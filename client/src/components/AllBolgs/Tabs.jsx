import React, { useState } from "react";

const filters = [
  "Business",
  "Entertainment",
  "Food & Cooking",
  "Travel",
  "Health",
  "Science",
  "Education",
  "Technology",
  "Bitcoin",
];

const Tabs = () => {
  const [activeFilter, setActiveFilter] = useState("");

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div >
      <div className="inline-flex space-x-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`px-4 py-2 rounded-lg focus:outline-none ${
              activeFilter === filter
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
