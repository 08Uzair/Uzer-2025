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
  const data = useSelector((state) => state?.blog?.blog);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBlogs());
  }, []);
  // console.log(data.length);
  const profile = JSON.parse(localStorage.getItem("profile"));

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Sucessfully");
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
                  <span className="absolute -inset-1.5" />
                  <span className="text-black-200">
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
                        className="h-8 w-8 rounded-full"
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
                    <MenuItems className="text-center absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <NavLink to="/profile">
                        <MenuItem>
                          {({ focus }) => (
                            <a
                              className={classNames(
                                focus ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 w-full"
                              )}
                            >
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
                                "block px-4 py-2 text-sm text-gray-700 w-full"
                              )}
                            >
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
                                "block px-4 py-2 text-sm text-gray-700 w-full"
                              )}
                              onClick={handleLogout}
                            >
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
                                "block px-4 py-2 text-sm text-gray-700 w-full"
                              )}
                              onClick={handleSignIn}
                            >
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
