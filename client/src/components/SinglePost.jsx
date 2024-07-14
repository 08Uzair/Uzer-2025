import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getBlogByID } from "../redux/actions/blog";
import { getTime } from "../utilty/getTime";
const SinglePost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.blog[0]);
  useEffect(() => {
    dispatch(getBlogByID(id));
  }, [dispatch, id]);
  console.log(data);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <img
            src={data?.image}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{data?.title}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-gray-600">By {data?.author?.name}</span>
            <span className="text-gray-600">{getTime(data?.createdAt)}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 prose prose-lg text-gray-700">
          {data?.content}
          <div />
        </div>
      </div>
    </>
  );
};
export default SinglePost;
