import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBlogByID } from "../redux/actions/blog";
import { getTime } from "../utilty/getTime";
import Loader from "../utilty/Loader";
const SinglePost = ({ placeholder }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.blog?.singleBlog);
  console.log(data);

  const parse = require("html-react-parser").default;
  useEffect(() => {
    window.scroll(0, 0);
    dispatch(getBlogByID(id));
  }, [id]);
  // console.log({ data });
  if (data == "") {
    return <Loader />;
  }
  return (
    <>
      <div className="max-w-4xl mx-auto p-6 ">
        <div className="mb-8">
          <img
            src={data?.image}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800 text-gray-600 bg-white rounded-xl p-2  border-2 border-gray-100">{data?.title}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-gray-600 bg-white rounded-xl p-2  border-2 border-gray-100">By {data?.author?.name}</span>
            <span className="text-gray-600 text-gray-600 bg-white rounded-xl p-2  border-2 border-gray-100">{getTime(data?.createdAt)}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 prose prose-lg text-gray-700 border-2 border-gray-100">
          {parse(data?.content)}
          <div />
        </div>
      </div>
    </>
  );
};
export default SinglePost;
