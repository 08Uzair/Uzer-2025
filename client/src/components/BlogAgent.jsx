import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, User, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { getBlogs } from "../redux/actions/blog";
/**
 * BlogChatWidget
 * A side-panel chat widget styled to match a clean, card-based blog dashboard
 * (white background, soft gray accents, rounded-xl cards, subtle borders).
 *
 * Talks to: http://localhost:5678/webhook/blog-agent-chat
 * Expected request:  { message: string, sessionId: string }
 * Expected response: { reply: string }  (also tolerates { message }, { output }, or plain text)
 *
 * Special response shapes handled:
 *   - List of blogs (get all blogs)        -> BlogCardList
 *   - { message, blogData }  (create blog) -> CreatedBlogCard
 *   - Single full blog object              -> SingleBlogCard
 *     (get blog by id / update blog — has content/category/likes/createdAt
 *      directly on the object, not nested under `blogData`)
 */

const WEBHOOK_URL = "http://localhost:5678/webhook/blog-agent-chat";

// --- tries to find a blog list anywhere inside a parsed JSON payload ---
// Handles shapes like: { data: { blog: [...] } }, [{ data: { blog: [...] } }],
// { blogs: [...] }, or a raw array of blog objects.
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
        if (Array.isArray(val) && val.length > 1 && val.every(looksLikeBlog)) {
          return val;
        }
        const nested = search(val);
        if (nested) return nested;
      }
    }
    // fall back: scan all values
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

// strip HTML tags + collapse whitespace, for a clean card preview
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// strip markdown syntax (#, **, ---, |tables|, etc.) for a clean preview
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

// Detects a single-blog "create" response, e.g. { success, message, blogData: {...} }
function extractCreatedBlog(payload) {
  if (!payload) return null;
  const candidates = Array.isArray(payload) ? payload : [payload];
  for (const item of candidates) {
    if (item && typeof item === "object" && item.blogData) {
      return {
        blog: item.blogData,
        message: item.message || "Blog created successfully",
      };
    }
  }
  return null;
}

// Detects a single full blog object returned directly (not nested under
// `blogData`, not a multi-item list). Covers "get blog by id" and
// "update blog" responses, e.g. { _id, title?, category, content, likes, createdAt, __v }
// or that same shape wrapped one level in { data: {...} } / { blog: {...} }.
function extractSingleBlog(payload) {
  if (!payload) return null;

  const looksLikeBlog = (item) =>
    item &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    !("blogData" in item) &&
    ("content" in item || "category" in item) &&
    ("_id" in item || "title" in item || "createdAt" in item);

  // direct hit
  if (looksLikeBlog(payload)) {
    return { blog: payload, message: payload.message || null };
  }

  // array with exactly one blog-shaped item (e.g. update/get-by-id sometimes
  // come back wrapped in an array)
  if (
    Array.isArray(payload) &&
    payload.length === 1 &&
    looksLikeBlog(payload[0])
  ) {
    return { blog: payload[0], message: payload[0].message || null };
  }

  // nested one level under common keys
  for (const key of ["data", "blog", "result"]) {
    const val = payload[key];
    if (looksLikeBlog(val)) {
      return { blog: val, message: payload.message || val.message || null };
    }
    if (Array.isArray(val) && val.length === 1 && looksLikeBlog(val[0])) {
      return { blog: val[0], message: payload.message || null };
    }
  }

  return null;
}

// Picks a banner message + tone for a single-blog result. Falls back to a
// neutral "fetched" framing when the webhook didn't send an explicit message,
// since the same shape covers both "get by id" and "update".
function singleBlogBanner(message, blog) {
  const m = (message || "").toLowerCase();
  if (m.includes("updat")) {
    return message;
  }
  if (m.includes("fetch") || m.includes("found") || m.includes("retriev")) {
    return message;
  }
  if (message) return message;
  return null; // no banner — just show the card with a quiet header instead
}

