// Header.js
import React, { useState } from "react";
import MobileNavbar from "./mobileNavbar";
import DesktopNavbar from "./navbar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-800 text-white flex items-center justify-between py-2 md:py-4 px-4 rounded-b-lg">
      <div className="flex items-center">
        {/* Logo */}
        <div className="bg-blue-500 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            width="25"
            height="25"
          >
            <path d="M12 2L3 8v8l9 6 9-6V8l-9-6zm0 2.18L19.18 8 12 12.82 4.82 8 12 4.18zM5 9.67L12 14.5l7-4.83V15L12 19.5 5 15V9.67z" />
          </svg>
        </div>
        {/* App Name */}
        <h1 className="text-2xl md:text-3xl font-bold ml-2">MINSYS</h1>
      </div>
      <DesktopNavbar />

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            width="25"
            height="25"
          >
            <path
              d="M4 6h16M4 12h16m-7 6h7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navbar */}
      {isMenuOpen && <MobileNavbar onClose={() => setIsMenuOpen(false)} />}
    </header>
  );
};

export default Header;
