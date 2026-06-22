import React, { useState, useEffect } from "react";
import Gallery from "./Gallery";
import CardPanel from "./CardPanel";
import UserCards from "./UserCards";
// import MainPopUp from "./MainPopUp";

const Main = () => {
  // const [showPopUp, setShowPopUp] = useState(false);

  // useEffect(() => {
  //   setShowPopUp(true);
  //   // console.log("trigger");
  // }, [5000]);

  return (
    <div className="gridBox">
      <div></div>
      <div>
        {/* {showPopUp ? <MainPopUp /> : ""} */}
        <Gallery />
        <CardPanel />
        <UserCards />
      </div>
      <div></div>
    </div>
  );
};

export default Main;
