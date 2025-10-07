"use client";

import React, { useContext } from "react";
import { DarkModeProvider, DarkModeContext } from "@/context/DarkModeContext";
import { Sun, Moon } from 'lucide-react';

function PageContent() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`p-4 flex justify-between items-center shadow-md ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-2xl font-bold text-blue-600">autodex</h1>
        <nav className="flex items-center">
          <a href="#" className="mx-3 hover:text-blue-600">
            Home
          </a>
          <a href="#" className="mx-3 hover:text-blue-600">
            About
          </a>
          <button
            onClick={toggleDarkMode}
            className="ml-4 px-4 py-2 rounded-lg border hover:bg-blue-600 hover:text-white transition"
          >
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className={`py-20 text-center transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-blue-100"
        }`}
      >
        <h2 className="text-4xl font-bold mb-4">
          everything you need, all in one place.
        </h2>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          start
        </button>
      </section>

      {/* Footer */}
      <footer
        className={`text-center py-6 mt-10 transition-colors duration-300 ${
          darkMode ? "bg-gray-950 text-gray-400" : "bg-gray-800 text-white"
        }`}
      >
        <p>© 2025 autodex. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <DarkModeProvider>
      <PageContent />
    </DarkModeProvider>
  );
}
