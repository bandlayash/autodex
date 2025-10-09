"use client";

import React, { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "@/context/DarkModeContext";
import { Search, Sparkles, ChevronDown } from "lucide-react";

// Types
interface Model {
  Make_ID?: number;
  Make_Name?: string;
  Model_ID?: number;
  Model_Name?: string;
  model_name?: string; // CarQuery format
  model_make_id?: string; // CarQuery format
}

const carMakes = ["Any", 
  "Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti",
  "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia", "Daewoo", "Daihatsu",
  "Dodge", "Ferrari", "Fiat", "Ford", "Honda", "Hyundai", "Infiniti", "Jaguar",
  "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", "Maserati", "Mazda",
  "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Porsche",
  "Rolls-Royce", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

const drivetrains = ["Any", "FWD", "RWD", "AWD", "4WD"];
const cylinders = ["Any", "3", "4", "5", "6", "8", "10", "12"];
const fuelTypes = ["Any", "Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const bodyStyles = ["Any", "Sedan", "Coupe", "Hatchback", "SUV", "Truck", "Van", "Convertible", "Wagon"];

const currentYear = new Date().getFullYear();
const years = ["Any", ...Array.from({ length: currentYear - 1959 }, (_, i) => String(currentYear - i))];

export default function SearchPage() {
  const { darkMode } = useContext(DarkModeContext);
  const [searchMode, setSearchMode] = useState<"specific" | "help" | null>(null);
  const [helpQuery, setHelpQuery] = useState("");

  // Filter states
  const [make, setMake] = useState("Any");
  const [model, setModel] = useState("Any");
  const [year, setYear] = useState("Any");
  const [drivetrain, setDrivetrain] = useState("Any");
  const [cylinder, setCylinder] = useState("Any");
  const [fuelType, setFuelType] = useState("Any");
  const [bodyStyle, setBodyStyle] = useState("Any");

  const [models, setModels] = useState<string[]>(["Any"]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (make !== "Any") {
      // Fetch all models for the make without year filter
      fetchModelsHybrid(make);
    } else {
      setModels(["Any"]);
      setModel("Any");
    }
  }, [make]);

  // Hybrid approach: Try CarQuery first, fallback to NHTSA, then merge results
  const fetchModelsHybrid = async (selectedMake: string) => {
    setLoadingModels(true);
    
    try {
      // Fetch from both APIs in parallel
      const [carQueryModels, nhtsaModels] = await Promise.all([
        fetchFromCarQuery(selectedMake),
        fetchFromNHTSA(selectedMake)
      ]);
      
      // Merge and deduplicate results from both APIs
      const allModels = new Set([...carQueryModels, ...nhtsaModels]);
      const sortedModels = Array.from(allModels).sort();
      
      if (sortedModels.length > 0) {
        setModels(["Any", ...sortedModels]);
        console.log(`✓ Total unique models found: ${sortedModels.length}`);
      } else {
        setModels(["Any"]);
        console.warn(`No models found for ${selectedMake}`);
      }
      
      setModel("Any");
      
    } catch (error) {
      console.error("Error fetching models:", error);
      setModels(["Any"]);
      setModel("Any");
    } finally {
      setLoadingModels(false);
    }
  };

  // CarQuery API - More comprehensive, includes exotic cars
  const fetchFromCarQuery = async (selectedMake: string): Promise<string[]> => {
    try {
      // CarQuery uses lowercase make names
      const makeFormatted = selectedMake.toLowerCase().replace(/\s+/g, '_');
      
      // Omit year parameter to get ALL models for the make
      const response = await fetch(
        `https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${makeFormatted}`,
        { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }
      );

      const text = await response.text();
      
      // CarQuery returns JSONP, we need to extract the JSON
      const jsonMatch = text.match(/\((.*)\)/s);
      if (!jsonMatch) return [];
      
      const data = JSON.parse(jsonMatch[1]);
      
      if (data.Models && data.Models.length > 0) {
        const modelNames = [...new Set(
          data.Models
            .map((item: Model) => item.model_name)
            .filter((name): name is string => typeof name === 'string' && name.length > 0)
        )].sort();
        
        console.log(`✓ CarQuery found ${modelNames.length} models for ${selectedMake}`);
        return modelNames;
      }
      
      return [];
    } catch (error) {
      console.warn("CarQuery API failed, trying NHTSA...", error);
      return [];
    }
  };

  // NHTSA API - Government data, very reliable but limited
  const fetchFromNHTSA = async (selectedMake: string): Promise<string[]> => {
    try {
      // Get all models across all years by using a wide year range
      const allModels: Set<string> = new Set();
      
      // Fetch models for the last 30 years to get comprehensive list
      const yearRange = Array.from({ length: 30 }, (_, i) => currentYear - i);
      
      // Batch requests in groups of 5 to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < yearRange.length; i += batchSize) {
        const batch = yearRange.slice(i, i + batchSize);
        const fetchPromises = batch.map(year =>
          fetch(
            `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(selectedMake)}/modelyear/${year}?format=json`
          )
            .then(res => res.json())
            .catch(err => {
              console.warn(`Failed to fetch ${selectedMake} for year ${year}:`, err);
              return { Results: [] };
            })
        );
        
        const results = await Promise.all(fetchPromises);
        
        results.forEach(data => {
          if (data.Results && data.Results.length > 0) {
            data.Results.forEach((item: Model) => {
              if (item.Model_Name && typeof item.Model_Name === 'string') {
                allModels.add(item.Model_Name);
              }
            });
          }
        });
      }
      
      const modelNames = Array.from(allModels).sort();
      console.log(`✓ NHTSA found ${modelNames.length} models for ${selectedMake}`);
      return modelNames;
      
    } catch (error) {
      console.error("NHTSA API error:", error);
      return [];
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching with filters:", {
      make, model, year, drivetrain, cylinder, fuelType, bodyStyle
    });
  };

  const resetFilters = () => {
    setMake("Any");
    setModel("Any");
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

  return (
    <section
      className={`h-full flex flex-col items-center justify-center px-4 py-8 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center">
        find your next car
      </h2>

      {!searchMode && (
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <button
            onClick={() => setSearchMode("specific")}
            className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 ${
              darkMode
                ? "border-gray-700 bg-gray-800 hover:border-blue-500"
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
                ? "border-gray-700 bg-gray-800 hover:border-blue-500"
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

      {searchMode === "specific" && (
        <div className="w-full max-w-4xl">
          <form onSubmit={handleSearch} className={`p-6 rounded-xl border ${
            darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  model {loadingModels && <span className="text-blue-500">(loading...)</span>}
                </label>
                <div className="relative">
                  <select 
                    value={model} 
                    onChange={(e) => setModel(e.target.value)} 
                    className={selectClass}
                    disabled={loadingModels || make === "Any"}
                  >
                    {models.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={20} />
                </div>
                {make === "Any" && (
                  <p className="text-xs text-gray-500 mt-1">select a make first</p>
                )}
              </div>

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
            combining carquery + nhtsa for comprehensive coverage • loads in ~2 seconds
          </p>
        </div>
      )}

      {searchMode === "help" && (
        <div className="w-full max-w-md">
          <form
            onSubmit={(e) => e.preventDefault()}
            className={`w-full rounded-xl border ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
            }`}
          >
            <textarea
              value={helpQuery}
              onChange={(e) => setHelpQuery(e.target.value)}
              placeholder="describe what you're looking for..."
              autoFocus
              rows={4}
              className={`w-full px-4 py-3 rounded-t-xl focus:outline-none resize-none ${
                darkMode
                  ? "bg-gray-800 text-gray-100 placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="p-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Sparkles size={18} />
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