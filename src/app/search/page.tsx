"use client";

import React, { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "@/context/DarkModeContext";
import { Search, Sparkles, ChevronDown } from "lucide-react";
import Papa from "papaparse";

interface MakeModel {
  Make: string;
  Model: string;
}

// Filter options
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

  // CSV data states
  const [makeModelData, setMakeModelData] = useState<MakeModel[]>([]);
  const [makes, setMakes] = useState<string[]>(["Any"]);
  const [models, setModels] = useState<string[]>(["Any"]);
  const [isLoading, setIsLoading] = useState(true);

  // Autocomplete states
  const [makeSearchTerm, setMakeSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [showMakeDropdown, setShowMakeDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [filteredMakes, setFilteredMakes] = useState<string[]>([]);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);

  // Load CSV on mount
  useEffect(() => {
    setIsLoading(true);
    
    // Try to read the CSV file from the public directory
    fetch("/makes_and_models.csv")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
          complete: (results) => {
            const data = results.data as MakeModel[];
            
            // Filter out any invalid entries
            const validData = data.filter(item => item.Make && item.Model);
            setMakeModelData(validData);

            // Extract unique makes and sort alphabetically
            const uniqueMakes = Array.from(
              new Set(validData.map(item => item.Make.trim()))
            ).sort((a, b) => a.localeCompare(b));
            
            setMakes(["Any", ...uniqueMakes]);
            setIsLoading(false);
          },
          error: (parseErr: any) => {
            console.error("Error parsing CSV:", parseErr);
            setIsLoading(false);
          }
        });
      })
      .catch(err => {
        console.error("Error loading CSV file:", err);
        console.error("Make sure makes_and_models.csv is in the public folder!");
        setIsLoading(false);
      });
  }, []);

  // Update models when make changes
  useEffect(() => {
    if (make === "Any") {
      setModels(["Any"]);
      setModel("Any");
      setModelSearchTerm("");
    } else {
      // Filter models for the selected make
      const filteredModels = makeModelData
        .filter(item => item.Make.trim() === make)
        .map(item => item.Model.trim())
        .sort((a, b) => a.localeCompare(b));
      
      // Remove duplicates while preserving order
      const uniqueModels = Array.from(new Set(filteredModels));
      
      setModels(["Any", ...uniqueModels]);
      setModel("Any");
      setModelSearchTerm("");
    }
  }, [make, makeModelData]);

  // Filter makes based on search term
  useEffect(() => {
    if (makeSearchTerm.trim() === "") {
      setFilteredMakes(makes);
    } else {
      const filtered = makes.filter(m => 
        m.toLowerCase().includes(makeSearchTerm.toLowerCase())
      );
      setFilteredMakes(filtered);
    }
  }, [makeSearchTerm, makes]);

  // Filter models based on search term
  useEffect(() => {
    if (modelSearchTerm.trim() === "") {
      setFilteredModels(models);
    } else {
      const filtered = models.filter(m => 
        m.toLowerCase().includes(modelSearchTerm.toLowerCase())
      );
      setFilteredModels(filtered);
    }
  }, [modelSearchTerm, models]);

  // Handle make selection
  const handleMakeSelect = (selectedMake: string) => {
    setMake(selectedMake);
    setMakeSearchTerm(selectedMake);
    setShowMakeDropdown(false);
  };

  // Handle model selection
  const handleModelSelect = (selectedModel: string) => {
    setModel(selectedModel);
    setModelSearchTerm(selectedModel);
    setShowModelDropdown(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams = {
      make: make !== "Any" ? make : undefined,
      model: model !== "Any" ? model : undefined,
      year: year !== "Any" ? year : undefined,
      drivetrain: drivetrain !== "Any" ? drivetrain : undefined,
      cylinder: cylinder !== "Any" ? cylinder : undefined,
      fuelType: fuelType !== "Any" ? fuelType : undefined,
      bodyStyle: bodyStyle !== "Any" ? bodyStyle : undefined
    };

    console.log("Searching with filters:", searchParams);
    
    // TODO: Implement actual search functionality
    // This would typically involve:
    // 1. Making an API call to your backend
    // 2. Navigating to a results page with query parameters
    // 3. Or filtering a local dataset
  };

  const resetFilters = () => {
    setMake("Any");
    setModel("Any");
    setYear("Any");
    setDrivetrain("Any");
    setCylinder("Any");
    setFuelType("Any");
    setBodyStyle("Any");
    setMakeSearchTerm("");
    setModelSearchTerm("");
  };

  const selectClass = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors ${
    darkMode
      ? "bg-gray-800 text-gray-100 border-gray-700 hover:border-gray-600"
      : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
  }`;

  const disabledSelectClass = `w-full px-4 py-3 rounded-lg border appearance-none cursor-not-allowed opacity-50 ${
    darkMode
      ? "bg-gray-900 text-gray-500 border-gray-700"
      : "bg-gray-100 text-gray-500 border-gray-300"
  }`;

  return (
    <section className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <h2 className="text-4xl font-bold mb-8 text-center">find your next car</h2>

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

      {searchMode === "specific" && (
        <div className="w-full max-w-4xl">
          {isLoading ? (
            <div className={`p-6 rounded-xl border text-center ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
            }`}>
              <p className="text-lg">Loading vehicle data...</p>
            </div>
          ) : (
            <form 
              onSubmit={handleSearch} 
              className={`p-6 rounded-xl border shadow-lg ${
                darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Make - with Autocomplete */}
                <div className="relative">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    make
                  </label>
                  <input
                    type="text"
                    value={makeSearchTerm}
                    onChange={(e) => {
                      setMakeSearchTerm(e.target.value);
                      setShowMakeDropdown(true);
                    }}
                    onFocus={() => setShowMakeDropdown(true)}
                    placeholder="Type to search makes..."
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      darkMode
                        ? "bg-gray-800 text-gray-100 border-gray-700 hover:border-gray-600 placeholder-gray-500"
                        : "bg-white text-gray-900 border-gray-300 hover:border-gray-400 placeholder-gray-400"
                    }`}
                  />
                  
                  {/* Make Dropdown */}
                  {showMakeDropdown && filteredMakes.length > 0 && (
                    <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg ${
                      darkMode 
                        ? "bg-gray-800 border-gray-700" 
                        : "bg-white border-gray-300"
                    }`}>
                      {filteredMakes.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleMakeSelect(m)}
                          className={`w-full text-left px-4 py-2 transition-colors ${
                            darkMode
                              ? "hover:bg-gray-700 text-gray-100"
                              : "hover:bg-gray-100 text-gray-900"
                          } ${make === m ? (darkMode ? "bg-gray-700" : "bg-gray-100") : ""}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Model - with Autocomplete */}
                <div className="relative">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    model
                  </label>
                  <input
                    type="text"
                    value={modelSearchTerm}
                    onChange={(e) => {
                      setModelSearchTerm(e.target.value);
                      setShowModelDropdown(true);
                    }}
                    onFocus={() => setShowModelDropdown(true)}
                    disabled={make === "Any"}
                    placeholder={make === "Any" ? "Select a make first" : "Type to search models..."}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      make === "Any"
                        ? darkMode
                          ? "bg-gray-900 text-gray-500 border-gray-700 cursor-not-allowed opacity-50"
                          : "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed opacity-50"
                        : darkMode
                          ? "bg-gray-800 text-gray-100 border-gray-700 hover:border-gray-600 placeholder-gray-500"
                          : "bg-white text-gray-900 border-gray-300 hover:border-gray-400 placeholder-gray-400"
                    }`}
                  />
                  
                  {/* Model Dropdown */}
                  {showModelDropdown && make !== "Any" && filteredModels.length > 0 && (
                    <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg ${
                      darkMode 
                        ? "bg-gray-800 border-gray-700" 
                        : "bg-white border-gray-300"
                    }`}>
                      {filteredModels.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleModelSelect(m)}
                          className={`w-full text-left px-4 py-2 transition-colors ${
                            darkMode
                              ? "hover:bg-gray-700 text-gray-100"
                              : "hover:bg-gray-100 text-gray-900"
                          } ${model === m ? (darkMode ? "bg-gray-700" : "bg-gray-100") : ""}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {make === "Any" && (
                    <p className={`text-xs mt-1 ${
                      darkMode ? "text-gray-500" : "text-gray-500"
                    }`}>
                      select a make first
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    year
                  </label>
                  <div className="relative">
                    <select 
                      value={year} 
                      onChange={(e) => setYear(e.target.value)} 
                      className={selectClass}
                    >
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <ChevronDown 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                      size={20} 
                    />
                  </div>
                </div>

                {/* Drivetrain */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    drivetrain
                  </label>
                  <div className="relative">
                    <select 
                      value={drivetrain} 
                      onChange={(e) => setDrivetrain(e.target.value)} 
                      className={selectClass}
                    >
                      {drivetrains.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                      size={20} 
                    />
                  </div>
                </div>

                {/* Cylinders */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    cylinders
                  </label>
                  <div className="relative">
                    <select 
                      value={cylinder} 
                      onChange={(e) => setCylinder(e.target.value)} 
                      className={selectClass}
                    >
                      {cylinders.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                      size={20} 
                    />
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    fuel type
                  </label>
                  <div className="relative">
                    <select 
                      value={fuelType} 
                      onChange={(e) => setFuelType(e.target.value)} 
                      className={selectClass}
                    >
                      {fuelTypes.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <ChevronDown 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                      size={20} 
                    />
                  </div>
                </div>

                {/* Body Style */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    body style
                  </label>
                  <div className="relative">
                    <select 
                      value={bodyStyle} 
                      onChange={(e) => setBodyStyle(e.target.value)} 
                      className={selectClass}
                    >
                      {bodyStyles.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <ChevronDown 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                      size={20} 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Search size={20} /> search
                </button>
                <button 
                  type="button" 
                  onClick={resetFilters} 
                  className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                    darkMode 
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  reset
                </button>
              </div>
            </form>
          )}

          <button 
            onClick={() => { 
              setSearchMode(null); 
              resetFilters(); 
            }} 
            className={`mt-4 text-sm transition-colors ${
              darkMode 
                ? "text-gray-400 hover:text-gray-300" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ← back
          </button>
        </div>
      )}

      {searchMode === "help" && (
        <div className="w-full max-w-md">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Help search query:", helpQuery);
              // TODO: Implement AI-powered search
            }} 
            className={`w-full rounded-xl border shadow-lg ${
              darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"
            }`}
          >
            <textarea
              value={helpQuery}
              onChange={(e) => setHelpQuery(e.target.value)}
              placeholder="describe what you're looking for... (e.g., 'I need a reliable family SUV with good gas mileage under $30k')"
              autoFocus
              rows={3}
              className={`w-full px-4 py-3 rounded-t-xl focus:outline-none resize-none ${
                darkMode 
                  ? "bg-gray-800 text-gray-100 placeholder-gray-400" 
                  : "bg-white text-gray-900 placeholder-gray-500"
              }`}
            />
            <div className="p-3 flex justify-end border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }">
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                disabled={!helpQuery.trim()}
              >
                <Sparkles size={18} /> search
              </button>
            </div>
          </form>

          <button 
            onClick={() => { 
              setSearchMode(null); 
              setHelpQuery(""); 
            }} 
            className={`mt-4 text-sm transition-colors ${
              darkMode 
                ? "text-gray-400 hover:text-gray-300" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ← back
          </button>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showMakeDropdown || showModelDropdown) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowMakeDropdown(false);
            setShowModelDropdown(false);
          }}
        />
      )}
    </section>
  );
}