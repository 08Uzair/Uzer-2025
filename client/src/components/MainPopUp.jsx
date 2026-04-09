import React, { useState } from "react";

const MainPopUp = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
    

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50 ">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            {/* Video Embed */}
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/LKaM1KRHbGc"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Description */}
            <div className="mt-4 text-gray-700">
              <h3 className="text-xl font-bold mb-2 text-red-500">PROJECT INFO</h3>
              <p>
            Since the server is hosted on a free platform and the trial period has ended, I am unable to provide a live demo of the project at the moment. However, I have created a project video that thoroughly explains the functionality and demonstrates how the project works.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPopUp;
