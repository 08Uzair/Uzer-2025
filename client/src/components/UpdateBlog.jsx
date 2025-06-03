import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategory } from "../redux/actions/category";
import { getBlogByID, updateBlog } from "../redux/actions/blog";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import PropTypes from "prop-types";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { uploadImageToCloudinary } from "../utilty/uploadToCloudinary";

const UpdateBlog = ({ placeholder }) => {
  const [step, setStep] = useState(1);
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState(""); // Use content state
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
      setContent(blog.content || ""); // Initialize content with blog content
      setCategory(blog.category || "");
    }
  }, [blog]);

  const handleChange = (html) => {
    setContent(html); // Update content state directly
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
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedBlog = {
      title,
      content,
      image,
      category,
    };
    await dispatch(updateBlog(id, updatedBlog));
    toast.success("Blog Updated Successfully 😊");
    setTimeout(() => {
      navigate("/allBlogs");
    }, 2000);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div
      className="flex items-center justify-center"
      // style={{ height: "81vh" }}
    >
      <form
        className="bg-white p-8 rounded shadow-md w-full"
        style={{ width: "47rem" }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Blog Post
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
                value={blog?.category?.name}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700"
              >
                <option value="">Select a category</option>
                {cat?.map((item) => (
                  <option key={item._id} value={item.name}>
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
                onChange={handleChange}
                value={content} // Use content state for value
                modules={UpdateBlog.modules}
                formats={UpdateBlog.formats}
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
                onClick={handleUpdate}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Blog
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

UpdateBlog.modules = {
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

UpdateBlog.formats = [
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

UpdateBlog.propTypes = {
  placeholder: PropTypes.string,
};

export default UpdateBlog;
