import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "./components/Main";
import Auth from "./components/Auth";
import AllBlogs from "./components/AllBolgs/AllBlogs";
import Profile from "./components/Profile";
import CreateBlog from "./components/CreateBlog";
import SinglePost from "./components/SinglePost";
import UserProfile from "./components/UserProfile";
import UpdateBlog from "./components/UpdateBlog";
import  { Bookmark } from "./components/Bookmarks";
function App() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  let isAuthenticated;

  if (profile === null) {
    isAuthenticated = false;
  } else {
    isAuthenticated = true;
  }
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="/auth"
            element={!isAuthenticated ? <Auth /> : <Navigate to="/" />}
          />
          <Route path="/allBlogs" element=<AllBlogs /> />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />}
          />
          <Route
            path="/createBlog"
            element={isAuthenticated ? <CreateBlog /> : <Navigate to="/auth" />}
          />
          <Route
            path="/bookmarks"
            element={isAuthenticated ? <Bookmark /> : <Navigate to="/auth" />}
          />
          <Route path="/singlePost/:id" element={<SinglePost />} />
          <Route path="/userProfile/:id" element={<UserProfile />} />
          <Route path="/updatePost/:id" element={<UpdateBlog />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
