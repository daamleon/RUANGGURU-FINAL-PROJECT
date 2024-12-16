import React, { useState } from "react";
import { AiOutlineSend, AiOutlineCheck } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";

// Import SVG Icons untuk model
import { ReactComponent as GoogleIcon } from "../assets/gemma-color.svg";
import { ReactComponent as MicrosoftIcon } from "../assets/Microsoft_logo.svg";
// Import PNG sebagai URL path
import QwenIcon from "../assets/qwen2.png";

const ChatInput = ({
  handleChat,
  generalQuery,
  setGeneralQuery,
  loading,
  setShowModelSelection,
  selectedModel,
}) => {
  const [isSent, setIsSent] = useState(false);

  const handleSendClick = () => {
    setIsSent(true);
    handleChat();
    setTimeout(() => {
      setIsSent(false);
    }, 2000);
  };

  const handleClipClick = () => {
    setShowModelSelection(true);
  };

  // Mapping ikon untuk setiap model
  const modelIcons = {
    "google/gemma-2-2b-it": <GoogleIcon className="h-5 w-5 text-gray-400" />,
    "microsoft/Phi-3.5-mini-instruct": (
      <MicrosoftIcon className="h-5 w-5 text-gray-400" />
    ),
    "Qwen/QwQ-32B-Preview": (
      <img src={QwenIcon} alt="Qwen Preview" className="h-5 w-5" />
    ),
    "Qwen/Qwen2.5-Coder-32B-Instruct": (
      <img src={QwenIcon} alt="Qwen Instruct" className="h-5 w-5" />
    ),
  };

  // Ambil ikon berdasarkan model yang dipilih
  const currentIcon = modelIcons[selectedModel] || (
    <div className="text-red-500">Model not found</div>
  );

  return (
    <div className="place-items-center">
      <div className="w-[90%] max-w-2xl flex items-center bg-[#2c2c2c] rounded-full px-4 py-3 shadow-md">
        {/* Icon Attachment */}
        <div
          className="mr-3 cursor-pointer relative group"
          onClick={handleClipClick}
          aria-label="Change AI model"
        >
          <div className="group-hover:scale-110 group-hover:opacity-80 transition-transform duration-200 ease-in-out">
            {currentIcon}
          </div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Change AI Model
          </div>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={generalQuery}
          onChange={(e) => setGeneralQuery(e.target.value)}
          placeholder="Ask for general question"
          className="flex-grow bg-transparent text-white outline-none placeholder-gray-400"
        />

        {/* Send Button */}
        <button
          onClick={handleSendClick}
          className={`ml-3 flex items-center justify-center w-9 h-9 rounded-full ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
          disabled={loading}
        >
          {loading ? (
            <ImSpinner2 className="animate-spin h-5 w-5 text-white" />
          ) : isSent ? (
            <AiOutlineCheck className="h-5 w-5 text-gray-800 " />
          ) : (
            <AiOutlineSend className="h-5 w-5 text-gray-800 transform -rotate-45" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
