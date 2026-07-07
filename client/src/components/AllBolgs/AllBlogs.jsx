import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTime } from "../../utilty/getTime.js";
import { getBlogs } from "../../redux/actions/blog.js";
import Share from "./Share.jsx";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getCategory } from "../../redux/actions/category.js";
import Loader from "../../utilty/Loader.jsx";
import { Search, BookOpen } from "lucide-react";

// ─── Animated Background (same as rest of UI) ───────────────────────────────
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

const AllBlogs = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.blog?.blog?.blog);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [query, setQuery] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const parse = require("html-react-parser").default;
  const [activeFilter, setActiveFilter] = useState("");
  const cat = useSelector((state) => state?.category);

  // When the page is opened with ?category=<name> (e.g. clicked from the
  // Gallery tiles), match it against the loaded categories so the matching
  // chip gets highlighted exactly as if the user had clicked it directly.
  useEffect(() => {
    const categoryParam = queryParams.get("category");
    if (categoryParam && cat?.length) {
      const matched = cat.find(
        (item) => item.name?.toLowerCase() === categoryParam.toLowerCase(),
      );
      if (matched) {
        setQuery(matched.name.toLowerCase());
        setActiveFilter(matched._id);
      } else {
        // fall back to a loose text match if no exact category found
        setQuery(categoryParam.toLowerCase());
        setActiveFilter("");
      }
      setIsSearch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, cat]);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"))?.result;
    setUserData(profile);
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
    dispatch(getBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  function handelAll() {
    setActiveFilter("");
    setQuery("");
    navigate({ pathname: window.location.pathname, search: "" });
  }

  const handleFilterClick = (item) => {
    setQuery(item.name?.toLowerCase());
    setActiveFilter(item._id);
    navigate({ pathname: window.location.pathname, search: "" });
  };

  const handleSearch = (e) => {
    setQuery(e.target.value?.toLowerCase());
    setIsSearch(true);
    setActiveFilter("");
    navigate({ pathname: window.location.pathname, search: "" });
  };

  const filteredBlogs = data?.filter(
    (item) =>
      item?.title?.toLowerCase()?.includes(query) ||
      item?.content?.toLowerCase()?.includes(query) ||
      item?.author?.name?.toLowerCase()?.includes(query) ||
      item?.category?.name?.toLowerCase()?.includes(query),
  );

  const baseUrl = window.location.href.split("allBlogs")[0];

  if (!data || !cat) return <Loader />;

  return (
    <div className="min-h-screen relative" style={{ background: "#0a0a0a" }}>
      <AnimatedBg />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* ── Page heading ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={15} className="text-white/30" />
            <span className="text-white/30 text-xs font-medium uppercase tracking-wider">
              All Posts
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Explore Blogs</h1>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-5">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
          />
          <input
            type="text"
            value={isSearch ? undefined : query}
            onChange={handleSearch}
            placeholder="Search by title, author, category…"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/25 focus:bg-white/8 transition-all backdrop-blur-sm"
          />
        </div>

        {/* ── Category filters ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          <button
            onClick={handelAll}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
              activeFilter === ""
                ? "bg-white text-black border-white"
                : "bg-white/5 text-white/50 border-white/10 hover:border-white/25 hover:text-white"
            }`}
          >
            All
          </button>
          {cat?.map((item) => (
            <button
              key={item._id}
              onClick={() => handleFilterClick(item)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                activeFilter === item._id
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/50 border-white/10 hover:border-white/25 hover:text-white"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* ── Blog grid ── */}
        {filteredBlogs?.length === 0 ? (
          <div
            className="rounded-3xl border border-white/8 p-16 text-center backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={22} className="text-white/25" />
            </div>
            <p className="text-white/30 text-sm mb-1">No blogs found</p>
            <p className="text-white/15 text-xs">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlogs?.map((item, index) => (
              <div
                key={item._id || index}
                className="group rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 hover:-translate-y-0.5 transition-all backdrop-blur-sm flex flex-col"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                {/* Blog image */}
                <NavLink to={`/singlePost/${item?._id}`}>
                  <div className="relative h-48 overflow-hidden border-b border-white/8">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:scale-[1.04] transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg";
                      }}
                    />
                    {/* Category badge */}
                    {item?.category?.name && (
                      <span className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border border-white/15">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                </NavLink>

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Author row */}
                  <div className="flex items-center justify-between mb-3">
                    <NavLink to={`/userProfile/${item?.author?._id}`}>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            item?.author?.image ||
                            "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg"
                          }
                          alt={item?.author?.name}
                          className="w-7 h-7 rounded-full object-cover border border-white/15"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg";
                          }}
                        />
                        <div>
                          <p className="text-[12px] font-medium text-white/70 leading-none">
                            {item?.author?.name}
                          </p>
                          <p className="text-[10px] text-white/30 mt-0.5">
                            {getTime(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </NavLink>
                    <Share
                      title={item.title}
                      content={parse(item.content)}
                      url={`${baseUrl}singlePost/${item._id}`}
                    />
                  </div>

                  {/* Title + preview */}
                  <NavLink to={`/singlePost/${item?._id}`} className="flex-1">
                    <h2 className="text-[14px] font-semibold text-white leading-snug line-clamp-2 hover:text-white/80 transition-colors mb-2">
                      {item.title}
                    </h2>
                    <p className="text-[12px] text-white/35 line-clamp-3 leading-relaxed">
                      {typeof item.content === "string"
                        ? item.content
                            .replace(/<[^>]*>/g, " ")
                            .replace(/\s+/g, " ")
                            .trim()
                        : ""}
                    </p>
                  </NavLink>

                  {/* Likes */}
                  {item.likes?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/8">
                      <span className="text-[11px] text-white/25">
                        ♥ {item.likes.length} likes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Results count ── */}
        {filteredBlogs?.length > 0 && (
          <p className="text-center text-white/15 text-xs mt-10">
            {filteredBlogs.length}{" "}
            {filteredBlogs.length === 1 ? "post" : "posts"} found
          </p>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
