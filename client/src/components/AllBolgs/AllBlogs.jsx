import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTime } from "../../utilty/getTime.js";
import { deleteBlog, getBlogs } from "../../redux/actions/blog.js";
import Share from "./Share.jsx";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getCategory } from "../../redux/actions/category.js";
import { toast } from "react-toastify";
import Loader from "../../utilty/Loader.jsx";

const AllBlogs = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.blog?.blog);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [query, setQuery] = useState("");
  const [open, setOpen] = React.useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  useEffect(() => {
    const category = queryParams.get("category");
    if (category !== null) {
      setQuery(category.toLowerCase());
      setIsSearch(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"))?.result;
    setUserData(profile);
  }, []);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteBlog(id));
    toast.success("Blog Deleted Successfully 😊");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  function handelAll() {
    setActiveFilter("");
    window.location.reload();
  }
  const isSameUser = (authorId) => {
    const storedId = userData?._id;
    return storedId === authorId;
  };

  const baseUrl = window.location.href.split("allBlogs")[0];

  const [activeFilter, setActiveFilter] = useState("");

  const handleFilterClick = (item) => {
    setQuery(item.name?.toLowerCase());
    setActiveFilter(item._id);
  };

  const cat = useSelector((state) => state?.category);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const handleOpen = () => setOpen(!open);

  const filteredBlogs = data?.filter(
    (item) =>
      item?.title?.toLowerCase()?.includes(query) ||
      item?.content?.toLowerCase()?.includes(query) ||
      item?.author?.name?.toLowerCase()?.includes(query) ||
      item?.category?.name?.toLowerCase()?.includes(query)
  );
  const handleSearch = (e) => {
    setQuery(e.target.value?.toLowerCase());
    setIsSearch(true);
    navigate({
      pathname: window.location.pathname,
      search: "",
    });
  };
  if (!data || !cat) {
    return <Loader />;
  }
  return (
    <div>
      <div className="ml-32 mt-12 mr-32">
        {/* SEARCH */}
        <div className="mb-4">
          <input
            type="text"
            onChange={(e) => handleSearch(e)}
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* FILTER */}
        <div>
          <div className="flex space-x-2 w-full overflow-x-auto ">
            <button
              onClick={() => handelAll()}
              className={`px-4 py-2 rounded-lg focus:outline-none ${
                activeFilter === ""
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            {cat?.map((item) => (
              <button
                onClick={() => handleFilterClick(item)}
                key={item._id}
                className={`px-4 py-2 rounded-lg focus:outline-none ${
                  activeFilter === item._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap item-center justify-center mt-24 mb-24">
            {filteredBlogs?.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer flex flex-wrap flex-col max-w-sm p-6 space-y-6 overflow-hidden rounded-lg shadow-md dark:bg-gray-50 dark:text-gray-800 mb-10 mr-2 ml-6"
              >
                <div className="flex space-x-4">
                  <NavLink to={`/userProfile/${item?.author?._id}`}>
                    <img
                      className="object-cover w-12 h-12 rounded-full shadow dark:bg-gray-500"
                      src={item?.author?.image}
                      alt={item?.author?.name}
                    />
                  </NavLink>
                  <div className="flex item-center justify ">
                    <div className="flex flex-col space-y-1 mr-36">
                      <a
                        rel="noopener noreferrer"
                        href="#"
                        className="text-sm font-semibold"
                      >
                        {item?.author?.name}
                      </a>
                      <span className="text-xs dark:text-gray-600 relative">
                        {getTime(item.createdAt)}
                      </span>
                    </div>
                    <Share
                      title={item.title}
                      content={item.content}
                      url={`${baseUrl}singlePost/${item._id}`}
                    />
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
                                    onClick={() => handleDelete(item._id)}
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
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;
