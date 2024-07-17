import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTime } from "../../utilty/getTime.js";
import { deleteBlog, getBlogs } from "../../redux/actions/blog.js";
import Share from "./Share.jsx";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
const Blogs = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.blog?.blog);
  const [userData, setUserData] = useState();
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"))?.result;
    setUserData(profile);
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
    dispatch(getBlogs());
  }, []);
  console.log(data);

  const handleDelete = (id) => {
    dispatch(deleteBlog(id));
    toast.success("Blog Deleted Sucessfully 😊");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  const isSameUser = (authorId) => {
    const storedId = userData?._id;
    return storedId === authorId;
  };
  const baseUrl = window.location.href.split("allBlogs")[0];

  return (
    <div>
      <div className="flex flex-wrap item-center justify-center mt-24 mb-24">
        {data?.map((item, index) => {
          return (
            <>
              <div className="cursor-pointer flex flex-wrap flex-col max-w-sm p-6 space-y-6 overflow-hidden rounded-lg shadow-md dark:bg-gray-50 dark:text-gray-800 mb-10 mr-2 ml-6">
                <div className="flex space-x-4">
                  <img
                    className="object-cover w-12 h-12 rounded-full shadow dark:bg-gray-500"
                    src={item?.author?.image}
                  />
                  <div className="flex flex-col space-y-1">
                    <a
                      rel="noopener noreferrer"
                      href="#"
                      className="text-sm font-semibold"
                    >
                      {item?.author?.name}
                    </a>
                    <span className="text-xs dark:text-gray-600">
                      {getTime(item.createdAt)}
                    </span>
                  </div>
                </div>
                <NavLink to={`/singlePost/${item?._id}`}>
                  <div>
                    <img
                      src={item.image}
                      className="object-cover w-full mb-4 h-60 sm:h-90 rounded-xl dark:bg-gray-500"
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
                        <button
                          aria-label="delete the post"
                          type="button"
                          className="p-2"
                          onClick={() => handleDelete(item._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-current dark:text-violet-600"
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
                              className="w-5 h-5 fill-current dark:text-violet-600"
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
                        <button
                          aria-label="Bookmark this post"
                          type="button"
                          className="p-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-current dark:text-violet-600"
                          >
                            <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"></path>
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        {" "}
                        <Share
                          title={item.title}
                          content={item.content}
                          url={`${baseUrl}singlePost/${item._id}`}
                        />
                        <button
                          aria-label="Bookmark this post"
                          type="button"
                          className="p-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-current dark:text-violet-600"
                          >
                            <path d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"></path>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-2 text-sm dark:text-gray-400">
                    <button
                      type="button"
                      className="flex items-center p-1 space-x-1.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 fill-current dark:text-violet-400"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"></path>
                      </svg>
                      <span>30</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center p-1 space-x-1.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 fill-current dark:text-violet-400"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z"></path>
                      </svg>
                      <span>283</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Blogs;
