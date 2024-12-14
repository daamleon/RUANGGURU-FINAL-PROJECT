import React from "react";

const Header = ({ showModelSelection, setShowModelSelection }) => (
  <header className="bg-slate-800 text-white text-center py-4">
    <h1 className="text-md font-bold">Mini Smart Home System & AI Chatbot</h1>
    <button
      onClick={() => setShowModelSelection(!showModelSelection)}
      className="text-blue-400 underline mt-2"
    >
      {showModelSelection ? "Back to Chat" : "Choose AI Model"}
    </button>
  </header>
);

export default Header;
