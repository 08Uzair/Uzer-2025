import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { getBlogByID } from "../redux/actions/blog";
import { getTime } from "../utilty/getTime";
import Loader from "../utilty/Loader";
import { User, Clock, ArrowLeft } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Dark theme overrides for rendered HTML / markdown content ──────────
function ProseDarkStyles() {
  return (
    <style>{`
      .dark-prose {
        color: rgba(255,255,255,0.65);
        line-height: 1.8;
      }
      .dark-prose h1, .dark-prose h2, .dark-prose h3,
      .dark-prose h4, .dark-prose h5, .dark-prose h6 {
        color: #fff;
        font-weight: 600;
      }
      .dark-prose a {
        color: #fff;
        text-decoration: underline;
        text-decoration-color: rgba(255,255,255,0.3);
      }
      .dark-prose a:hover {
        text-decoration-color: rgba(255,255,255,0.7);
      }
      .dark-prose strong { color: #fff; }
      .dark-prose blockquote {
        border-left: 3px solid rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.5);
        font-style: normal;
      }
      .dark-prose code {
        background: rgba(255,255,255,0.08);
        color: #fff;
        padding: 0.15rem 0.4rem;
        border-radius: 6px;
        font-size: 0.85em;
      }
      .dark-prose pre {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
      }
      .dark-prose pre code {
        background: transparent;
        padding: 0;
      }
      .dark-prose hr {
        border-color: rgba(255,255,255,0.1);
      }
      .dark-prose img {
        border-radius: 14px;
      }
      .dark-prose table {
        border-color: rgba(255,255,255,0.1);
      }
      .dark-prose th, .dark-prose td {
        border-color: rgba(255,255,255,0.1) !important;
        color: rgba(255,255,255,0.65);
      }
      .dark-prose th {
        color: #fff;
      }
    `}</style>
  );
}

const SinglePost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const data = useSelector((state) => state?.blog?.singleBlog);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getBlogByID(id));
  }, [id, dispatch]);

  // Detect HTML content
  const isHTML = (content) => {
    if (!content) return false;

    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(content);
  };

  if (!data || Object.keys(data).length === 0) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen px-4 py-10 pt-24">
      <ProseDarkStyles />

      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <NavLink to="/allBlogs">
          <button className="flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all text-sm">
            <ArrowLeft size={14} />
            All Blogs
          </button>
        </NavLink>

        {/* Featured Image */}
        <div className="mb-8 rounded-3xl overflow-hidden border border-white/10">
          <img
            src={data?.image}
            alt={data?.title}
            className="w-full h-[420px] object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg";
            }}
          />
        </div>

        {/* Blog Header */}
        <div className="mb-8">
          {data?.category?.name && (
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wide border border-white/15">
              {data.category.name}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-5 leading-tight">
            {data?.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <NavLink to={`/userProfile/${data?.author?._id}`}>
              <span className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-white/70 text-sm">
                <img
                  src={
                    data?.author?.image ||
                    "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg"
                  }
                  alt={data?.author?.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                {data?.author?.name}
              </span>
            </NavLink>

            <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-sm">
              <Clock size={13} />
              {getTime(data?.createdAt)}
            </span>
          </div>
        </div>

        {/* Blog Content */}
        <article
          className="rounded-3xl p-8 sm:p-10 border border-white/10 backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div className="dark-prose prose prose-lg max-w-none">
            {isHTML(data?.content) ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: data.content,
                }}
              />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.content || ""}
              </ReactMarkdown>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default SinglePost;
