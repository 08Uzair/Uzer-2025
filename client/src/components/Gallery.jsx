import React from "react";
import { useNavigate } from "react-router-dom";
import plus from "../assets/plus.png";

const Gallery = () => {
  const navigate = useNavigate();

  const images = [
    [
      {
        src: plus,
        path: "/createBlog",
        label: "Create Blog",
      },
      {
        src: "https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=927&amp;q=80",
        path: "/allBlogs?category=bussiness",
        label: "Business",
      },
      {
        src: "https://images.pexels.com/photos/4491533/pexels-photo-4491533.jpeg?auto=compress&cs=tinysrgb&w=600",
        path: "/allBlogs?category=entertainment",
        label: "Entertainment",
      },
    ],
    [
      {
        src: "https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&w=600",
        path: "/allBlogs?category=food&cooking",
        label: "Food & Cooking",
      },
      {
        src: "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        path: "/allBlogs?category=travel",
        label: "Travel",
      },
      {
        src: "https://images.pexels.com/photos/5851033/pexels-photo-5851033.jpeg?auto=compress&cs=tinysrgb&w=600",
        path: "/allBlogs?category=health",
        label: "Health",
      },
    ],
    [
      {
        src: "https://images.pexels.com/photos/3825572/pexels-photo-3825572.jpeg?auto=compress&cs=tinysrgb&w=600",
        path: "/allBlogs?category=science",
        label: "Science",
      },
      {
        src: "https://media.istockphoto.com/id/1152134905/photo/double-exposure-of-student-graduation-watching-the-sunrise.jpg?b=1&s=612x612&w=0&k=20&c=iaY0Qbc_W0x4VmlLXd-LbOS56p5LQP9cllG2lzDIv9I=",
        path: "/allBlogs?category=education",
        label: "Education",
      },
      {
        src: "https://images.pexels.com/photos/2603464/pexels-photo-2603464.jpeg?auto=compress&cs=tinysrgb&w=600",
        path: "/allBlogs?category=technology",
        label: "Technology",
      },
    ],
    [
      {
        src: "https://images.pexels.com/photos/6777573/pexels-photo-6777573.jpeg?auto=compress&cs=tinysrgb&w=600",
        path: "/allBlogs?category=bitcoin",
        label: "Bitcoin",
      },
      {
        src: "https://images.pexels.com/photos/2827400/pexels-photo-2827400.jpeg?auto=compress&cs=tinysrgb&w=600",
        path: "/allBlogs?category=gym",
        label: "Gym",
      },
    ],
  ];

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-24 mt-12">
      {images.map((column, columnIndex) => (
        <div className="grid gap-4" key={columnIndex}>
          {column.map((image, index) => (
            <div
              className="relative"
              key={index}
              onClick={() => handleClick(image.path)}
            >
              <img
                className="h-auto max-w-full rounded-lg object-cover object-center cursor-pointer"
                src={image.src}
                alt={`gallery-photo-${columnIndex}-${index}`}
              />
              <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <span className="text-white text-lg font-bold">
                  {image.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
