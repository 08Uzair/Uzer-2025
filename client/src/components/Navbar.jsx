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
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { getBlogs } from "../redux/actions/blog";
import { useDispatch, useSelector } from "react-redux";

const SparkleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="starGrad" cx="50%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="40%" stopColor="#e0e0e0" stopOpacity="1" />
        <stop offset="100%" stopColor="#777777" stopOpacity="1" />
      </radialGradient>
      <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="0.3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Main 4-pointed star */}
    <path
      d="M8 1C8 1 8.55 5.6 9.5 7C10.45 8.4 15 8 15 8C15 8 10.45 8.6 9.5 9C8.55 10.4 8 15 8 15C8 15 7.45 10.4 6.5 9C5.55 8.6 1 8 1 8C1 8 5.55 8.4 6.5 7C7.45 5.6 8 1 8 1Z"
      fill="url(#starGrad)"
      filter="url(#starGlow)"
    />
    {/* Top-left shine highlight */}
    <path
      d="M8 1.8C8 1.8 8.25 5.2 8.9 6.5C8.4 5.5 8 1.8 8 1.8Z"
      fill="rgba(255,255,255,0.7)"
    />
  </svg>
);

const BlogiiButton = ({ className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${className}`}
    style={{
      background:
        "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 50%, #0d0d0d 100%)",
      color: "#fff",
      boxShadow:
        "0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.35)",
      border: "0.5px solid rgba(255,255,255,0.14)",
      letterSpacing: "0.01em",
    }}
  >
    <SparkleIcon />
    Ask Blogii
  </button>
);

export default function Navbar() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.blog?.blog?.blog);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getBlogs());
  }, []);

  const profile = JSON.parse(localStorage.getItem("profile"));
  const isAuthenticated = profile !== null;

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out Successfully 😊");
    navigate("/");
    setTimeout(() => window.location.reload(), 2000);
  };

  return (
    <Disclosure
      as="nav"
      className="sticky top-4 z-[111] max-w-[92%] lg:max-w-4xl mx-auto rounded-2xl"
      style={{
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.6) inset",
      }}
    >
      {({ open }) => (
        <>
          <div className="mx-auto px-3 sm:px-5">
            <div className="relative flex h-14 items-center justify-between gap-3">
              {/* Brand */}
              <NavLink to="/" className="flex items-center gap-2 shrink-0">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    background:
                      "linear-gradient(160deg, #2a2a2a 0%, #0d0d0d 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  U
                </span>
                <span className="text-lg font-bold text-gray-900 tracking-tight">
                  Uzer.
                </span>
              </NavLink>

              {/* Center: blog count badge (desktop) */}
              <div className="hidden md:flex flex-1 justify-center">
                <span
                  className="text-xs font-medium text-gray-700 rounded-full px-3.5 py-1.5 flex items-center gap-1.5"
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {data?.length ?? 0} Blogs Published
                </span>
              </div>

              {/* Right side (desktop) */}
              <div className="hidden sm:flex items-center gap-2.5">
                <BlogiiButton onClick={() => navigate("/ask-blogii")} />

                <Menu as="div" className="relative">
                  <MenuButton className="relative flex rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400/60 focus:ring-offset-2 focus:ring-offset-transparent transition-transform hover:scale-105">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="object-cover h-9 w-9 rounded-full ring-2 ring-white shadow-sm"
                      src={
                        profile?.result?.image ||
                        "https://tse3.mm.bing.net/th?id=OIP.2hAVCZRMcBjsE8AGQfWCVQHaHa&pid=Api&P=0&h=220"
                      }
                      alt="Profile"
                    />
                  </MenuButton>

                  <Transition
                    enter="transition ease-out duration-150"
                    enterFrom="transform opacity-0 scale-95 -translate-y-1"
                    enterTo="transform opacity-100 scale-100 translate-y-0"
                    leave="transition ease-in duration-100"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      className="flex flex-col absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-2xl p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none"
                      style={{
                        background: "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        border: "1px solid rgba(255,255,255,0.6)",
                      }}
                    >
                      {/* mini profile header */}
                      <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1">
                        <img
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-black/10"
                          src={
                            profile?.result?.image ||
                            "https://tse3.mm.bing.net/th?id=OIP.2hAVCZRMcBjsE8AGQfWCVQHaHa&pid=Api&P=0&h=220"
                          }
                          alt="Profile"
                        />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {profile?.result?.name || "Guest"}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {profile?.result?.email || "Not signed in"}
                          </span>
                        </div>
                      </div>
                      <div className="h-px bg-black/8 mx-2.5 mb-1" />

                      <NavLink to="/profile">
                        <MenuItem>
                          {({ focus }) => (
                            <a
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 w-full transition-colors ${
                                focus ? "bg-black/5" : ""
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                className="shrink-0 text-gray-500"
                              >
                                <path
                                  fill="currentColor"
                                  d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"
                                />
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
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 w-full transition-colors ${
                                focus ? "bg-black/5" : ""
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                className="shrink-0 text-gray-500"
                              >
                                <path
                                  fill="currentColor"
                                  d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h7v14H4zm9 0V5h7l.001 14H13z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M15 7h3v2h-3zm0 4h3v2h-3z"
                                />
                              </svg>
                              All Blogs
                            </a>
                          )}
                        </MenuItem>
                      </NavLink>

                      <div className="h-px bg-black/8 mx-2.5 my-1" />

                      <MenuItem>
                        {({ focus }) => (
                          <button
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm w-full transition-colors ${
                              isAuthenticated ? "text-red-600" : "text-gray-700"
                            } ${focus ? "bg-black/5" : ""}`}
                            onClick={
                              isAuthenticated
                                ? handleLogout
                                : () => navigate("/auth")
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              className="shrink-0"
                            >
                              {isAuthenticated ? (
                                <>
                                  <path
                                    fill="currentColor"
                                    d="M16 13v-2H7V8l-5 4 5 4v-3z"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"
                                  />
                                </>
                              ) : (
                                <>
                                  <path
                                    fill="currentColor"
                                    d="m13 16 5-4-5-4v3H4v2h9z"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"
                                  />
                                </>
                              )}
                            </svg>
                            {isAuthenticated ? "Sign out" : "Sign in"}
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>

              {/* Mobile right side: badge + menu button */}
              <div className="flex sm:hidden items-center gap-2">
                <span
                  className="text-[11px] font-medium text-gray-700 rounded-full px-2.5 py-1 flex items-center gap-1"
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {data?.length ?? 0}
                </span>
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-400/60 transition-colors">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-5 w-5" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* Mobile panel */}
          <DisclosurePanel className="sm:hidden z-[111]">
            <div
              className="mx-2 mb-2 px-2 pb-2 pt-2 rounded-2xl flex flex-col gap-1"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.5)",
              }}
            >
              {/* mini profile header */}
              <div className="flex items-center gap-2.5 px-2.5 py-2">
                <img
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-black/10"
                  src={
                    profile?.result?.image ||
                    "https://tse3.mm.bing.net/th?id=OIP.2hAVCZRMcBjsE8AGQfWCVQHaHa&pid=Api&P=0&h=220"
                  }
                  alt="Profile"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {profile?.result?.name || "Guest"}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {profile?.result?.email || "Not signed in"}
                  </span>
                </div>
              </div>
              <div className="h-px bg-black/8 mx-2.5 mb-1" />

              <NavLink to="/profile">
                <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 w-full hover:bg-black/5 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="shrink-0 text-gray-500"
                  >
                    <path
                      fill="currentColor"
                      d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"
                    />
                  </svg>
                  Your Profile
                </button>
              </NavLink>

              <NavLink to="/allBlogs">
                <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 w-full hover:bg-black/5 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="shrink-0 text-gray-500"
                  >
                    <path
                      fill="currentColor"
                      d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h7v14H4zm9 0V5h7l.001 14H13z"
                    />
                    <path fill="currentColor" d="M15 7h3v2h-3zm0 4h3v2h-3z" />
                  </svg>
                  All Blogs
                </button>
              </NavLink>

              <div className="h-px bg-black/8 mx-2.5 my-1" />

              <BlogiiButton
                className="w-full justify-center"
                onClick={() => navigate("/ask-blogii")}
              />

              <button
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm w-full transition-colors hover:bg-black/5 ${
                  isAuthenticated ? "text-red-600" : "text-gray-700"
                }`}
                onClick={
                  isAuthenticated ? handleLogout : () => navigate("/auth")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="shrink-0"
                >
                  {isAuthenticated ? (
                    <>
                      <path
                        fill="currentColor"
                        d="M16 13v-2H7V8l-5 4 5 4v-3z"
                      />
                      <path
                        fill="currentColor"
                        d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"
                      />
                    </>
                  ) : (
                    <>
                      <path fill="currentColor" d="m13 16 5-4-5-4v3H4v2h9z" />
                      <path
                        fill="currentColor"
                        d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"
                      />
                    </>
                  )}
                </svg>
                {isAuthenticated ? "Sign out" : "Sign in"}
              </button>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
