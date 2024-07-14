import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { useLocation, NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs, deleteBlog } from "../redux/actions/blog";
import { getTime } from "../utilty/getTime";
import { toast } from "react-toastify";
import { getUserByID, getUsers } from "../redux/actions/auth";
import Share from "./AllBolgs/Share";
import Loader from "../utilty/Loader";
const UserProfile = () => {
  const [open, setOpen] = React.useState(false);
  const blogs = useSelector((state) => state?.blog?.blog);
  const dispatch = useDispatch();
  useEffect(() => {
    window.scroll(0, 0);
    dispatch(getBlogs());
  }, [dispatch]);
  console.log(blogs);

  const { id } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const data = useSelector((state) => state?.auth[0]);
  useEffect(() => {
    dispatch(getUserByID(id));
  }, [dispatch, id]);
  // console.log(data);

  const handleDelete = (id) => {
    dispatch(deleteBlog(id));
    toast.success("Blog Deleted Successfully 😊");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  const baseUrl = window.location.href.split("allBlogs")[0];
  const isSameUser = (authorId) => {
    return id === authorId;
  };
  const handleOpen = () => setOpen(!open);
  if (!blogs || !data) {
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
                    src={data?.image}
                    alt="User Icon"
                    className="object-cover w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500"
                  />
                </div>
              </div>
              <h1 className="text-4xl font-medium text-gray-700">
                {data?.name}
                <span className="font-light text-gray-500">27</span>
              </h1>
              <p className="font-light text-gray-600 mt-3">{data?.email}</p>
              <p className="mt-8 text-gray-500">{data?.bio}</p>
              <p className="mt-2 text-gray-500">You Can Connect Me</p>
            </div>
            <div>
              <div className="flex justify-center item-center flex-wrap">
                {blogs?.map((item, index) => {
                  return (
                    <>
                      {isSameUser(item?.author?._id) ? (
                        <>
                          <div className="flex flex-wrap item-center justify-center mt-24 mb-24">
                            <div
                              key={index}
                              className="cursor-pointer flex flex-wrap flex-col max-w-sm p-6 space-y-6 overflow-hidden rounded-lg shadow-md dark:bg-gray-50 dark:text-gray-800 mb-10 mr-2 ml-6"
                            >
                              <div className="flex space-x-4">
                                {/* <NavLink
                                  to={`/userProfile/${item?.author?._id}`}
                                >
                                  <img
                                    className="object-cover w-12 h-12 rounded-full shadow dark:bg-gray-500"
                                    src={item?.author?.image}
                                    alt={item?.author?.name}
                                  />
                                </NavLink> */}

                                <div className="flex flex-col space-y-1">
                                  {/* <a
                                    rel="noopener noreferrer"
                                    href="#"
                                    className="text-sm font-semibold"
                                  >
                                    {item?.author?.name}
                                  </a> */}
                                  <span
                                    className="text-xs dark:text-gray-600 relative"
                                    style={{
                                      left: "-7rem",
                                      top: "-23rem",
                                      background: "black",
                                      border: "1px solid",
                                      color: "#fff",
                                      padding: "4px",
                                      "border-radius": "6px",
                                    }}
                                  >
                                    {getTime(item.createdAt)}
                                  </span>
                                </div>
                              </div>
                              <NavLink to={`/singlePost/${item?._id}`}>
                                <div>
                                  <img
                                    src={item.image}
                                    className="object-cover w-full mb-4 h-60 sm:h-90 rounded-xl dark:bg-gray-500"
                                    alt={item.title}
                                  />
                                  <h2 className="mb-1 text-xl font-semibold line-clamp-1">
                                    {item.title}
                                  </h2>
                                  <p className="text-sm dark:text-gray-600 line-clamp-3">
                                    {item.content}
                                  </p>
                                </div>
                              </NavLink>
                              <div className="flex flex-wrap justify-between">
                                <div className="space-x-2">
                                  {isSameUser(item.author._id) ? (
                                    <>
                                      <div>
                                        {open && (
                                          <div className="fixed inset-0 flex items-center justify-center z-50">
                                            <div className="absolute inset-0 bg-black opacity-50"></div>
                                            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full z-10">
                                              <div className=" text-xl font-black p-5 text-center">
                                                Do You Want to Delete the Blog !
                                              </div>
                                              <div className="px-4 py-2 border-t flex justify-end">
                                                <button
                                                  onClick={handleOpen}
                                                  className="text-grey-500 p-4 mr-2"
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    handleDelete(item._id)
                                                  }
                                                  style={{ width: "20%" }}
                                                  className="bg-red-700 text-white rounded"
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <button
                                        aria-label="delete the post"
                                        type="button"
                                        className="p-2 "
                                        onClick={handleOpen}
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
                                      <Share
                                        title={item.title}
                                        content={item.content}
                                        url={`${baseUrl}singlePost/${item._id}`}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <Share
                                        title={item.title}
                                        content={item.content}
                                        url={`${baseUrl}singlePost/${item._id}`}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
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

export default UserProfile;
