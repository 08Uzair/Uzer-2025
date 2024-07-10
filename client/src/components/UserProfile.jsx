import React, { useState, useEffect } from "react";
// import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { getBlogs, deleteBlog } from "../redux/actions/blog";
// import { getTime } from "../utilty/getTime";
import { getUserByID, getUsers } from "../redux/actions/auth";
const UserProfile = () => {
  //   const blogs = useSelector((state) => state?.blog?.blog);
  //   useEffect(() => {
  //     dispatch(getBlogs());
  //   }, [dispatch]);
  // console.log(blogs);

  const { id } = useParams();
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.auth[0]);
  useEffect(() => {
    dispatch(getUserByID(id));
  }, [dispatch, id]);
  console.log(data);

  //   const handleDelete = (id) => {
  //     dispatch(deleteBlog(id));
  //     window.location.reload();
  //   };

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
                    className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500"
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
              {/* <div className="flex justify-center item-center flex-wrap">
              {blogs?.map((item, index) => {
                return (
                  <>
                    {isSameUser(item?.author?._id) ? (
                      <>
                        <Card className="max-w-[24rem] m-8 overflow-hidden mt-12">
                          <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="m-0 rounded-none"
                          >
                            <img src={item.image} alt="ui/ux review check" />
                          </CardHeader>
                          <CardBody>
                            <h1 className="line-clamp-1 blue-gray font-black text-base">
                              {item.title}
                            </h1>
                            <h2
                              variant="lead"
                              color="gray"
                              className="line-clamp-3 mt-3 font-normal"
                            >
                              {item.content}
                            </h2>
                          </CardBody>
                          <div className="flex flex-wrap justify-between m-8">
                            <button
                              aria-label="Share this post"
                              type="button"
                              className="p-2 text-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-5 h-5 fill-current dark:text-violet-600"
                              >
                                <path d="M5.5 15a3.51 3.51 0 0 0 2.36-.93l6.26 3.58a3.06 3.06 0 0 0-.12.85 3.53 3.53 0 1 0 1.14-2.57l-6.26-3.58a2.74 2.74 0 0 0 .12-.76l6.15-3.52A3.49 3.49 0 1 0 14 5.5a3.35 3.35 0 0 0 .12.85L8.43 9.6A3.5 3.5 0 1 0 5.5 15zm12 2a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5zm0-13A1.5 1.5 0 1 1 16 5.5 1.5 1.5 0 0 1 17.5 4zm-12 6A1.5 1.5 0 1 1 4 11.5 1.5 1.5 0 0 1 5.5 10z"></path>
                              </svg>
                            </button>
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
                            <div className="space-x-2">
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
                            </div>
                            <div className="flex space-x-2 text-sm dark:text-gray-400">
                              <button
                                type="button"
                                className="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of comments"
                                  className="w-4 h-4 fill-current dark:text-violet-400"
                                >
                                  <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                                  <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                                </svg>
                                <span>30</span>
                              </button>
                              <button
                                type="button"
                                className="flex items-center p-1 space-x-1.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  aria-label="Number of likes"
                                  className="w-4 h-4 fill-current dark:text-violet-600"
                                >
                                  <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                                  <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                                </svg>
                                <span>283</span>
                              </button>
                            </div>
                          </div>
                          <span className="text-xs dark:text-gray-600 relative left-20 mb-5">
                            {getTime(item.createdAt)}
                          </span>
                        </Card>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                );
              })}
            </div> */}
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
