"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { DarkModeContext } from "@/context/DarkModeContext";
import { Sun, Moon, Search, House, User } from "lucide-react";

export default function Header() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  return (
    <header
      className={`p-4 flex justify-between items-center shadow-md transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold text-blue-600">autodex</h1>
      <nav className="flex items-center space-x-4">
        <div className = "relative">
          <Link href="/" className="hover:text-blue-600 transition-colors"
          onMouseEnter={() => setHoveredIcon("home")}
          onMouseLeave={() => setHoveredIcon(null)}>
            <House/>
          </Link>
          {hoveredIcon === "home" && (
            <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded text-xs whitespace-nowrap z-50 ${
              darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-900 text-white"
            }`}>
              home
              <div className={`absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45 ${
                darkMode ? "bg-gray-700" : "bg-gray-900"
              }`} />
            </div>
          )}
        </div>
        
        <div className = "relative">
          <Link href="/search" className="hover:text-blue-600 transition-colors"
          onMouseEnter={() => setHoveredIcon("search")}
          onMouseLeave={() => setHoveredIcon(null)}>
            <Search/>
          </Link>
          {hoveredIcon === "search" && (
            <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded text-xs whitespace-nowrap z-50 ${
              darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-900 text-white"
            }`}>
              search
              <div className={`absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45 ${
                darkMode ? "bg-gray-700" : "bg-gray-900"
              }`} />
            </div>
          )}
        </div>

        <div className = "relative">
          <Link href="#" className="hover:text-blue-600 transition-colors"
          onMouseEnter={() => setHoveredIcon("account")}
          onMouseLeave={() => setHoveredIcon(null)}>
            <User/>
          </Link>
          {hoveredIcon === "account" && (
            <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 rounded text-xs whitespace-nowrap z-50 ${
              darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-900 text-white"
            }`}>
              account
              <div className={`absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45 ${
                darkMode ? "bg-gray-700" : "bg-gray-900"
              }`} />
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full border transition ${
            darkMode
              ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
              : "bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white"
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </nav>
    </header>
  );
}
