import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../redux/actions/blog";
import { getCategory } from "../redux/actions/category";
import { toast } from "react-toastify";
const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cat = useSelector((state) => state?.category);
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const newBlog = {
        category,
        title,
        content,
        image,
      };
      await dispatch(createBlog(newBlog));
      toast.success("Blog Created Sucessfully 😊");
      setTimeout(() => {
        navigate("/allBlogs");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Blog Post
        </h2>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 font-bold mb-2"
          >
            Category
          </label>

          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700"
          >
            <option value="">Select a category</option>

            {cat?.map((item, index) => {
              return <option value={item._id}>{item.name}</option>;
            })}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="author"
            className="block text-gray-700 font-bold mb-2"
          >
            Image URL
          </label>
          <input
            type="text"
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 font-bold mb-2"
          >
            Content
          </label>
          <textarea
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700"
            rows="5"
          ></textarea>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleCreatePost}
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
