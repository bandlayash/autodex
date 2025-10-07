"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { DarkModeContext } from "@/context/DarkModeContext";
import { Sun, Moon, Search, House } from "lucide-react";

export default function Header() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <header
      className={`p-4 flex justify-between items-center shadow-md transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold text-blue-600">autodex</h1>
      <nav className="flex items-center space-x-4">
        <Link href="/" className="hover:text-blue-600">
          <House/>
        </Link>
        <Link href="/search" className="hover:text-blue-600">
          <Search/>
        </Link>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full border transition ${
            darkMode
              ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
              : "bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white"
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>
    </header>
  );
}
