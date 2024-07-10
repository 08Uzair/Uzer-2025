import React from "react";
import Navbar from "../components/Navbar.jsx";
export function Bookmark() {
  return (
    <>
      <div className="flex item-center justify-center mt-12">
        <div className="flex w-full max-w-[48rem] bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-2/5">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
              alt="card-image"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="w-3/5 p-4">
            <h6 className="text-gray-500 uppercase mb-4">Startups</h6>
            <h4 className="text-blue-gray-900 text-2xl font-semibold mb-2">
              Lyft launching cross-platform service this week
            </h4>
            <p className="text-gray-700 font-normal mb-8">
              Like so many organizations these days, Autodesk is a company in
              transition. It was until recently a traditional boxed software
              company selling licenses. Yet its own business model disruption is
              only part of the story
            </p>
            <a href="#" className="inline-block">
              <button className="flex items-center gap-2 text-blue-500">
                Read Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
