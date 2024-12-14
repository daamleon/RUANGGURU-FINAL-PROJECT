import React from "react";

const ResponseArea = ({ responseWords }) => {
  return (
    <div className="place-items-center">
      <div className="w-[90%] max-w-2xl bg-[#2c2c2c] p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Response</h2>
        <p className="text-gray-400">
          {responseWords && responseWords.length > 0
            ? responseWords.join(" ")
            : "No response yet."}
        </p>
      </div>
    </div>
  );
};

export default ResponseArea;
