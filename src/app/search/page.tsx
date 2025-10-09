"use client";

import React, { useContext, useState } from "react";
import { DarkModeContext } from "@/context/DarkModeContext";
import { Search } from "lucide-react";

export default function HomePage() {
  const { darkMode } = useContext(DarkModeContext);
  const [query, setQuery] = useState("");

  return (
    <section
      className={`h-full flex flex-col items-center justify-center min-h-[80vh] transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2 className="text-4xl font-bold mb-6 text-center">
        find your next car
      </h2>

      {/* Search Box */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className={`flex items-center w-full max-w-md rounded-xl border transition-colors duration-300 ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
        }`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ex. 2005 BMW 330i"
          className={`flex-grow px-4 py-3 rounded-l-xl focus:outline-none ${
            darkMode
              ? "bg-gray-800 text-gray-100 placeholder-gray-400"
              : "bg-white text-gray-900 placeholder-gray-500"
          }`}
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 transition flex items-center justify-center"
        >
          <Search size={20} />
        </button>
      </form>

      <p className="mt-6 text-gray-500 text-sm">
        (Search functionality coming soon!)
      </p>
    </section>
  );
}
