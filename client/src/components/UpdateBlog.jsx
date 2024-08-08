import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategory } from "../redux/actions/category";
import { getBlogByID, updateBlog } from "../redux/actions/blog";
import { toast } from "react-toastify";

const UpdateBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cat = useSelector((state) => state?.category);
  const blog = useSelector((state) => state.blog.singleBlog);
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBlogByID(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setImage(blog.image || "");
      setContent(blog.content || "");
      setCategory(blog.category || "");
    }
  }, [blog]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedBlog = {
      title,
      content,
      image,
      category,
    };
    await dispatch(updateBlog(id, updatedBlog));
    toast.success("Blog Updated Sucessfully 😊");
    setTimeout(() => {
      navigate("/allBlogs");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Blog Post
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
            value={category} // Use the category state instead of blog?.category
            className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700"
          >
            <option value="">Select a category</option>
            {cat?.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
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
            value={image}
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
            value={content}
            className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700"
            rows="5"
          ></textarea>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