// --- tiny formatter: turns **bold**, `code`, and lists into styled JSX ---
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
              className="text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere]"
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
          className="text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere]"
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
  // split on **bold** and `code`
  const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong
          key={i}
          className="font-semibold text-black underline decoration-2"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/^`[^`]+`$/.test(part)) {
      return (
        <code
          key={i}
          className="bg-black text-white rounded px-1.5 py-0.5 text-[12.5px] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * CreatedBlogCard
 * Renders the result of a "create blog" action: a success banner
 * plus a single styled preview card. Tolerant of markdown content
 * and author/category fields that are raw IDs rather than objects.
 */
function CreatedBlogCard({ blog, message }) {
  const authorName = typeof blog.author === "object" ? blog.author?.name : null;
  const categoryName =
    typeof blog.category === "object" ? blog.category?.name : null;
  const preview = previewOf(blog.content);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 bg-black text-white rounded-xl px-3 py-2 border-2 border-black">
        <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[12px] font-bold shrink-0">
          ✓
        </span>
        <p className="text-[12.5px] font-semibold leading-snug">{message}</p>
      </div>

      <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
        {blog.image && (
          <div className="relative h-32 w-full overflow-hidden border-b-2 border-black bg-gray-100">
            <img
              src={blog.image}
              alt={blog.title || "Blog image"}
              loading="lazy"
              className="w-full h-full object-cover grayscale contrast-125"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {categoryName && (
              <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border border-white/20">
                {categoryName}
              </span>
            )}
          </div>
        )}

        <div className="p-3">
          <p className="text-[13.5px] font-bold text-black leading-snug">
            {blog.title || "Untitled post"}
          </p>

          {preview && (
            <p className="text-[12px] text-black/60 leading-relaxed mt-1.5 line-clamp-3">
              {preview}…
            </p>
          )}

          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/10">
            <span className="text-[11px] text-black/50 truncate">
              {authorName ? `by ${authorName}` : "Draft"}
            </span>
            {blog.createdAt && (
              <span className="text-[10.5px] text-black/40 shrink-0 ml-2">
                {formatDate(blog.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SingleBlogCard
 * Renders the result of a "get blog by id" or "update blog" action.
 * Same visual language as CreatedBlogCard, but:
 *   - banner is optional (only shown if the webhook sent a message,
 *     e.g. "Blog updated successfully")
 *   - shows a like count when `likes` is present, since that's a field
 *     these responses carry that create-responses typically don't
 */
function SingleBlogCard({ blog, message }) {
  const authorName = typeof blog.author === "object" ? blog.author?.name : null;
  const categoryName =
    typeof blog.category === "object" ? blog.category?.name : blog.category;
  const preview = previewOf(blog.content);
  const banner = singleBlogBanner(message, blog);
  const likeCount = Array.isArray(blog.likes) ? blog.likes.length : null;

  return (
    <div className="space-y-2.5">
      {banner && (
        <div className="flex items-center gap-2 bg-black text-white rounded-xl px-3 py-2 border-2 border-black">
          <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[12px] font-bold shrink-0">
            ✓
          </span>
          <p className="text-[12.5px] font-semibold leading-snug">{banner}</p>
        </div>
      )}

      <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
        {blog.image && (
          <div className="relative h-32 w-full overflow-hidden border-b-2 border-black bg-gray-100">
            <img
              src={blog.image}
              alt={blog.title || "Blog image"}
              loading="lazy"
              className="w-full h-full object-cover grayscale contrast-125"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {categoryName && (
              <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border border-white/20">
                {categoryName}
              </span>
            )}
          </div>
        )}

        <div className="p-3">
          <p className="text-[13.5px] font-bold text-black leading-snug">
            {blog.title || "Untitled post"}
          </p>

          {preview && (
            <p className="text-[12px] text-black/60 leading-relaxed mt-1.5 line-clamp-3">
              {preview}…
            </p>
          )}

          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/10">
            <span className="text-[11px] text-black/50 truncate">
              {authorName ? `by ${authorName}` : "Draft"}
            </span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {likeCount !== null && (
                <span className="text-[10.5px] text-black/40">
                  ♥ {likeCount}
                </span>
              )}
              {blog.createdAt && (
                <span className="text-[10.5px] text-black/40">
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

/**
 * BlogCardList
 * Renders an array of blog objects (from the n8n "get all blogs" response)
 * as a stack of compact, sketchbook-style cards.
 */
function BlogCardList({ blogs }) {
  return (
    <div className="space-y-3">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-black/50">
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
            className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
          >
            {blog.image && (
              <div className="relative h-28 w-full overflow-hidden border-b-2 border-black bg-gray-100">
                <img
                  src={blog.image}
                  alt={blog.title || "Blog image"}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale contrast-125"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {categoryName && (
                  <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border border-white/20">
                    {categoryName}
                  </span>
                )}
              </div>
            )}

            <div className="p-3">
              <p className="text-[13.5px] font-bold text-black leading-snug line-clamp-2">
                {blog.title || "Untitled post"}
              </p>

              {preview && (
                <p className="text-[12px] text-black/60 leading-relaxed mt-1 line-clamp-2">
                  {preview}…
                </p>
              )}

              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/10">
                <div className="flex items-center gap-1.5 min-w-0">
                  {authorImage ? (
                    <img
                      src={authorImage}
                      alt={authorName || "Author"}
                      className="w-5 h-5 rounded-full border border-black object-cover shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0">
                      <User size={11} className="text-white" />
                    </div>
                  )}
                  <span className="text-[11px] text-black/70 truncate">
                    {authorName || "Unknown"}
                  </span>
                </div>
                {blog.createdAt && (
                  <span className="text-[10.5px] text-black/40 shrink-0 ml-2">
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

export default function BlogAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm your blog assistant. Ask me to draft an outline, brainstorm titles, or help polish a post.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
const profile = JSON.parse(localStorage.getItem("profile"));
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

async function sendMessage() {
  const text = input.trim();

  if (!text || loading) return;

  setMessages((prev) => [...prev, { role: "user", content: text }]);
  setInput("");
  setLoading(true);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
        author: profile?.result?._id,
      }),
    });

    let replyText = "";
    let blogs = null;
    let createdBlog = null;
    let singleBlog = null;

    const contentType = res.headers.get("content-type") || "";

    const interpret = (data) => {
      createdBlog = extractCreatedBlog(data);

      if (!createdBlog) {
        blogs = extractBlogs(data);
      }

      if (!createdBlog && !blogs) {
        singleBlog = extractSingleBlog(data);
      }

      if (!createdBlog && !blogs && !singleBlog) {
        replyText =
          data?.reply ??
          data?.message ??
          data?.output ??
          data?.text ??
          (typeof data === "string"
            ? data
            : JSON.stringify(data, null, 2));
      }
    };

    if (contentType.includes("application/json")) {
      const data = await res.json();
      interpret(data);
    } else {
      const raw = await res.text();

      try {
        interpret(JSON.parse(raw));
      } catch {
        replyText = raw;
      }
    }

    if (!res.ok && !createdBlog && !blogs && !singleBlog) {
      throw new Error(replyText || `Request failed (${res.status})`);
    }

    setMessages((prev) => [
      ...prev,
      createdBlog
        ? { role: "assistant", createdBlog }
        : blogs
        ? { role: "assistant", blogs }
        : singleBlog
        ? { role: "assistant", singleBlog }
        : {
            role: "assistant",
            content: replyText || "...",
          },
    ]);

    // ===============================
    // REFRESH BLOGS AFTER WEBHOOK RESPONSE
    // ===============================
    dispatch(getBlogs());
  } catch (err) {
    console.error(err);

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
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Compact floating chat card */}
      <div
        className={`pointer-events-auto fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-9rem)] bg-[#f0eee6] rounded-3xl border-2 border-black shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] flex flex-col overflow-hidden origin-bottom-right transition-all duration-300 ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-3 pointer-events-none"
        }`}
      >
        {/* Header — solid black, paper-grain texture, hard outline */}
        <div className="relative px-5 py-4 bg-black border-b-2 border-black overflow-hidden">
          <PaperGrain opacity={0.18} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center ring-2 ring-white">
                <Bot size={20} className="text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight tracking-wide">
                  Blog Assistant
                </p>
                <p className="text-[11px] text-white/60 leading-tight flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      loading ? "bg-white animate-pulse" : "bg-white/70"
                    }`}
                  />
                  {loading ? "Typing…" : "Online"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 border border-white/30 hover:bg-white/15 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#ece9df]"
        >
          <PaperGrain opacity={0.12} fixedLayer />
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const isCard = m.blogs || m.createdBlog || m.singleBlog;
            return (
              <div
                key={i}
                className={`flex items-end gap-2 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-black border-2 border-black flex items-center justify-center shrink-0 shadow-sm">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`${
                    isCard ? "max-w-[92%]" : "max-w-[78%]"
                  } min-w-0 rounded-2xl px-3.5 py-2.5 shadow-sm border-2 ${
                    isUser
                      ? "bg-black text-white border-black rounded-br-sm"
                      : m.error
                        ? "bg-white text-black border-black border-dashed rounded-bl-sm"
                        : "bg-white text-black border-black rounded-bl-sm"
                  }`}
                >
                  {isUser ? (
                    <p className="text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere]">
                      {m.content}
                    </p>
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
                    formatMessage(m.content)
                  )}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-black flex items-center justify-center shrink-0">
                    <User size={14} className="text-black" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-black border-2 border-black flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white border-2 border-black rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t-2 border-black p-3 bg-[#f0eee6]">
          <div className="flex items-end gap-2 bg-white border-2 border-black rounded-2xl px-3 py-2 focus-within:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-shadow">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the blog assistant…"
              className="flex-1 resize-none bg-transparent outline-none text-[13.5px] text-black placeholder:text-black/40 max-h-24 py-1.5"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all border-2 ${
                input.trim() && !loading
                  ? "bg-black text-white border-black hover:scale-105"
                  : "bg-white text-black/30 border-black/20"
              }`}
              aria-label="Send message"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>
          <p className="text-[10.5px] text-black/40 text-center mt-2 tracking-wide">
            Connected to your n8n agent · localhost:5678
          </p>
        </div>
      </div>

      {/* 3D-style robot launcher button — black & white, paper grain */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center group transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 overflow-hidden border-2 border-black"
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #3a3a3a 0%, #1a1a1a 45%, #000000 100%)",
          boxShadow:
            "0 10px 25px -5px rgba(0,0,0,0.6), inset 0 2px 3px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.5)",
        }}
      >
        <PaperGrain opacity={0.25} />
        {/* glossy highlight */}
        <span
          className="absolute top-1.5 left-2.5 w-6 h-3 rounded-full bg-white/30 blur-[2px] rotate-[-20deg]"
          aria-hidden="true"
        />
        {/* pulse ring when idle */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
        )}
        <span className="relative z-10 transition-transform duration-300 group-hover:rotate-[8deg]">
          {open ? (
            <X size={26} className="text-white drop-shadow" />
          ) : (
            <Bot size={28} className="text-white drop-shadow" />
          )}
        </span>
        {/* unread-style notification dot */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-black shadow-sm" />
        )}
      </button>
    </div>
  );
}

/**
 * PaperGrain
 * A reusable, lightweight SVG noise overlay that gives any container
 * a rough, textured "paper" feel. Pure CSS/SVG, no external assets.
 */
function PaperGrain({ opacity = 0.15, fixedLayer = false }) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none ${
        fixedLayer ? "fixed" : "absolute"
      } inset-0 w-full h-full mix-blend-multiply`}
      style={{ opacity }}
    >
      <filter id="paperGrainFilter">
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
      <rect width="100%" height="100%" filter="url(#paperGrainFilter)" />
    </svg>
  );
}
