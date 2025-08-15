import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  Scale,
  ArrowUpDown,
  RotateCcw,
  Package,
} from "lucide-react";

interface DebrisType {
  id: string;
  name: string;
  category: string;
  weightPerUnit: number; // pounds per typical unit
  volumePerUnit: number; // cubic yards per typical unit
  unit: string; // "each", "cubic yard", "square foot", "bundle", etc.
  description: string;
  icon: string;
}

// REMOVED: All debris types moved to Supabase database
// Use Supabase client to fetch debris types instead of hardcoded data
const DEBRIS_TYPES: DebrisType[] = [
  // All debris types removed - fetch from Supabase debris_types table instead
  {
    id: "drywall",
    name: "Drywall",
    category: "Construction",
    weightPerUnit: 50,
    volumePerUnit: 0.03,
    unit: "sheet (4x8)",
    description: "Gypsum wallboard sheets",
    icon: "⬜",
  },
  {
    id: "lumber",
    name: "Lumber",
    category: "Construction",
    weightPerUnit: 2000,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Wood boards, framing",
    icon: "����",
  },
  {
    id: "roofing",
    name: "Roofing Shingles",
    category: "Construction",
    weightPerUnit: 80,
    volumePerUnit: 0.05,
    unit: "bundle",
    description: "Asphalt roof shingles",
    icon: "🏠",
  },
  {
    id: "siding",
    name: "Siding",
    category: "Construction",
    weightPerUnit: 1500,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Vinyl, wood, or fiber cement",
    icon: "🏠",
  },

  // Metals
  {
    id: "steel",
    name: "Steel",
    category: "Metal",
    weightPerUnit: 15000,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Steel beams, rebar, appliances",
    icon: "🔩",
  },
  {
    id: "aluminum",
    name: "Aluminum",
    category: "Metal",
    weightPerUnit: 1400,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Aluminum siding, cans, gutters",
    icon: "📦",
  },
  {
    id: "copper",
    name: "Copper",
    category: "Metal",
    weightPerUnit: 18000,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Copper pipes, wiring",
    icon: "🔶",
  },

  // Green Waste
  {
    id: "yard_waste",
    name: "Yard Waste",
    category: "Organic",
    weightPerUnit: 400,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Grass, leaves, small branches",
    icon: "🍃",
  },
  {
    id: "tree_logs",
    name: "Tree Logs",
    category: "Organic",
    weightPerUnit: 2000,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Cut tree trunks and large logs",
    icon: "🪵",
  },
  {
    id: "stumps",
    name: "Tree Stumps",
    category: "Organic",
    weightPerUnit: 2500,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Root balls and stumps",
    icon: "🌳",
  },

  // Dirt & Stone
  {
    id: "topsoil",
    name: "Topsoil",
    category: "Earth",
    weightPerUnit: 2200,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Regular dirt and topsoil",
    icon: "🟫",
  },
  {
    id: "clay",
    name: "Clay",
    category: "Earth",
    weightPerUnit: 2800,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Heavy clay soil",
    icon: "🟤",
  },
  {
    id: "sand",
    name: "Sand",
    category: "Earth",
    weightPerUnit: 2700,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Construction sand",
    icon: "🏖️",
  },
  {
    id: "gravel",
    name: "Gravel",
    category: "Earth",
    weightPerUnit: 3000,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Crushed stone, gravel",
    icon: "🪨",
  },
  {
    id: "rock",
    name: "Rock/Stone",
    category: "Earth",
    weightPerUnit: 4500,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Natural stone, boulders",
    icon: "🪨",
  },

  // Mixed Materials
  {
    id: "mixed_debris",
    name: "Mixed C&D Debris",
    category: "Mixed",
    weightPerUnit: 800,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Construction & demolition mix",
    icon: "🗑️",
  },
  {
    id: "household",
    name: "Household Items",
    category: "Mixed",
    weightPerUnit: 300,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "General household debris",
    icon: "🏠",
  },
  {
    id: "furniture",
    name: "Furniture",
    category: "Mixed",
    weightPerUnit: 400,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "Mixed furniture pieces",
    icon: "🛋️",
  },

  // Specialty Items
  {
    id: "appliances",
    name: "Appliances",
    category: "Appliances",
    weightPerUnit: 200,
    volumePerUnit: 0.4,
    unit: "each",
    description: "Washers, dryers, fridges",
    icon: "🔌",
  },
  {
    id: "mattresses",
    name: "Mattresses",
    category: "Furniture",
    weightPerUnit: 60,
    volumePerUnit: 0.6,
    unit: "each",
    description: "Mattress and box spring",
    icon: "🛏️",
  },
  {
    id: "tires",
    name: "Tires",
    category: "Auto",
    weightPerUnit: 25,
    volumePerUnit: 0.1,
    unit: "each",
    description: "Car and truck tires",
    icon: "🛞",
  },
  {
    id: "electronics",
    name: "Electronics",
    category: "Electronics",
    weightPerUnit: 500,
    volumePerUnit: 1.0,
    unit: "cubic yard",
    description: "TVs, computers, e-waste",
    icon: "📺",
  },
];

