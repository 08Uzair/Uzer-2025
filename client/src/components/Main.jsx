import React from "react";
import Gallery from "./Gallery";
import CardPanel from "./CardPanel";
import UserCards from "./UserCards";

const Main = () => {
  return (
    <div className="gridBox ">
      <div></div>
      <div>
        <Gallery />
        <CardPanel />
        <UserCards />
      </div>
      <div></div>
    </div>
  );
};

export default Main;
