import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTime } from "../../utilty/getTime.js";
import {  getBlogs } from "../../redux/actions/blog.js";
import Share from "./Share.jsx";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getCategory } from "../../redux/actions/category.js";
import { toast } from "react-toastify";
import Loader from "../../utilty/Loader.jsx";

const AllBlogs = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.blog?.blog?.blog);
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [query, setQuery] = useState("");
  // const [open, setOpen] = React.useState(false);
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
    window.scroll(0, 0);
    dispatch(getBlogs());
  }, [dispatch]);


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

  // const handleOpen = () => setOpen(!open);

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
            {data?.map((item, index) => (
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;
