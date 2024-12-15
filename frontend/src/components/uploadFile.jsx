import React from "react";

const UploadFile = ({
  handleFileChange,
  handleAnalyze,
  fileQuery,
  setFileQuery,
  loading,
}) => {
  return (
    <div className="place-items-center">
      <div className="w-[90%] mt-4 max-w-2xl bg-[#2c2c2c] p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">
          Upload File
        </h2>
        <div className="flex flex-col">
          {/* File Input */}
          <label className="block mb-2 text-sm font-medium text-gray-400">
            Choose a file to upload:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-none file:text-sm file:font-semibold file:bg-white file:text-gray-800 hover:file:bg-blue-100"
          />

          {/* Query Input */}
          <input
            type="text"
            value={fileQuery}
            onChange={(e) => setFileQuery(e.target.value)}
            placeholder="Enter query related to the data..."
            className="block w-full px-3 py-2 mb-4 bg-[#1e1e1e] text-gray-200 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
          />

          {/* Upload Button */}
          <button
            onClick={handleAnalyze}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
