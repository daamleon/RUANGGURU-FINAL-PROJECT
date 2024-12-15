// DesktopNavbar.js
import React from "react";

const DesktopNavbar = () => {
  return (
    <nav className="hidden md:flex space-x-6 text-lg font-medium">
      <a href="#home" className="text-white hover:text-blue-400 transition">
        Home
      </a>
      <a href="#analyze" className="text-white hover:text-blue-400 transition">
        Analyze
      </a>
    </nav>
  );
};

export default DesktopNavbar;
