import React, { useState } from "react";

const Share = ({ title, content, url }) => {
  const handleShare = async (title, content, url) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: content,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing blog post", error);
      }
    } else {
      console.log("Web Share API not supported in this browser");
    }
  };
  return (
    <>
      <button
        onClick={() => handleShare(title, content, url)}
        aria-label="Share this post"
        type="button"
        className="p-2 text-center "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-current dark:text-violet-600 hover:text-gray-600"
        >
          <path d="M5.5 15a3.51 3.51 0 0 0 2.36-.93l6.26 3.58a3.06 3.06 0 0 0-.12.85 3.53 3.53 0 1 0 1.14-2.57l-6.26-3.58a2.74 2.74 0 0 0 .12-.76l6.15-3.52A3.49 3.49 0 1 0 14 5.5a3.35 3.35 0 0 0 .12.85L8.43 9.6A3.5 3.5 0 1 0 5.5 15zm12 2a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5zm0-13A1.5 1.5 0 1 1 16 5.5 1.5 1.5 0 0 1 17.5 4zm-12 6A1.5 1.5 0 1 1 4 11.5 1.5 1.5 0 0 1 5.5 10z"></path>
        </svg>
      </button>
    </>
  );
};

export default Share;
