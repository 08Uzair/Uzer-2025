import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../redux/actions/blog";
import { getTime } from "../utilty/getTime";
import { NavLink } from "react-router-dom";
// import { NavLink } from "react-router-dom";
const CardPanel = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.blog?.blog?.slice(0, 3));
  useEffect(() => {
    dispatch(getBlogs());
  }, []);
  console.log(data);
  return (
    <div>
      <div class="dark:bg-gray-100 dark:text-gray-900 mb-24">
        <div class="container grid grid-cols-12 mx-auto">
          <div class="group relative flex flex-col justify-center col-span-12 align-middle dark:bg-gray-300 bg-no-repeat bg-cover lg:col-span-6 lg:h-auto bg-[url('https://images.pexels.com/photos/15779596/pexels-photo-15779596/free-photo-of-close-up-of-keys-on-a-vintage-typewriter.jpeg?auto=compress&cs=tinysrgb&w=600')]">
            <div class="absolute inset-0 bg-gradient-to-br from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative flex flex-col items-center p-8 py-12 text-center dark:text-gray-800">
              <h2 class="py-4 text-5xl font-bold text-white">
                Blogging is just writting-writting using a particularly
                efficient type of publishing technology
              </h2>
              <a class="" href="/allBlogs">
                <p class="pb-6 text-white">BY SIMON DUMEN</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-7 h-7 text-white"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
          <div class="flex flex-col col-span-12  divide-y lg:col-span-6  dark:divide-gray-300">
            {data?.map((item, index) => {
              return (
                <>
                  <div class=" group relative flex flex-col p-6 bg-no-repeat bg-cover bg-[gray]">
                    <div class="absolute inset-0 bg-gradient-to-br from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative pt-6 pb-4 space-y-2">
                      <span class="text-white">{getTime(item.createdAt)}</span>
                      <h1 class="line-clamp-2 text-2xl font-bold text-white">
                        {item.title}
                      </h1>
                      <p class="line-clamp-2 text-white">{item.content}</p>
                      <a class="" href="/singlePost/666a8ea0d20411c5c41af8e9">
                        <div class="inline-flex items-center py-2 space-x-2 text-sm dark:text-violet-600 ">
                          <NavLink to={`/singlePost/${item._id}`}>
                            <span class="font-bold text-white">Read more</span>
                          </NavLink>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="w-4 h-4 font-bold text-white"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPanel;
