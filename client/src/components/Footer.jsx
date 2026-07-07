import React from "react";

const Footer = () => {
  return (
    <footer
      className="relative z-10 border-t border-white/8 py-5"
      style={{
        background: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-white/20 text-xl">✦</span>
          <span className="text-white/25 text-l font-medium tracking-wide">
            Blogii
          </span>
        </div>
        <p className="text-white/20 text-xs tracking-wide">
          By Uzer Nizamuddin Qureshi © 2024/2025
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="text-white/15 text-xs">All rights reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
