import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getTime } from "../utilty/getTime.js";
import { getUsers } from "../redux/actions/auth.js";
import { NavLink } from "react-router-dom";
const UserCards = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth?.user?.slice(0, 4));
  useEffect(() => {
    dispatch(getUsers());
  }, []);
  // console.log(data);
  return (
    <>
      <h1 className="text-center p-5 text-3xl font-bold mb-4">Our Community</h1>
      <div className="flex item-center justify-center mb-6">
        {data?.map((item, index) => {
          return (
            <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 cursor-pointer">
              <NavLink to={`/userProfile/${item._id}`}>
                <div className="flex flex-col items-center p-6">
                  <img
                    className="w-24 h-24 rounded-full object-cover"
                    src={item.image}
                  />
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">{item.email}</p>
                </div>
              </NavLink>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserCards;
