import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../redux/actions/auth.js";
import { NavLink } from "react-router-dom";
import { Users } from "lucide-react";

const UserCards = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth?.user?.slice(7, 11));

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  return (
    <div className="mb-16">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-6">
        <Users size={14} className="text-white/30" />
        <span className="text-white/30 text-xs font-medium uppercase tracking-widest">
          Community
        </span>
      </div>
      <h2 className="text-xl font-semibold text-white mb-8">
        Meet our writers
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data?.map((item, index) => (
          <NavLink to={`/userProfile/${item._id}`} key={item._id || index}>
            <div
              className="group rounded-2xl border border-white/10 p-5 flex flex-col items-center text-center hover:border-white/25 hover:-translate-y-0.5 transition-all backdrop-blur-sm cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="relative mb-3">
                <img
                  src={
                    item.image ||
                    "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg"
                  }
                  alt={item.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/15 group-hover:border-white/30 transition-all"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://res.cloudinary.com/dyphiefiy/image/upload/v1753491009/images_exk1wk.jpg";
                  }}
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-white/60 border-2 border-black" />
              </div>
              <h3 className="text-[13px] font-semibold text-white leading-tight line-clamp-1">
                {item.name}
              </h3>
              <p className="text-[11px] text-white/35 mt-1 line-clamp-1">
                {item.email}
              </p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default UserCards;
