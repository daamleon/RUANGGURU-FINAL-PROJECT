import React from "react";
import { AiOutlineUpload } from "react-icons/ai";

const UploadFile = ({
  handleFileChange,
  handleAnalyze,
  fileQuery,
  setFileQuery,
  loading,
  showFileInput, // Terima dari props
  toggleFileInput, // Terima dari props
}) => {
  return (
    <div className="place-items-center">
      <div className="w-[90%] mt-4 max-w-2xl bg-[#2c2c2c] p-6 rounded-lg shadow-md mb-6">
        <h2 id="analyze" className="text-lg font-semibold text-gray-200 mb-4">
          Data Analyze
        </h2>

        <div className="flex flex-col">
          <input
            type="text"
            value={fileQuery}
            onChange={(e) => setFileQuery(e.target.value)}
            placeholder="Enter query related to the data..."
            className="block w-full px-3 py-2 mb-4 bg-[#1e1e1e] text-gray-200 border border-gray-600 rounded-xl focus:outline-none focus:ring focus:ring-blue-500"
          />

          {showFileInput && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Choose a file to upload:
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-none file:text-sm file:font-semibold file:bg-white file:text-gray-800 hover:file:bg-blue-100"
              />
            </div>
          )}

          <div className="place-items-center">
            <div
              onClick={toggleFileInput}
              className="flex items-center mb-4 cursor-pointer text-gray-300 hover:text-white transition-colors"
            >
              <AiOutlineUpload className="h-4 w-4 mr-2" />
              <span className="text-xs">
                {showFileInput ? "Hide File Upload" : "Upload File"}
              </span>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            className={`px-4 py-2 rounded-xl text-white ${
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

// import React, { useState } from "react";
// import { AiOutlineUpload } from "react-icons/ai"; // Import ikon upload

// const UploadFile = ({
//   handleFileChange,
//   handleAnalyze,
//   fileQuery,
//   setFileQuery,
//   loading,
// }) => {
//   // State untuk mengontrol visibilitas opsi "Choose File"
//   const [showFileInput, setShowFileInput] = useState(false);

//   const toggleFileInput = () => {
//     setShowFileInput((prev) => !prev);
//   };

//   return (
//     <div className="place-items-center">
//       <div className="w-[90%] mt-4 max-w-2xl bg-[#2c2c2c] p-6 rounded-lg shadow-md mb-6">
//         <h2 className="text-lg font-semibold text-gray-200 mb-4">
//           Data Analyze
//         </h2>

//         <div className="flex flex-col">
//           <div className="flex flex-col lg:flex-row lg:gap-4">
//             {/* Query Input */}
//             <input
//               type="text"
//               value={fileQuery}
//               onChange={(e) => setFileQuery(e.target.value)}
//               placeholder="Enter query related to the data..."
//               className="block w-full px-3 py-2 mb-4 bg-[#1e1e1e] text-gray-200 border border-gray-600 rounded-xl focus:outline-none focus:ring focus:ring-blue-500"
//             />
//             {/* File Input (Hidden secara default) */}
//             {showFileInput && (
//               <div className="mb-4">
//                 <label className="block mb-2 text-sm font-medium text-gray-400">
//                   Choose a file to upload:
//                 </label>
//                 <input
//                   type="file"
//                   onChange={handleFileChange}
//                   className="block w-full mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-none file:text-sm file:font-semibold file:bg-white file:text-gray-800 hover:file:bg-blue-100"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Tombol (ikon + teks kecil) untuk memunculkan opsi Choose File */}
//           <div className="place-items-center">
//             <div
//               onClick={toggleFileInput}
//               className="flex items-center mb-4 cursor-pointer text-gray-300 hover:text-white transition-colors"
//             >
//               <AiOutlineUpload className="h-4 w-4 mr-2" />
//               <span className="text-xs">
//                 {showFileInput ? "Hide File Upload" : "Upload File"}
//               </span>
//             </div>
//           </div>

//           {/* Analyze Button */}
//           <button
//             onClick={handleAnalyze}
//             className={`px-4 py-2 rounded-xl text-white ${
//               loading
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//             disabled={loading}
//           >
//             {loading ? "Analyzing..." : "Analyze"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadFile;
