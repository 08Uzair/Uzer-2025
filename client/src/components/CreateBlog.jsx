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
import {
  ImageIcon,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

// ─── Dark theme overrides for ReactQuill ────────────────────────────────
function QuillDarkStyles() {
  return (
    <style>{`
      .dark-quill .ql-toolbar.ql-snow {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 14px 14px 0 0;
        border-bottom: none;
      }
      .dark-quill .ql-container.ql-snow {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 0 0 14px 14px;
        color: #fff;
      }
      .dark-quill .ql-editor.ql-blank::before {
        color: rgba(255,255,255,0.25);
        font-style: normal;
      }
      .dark-quill .ql-snow .ql-stroke {
        stroke: rgba(255,255,255,0.55);
      }
      .dark-quill .ql-snow .ql-fill {
        fill: rgba(255,255,255,0.55);
      }
      .dark-quill .ql-snow .ql-picker {
        color: rgba(255,255,255,0.55);
      }
      .dark-quill .ql-snow.ql-toolbar button:hover .ql-stroke,
      .dark-quill .ql-snow .ql-toolbar button:hover .ql-stroke {
        stroke: #fff;
      }
      .dark-quill .ql-snow.ql-toolbar button:hover .ql-fill {
        fill: #fff;
      }
      .dark-quill .ql-picker-options {
        background: #161616;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .dark-quill .ql-picker-item {
        color: rgba(255,255,255,0.7);
      }
      .dark-quill .ql-snow .ql-tooltip {
        background: #161616;
        border: 1px solid rgba(255,255,255,0.12);
        color: #fff;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      }
      .dark-quill .ql-snow .ql-tooltip input[type=text] {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.15);
        color: #fff;
      }
      .dark-quill-error .ql-toolbar.ql-snow,
      .dark-quill-error .ql-container.ql-snow {
        border-color: rgba(239,68,68,0.55) !important;
      }
    `}</style>
  );
}

const STEPS = [
  { id: 1, label: "Details" },
  { id: 2, label: "Content" },
];

const CreateBlog = ({ placeholder }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cat = useSelector((state) => state?.category);
  const [editorHtml, setEditorHtml] = useState("");
  const profile = JSON.parse(localStorage.getItem("profile"));

  const MIN_TITLE_LENGTH = 5;
  const MIN_CONTENT_LENGTH = 30; // plain-text chars, html stripped

  const plainTextLength = (html) =>
    (html || "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim().length;

  const validateStep1 = () => {
    const next = {};
    if (!category) next.category = "Please select a category";
    if (!title.trim()) next.title = "Title is required";
    else if (title.trim().length < MIN_TITLE_LENGTH)
      next.title = `Title must be at least ${MIN_TITLE_LENGTH} characters`;
    if (!image) next.image = "Please upload a cover image";
    setErrors((prev) => ({
      ...prev,
      ...next,
      category: next.category,
      title: next.title,
      image: next.image,
    }));
    return next;
  };

  const validateStep2 = () => {
    const next = {};
    if (plainTextLength(content) === 0) next.content = "Content is required";
    else if (plainTextLength(content) < MIN_CONTENT_LENGTH)
      next.content = `Content must be at least ${MIN_CONTENT_LENGTH} characters`;
    setErrors((prev) => ({ ...prev, content: next.content }));
    return next;
  };

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const uploadImage = await uploadImageToCloudinary(file);
        setImage(uploadImage);
        clearError("image");
      } catch (err) {
        toast.error("Image upload failed, please try again");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDropImage = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploading(true);
      try {
        const uploaded = await uploadImageToCloudinary(file);
        setImage(uploaded);
        clearError("image");
      } catch (err) {
        toast.error("Image upload failed, please try again");
      } finally {
        setUploading(false);
      }
    }
  };

  function blog(html) {
    handleChange(html);
    setContent(html);
    if (plainTextLength(html) >= MIN_CONTENT_LENGTH) clearError("content");
  }

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const next = validateStep2();
    if (Object.values(next).some(Boolean)) {
      toast.error("Please add some content before publishing");
      return;
    }
    setSubmitting(true);
    try {
      const newBlog = {
        category,
        title,
        content,
        image,
        author: profile?.result?._id,
      };
      await dispatch(createBlog(newBlog));
      toast.success("Blog Created Successfully 😊");
      setTimeout(() => {
        navigate("/allBlogs");
      }, 1500);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    const next = validateStep1();
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields to continue");
      return;
    }
    setStep(2);
  };
  const prevStep = () => setStep(1);

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <QuillDarkStyles />

      <div
        className="w-full rounded-3xl border border-white/10 backdrop-blur-sm overflow-hidden"
        style={{ maxWidth: "47rem", background: "rgba(255,255,255,0.04)" }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/8">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            Create Blog Post
          </h2>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3">
            {STEPS.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      step === s.id
                        ? "bg-white text-black"
                        : step > s.id
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-white/30 border border-white/10"
                    }`}
                  >
                    {step > s.id ? <Check size={14} /> : s.id}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step === s.id ? "text-white" : "text-white/35"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-px ${
                      step > s.id ? "bg-white/40" : "bg-white/10"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form className="px-8 py-8">
          {step === 1 && (
            <>
              <div className="mb-5">
                <label
                  htmlFor="category"
                  className="block text-white/60 text-sm font-medium mb-2"
                >
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    clearError("category");
                  }}
                  className={`w-full rounded-xl py-2.5 px-3.5 text-sm text-white bg-white/5 border focus:outline-none transition-colors ${
                    errors.category
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-white/30"
                  }`}
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className="bg-[#111]">
                    Select a category
                  </option>
                  {cat?.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      className="bg-[#111]"
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="title"
                  className="block text-white/60 text-sm font-medium mb-2"
                >
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    clearError("title");
                  }}
                  type="text"
                  placeholder="Give your post a compelling title"
                  className={`w-full rounded-xl py-2.5 px-3.5 text-sm text-white bg-white/5 border placeholder:text-white/25 focus:outline-none transition-colors ${
                    errors.title
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-white/30"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-white/60 text-sm font-medium mb-2">
                  Cover Image
                </label>

                {image && (
                  <div className="relative mb-3 rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-56 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImage("")}
                      className="absolute top-2 right-2 text-xs px-2.5 py-1 rounded-lg bg-black/60 text-white/70 hover:text-white border border-white/15 backdrop-blur-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {!image && (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropImage}
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 ${
                      errors.image
                        ? "border-red-500/50 hover:border-red-500/70"
                        : "border-white/15 hover:border-white/30"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      {uploading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      ) : (
                        <UploadCloud size={20} className="text-white/40" />
                      )}
                    </div>
                    <p className="text-sm text-white/40 mb-3 text-center">
                      {uploading
                        ? "Uploading image…"
                        : "Drag and drop an image, or click to select"}
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
                      className="cursor-pointer flex items-center gap-2 bg-white text-black hover:bg-white/90 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      <ImageIcon size={14} />
                      Browse Files
                    </label>
                  </div>
                )}
                {errors.image && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.image}</p>
                )}
              </div>

              <div className="flex items-center justify-end mt-8">
                <button
                  onClick={nextStep}
                  type="button"
                  className="flex items-center gap-2 bg-white text-black hover:bg-white/90 font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors"
                >
                  Next
                  <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-4">
                <label className="block text-white/60 text-sm font-medium mb-2">
                  Content
                </label>
                <div
                  className={`dark-quill ${errors.content ? "dark-quill-error" : ""}`}
                >
                  <ReactQuill
                    onChange={(html) => blog(html)}
                    value={editorHtml}
                    modules={CreateBlog.modules}
                    formats={CreateBlog.formats}
                    bounds={".app"}
                    placeholder={placeholder}
                    style={{ height: "40vh", marginBottom: "3.5rem" }}
                  />
                </div>
                {errors.content && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.content}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={prevStep}
                  type="button"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-medium py-2.5 px-5 rounded-xl text-sm transition-colors"
                >
                  <ArrowLeft size={15} />
                  Previous
                </button>
                <button
                  onClick={handleCreatePost}
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    "Create Blog"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
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
