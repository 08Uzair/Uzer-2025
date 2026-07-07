import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, User, Loader2, ArrowUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { getBlogs } from "../redux/actions/blog";

const WEBHOOK_URL = "http://localhost:5678/webhook/blog-agent-chat";

// ─── Helpers ────────────────────────────────────────────────────────────────

function extractBlogs(payload) {
  if (!payload) return null;
  const looksLikeBlog = (item) =>
    item &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    ("title" in item || "_id" in item) &&
    ("content" in item || "category" in item || "author" in item);
  const visited = new Set();
  function search(node) {
    if (!node || typeof node !== "object" || visited.has(node)) return null;
    visited.add(node);
    if (Array.isArray(node)) {
      if (node.length > 1 && node.every(looksLikeBlog)) return node;
      for (const item of node) {
        const found = search(item);
        if (found) return found;
      }
      return null;
    }
    for (const key of ["blog", "blogs", "data", "result", "results"]) {
      if (key in node) {
        const val = node[key];
        if (Array.isArray(val) && val.length > 1 && val.every(looksLikeBlog))
          return val;
        const nested = search(val);
        if (nested) return nested;
      }
    }
    for (const val of Object.values(node)) {
      const nested = search(val);
      if (nested) return nested;
    }
    return null;
  }
  return search(payload);
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripMarkdown(md) {
  if (!md) return "";
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`-]/g, " ")
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function previewOf(content) {
  if (!content || typeof content !== "string") return "";
  const isMarkdown = /[#*`>|-]/.test(content) && content.includes("\n");
  return (isMarkdown ? stripMarkdown(content) : stripHtml(content)).slice(
    0,
    140,
  );
}

function extractCreatedBlog(payload) {
  if (!payload) return null;
  const candidates = Array.isArray(payload) ? payload : [payload];
  for (const item of candidates) {
    if (item && typeof item === "object" && item.blogData)
      return {
        blog: item.blogData,
        message: item.message || "Blog created successfully",
      };
  }
  return null;
}

function extractSingleBlog(payload) {
  if (!payload) return null;
  const looksLikeBlog = (item) =>
    item &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    !("blogData" in item) &&
    ("content" in item || "category" in item) &&
    ("_id" in item || "title" in item || "createdAt" in item);
  if (looksLikeBlog(payload))
    return { blog: payload, message: payload.message || null };
  if (
    Array.isArray(payload) &&
    payload.length === 1 &&
    looksLikeBlog(payload[0])
  )
    return { blog: payload[0], message: payload[0].message || null };
  for (const key of ["data", "blog", "result"]) {
    const val = payload[key];
    if (looksLikeBlog(val))
      return { blog: val, message: payload.message || val.message || null };
    if (Array.isArray(val) && val.length === 1 && looksLikeBlog(val[0]))
      return { blog: val[0], message: payload.message || null };
  }
  return null;
}

function singleBlogBanner(message) {
  const m = (message || "").toLowerCase();
  if (
    m.includes("updat") ||
    m.includes("fetch") ||
    m.includes("found") ||
    m.includes("retriev")
  )
    return message;
  return message || null;
}

