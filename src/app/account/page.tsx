"use client";

import React, { useContext } from "react";
import { DarkModeContext } from "@/context/DarkModeContext";


export default function HomePage() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <section
      className={`h-full flex flex-col items-center justify-center text-center transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-blue-100 text-gray-900"
      }`}
    >
      <h2 className="text-4xl font-bold mb-8">
        coming soon.
      </h2>
    </section>
  );
}