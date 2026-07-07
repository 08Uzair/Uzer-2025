import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../redux/actions/blog";
import { getTime } from "../utilty/getTime";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const parse = require("html-react-parser").default;

function AnimatedBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
      <div
        className="absolute rounded-full opacity-[0.06]"
        style={{
          width: "500px",
          height: "500px",
          top: "-100px",
          left: "-100px",
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          animation: "orbFloat1 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-[0.04]"
        style={{
          width: "400px",
          height: "400px",
          bottom: "-100px",
          right: "-100px",
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          animation: "orbFloat2 16s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,30px) scale(1.05)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-40px,-30px) scale(1.05)}}
      `}</style>
    </div>
  );
}

const CardPanel = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.blog?.blog?.blog?.slice(0, 3));

  useEffect(() => {
    dispatch(getBlogs());
  }, []);

  return (
    <div
      className="relative rounded-3xl overflow-hidden mb-16 border border-white/10"
      style={{ background: "#0a0a0a" }}
    >
      <AnimatedBg />

      <div className="relative z-10 grid grid-cols-12">
        {/* ── Left hero panel ── */}
        <div
          className="col-span-12 lg:col-span-6 relative flex flex-col justify-end p-10 min-h-[420px] bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/15779596/pexels-photo-15779596/free-photo-of-close-up-of-keys-on-a-vintage-typewriter.jpeg?auto=compress&cs=tinysrgb&w=600')`,
          }}
        >
          {/* dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          {/* grain */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10">
            <span className="text-white/40 text-xs font-medium uppercase tracking-widest mb-4 block">
              Featured
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              Blogging is a Conversation, Not a Code
            </h2>
            <p className="text-white/40 text-sm mb-6">by Mike Butcher</p>
            <NavLink to="/allBlogs">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white border border-white/20 hover:bg-white/10 hover:border-white/35 transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Explore all blogs
                <ArrowRight size={14} />
              </button>
            </NavLink>
          </div>
        </div>

        {/* ── Right blog list ── */}
        <div className="col-span-12 lg:col-span-6 flex flex-col divide-y divide-white/8 p-2">
          {data?.map((item, index) => (
            <div
              key={item._id || index}
              className="group flex gap-4 p-5 hover:bg-white/4 rounded-2xl transition-all border-none"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 ">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg";
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <span className="text-white/30 text-[11px]">
                    {getTime(item.createdAt)}
                  </span>
                  <h3 className="text-white text-[14px] font-semibold leading-snug line-clamp-2 mt-0.5">
                    {item.title}
                  </h3>
                </div>
                <NavLink to={`/singlePost/${item._id}`}>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white transition-colors mt-2">
                    Read more <ArrowRight size={11} />
                  </span>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardPanel;
