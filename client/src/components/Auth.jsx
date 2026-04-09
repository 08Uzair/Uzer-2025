import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategory } from "../redux/actions/category";
import { authSignIn, authSignUp } from "../redux/actions/auth";
import { uploadImageToCloudinary } from "../utilty/uploadToCloudinary";

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cat = useSelector((state) => state?.category);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadImage = await uploadImageToCloudinary(file);
      setImage(uploadImage);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = { name, email, password, image, bio, category };
      await dispatch(authSignUp(newUser));
      navigate("/");
    } catch (error) {
      console.error("Sign Up Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = { email, password };
      await dispatch(authSignIn(user));
      navigate("/");
    } catch (error) {
      console.error("Sign In Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!cat) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg max-w-md w-full p-8">
        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setIsSignIn(true)}
            className={`w-full py-2 rounded font-semibold transition ${
              isSignIn
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`w-full py-2 rounded font-semibold transition ${
              !isSignIn
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isSignIn ? (
          <SignInForm
            handleSignIn={handleSignIn}
            setEmail={setEmail}
            setPassword={setPassword}
            loading={loading}
          />
        ) : (
          <SignUpForm
            handleSignUp={handleSignUp}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            setBio={setBio}
            setCategory={setCategory}
            handleImageUpload={handleImageUpload}
            loading={loading}
            cat={cat}
          />
        )}
      </div>
    </div>
  );
};

const SignInForm = ({ handleSignIn, setEmail, setPassword, loading }) => (
  <form onSubmit={handleSignIn} className="space-y-4">
    <div>
      <label className="block text-sm font-semibold text-gray-700">Email</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter your email"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700">
        Password
      </label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Enter your password"
      />
    </div>

    <div className="flex justify-between items-center mt-4">
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </div>
  </form>
);

const SignUpForm = ({
  handleSignUp,
  setName,
  setEmail,
  setPassword,
  setBio,
  setCategory,
  handleImageUpload,
  loading,
  cat,
}) => {
  const [step, setStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleFileChange = async (file) => {
    if (!file) return;
    const fakeEvent = { target: { files: [file] } };
    await handleImageUpload(fakeEvent);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFileChange(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {step === 1 && (
        <>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter email"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`mt-1 w-full border-2 border-dashed ${
                  dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
                } rounded px-3 py-6 text-center cursor-pointer flex items-center justify-center`}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-full"
                  />
                ) : (
                  <p className="text-gray-500">
                    Drag and drop or click to upload
                  </p>
                )}
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-white"
                required
              >
                <option value="">Select category</option>
                {cat?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Tell us about yourself"
              />
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default Auth;