function formatMessage(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const blocks = [];
  let listBuffer = [];
  const flushList = () => {
    if (listBuffer.length) {
      blocks.push(
        <ul
          key={`ul-${blocks.length}`}
          className="list-disc pl-5 space-y-1 my-1.5"
        >
          {listBuffer.map((item, i) => (
            <li
              key={i}
              className="text-[13.5px] leading-relaxed text-white/80 break-words [overflow-wrap:anywhere]"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (/^[-*]\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }
    flushList();
    if (trimmed === "") {
      blocks.push(<div key={`sp-${idx}`} className="h-1.5" />);
    } else {
      blocks.push(
        <p
          key={`p-${idx}`}
          className="text-[13.5px] leading-relaxed text-white/80 break-words [overflow-wrap:anywhere]"
        >
          {renderInline(trimmed)}
        </p>,
      );
    }
  });
  flushList();
  return <div className="space-y-0.5">{blocks}</div>;
}

function renderInline(str) {
  const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part))
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    if (/^`[^`]+`$/.test(part))
      return (
        <code
          key={i}
          className="bg-white/10 text-white/90 rounded px-1.5 py-0.5 text-[12.5px] font-mono border border-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    return <span key={i}>{part}</span>;
  });
}

// ─── Card Components (dark theme) ───────────────────────────────────────────

function CreatedBlogCard({ blog, message }) {
  const authorName = typeof blog.author === "object" ? blog.author?.name : null;
  const categoryName =
    typeof blog.category === "object" ? blog.category?.name : null;
  const preview = previewOf(blog.content);
  return (
    <div className="space-y-2.5">
      <div className="w-[50%] flex items-center gap-2 bg-white/10 text-white rounded-xl px-3 py-2 border border-white/20 backdrop-blur-sm">
        <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[12px] font-bold shrink-0">
          ✓
        </span>
        <p className="text-[12.5px] font-semibold leading-snug">{message}</p>
      </div>
      <div className="bg-white/5 border border-white/15 rounded-2xl overflow-hidden backdrop-blur-sm w-[50%]">
        {blog.image && (
          <div className="relative h-64 w-full overflow-hidden border-b border-white/10 bg-white/5">
            <img
              src={blog.image}
              alt={blog.title || "Blog image"}
              loading="lazy"
              className="w-full h-full object-cover  contrast-125"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {categoryName && (
              <span className="absolute top-2 left-2 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border border-white/20">
                {categoryName}
              </span>
            )}
          </div>
        )}
        <div className="p-3">
          <p className="text-[13.5px] font-bold text-white leading-snug">
            {blog.title || "Untitled post"}
          </p>
          {preview && (
            <p className="text-[12px] text-white/50 leading-relaxed mt-1.5 line-clamp-3">
              {preview}…
            </p>
          )}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10">
            <span className="text-[11px] text-white/40 truncate">
              {authorName ? `by ${authorName}` : "Draft"}
            </span>
            {blog.createdAt && (
              <span className="text-[10.5px] text-white/30 shrink-0 ml-2">
                {formatDate(blog.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SingleBlogCard({ blog, message }) {
  const authorName = typeof blog.author === "object" ? blog.author?.name : null;
  const categoryName =
    typeof blog.category === "object" ? blog.category?.name : blog.category;
  const preview = previewOf(blog.content);
  const banner = singleBlogBanner(message);
  const likeCount = Array.isArray(blog.likes) ? blog.likes.length : null;
  return (
    <div className="space-y-2.5">
      {banner && (
        <div className="w-[50%] flex items-center gap-2 bg-white/10 text-white rounded-xl px-3 py-2 border border-white/20 backdrop-blur-sm">
          <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[12px] font-bold shrink-0">
            ✓
          </span>
          <p className="text-[12.5px] font-semibold leading-snug">{banner}</p>
        </div>
      )}
      <div className="bg-white/5 border border-white/15 rounded-2xl overflow-hidden backdrop-blur-sm  w-[50%]">
        {blog.image && (
          <div className="relative h-64 overflow-hidden border-b border-white/10 bg-white/5">
            <img
              src={blog.image}
              alt={blog.title || "Blog image"}
              loading="lazy"
              className="w-full h-full object-cover  contrast-125"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {categoryName && (
              <span className="absolute top-2 left-2 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border border-white/20">
                {categoryName}
              </span>
            )}
          </div>
        )}
        <div className="p-3">
          <p className="text-[13.5px] font-bold text-white leading-snug">
            {blog.title || "Untitled post"}
          </p>
          {preview && (
            <p className="text-[12px] text-white/50 leading-relaxed mt-1.5 line-clamp-3">
              {preview}…
            </p>
          )}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10">
            <span className="text-[11px] text-white/40 truncate">
              {authorName ? `by ${authorName}` : "Draft"}
            </span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {likeCount !== null && (
                <span className="text-[10.5px] text-white/30">
                  ♥ {likeCount}
                </span>
              )}
              {blog.createdAt && (
                <span className="text-[10.5px] text-white/30">
                  {formatDate(blog.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCardList({ blogs }) {
  return (
    <div className="space-y-3">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-white/40">
        {blogs.length} {blogs.length === 1 ? "blog" : "blogs"} found
      </p>
      {blogs.map((blog, i) => {
        const authorName =
          typeof blog.author === "object" ? blog.author?.name : blog.author;
        const authorImage =
          typeof blog.author === "object" ? blog.author?.image : null;
        const categoryName =
          typeof blog.category === "object"
            ? blog.category?.name
            : blog.category;
        const preview = stripHtml(blog.content).slice(0, 110);
        return (
          <div
            key={blog._id || i}
            className="w-[50%] bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 hover:-translate-y-0.5 transition-all backdrop-blur-sm "
          >
            {blog.image && (
              <div className="relative h-64  overflow-hidden border-b border-white/10 bg-white/5">
                <img
                  src={blog.image}
                  alt={blog.title || "Blog image"}
                  loading="lazy"
                  className="w-full h-full object-cover  contrast-125"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {categoryName && (
                  <span className="absolute top-2 left-2 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border border-white/20">
                    {categoryName}
                  </span>
                )}
              </div>
            )}
            <div className="p-3">
              <p className="text-[13.5px] font-bold text-white leading-snug line-clamp-2">
                {blog.title || "Untitled post"}
              </p>
              {preview && (
                <p className="text-[12px] text-white/50 leading-relaxed mt-1 line-clamp-2">
                  {preview}…
                </p>
              )}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 min-w-0">
                  {authorImage ? (
                    <img
                      src={authorImage}
                      alt={authorName || "Author"}
                      className="w-5 h-5 rounded-full border border-white/20 object-cover shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                      <User size={11} className="text-white/60" />
                    </div>
                  )}
                  <span className="text-[11px] text-white/50 truncate">
                    {authorName || "Unknown"}
                  </span>
                </div>
                {blog.createdAt && (
                  <span className="text-[10.5px] text-white/30 shrink-0 ml-2">
                    {formatDate(blog.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Animated Background Orbs ───────────────────────────────────────────────

// function AnimatedBg() {
//   return (
//     <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//       {/* Orb 1 - top left */}
//       <div
//         className="absolute rounded-full opacity-[0.07]"
//         style={{
//           width: "600px",
//           height: "600px",
//           top: "-100px",
//           left: "-150px",
//           background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
//           animation: "orbFloat1 12s ease-in-out infinite",
//         }}
//       />
//       {/* Orb 2 - bottom right */}
//       <div
//         className="absolute rounded-full opacity-[0.05]"
//         style={{
//           width: "700px",
//           height: "700px",
//           bottom: "-200px",
//           right: "-200px",
//           background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
//           animation: "orbFloat2 16s ease-in-out infinite",
//         }}
//       />
//       {/* Orb 3 - center */}
//       <div
//         className="absolute rounded-full opacity-[0.04]"
//         style={{
//           width: "400px",
//           height: "400px",
//           top: "30%",
//           left: "40%",
//           background: "radial-gradient(circle, #aaaaaa 0%, transparent 70%)",
//           animation: "orbFloat3 20s ease-in-out infinite",
//         }}
//       />
//       {/* Subtle grid lines */}
//       <div
//         className="absolute inset-0 opacity-[0.03]"
//         style={{
//           backgroundImage: `
//             linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
//           `,
//           backgroundSize: "60px 60px",
//         }}
//       />
//       <style>{`
//         @keyframes orbFloat1 {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(60px, 40px) scale(1.05); }
//           66% { transform: translate(-30px, 70px) scale(0.97); }
//         }
//         @keyframes orbFloat2 {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(-80px, -50px) scale(1.08); }
//           66% { transform: translate(40px, -80px) scale(0.95); }
//         }
//         @keyframes orbFloat3 {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           50% { transform: translate(-60px, 60px) scale(1.1); }
//         }
//       `}</style>
//     </div>
//   );
// }

// ─── Sparkle Icon ───────────────────────────────────────────────────────────

function SparkleIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="sgDark" cx="50%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%" stopColor="#e0e0e0" stopOpacity="1" />
          <stop offset="100%" stopColor="#777777" stopOpacity="1" />
        </radialGradient>
      </defs>
      <path
        d="M8 1C8 1 8.55 5.6 9.5 7C10.45 8.4 15 8 15 8C15 8 10.45 8.6 9.5 9C8.55 10.4 8 15 8 15C8 15 7.45 10.4 6.5 9C5.55 8.6 1 8 1 8C1 8 5.55 8.4 6.5 7C7.45 5.6 8 1 8 1Z"
        fill="url(#sgDark)"
      />
    </svg>
  );
}

// ─── Suggestion Chips ───────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Show all my blogs",
  "Create a new blog post",
  "Get blog by ID",
  "Help me write an outline",
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function BlogAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false); // false = greeting screen
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const profile = JSON.parse(localStorage.getItem("profile"));
  const firstName = profile?.result?.name?.split(" ")[0] || "there";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  async function sendMessage(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;
    if (!started) setStarted(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, author: profile?.result?._id }),
      });

      let replyText = "",
        blogs = null,
        createdBlog = null,
        singleBlog = null;
      const contentType = res.headers.get("content-type") || "";

      const interpret = (data) => {
        createdBlog = extractCreatedBlog(data);
        if (!createdBlog) blogs = extractBlogs(data);
        if (!createdBlog && !blogs) singleBlog = extractSingleBlog(data);
        if (!createdBlog && !blogs && !singleBlog) {
          replyText =
            data?.reply ??
            data?.message ??
            data?.output ??
            data?.text ??
            (typeof data === "string" ? data : JSON.stringify(data, null, 2));
        }
      };

      if (contentType.includes("application/json")) {
        interpret(await res.json());
      } else {
        const raw = await res.text();
        try {
          interpret(JSON.parse(raw));
        } catch {
          replyText = raw;
        }
      }

      if (!res.ok && !createdBlog && !blogs && !singleBlog)
        throw new Error(replyText || `Request failed (${res.status})`);

      setMessages((prev) => [
        ...prev,
        createdBlog
          ? { role: "assistant", createdBlog }
          : blogs
            ? { role: "assistant", blogs }
            : singleBlog
              ? { role: "assistant", singleBlog }
              : { role: "assistant", content: replyText || "..." },
      ]);
      dispatch(getBlogs());
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Couldn't reach the assistant. Make sure your n8n webhook is running at localhost:5678 and try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col"
      style={{ background: "#0a0a0a" }}
    >
      {/* <AnimatedBg /> */}

      {/* ── Top bar ──
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
            <Bot size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">
            Blogii
          </span>
        </div>
        <div className="flex items-center gap-2">
          {started && (
            <button
              onClick={() => {
                setMessages([]);
                setStarted(false);
              }}
              className="text-[12px] text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              New chat
            </button>
          )}
          {profile?.result?.image ? (
            <img
              src={profile.result.image}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-white/20 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <User size={14} className="text-white/60" />
            </div>
          )}
        </div>
      </header> */}

      {/* ── Body ── */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Greeting screen */}
        {!started && (
          <div className="flex-1 flex flex-col items-start justify-end px-6 pb-8 max-w-3xl mx-auto w-full">
            <div className="mb-8">
              <h1
                className="text-4xl font-semibold mb-1"
                style={{ color: "#a8c7fa" }}
              >
                Hello, {firstName}
              </h1>
              <p className="text-3xl font-semibold text-white/25">
                How can I help you today?
              </p>
            </div>
            {/* Suggestion chips */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all text-[13px] text-white/70 hover:text-white backdrop-blur-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {started && (
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-6 pt-20"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                const isCard = m.blogs || m.createdBlog || m.singleBlog;
                return (
                  <div
                    key={i}
                    className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={15} className="text-white/70" />
                      </div>
                    )}
                    <div
                      className={`${isCard ? "max-w-[85%]" : isUser ? "max-w-[75%]" : "max-w-[80%]"} min-w-0`}
                    >
                      {isUser ? (
                        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tr-sm px-4 py-3 backdrop-blur-sm">
                          <p className="text-[14px] text-white leading-relaxed break-words [overflow-wrap:anywhere]">
                            {m.content}
                          </p>
                        </div>
                      ) : m.createdBlog ? (
                        <CreatedBlogCard
                          blog={m.createdBlog.blog}
                          message={m.createdBlog.message}
                        />
                      ) : m.singleBlog ? (
                        <SingleBlogCard
                          blog={m.singleBlog.blog}
                          message={m.singleBlog.message}
                        />
                      ) : m.blogs ? (
                        <BlogCardList blogs={m.blogs} />
                      ) : (
                        <div
                          className={`px-4 py-3 rounded-2xl rounded-tl-sm backdrop-blur-sm border ${
                            m.error
                              ? "border-red-500/20 border-dashed bg-red-500/5"
                              : "border-white/10 bg-white/5"
                          }`}
                        >
                          {formatMessage(m.content)}
                        </div>
                      )}
                    </div>
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                        {profile?.result?.image ? (
                          <img
                            src={profile.result.image}
                            alt="You"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={14} className="text-white/60" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    <Bot size={15} className="text-white/70" />
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-3">
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Input bar ── */}
        <div className="px-4 pb-6 pt-2">
          <div className="max-w-3xl mx-auto">
            <div
              className="flex items-end gap-3 px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-md transition-all focus-within:border-white/25"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Blogii anything…"
                className="flex-1 resize-none bg-transparent outline-none text-[14px] text-white placeholder:text-white/30 py-1 overflow-hidden"
                style={{ maxHeight: "160px" }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  input.trim() && !loading
                    ? "bg-white text-black hover:bg-white/90 hover:scale-105"
                    : "bg-white/10 text-white/20 cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowUp size={16} />
                )}
              </button>
            </div>
            <p className="text-[11px] text-white/20 text-center mt-3 tracking-wide">
              Blogii can make mistakes · Connected to n8n · localhost:5678
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaperGrain({ opacity = 0.15 }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full mix-blend-overlay"
      style={{ opacity }}
    >
      <filter id="pgf">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#pgf)" />
    </svg>
  );
}
// abdullaha08@gmail.com
// Pass@1234
