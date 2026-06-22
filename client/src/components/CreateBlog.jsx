import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../redux/actions/blog";
import { getCategory } from "../redux/actions/category";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { uploadImageToCloudinary } from "../utilty/uploadToCloudinary";

const CreateBlog = ({ placeholder }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cat = useSelector((state) => state?.category);
  const [editorHtml, setEditorHtml] = useState("");
  const profile = JSON.parse(localStorage.getItem("profile"));

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadImage = await uploadImageToCloudinary(file);
      setImage(uploadImage);
    }
  };

  const handleDropImage = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const uploaded = await uploadImageToCloudinary(file);
      setImage(uploaded);
    }
  };

  function blog(html) {
    handleChange(html);
    setContent(html);
  }

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
        author: profile?.result?._id,
      };
      await dispatch(createBlog(newBlog));
      console.log(newBlog, "This is Blog Data");
      toast.success("Blog Created Successfully 😊");
      setTimeout(() => {
        navigate("/allBlogs");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div
      className="flex items-center justify-center my-5"
      // style={{ height: "81vh" }}
    >
      <form
        className="bg-white p-8 rounded shadow-lg w-full"
        style={{ width: "47rem" }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Blog Post
        </h2>

        {step === 1 && (
          <>
            <div className="mb-4">
              <label
                htmlFor="category"
                className="block text-gray-700 font-bold mb-2"
              >
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              <label
                htmlFor="title"
                className="block text-gray-700 font-bold mb-2"
              >
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-gray-700 font-bold mb-2"
              >
                Upload Image
              </label>

              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="mb-4 w-full h-64 object-cover rounded-md"
                />
              )}

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropImage}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50 text-gray-500 hover:border-blue-400 transition duration-300"
              >
                <p className="text-lg text-gray-500">
                  Drag and drop an image, or click to select
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="mt-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Browse Files
                </label>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={nextStep}
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-gray-700 font-bold mb-2"
              >
                Content
              </label>
              <ReactQuill
                onChange={(html) => blog(html)}
                value={editorHtml}
                modules={CreateBlog.modules}
                formats={CreateBlog.formats}
                bounds={".app"}
                placeholder={placeholder}
                style={{ height: "43vh", marginBottom: "4rem" }}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Previous
              </button>
              <button
                onClick={handleCreatePost}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Blog
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

CreateBlog.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

CreateBlog.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

CreateBlog.propTypes = {
  placeholder: PropTypes.string,
};

export default CreateBlog;
