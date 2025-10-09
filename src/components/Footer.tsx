"use client";

import React, { useContext } from "react";
import { DarkModeContext } from "@/context/DarkModeContext";

export default function Footer() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <footer
      className={`text-center py-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-950 text-gray-400" : "bg-gray-800 text-white"
      }`}
    >
      <p>© 2025 autodex. All rights reserved.</p>
    </footer>
  );
}
