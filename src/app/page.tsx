"use client";

import React, { useContext } from "react";
import { DarkModeContext } from "@/context/DarkModeContext";

export default function HomePage() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <section
      className={`py-20 text-center transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-blue-100 text-gray-900"
      }`}
    >
      <h2 className="text-4xl font-bold mb-4">
        everything you need, all in one place.
      </h2>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
        get started
      </button>
    </section>
  );
}