export default function DebrisWeightCalculator() {
  const [pounds, setPounds] = useState<string>("");
  const [yards, setYards] = useState<string>("");
  const [conversionFactor, setConversionFactor] = useState<string>("");
  const [debrisTypes, setDebrisTypes] = useState<DebrisType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [selectedDebris, setSelectedDebris] = useState<DebrisType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load debris types from admin storage
  useEffect(() => {
    const loadDebrisTypes = async () => {
      try {
        setIsLoadingTypes(true);

        // Try to load from API first, fallback to localStorage
        let types = [];
        try {
          const response = await fetch("/api/admin/debris-types");
          if (response.ok) {
            const data = await response.json();
            types = data.types || [];
          }
        } catch (error) {
          console.log("API not available, using localStorage");
        }

        // Fallback to localStorage
        if (types.length === 0) {
          const localTypes = localStorage.getItem("admin-debris-types");
          if (localTypes) {
            types = JSON.parse(localTypes);
          } else {
            // Use fallback DEBRIS_TYPES if no admin data exists
            types = DEBRIS_TYPES;
          }
        }

        // Filter only active types
        const activeTypes = types.filter(
          (type: any) => type.isActive !== false,
        );
        setDebrisTypes(activeTypes);
      } catch (error) {
        console.error("Error loading debris types:", error);
        // Fallback to hardcoded types
        setDebrisTypes(DEBRIS_TYPES);
      } finally {
        setIsLoadingTypes(false);
      }
    };

    loadDebrisTypes();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sort items alphabetically for dropdown
  const sortedDebrisTypes = [...debrisTypes].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  // Filter items based on search term for dropdown
  const filteredItems = sortedDebrisTypes.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePoundsChange = (value: string) => {
    setPounds(value);
    if (value && !isNaN(Number(value)) && selectedDebris) {
      const poundsNum = Number(value);
      const conversionFactor =
        selectedDebris.weightPerUnit / selectedDebris.volumePerUnit;
      const yardsResult = poundsNum / conversionFactor;
      setYards(yardsResult.toFixed(2));
    } else if (!value) {
      setYards("");
    }
  };

  const handleYardsChange = (value: string) => {
    setYards(value);
    if (value && !isNaN(Number(value)) && selectedDebris) {
      const yardsNum = Number(value);
      const conversionFactor =
        selectedDebris.weightPerUnit / selectedDebris.volumePerUnit;
      const poundsResult = yardsNum * conversionFactor;
      setPounds(poundsResult.toFixed(0));
    } else if (!value) {
      setPounds("");
    }
  };

  const handleDebrisSelection = (debris: DebrisType) => {
    setSelectedDebris(debris);
    setSearchTerm(debris.name);
    setIsDropdownOpen(false);

    // Recalculate conversion if either field has a value
    if (pounds && !isNaN(Number(pounds))) {
      const poundsNum = Number(pounds);
      const conversionFactor = debris.weightPerUnit / debris.volumePerUnit;
      const yardsResult = poundsNum / conversionFactor;
      setYards(yardsResult.toFixed(2));
    } else if (yards && !isNaN(Number(yards))) {
      const yardsNum = Number(yards);
      const conversionFactor = debris.weightPerUnit / debris.volumePerUnit;
      const poundsResult = yardsNum * conversionFactor;
      setPounds(poundsResult.toFixed(0));
    }
  };

  const handleConversionFactorChange = (value: string) => {
    setConversionFactor(value);
    if (pounds && !isNaN(Number(pounds)) && value && !isNaN(Number(value))) {
      const poundsNum = Number(pounds);
      const factorNum = Number(value);
      const yardsResult = poundsNum / factorNum;
      setYards(yardsResult.toFixed(2));
    }
  };

  const setFactorFromDebris = (debrisType: DebrisType) => {
    const factor = debrisType.weightPerUnit / debrisType.volumePerUnit;
    setConversionFactor(factor.toString());
    if (pounds && !isNaN(Number(pounds))) {
      const poundsNum = Number(pounds);
      const yardsResult = poundsNum / factor;
      setYards(yardsResult.toFixed(2));
    }
  };

  const clearAll = () => {
    setPounds("");
    setYards("");
    setConversionFactor("2000");
  };

  const exportResults = () => {
    const results = `DEBRIS WEIGHT TO VOLUME CONVERSION
Generated on: ${new Date().toLocaleDateString()}

DEBRIS TYPE: ${selectedDebris?.name || "Not selected"} (${selectedDebris?.category || "N/A"})
Conversion Factor: ${selectedDebris ? (selectedDebris.weightPerUnit / selectedDebris.volumePerUnit).toFixed(0) : "0"} lbs per cubic yard

RESULTS:
Weight: ${pounds} lbs
Volume: ${yards} cubic yards
${Number(pounds) ? `Weight in tons: ${(Number(pounds) / 2000).toFixed(2)} tons` : ""}

Generated by WasteFinder Debris Weight Calculator`;

    const blob = new Blob([results], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `debris-conversion-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Scale className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                      Debris Weight Calculator
                    </h1>
                    <p className="text-green-100 text-lg">
                      Convert pounds to cubic yards or cubic yards to pounds ⚖️
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button
                  onClick={exportResults}
                  disabled={!selectedDebris || (!pounds && !yards)}
                  className="bg-white/20 hover:bg-white/30 border border-white/40 text-white backdrop-blur-sm"
                >
                  📄 Export Results
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Main Calculator */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calculator className="w-5 h-5" />
                  </div>
                  ⚖️ Debris Weight & Volume Converter
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Debris Type Selection */}
                  <div>
                    <Label className="text-lg font-semibold text-blue-800 mb-3 block">
                      🔍 Select Debris Type
                    </Label>
                    <div className="relative" ref={dropdownRef}>
                      <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Search for debris type (e.g., concrete, wood, metal...)"
                        className="text-lg h-12 border-blue-300 focus:border-blue-500 pr-10"
                      />
                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-blue-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {isLoadingTypes ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                              Loading debris types...
                            </div>
                          ) : filteredItems.length > 0 ? (
                            filteredItems.map((debris) => (
                              <div
                                key={debris.id}
                                onClick={() => handleDebrisSelection(debris)}
                                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">
                                    {debris.icon || "🔲"}
                                  </span>
                                  <div className="flex-1">
                                    <div className="font-medium text-blue-800">
                                      {debris.name}
                                    </div>
                                    <div className="text-sm text-blue-600">
                                      {debris.weightPerUnit.toLocaleString()}{" "}
                                      lbs per {debris.unit} • {debris.category}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {debris.description}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              No debris types found matching "{searchTerm}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedDebris && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{selectedDebris.icon}</span>
                          <div>
                            <div className="font-semibold text-green-800">
                              {selectedDebris.name} Selected
                            </div>
                            <div className="text-sm text-green-600">
                              {selectedDebris.weightPerUnit.toLocaleString()}{" "}
                              lbs per {selectedDebris.unit}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Conversion Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pounds Input */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="pounds"
                        className="text-lg font-semibold text-blue-800 flex items-center gap-2"
                      >
                        <Scale className="w-5 h-5" />
                        Weight (Pounds)
                      </Label>
                      <Input
                        id="pounds"
                        type="number"
                        value={pounds}
                        onChange={(e) => handlePoundsChange(e.target.value)}
                        placeholder="Enter weight in pounds"
                        className="text-lg h-12 border-blue-300 focus:border-blue-500 bg-white"
                      />
                      {pounds && !isNaN(Number(pounds)) && (
                        <p className="text-sm text-blue-600">
                          = {(Number(pounds) / 2000).toFixed(2)} tons
                        </p>
                      )}
                    </div>

                    {/* Conversion Arrow */}
                    <div className="flex items-center justify-center md:hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full">
                        <ArrowUpDown className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Yards Input */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="yards"
                        className="text-lg font-semibold text-blue-800 flex items-center gap-2"
                      >
                        <Calculator className="w-5 h-5" />
                        Volume (Cubic Yards)
                      </Label>
                      <Input
                        id="yards"
                        type="number"
                        step="0.01"
                        value={yards}
                        onChange={(e) => handleYardsChange(e.target.value)}
                        placeholder="Enter volume in cubic yards"
                        className="text-lg h-12 border-blue-300 focus:border-blue-500 bg-white"
                      />
                      {yards && !isNaN(Number(yards)) && (
                        <p className="text-sm text-blue-600">
                          = {(Number(yards) * 27).toFixed(1)} cubic feet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hidden arrow for larger screens */}
                  <div className="hidden md:flex justify-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full">
                      <ArrowUpDown className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Results Display */}
                  {(pounds || yards) && selectedDebris && (
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6 mt-6">
                      <h3 className="text-xl font-bold mb-4 text-center">
                        📊 Conversion Results
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/20 rounded-lg p-4 text-center backdrop-blur-sm">
                          <div className="text-2xl font-black text-yellow-200">
                            {pounds || "0"}
                          </div>
                          <div className="text-sm text-green-100">Pounds</div>
                          {pounds && (
                            <div className="text-xs text-green-200 mt-1">
                              ({(Number(pounds) / 2000).toFixed(2)} tons)
                            </div>
                          )}
                        </div>
                        <div className="bg-white/20 rounded-lg p-4 text-center backdrop-blur-sm">
                          <div className="text-2xl font-black text-yellow-200">
                            {yards || "0"}
                          </div>
                          <div className="text-sm text-green-100">
                            Cubic Yards
                          </div>
                          {yards && (
                            <div className="text-xs text-green-200 mt-1">
                              ({(Number(yards) * 27).toFixed(1)} cubic feet)
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-center mt-4 text-green-100 text-sm">
                        Using {selectedDebris.name}:{" "}
                        {(
                          selectedDebris.weightPerUnit /
                          selectedDebris.volumePerUnit
                        ).toFixed(0)}{" "}
                        lbs/yd³
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      onClick={() => {
                        setPounds("");
                        setYards("");
                        setSelectedDebris(null);
                        setSearchTerm("");
                        setIsDropdownOpen(false);
                      }}
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-100"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="border-green-200 bg-green-50 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <h3 className="font-semibold text-green-800 mb-3">
                💡 How to Use
              </h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>
                  • Click any debris type to automatically set its conversion
                  factor
                </li>
                <li>
                  • Or manually set the conversion factor (lbs per cubic yard)
                  for your debris type
                </li>
                <li>• Enter weight in pounds OR volume in cubic yards</li>
                <li>• The other value will automatically calculate</li>
                <li>• Export results to save your conversion</li>
              </ul>
              <div className="mt-4 text-xs text-green-600">
                <strong>Browse the debris library</strong> to see weight
                specifications for different materials. Click any item to use
                its conversion factor.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
