import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBlogByID } from "../redux/actions/blog";
import { getTime } from "../utilty/getTime";
import Loader from "../utilty/Loader";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={data?.image}
          alt={data?.title}
          className="w-full h-[450px] object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* Blog Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
          {data?.title}
        </h1>

        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm">
            👤 {data?.author?.name}
          </span>

          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm">
            🕒 {getTime(data?.createdAt)}
          </span>

          {data?.category?.name && (
            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm">
              {data.category.name}
            </span>
          )}
        </div>
      </div>

      {/* Blog Content */}
      <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="prose prose-lg max-w-none">
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
  );
};

export default SinglePost;