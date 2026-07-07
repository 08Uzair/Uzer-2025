import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs, deleteBlog } from "../redux/actions/blog";
import Share from "./AllBolgs/Share";
import { toast } from "react-toastify";
import Loader from "../utilty/Loader";
import {
  Trash2,
  Pencil,
  ArrowLeft,
  Mail,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";

// ─── Animated Background (same as BlogAgent) ────────────────────────────────
function AnimatedBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute rounded-full opacity-[0.07]"
        style={{
          width: "600px",
          height: "600px",
          top: "-100px",
          left: "-150px",
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          animation: "orbFloat1 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-[0.05]"
        style={{
          width: "700px",
          height: "700px",
          bottom: "-200px",
          right: "-200px",
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          animation: "orbFloat2 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-[0.04]"
        style={{
          width: "400px",
          height: "400px",
          top: "30%",
          left: "40%",
          background: "radial-gradient(circle, #aaaaaa 0%, transparent 70%)",
          animation: "orbFloat3 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <style>{`
        @keyframes orbFloat1 {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(60px,40px) scale(1.05)}
          66%{transform:translate(-30px,70px) scale(0.97)}
        }
        @keyframes orbFloat2 {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(-80px,-50px) scale(1.08)}
          66%{transform:translate(40px,-80px) scale(0.95)}
        }
        @keyframes orbFloat3 {
          0%,100%{transform:translate(0,0) scale(1)}
          50%{transform:translate(-60px,60px) scale(1.1)}
        }
      `}</style>
    </div>
  );
}

// ─── Copy ID Button ──────────────────────────────────────────────────────────
function CopyIdButton({ id }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-1.5 overflow-hidden min-w-0 justify-between">
      <span className="text-[10px] text-white/20 font-mono uppercase tracking-wide shrink-0">
        ID
      </span>
      <span
        className="text-[10px] text-white/25 font-mono truncate min-w-0"
        title={id}
      >
        {id}
      </span>
      <button
        onClick={handleCopy}
        aria-label="Copy blog ID"
        className="absolute  right-9 shrink-0 p-1 rounded-md text-white/25 hover:text-white/60 hover:bg-white/8 transition-all"
        title={copied ? "Copied!" : "Copy ID"}
      >
        {copied ? (
          <Check size={11} className="text-green-400" />
        ) : (
          <Copy size={11} />
        )}
      </button>
    </div>
  );
}

const Profile = () => {
  const [userData, setUserData] = useState();
  const parse = require("html-react-parser").default;
  const dispatch = useDispatch();

  useEffect(() => {
    const profile =
      JSON.parse(localStorage.getItem("profile"))?.result ||
      JSON.parse(localStorage.getItem("profile"));
    setUserData(profile);
  }, []);

  const blogs = useSelector((state) => state?.blog?.blog?.blog);

  useEffect(() => {
    window.scroll(0, 0);
    dispatch(getBlogs());
  }, [dispatch]);

  const isSameUser = (authorId) => userData?._id === authorId;

  const handleDelete = (id) => {
    dispatch(deleteBlog(id));
    dispatch(getBlogs());
    toast.success("Blog Deleted Successfully 😊");
  };

  const baseUrl = window.location.href.split("allBlogs")[0];
  const myBlogs = blogs?.filter((item) => isSameUser(item?.author?._id)) || [];

  if (!blogs || !userData) return <Loader />;

  return (
    <div className="min-h-screen relative" style={{ background: "#0a0a0a" }}>
      <AnimatedBg />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 pt-24">
        {/* ── Profile Hero Card ── */}
        <div
          className="rounded-3xl border border-white/10 overflow-hidden mb-8 backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {/* Banner */}
          <div
            className="h-36 w-full relative"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* subtle grain */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Avatar + Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-6">
              {/* Avatar */}
              <div className="relative w-fit">
                <img
                  src={
                    userData?.image ||
                    "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg"
                  }
                  alt={userData?.name}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-white/15 shadow-2xl"
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                />
                {/* online dot */}
                <span className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-white/70 border-2 border-black" />
              </div>

              {/* Back button */}
              <NavLink to="/allBlogs">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all text-sm">
                  <ArrowLeft size={14} />
                  All Blogs
                </button>
              </NavLink>
            </div>

            {/* Name + meta */}
            <h1 className="text-2xl font-semibold text-white mb-1">
              {userData?.name}
            </h1>
            <div className="flex items-center gap-2 text-white/40 text-sm mb-3">
              <Mail size={13} />
              <span>{userData?.email}</span>
            </div>
            {userData?.bio && (
              <p className="text-white/50 text-sm leading-relaxed max-w-xl">
                {userData?.bio}
              </p>
            )}

            {/* Stats row */}
            <div className="flex gap-6 mt-6 pt-6 border-t border-white/8">
              <div>
                <p className="text-xl font-semibold text-white">
                  {myBlogs.length}
                </p>
                <p className="text-xs text-white/35 mt-0.5">Posts</p>
              </div>
              <div className="w-px bg-white/8" />
              <div>
                <p className="text-xl font-semibold text-white">
                  {myBlogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0)}
                </p>
                <p className="text-xs text-white/35 mt-0.5">Total Likes</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── My Posts Section ── */}
        {myBlogs.length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={15} className="text-white/30" />
              <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider">
                Your Posts
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myBlogs.map((item, index) => (
                <div
                  key={item._id || index}
                  className="group rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 hover:-translate-y-0.5 transition-all backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {/* Image */}
                  <NavLink to={`/singlePost/${item._id}`}>
                    <div className="relative h-44 overflow-hidden border-b border-white/8">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale-[30%] contrast-110 group-hover:scale-[1.03] transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg";
                        }}
                      />
                      {/* category badge */}
                      {item.category && (
                        <span className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border border-white/15">
                          {typeof item.category === "object"
                            ? item.category?.name
                            : item.category}
                        </span>
                      )}
                    </div>
                  </NavLink>

                  {/* Content */}
                  <div className="p-4">
                    <NavLink to={`/singlePost/${item._id}`}>
                      <h3 className="text-[14px] font-semibold text-white leading-snug line-clamp-2 hover:text-white/80 transition-colors mb-2">
                        {item.title}
                      </h3>
                    </NavLink>
                    <p className="text-[12px] text-white/40 line-clamp-2 leading-relaxed">
                      {typeof item.content === "string"
                        ? item.content
                            .replace(/<[^>]*>/g, " ")
                            .replace(/\s+/g, " ")
                            .trim()
                            .slice(0, 100)
                        : ""}
                    </p>

                    {/* ID Row */}
                    <div className="flex items-center justify-between mt-3 px-2 py-1.5 rounded-lg border border-white/6 bg-white/[0.02]">
                      <CopyIdButton id={item._id} />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
                      <div className="flex items-center gap-1.5">
                        {item.likes?.length > 0 && (
                          <span className="text-[11px] text-white/30">
                            ♥ {item.likes.length}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share
                          title={item.title}
                          content={parse(item.content)}
                          url={`${baseUrl}singlePost/${item._id}`}
                        />
                        <button
                          onClick={() => handleDelete(item._id)}
                          aria-label="Delete post"
                          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <NavLink to={`/updatePost/${item._id}`}>
                          <button
                            aria-label="Edit post"
                            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div
            className="rounded-3xl border border-white/8 p-16 text-center backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={22} className="text-white/25" />
            </div>
            <p className="text-white/30 text-sm mb-1">No posts yet</p>
            <p className="text-white/15 text-xs">
              Your published blogs will appear here
            </p>
            <NavLink to="/allBlogs">
              <button className="mt-6 px-5 py-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all text-sm">
                Browse Blogs
              </button>
            </NavLink>
          </div>
        )}

        {/* ── Quote footer ── */}
        <p className="text-center text-white/15 text-xs leading-relaxed mt-12 max-w-xl mx-auto">
          "Bloggers are the modern-day storytellers, weaving threads of
          knowledge, experience, and creativity into the vast tapestry of the
          internet."
        </p>
      </div>
    </div>
  );
};

export default Profile;
