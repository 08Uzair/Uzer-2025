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

const CreateBlog = ({ placeholder }) => {
  const [step, setStep] = useState(1); // Step state to manage current step
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cat = useSelector((state) => state?.category);
  const [editorHtml, setEditorHtml] = useState("");

  const handleChange = (html) => {
    setEditorHtml(html);
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
      };
      console.log(newBlog);
      await dispatch(createBlog(newBlog));
      toast.success("Blog Created Successfully 😊");
      setTimeout(() => {
        navigate("/allBlogs");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle the "Next" button click
  const nextStep = () => {
    setStep(step + 1);
  };

  // Function to handle the "Previous" button click
  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div
      className="bg-gray-100 flex items-center justify-center"
      style={{ height: "81vh" }}
    >
      <form
        className="bg-white p-8 rounded shadow-md w-full"
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
                Image URL
              </label>
              <input
                value={image}
                type="text"
                onChange={(e) => setImage(e.target.value)}
                className="w-full border border-gray-300 rounded py-2 px-3 text-gray-700"
              />
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
                onChange={(html) => {
                  blog(html);
                }}
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

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
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
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
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

/*
 * PropType validation
 */
CreateBlog.propTypes = {
  placeholder: PropTypes.string,
};

export default CreateBlog;
