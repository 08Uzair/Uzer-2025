import React from "react";
import { useNavigate } from "react-router-dom";
import plus from "../assets/plus.png";
import { Plus } from "lucide-react";

const Gallery = () => {
  const navigate = useNavigate();

  const images = [
    [
      { src: plus, path: "/createBlog", isCreate: true },
      {
        src: "https://images.pexels.com/photos/1629367494173/business.jpg",
        path: "/allBlogs?category=business",
        label: "Business",
        src: "https://images.unsplash.com/photo-1629367494173-c78a56567877?auto=format&fit=crop&w=927&q=80",
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

  return (
    <div className="mb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/30 text-xs font-medium uppercase tracking-widest">
              Browse
            </span>
          </div>
          <h2 className="text-xl font-semibold text-white">
            Explore by category
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((column, columnIndex) => (
          <div className="grid gap-3" key={columnIndex}>
            {column.map((image, index) =>
              image.isCreate ? (
                /* Create blog tile */
                <div
                  key={index}
                  onClick={() => navigate(image.path)}
                  className="group relative cursor-pointer rounded-2xl border border-dashed border-white/20 hover:border-white/40 transition-all overflow-hidden aspect-square flex flex-col items-center justify-center gap-3"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/15 group-hover:border-white/35 group-hover:bg-white/10 transition-all"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <Plus
                      size={18}
                      className="text-white/50 group-hover:text-white transition-colors"
                    />
                  </div>
                  <span className="text-white/35 text-xs font-medium group-hover:text-white/60 transition-colors">
                    Create Blog
                  </span>
                </div>
              ) : (
                /* Category tile */
                <div
                  key={index}
                  onClick={() => navigate(image.path)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden border border-white/8 hover:border-white/20 transition-all"
                  style={{
                    aspectRatio:
                      columnIndex === 0 && index === 0 ? "1" : "auto",
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.label}
                    className="w-full h-full object-cover min-h-[120px] grayscale-[15%] group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg";
                    }}
                  />
                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  {/* label */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-white text-[12px] font-semibold">
                      {image.label}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
