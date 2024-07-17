import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs, deleteBlog } from "../redux/actions/blog";
import { getTime } from "../utilty/getTime";

import Share from "./AllBolgs/Share";
import { toast } from "react-toastify";
import Loader from "../utilty/Loader";
const Profile = () => {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  useEffect(() => {
    const profile =
      JSON.parse(localStorage.getItem("profile"))?.result ||
      JSON.parse(localStorage.getItem("profile"));
    setUserData(profile);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };
  const blogs = useSelector((state) => state?.blog?.blog?.blog);
  useEffect(() => {
    window.scroll(0, 0);
    dispatch(getBlogs());
  }, [dispatch]);
  console.log(blogs);
  const isSameUser = (authorId) => {
    const storedId = userData?._id;
    return storedId === authorId;
  };
  const handleDelete = (id) => {
    dispatch(deleteBlog(id));
    toast.success("Blog Deleted Sucessfully 😊");
    dispatch(getBlogs());
  };
  const baseUrl = window.location.href.split("allBlogs")[0];
  if (!blogs || !userData) {
    return <Loader />;
  }
  return (
    <>
      <div className="p-16">
        <div className="p-8 bg-white shadow mt-24">
          <div className="mt-20 text-center border-b pb-12">
            <div>
              <div>
                <div>
                  <img
                    src={userData?.image}
                    alt="User Icon"
                    className="object-cover w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500"
                  />
                </div>
              </div>
              <h1 className="text-4xl font-medium text-gray-700">
                {userData?.name}
              </h1>
              <p className="font-light text-gray-600 mt-3">{userData?.email}</p>
              <p className="mt-8 text-gray-500">{userData?.bio}</p>
              <p className="mt-2 text-gray-500">You Can Connect Me</p>
            </div>
            <div className="flex justify-center item-center flex-wrap">
              <div className="flex justify-center items-center flex-wrap">
                {blogs?.map((item, index) => {
                  return (
                    <>
                      {isSameUser(item?.author?._id) ? (
                        <>
                          <div className="max-w-[24rem] m-8 overflow-hidden mt-12 bg-white shadow-lg rounded-lg">
                            <NavLink to={`/singlePost/${item._id}`}>
                              <div className="m-0 rounded-none">
                                <img
                                  src={item.image}
                                  alt="ui/ux review check"
                                  className="w-full"
                                />
                              </div>
                            </NavLink>
                            <div className="p-4">
                              <h1 className="line-clamp-1 text-blue-gray-900 font-black text-base">
                                {item.title}
                              </h1>
                              <h2 className="line-clamp-3 mt-3 text-gray-700 font-normal">
                                {item.content}
                              </h2>
                            </div>
                            <div className="flex flex-wrap justify-between p-4">
                              <div className="space-x-2">
                                <Share
                                  title={item.title}
                                  content={item.content}
                                  url={`${baseUrl}singlePost/${item._id}`}
                                />
                                <button
                                  aria-label="delete the post"
                                  type="button"
                                  className="p-2"
                                  onClick={() => handleDelete(item._id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 fill-current dark:text-violet-600 hover:text-red-600"
                                  >
                                    <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path>
                                    <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
                                  </svg>
                                </button>
                                <NavLink to={`/updatePost/${item._id}`}>
                                  <button
                                    aria-label="Edit this post"
                                    type="button"
                                    className="p-2"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      className="w-5 h-5 fill-current dark:text-violet-600 hover:text-green-600"
                                    >
                                      <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"></path>
                                    </svg>
                                  </button>
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-center">
            <p className="text-gray-600 text-center font-light lg:px-16">
              "Bloggers are the modern-day storytellers, weaving threads of
              knowledge, experience, and creativity into the vast tapestry of
              the internet. Their words have the power to inform, inspire, and
              ignite change, turning the ordinary into the extraordinary and
              connecting the world one post at a time."
            </p>
            <NavLink className="text-center" to="/allBlogs">
              <button className="text-indigo-500 py-2 px-4 font-medium mt-4">
                BACK
              </button>
            </NavLink>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default Profile;
