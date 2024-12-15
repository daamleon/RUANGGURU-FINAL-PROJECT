import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai"; // Icon Pesawat Kertas
import { AiOutlineCheck } from "react-icons/ai"; // Icon Centang
import { FiPaperclip } from "react-icons/fi"; // Icon Attachment
import { ImSpinner2 } from "react-icons/im"; // Icon Loading

const ChatInput = ({ handleChat, generalQuery, setGeneralQuery, loading }) => {
  const [isSent, setIsSent] = useState(false); // State untuk melacak apakah pesan telah dikirim

  const handleSendClick = () => {
    setIsSent(true); // Ubah ikon menjadi centang
    handleChat(); // Panggil fungsi handleChat
    setTimeout(() => {
      setIsSent(false); // Kembalikan ikon ke pesawat kertas setelah beberapa saat
    }, 2000); // Durasi reset ikon (2 detik)
  };

  return (
    <div className="place-items-center">
      <div className="w-[90%] max-w-2xl flex items-center bg-[#2c2c2c] rounded-full px-4 py-3 shadow-md">
        {/* Icon Attachment */}
        <div className="mr-3 cursor-pointer">
          <FiPaperclip className="h-5 w-5 text-gray-400" />
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
