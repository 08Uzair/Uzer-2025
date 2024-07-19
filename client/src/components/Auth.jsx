import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCategory } from "../redux/actions/category";
import { signUp, signin } from "../redux/actions/auth";
import { toast } from "react-toastify";

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
  const handleSignUp = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const newUser = {
        name,
        email,
        password,
        image,
        bio,
        category,
      };
      await dispatch(signUp(newUser));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
    window.location.reload();
  };
  const handleSignIn = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const user = {
        email,
        password,
      };
      await dispatch(signin(user));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
    window.location.reload();
  };
  if (!cat) {
    return <>Loading....</>;
  }
  if (!signin) {
    return <>Loading....</>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 shadow-md w-full max-w-md">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsSignIn(true)}
            className={`px-4 py-2 text-lg font-semibold ${
              isSignIn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }  -l`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`px-4 py-2 text-lg font-semibold ${
              !isSignIn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }  -r`}
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
            setImage={setImage}
            setBio={setBio}
            setCategory={setCategory}
            cat={cat}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

const SignInForm = ({ handleSignIn, setEmail, setPassword, loading }) => (
  <form onSubmit={handleSignIn}>
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="email"
      >
        Email
      </label>
      <input
        onChange={(e) => setEmail(e.target.value)}
        className="shadow appearance-none border   w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="email"
        type="email"
        placeholder="Email"
      />
    </div>
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="password"
      >
        Password
      </label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        className="shadow appearance-none border   w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder="Password"
      />
    </div>
    <div className="flex items-center justify-between">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   focus:outline-none focus:shadow-outline"
        type="button"
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Signin"}
      </button>
      <a
        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        href="#"
      >
        Forgot Password?
      </a>
    </div>
  </form>
);

const SignUpForm = ({
  handleSignUp,
  loading,
  setName,
  setEmail,
  setPassword,
  setImage,
  setBio,
  setCategory,
  cat,
}) => (
  <form onSubmit={handleSignUp}>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Username
      </label>
      <input
        className="shadow appearance-none border   w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Username"
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Email
      </label>
      <input
        className="shadow appearance-none border   w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Password
      </label>
      <input
        className="shadow appearance-none border   w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Profile Avatar
      </label>
      <input
        className="shadow appearance-none border   w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Image Url"
        onChange={(e) => setImage(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
        Category
      </label>

      <select
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-300   py-2 px-3 text-gray-700"
      >
        <option value="">Select a category</option>

        {cat?.map((item, index) => {
          return (
            <>
              <option value={item._id}>{item.name}</option>
            </>
          );
        })}
      </select>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
      <textarea
        className="shadow appearance-none border   w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
      />
    </div>
    <div className="flex items-center justify-between">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4   focus:outline-none focus:shadow-outline"
        type="submit"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Signup"}
      </button>
    </div>
  </form>
);

export default Auth;
