import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { getBlogs } from "../redux/actions/blog";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const navigation = [{ name: "Blogs", href: "/allBlogs", current: false }];
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const data = useSelector((state) => state?.blog?.blog?.blog);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBlogs());
  }, []);
  // console.log(data.length);
  const profile = JSON.parse(localStorage.getItem("profile"));

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out Successfully 😊");
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  const handleSignIn = () => {
    navigate("/auth");
  };

  let isAuthenticated;

  if (profile === null) {
    isAuthenticated = false;
  } else {
    isAuthenticated = true;
  }
  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center text-2xl font-bold sm:items-stretch sm:justify-start">
                <NavLink to="/">
                  <div className="flex flex-shrink-0 items-center">Uzer.</div>
                </NavLink>
                <div className="hidden sm:ml-6 sm:block">
                  {/* <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-200 text-gray-900"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div> */}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="flex item-center justify-center relative rounded-full bg-white p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white"
                >
                  <span className="absolute -inset-1.5 " />
                  <span className="text-black-200 bg-slate-200  rounded-full p-2 ">
                    Total Blogs : {data?.length}
                  </span>
                  {/* <i style={{ fontSize: "20px" }} class="bx bx-bookmark"></i> */}
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="object-cover h-8 w-8 rounded-full"
                        src={
                          profile?.result?.image ||
                          "https://tse3.mm.bing.net/th?id=OIP.2hAVCZRMcBjsE8AGQfWCVQHaHa&pid=Api&P=0&h=220"
                        }
                        alt=""
                      />
                    </MenuButton>
                  </div>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="flex flex-col item-start absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <NavLink to="/profile">
                        <MenuItem>
                          {({ focus }) => (
                            <a
                              className={classNames(
                                focus ? "bg-gray-100" : "",
                                "flex item-start block px-4 py-2 text-sm text-gray-700 w-full"
                              )}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="text-gray rounded mr-2"
                              >
                                <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path>
                              </svg>
                              Your Profile
                            </a>
                          )}
                        </MenuItem>
                      </NavLink>

                      <NavLink to="/allBlogs">
                        <MenuItem>
                          {({ focus }) => (
                            <a
                              className={classNames(
                                focus ? "bg-gray-100" : "",
                                "flex item-start block px-4 py-2 text-sm text-gray-700 w-full"
                              )}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="text-gray rounded mr-2"
                              >
                                <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h7v14H4zm9 0V5h7l.001 14H13z"></path>
                                <path d="M15 7h3v2h-3zm0 4h3v2h-3z"></path>
                              </svg>
                              All Blogs
                            </a>
                          )}
                        </MenuItem>
                      </NavLink>

                      {isAuthenticated ? (
                        <MenuItem>
                          {({ focus }) => (
                            <button
                              className={classNames(
                                focus ? "bg-gray-100" : "",
                                " flex item-start block px-4 py-2 text-sm text-gray-700 w-full"
                              )}
                              onClick={handleLogout}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="text-gray rounded mr-2"
                              >
                                <path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path>
                                <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path>
                              </svg>
                              Sign out
                            </button>
                          )}
                        </MenuItem>
                      ) : (
                        <MenuItem>
                          {({ focus }) => (
                            <button
                              className={classNames(
                                focus ? "bg-gray-100" : "",
                                "flex item-start block px-4 py-2 text-sm text-gray-700 w-full"
                              )}
                              onClick={handleSignIn}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="text-gray rounded mr-2"
                              >
                                <path d="m13 16 5-4-5-4v3H4v2h9z"></path>
                                <path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path>
                              </svg>
                              Sign In
                            </button>
                          )}
                        </MenuItem>
                      )}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
