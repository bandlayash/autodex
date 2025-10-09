"use client";

import React, { useContext, useState } from "react";
import { DarkModeContext } from "@/context/DarkModeContext";
import { Search, Sparkles, ChevronDown } from "lucide-react";

// Car data for dropdowns
const carMakes = ["Any", 
  "Abarth",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroën",
  "Dacia",
  "Daewoo",
  "Daihatsu",
  "Dodge",
  "Donkervoort",
  "DS",
  "Ferrari",
  "Fiat",
  "Fisker",
  "Ford",
  "Honda",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Iveco",
  "Jaguar",
  "Jeep",
  "Kia",
  "KTM",
  "Lada",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Landwind",
  "Lexus",
  "Lotus",
  "Maserati",
  "Maybach",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Morgan",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "Rover",
  "Saab",
  "Seat",
  "Skoda",
  "Smart",
  "SsangYong",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo", ];
const drivetrains = ["Any", "FWD", "RWD", "AWD", "4WD"];
const cylinders = ["Any", "3", "4", "5", "6", "8", "10", "12"];
const fuelTypes = ["Any", "Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const bodyStyles = ["Any", "Sedan", "Coupe", "Hatchback", "SUV", "Truck", "Van", "Convertible", "Wagon"];

// Generate years from 1990 to current year
const currentYear = new Date().getFullYear();
const years = ["Any", ...Array.from({ length: currentYear - 1959 }, (_, i) => String(currentYear - i))];



export default function SearchPage() {
  const { darkMode } = useContext(DarkModeContext);
  const [searchMode, setSearchMode] = useState<"specific" | "help" | null>(null);
  const [helpQuery, setHelpQuery] = useState("");

  // Filter states
  const [make, setMake] = useState("Any");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("Any");
  const [drivetrain, setDrivetrain] = useState("Any");
  const [cylinder, setCylinder] = useState("Any");
  const [fuelType, setFuelType] = useState("Any");
  const [bodyStyle, setBodyStyle] = useState("Any");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching with filters:", {
      make, model, year, drivetrain, cylinder, fuelType, bodyStyle
    });
    // Search functionality will be implemented later
  };

  const resetFilters = () => {
    setMake("Any");
    setModel("");
    setYear("Any");
    setDrivetrain("Any");
    setCylinder("Any");
    setFuelType("Any");
    setBodyStyle("Any");
  };

  const selectClass = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer ${
    darkMode
      ? "bg-gray-800 text-gray-100 border-gray-700"
      : "bg-white text-gray-900 border-gray-300"
  }`;

  const inputClass = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400"
      : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
  }`;

  return (
    <section
      className={`h-full flex flex-col items-center justify-center px-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center">
        find your next car
      </h2>

      {/* Initial Choice Buttons */}
      {!searchMode && (
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <button
            onClick={() => setSearchMode("specific")}
            className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 ${
              darkMode
                ? "border-gray-700 bg-gray-800 hover:border-blue-500 hover:bg-gray-750"
                : "border-gray-300 bg-white hover:border-blue-500 hover:shadow-lg"
            }`}
          >
            <Search className="mx-auto mb-3" size={32} />
            <h3 className="text-xl font-semibold mb-2">i know what car I want</h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              search for a specific make and model
            </p>
          </button>

          <button
            onClick={() => setSearchMode("help")}
            className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 ${
              darkMode
                ? "border-gray-700 bg-gray-800 hover:border-blue-500 hover:bg-gray-750"
                : "border-gray-300 bg-white hover:border-blue-500 hover:shadow-lg"
            }`}
          >
            <Sparkles className="mx-auto mb-3" size={32} />
            <h3 className="text-xl font-semibold mb-2">help me find a car</h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              describe what you're looking for
            </p>
          </button>
        </div>
      )}

      {/* Specific Car Search with Filters */}
      {searchMode === "specific" && (
        <div className="w-full max-w-4xl animate-fadeIn">
          <form onSubmit={handleSearch} className={`p-6 rounded-xl border ${
            darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Make */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  make
                </label>
                <div className="relative">
                  <select value={make} onChange={(e) => setMake(e.target.value)} className={selectClass}>
                    {carMakes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Model */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  model
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g., Civic, 3 Series"
                  className={inputClass}
                />
              </div>

              {/* Year */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  year
                </label>
                <div className="relative">
                  <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Drivetrain */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  drivetrain
                </label>
                <div className="relative">
                  <select value={drivetrain} onChange={(e) => setDrivetrain(e.target.value)} className={selectClass}>
                    {drivetrains.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Cylinders */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  cylinders
                </label>
                <div className="relative">
                  <select value={cylinder} onChange={(e) => setCylinder(e.target.value)} className={selectClass}>
                    {cylinders.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  fuel type
                </label>
                <div className="relative">
                  <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className={selectClass}>
                    {fuelTypes.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Body Style */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  body style
                </label>
                <div className="relative">
                  <select value={bodyStyle} onChange={(e) => setBodyStyle(e.target.value)} className={selectClass}>
                    {bodyStyles.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
              >
                <Search size={20} />
                search
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className={`px-6 py-3 rounded-lg border transition font-medium ${
                  darkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                reset
              </button>
            </div>
          </form>

          <button
            onClick={() => {
              setSearchMode(null);
              resetFilters();
            }}
            className={`mt-4 text-sm ${
              darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ← back
          </button>

          <p className="mt-6 text-gray-500 text-sm text-center">
            (Search functionality coming soon!)
          </p>
        </div>
      )}

      {/* Help Find a Car */}
      {searchMode === "help" && (
        <div className="w-full max-w-md animate-fadeIn">
          <form
            onSubmit={(e) => e.preventDefault()}
            className={`w-full rounded-xl border transition-colors duration-300 ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
            }`}
          >
            <textarea
              value={helpQuery}
              onChange={(e) => setHelpQuery(e.target.value)}
              placeholder="describe what you're looking for..."
              autoFocus
              rows={1}
              className={`w-full px-4 py-3 rounded-t-xl focus:outline-none resize-true ${
                darkMode
                  ? "bg-gray-800 text-gray-100 placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
              }`}

            />
            <div className="p-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Sparkles size={15} />
                search
              </button>
            </div>
          </form>

          <button
            onClick={() => {
              setSearchMode(null);
              setHelpQuery("");
            }}
            className={`mt-4 text-sm ${
              darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ← back
          </button>

          <p className="mt-6 text-gray-500 text-sm text-center">
            (AI recommendations coming soon!)
          </p>
        </div>
      )}
    </section>
  );
}
