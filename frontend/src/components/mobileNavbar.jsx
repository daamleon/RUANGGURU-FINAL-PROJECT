import React from "react";

const MobileNavbar = ({ onClose }) => {
  return (
    <div className="absolute top-0 right-0 w-3/4 h-full bg-slate-800 shadow-lg flex flex-col z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="self-end p-4 text-white text-xl focus:outline-none"
      >
        ✕
      </button>

      {/* Navigation Links */}
      <nav className="flex flex-col items-start px-6 space-y-4 mt-8">
        <a
          href="#home"
          className="text-lg text-white hover:text-blue-400 transition"
          onClick={onClose}
        >
          Home
        </a>
        <a
          href="#analyze"
          className="text-lg text-white hover:text-blue-400 transition"
          onClick={onClose}
        >
          Analyze
        </a>
      </nav>

      {/* Additional Content */}
      <div className="mt-auto px-6 py-4 border-t border-slate-700">
        <p className="text-sm text-slate-400">
          © 2024 MINSYS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MobileNavbar;
