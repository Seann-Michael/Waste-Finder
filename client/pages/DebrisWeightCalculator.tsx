import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  Scale,
  Package,
  Trash2,
  Plus,
  Minus,
  RotateCcw,
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

interface CalculatorItem {
  debrisType: DebrisType;
  quantity: number;
  customWeight?: number; // custom weight per unit in pounds
  customVolume?: number; // custom volume per unit in cubic yards
}

const DEBRIS_TYPES: DebrisType[] = [
  // Construction Materials
  { id: "concrete", name: "Concrete", category: "Construction", weightPerUnit: 4000, volumePerUnit: 1.0, unit: "cubic yard", description: "Broken concrete, sidewalks, driveways", icon: "🧱" },
  { id: "asphalt", name: "Asphalt", category: "Construction", weightPerUnit: 3000, volumePerUnit: 1.0, unit: "cubic yard", description: "Asphalt pavement, shingles", icon: "🛣️" },
  { id: "brick", name: "Brick", category: "Construction", weightPerUnit: 3500, volumePerUnit: 1.0, unit: "cubic yard", description: "Clay bricks, masonry", icon: "🧱" },
  { id: "drywall", name: "Drywall", category: "Construction", weightPerUnit: 50, volumePerUnit: 0.03, unit: "sheet (4x8)", description: "Gypsum wallboard sheets", icon: "⬜" },
  { id: "lumber", name: "Lumber", category: "Construction", weightPerUnit: 2000, volumePerUnit: 1.0, unit: "cubic yard", description: "Wood boards, framing", icon: "🪵" },
  { id: "roofing", name: "Roofing Shingles", category: "Construction", weightPerUnit: 80, volumePerUnit: 0.05, unit: "bundle", description: "Asphalt roof shingles", icon: "🏠" },
  { id: "siding", name: "Siding", category: "Construction", weightPerUnit: 1500, volumePerUnit: 1.0, unit: "cubic yard", description: "Vinyl, wood, or fiber cement", icon: "🏠" },
  
  // Metals
  { id: "steel", name: "Steel", category: "Metal", weightPerUnit: 15000, volumePerUnit: 1.0, unit: "cubic yard", description: "Steel beams, rebar, appliances", icon: "🔩" },
  { id: "aluminum", name: "Aluminum", category: "Metal", weightPerUnit: 1400, volumePerUnit: 1.0, unit: "cubic yard", description: "Aluminum siding, cans, gutters", icon: "📦" },
  { id: "copper", name: "Copper", category: "Metal", weightPerUnit: 18000, volumePerUnit: 1.0, unit: "cubic yard", description: "Copper pipes, wiring", icon: "🔶" },
  
  // Green Waste
  { id: "yard_waste", name: "Yard Waste", category: "Organic", weightPerUnit: 400, volumePerUnit: 1.0, unit: "cubic yard", description: "Grass, leaves, small branches", icon: "🍃" },
  { id: "tree_logs", name: "Tree Logs", category: "Organic", weightPerUnit: 2000, volumePerUnit: 1.0, unit: "cubic yard", description: "Cut tree trunks and large logs", icon: "🪵" },
  { id: "stumps", name: "Tree Stumps", category: "Organic", weightPerUnit: 2500, volumePerUnit: 1.0, unit: "cubic yard", description: "Root balls and stumps", icon: "🌳" },
  
  // Dirt & Stone
  { id: "topsoil", name: "Topsoil", category: "Earth", weightPerUnit: 2200, volumePerUnit: 1.0, unit: "cubic yard", description: "Regular dirt and topsoil", icon: "🟫" },
  { id: "clay", name: "Clay", category: "Earth", weightPerUnit: 2800, volumePerUnit: 1.0, unit: "cubic yard", description: "Heavy clay soil", icon: "🟤" },
  { id: "sand", name: "Sand", category: "Earth", weightPerUnit: 2700, volumePerUnit: 1.0, unit: "cubic yard", description: "Construction sand", icon: "🏖️" },
  { id: "gravel", name: "Gravel", category: "Earth", weightPerUnit: 3000, volumePerUnit: 1.0, unit: "cubic yard", description: "Crushed stone, gravel", icon: "🪨" },
  { id: "rock", name: "Rock/Stone", category: "Earth", weightPerUnit: 4500, volumePerUnit: 1.0, unit: "cubic yard", description: "Natural stone, boulders", icon: "🪨" },
  
  // Mixed Materials
  { id: "mixed_debris", name: "Mixed C&D Debris", category: "Mixed", weightPerUnit: 800, volumePerUnit: 1.0, unit: "cubic yard", description: "Construction & demolition mix", icon: "🗑️" },
  { id: "household", name: "Household Items", category: "Mixed", weightPerUnit: 300, volumePerUnit: 1.0, unit: "cubic yard", description: "General household debris", icon: "🏠" },
  { id: "furniture", name: "Furniture", category: "Mixed", weightPerUnit: 400, volumePerUnit: 1.0, unit: "cubic yard", description: "Mixed furniture pieces", icon: "🛋️" },
  
  // Specialty Items
  { id: "appliances", name: "Appliances", category: "Appliances", weightPerUnit: 200, volumePerUnit: 0.4, unit: "each", description: "Washers, dryers, fridges", icon: "🔌" },
  { id: "mattresses", name: "Mattresses", category: "Furniture", weightPerUnit: 60, volumePerUnit: 0.6, unit: "each", description: "Mattress and box spring", icon: "🛏️" },
  { id: "tires", name: "Tires", category: "Auto", weightPerUnit: 25, volumePerUnit: 0.1, unit: "each", description: "Car and truck tires", icon: "🛞" },
  { id: "electronics", name: "Electronics", category: "Electronics", weightPerUnit: 500, volumePerUnit: 1.0, unit: "cubic yard", description: "TVs, computers, e-waste", icon: "📺" },
];

export default function DebrisWeightCalculator() {
  const [calculatorItems, setCalculatorItems] = useState<CalculatorItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sort items alphabetically
  const sortedDebrisTypes = [...DEBRIS_TYPES].sort((a, b) => a.name.localeCompare(b.name));
  const categories = ["All", ...Array.from(new Set(sortedDebrisTypes.map(item => item.category)))];

  // Filter items by category and search term
  const filteredItems = sortedDebrisTypes.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addCalculatorItem = (debrisType: DebrisType) => {
    const existingItem = calculatorItems.find(item => item.debrisType.id === debrisType.id);
    if (existingItem) {
      setCalculatorItems(calculatorItems.map(item =>
        item.debrisType.id === debrisType.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCalculatorItems([...calculatorItems, { debrisType, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCalculatorItems(calculatorItems.filter(item => item.debrisType.id !== itemId));
    } else {
      setCalculatorItems(calculatorItems.map(item =>
        item.debrisType.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const updateCustomWeight = (itemId: string, weight: number | undefined) => {
    setCalculatorItems(calculatorItems.map(item =>
      item.debrisType.id === itemId
        ? { ...item, customWeight: weight }
        : item
    ));
  };

  const updateCustomVolume = (itemId: string, volume: number | undefined) => {
    setCalculatorItems(calculatorItems.map(item =>
      item.debrisType.id === itemId
        ? { ...item, customVolume: volume }
        : item
    ));
  };

  const calculateTotals = () => {
    const totalWeight = calculatorItems.reduce((sum, item) => {
      const weight = item.customWeight ?? item.debrisType.weightPerUnit;
      return sum + (weight * item.quantity);
    }, 0);

    const totalVolume = calculatorItems.reduce((sum, item) => {
      const volume = item.customVolume ?? item.debrisType.volumePerUnit;
      return sum + (volume * item.quantity);
    }, 0);

    const totalTons = totalWeight / 2000;

    return {
      totalWeight,
      totalTons,
      totalVolume,
      itemCount: calculatorItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  const totals = calculateTotals();

  const clearAll = () => {
    setCalculatorItems([]);
  };

  const exportResults = () => {
    const results = `DEBRIS WEIGHT CALCULATION RESULTS
Generated on: ${new Date().toLocaleDateString()}

SUMMARY:
Total Weight: ${totals.totalWeight.toLocaleString()} lbs (${totals.totalTons.toFixed(2)} tons)
Total Volume: ${totals.totalVolume.toFixed(1)} cubic yards
Total Items: ${totals.itemCount}

ITEMIZED BREAKDOWN:
${calculatorItems.map(item => {
  const weight = item.customWeight ?? item.debrisType.weightPerUnit;
  const volume = item.customVolume ?? item.debrisType.volumePerUnit;
  const totalWeight = weight * item.quantity;
  const totalVolume = volume * item.quantity;
  
  return `${item.quantity} ${item.debrisType.unit} of ${item.debrisType.name}
  Weight: ${weight} lbs per ${item.debrisType.unit} × ${item.quantity} = ${totalWeight.toLocaleString()} lbs
  Volume: ${volume} yd³ per ${item.debrisType.unit} × ${item.quantity} = ${totalVolume.toFixed(1)} yd³
  ${item.customWeight || item.customVolume ? '(Custom values applied)' : ''}`;
}).join('\n\n')}

Generated by WasteFinder Debris Weight Calculator`;

    const blob = new Blob([results], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `debris-weight-calculation-${new Date().toISOString().split('T')[0]}.txt`;
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
                      Convert debris types to weight, volume, and quantities ⚖️
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button
                  onClick={exportResults}
                  disabled={calculatorItems.length === 0}
                  className="bg-white/20 hover:bg-white/30 border border-white/40 text-white backdrop-blur-sm"
                >
                  📄 Export Results
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Debris Type Library */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Package className="w-5 h-5" />
                  </div>
                  📦 Debris Type Library ({filteredItems.length} types)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Search and Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="searchDebris">🔍 Search Debris Types</Label>
                      <Input
                        id="searchDebris"
                        type="text"
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label>Filter by Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="border-purple-300 focus:border-purple-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(searchTerm || selectedCategory !== "All") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                      }}
                      className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      🗑️ Clear Filters
                    </Button>
                  )}

                  {/* Debris Types Grid */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No debris types found matching your search
                      </div>
                    ) : (
                      filteredItems.map((debrisType) => (
                        <div
                          key={debrisType.id}
                          className="flex items-center justify-between p-3 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors shadow-sm"
                          onClick={() => addCalculatorItem(debrisType)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-2xl">{debrisType.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-purple-800 text-sm">{debrisType.name}</div>
                              <div className="text-xs text-purple-600">
                                <Badge variant="outline" className="mr-1 text-xs border-purple-300">
                                  {debrisType.category}
                                </Badge>
                              </div>
                              <div className="text-xs text-purple-500 mt-1">
                                {debrisType.weightPerUnit.toLocaleString()} lbs per {debrisType.unit}
                              </div>
                              <div className="text-xs text-gray-500">{debrisType.description}</div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="ml-2 border-purple-300 text-purple-600 hover:bg-purple-200">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculator Results */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calculator className="w-5 h-5" />
                  </div>
                  ⚖️ Weight & Volume Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {calculatorItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Scale className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                    <p className="text-blue-600 font-medium text-lg">
                      Add debris types to calculate weight and volume
                    </p>
                    <p className="text-sm text-blue-500 mt-2">
                      Click on any debris type from the library to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary Totals */}
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-center">📊 Total Calculations</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/20 rounded-lg p-4 text-center backdrop-blur-sm">
                          <div className="text-2xl font-black text-yellow-200">
                            {totals.totalWeight.toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-100">Total Pounds</div>
                          <div className="text-xs text-blue-200 mt-1">
                            ({totals.totalTons.toFixed(2)} tons)
                          </div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-4 text-center backdrop-blur-sm">
                          <div className="text-2xl font-black text-yellow-200">
                            {totals.totalVolume.toFixed(1)}
                          </div>
                          <div className="text-sm text-blue-100">Cubic Yards</div>
                          <div className="text-xs text-blue-200 mt-1">
                            ({totals.itemCount} items)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-blue-800">Calculation Items ({calculatorItems.length})</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={clearAll}
                          className="border-blue-300 text-blue-600 hover:bg-blue-100"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Clear All
                        </Button>
                      </div>

                      {calculatorItems.map((item) => {
                        const weight = item.customWeight ?? item.debrisType.weightPerUnit;
                        const volume = item.customVolume ?? item.debrisType.volumePerUnit;
                        const totalWeight = weight * item.quantity;
                        const totalVolume = volume * item.quantity;

                        return (
                          <div key={item.debrisType.id} className="border border-blue-200 rounded-lg bg-blue-50/50 p-4">
                            {/* Item Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{item.debrisType.icon}</span>
                                <div>
                                  <div className="font-medium text-blue-800">{item.debrisType.name}</div>
                                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-600">
                                    {item.debrisType.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.debrisType.id, item.quantity - 1)}
                                  className="border-blue-300 text-blue-600 hover:bg-blue-100"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.debrisType.id, Math.max(1, Number(e.target.value)))}
                                  className="w-16 text-center border-blue-300 focus:border-blue-500"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.debrisType.id, item.quantity + 1)}
                                  className="border-blue-300 text-blue-600 hover:bg-blue-100"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateQuantity(item.debrisType.id, 0)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Custom Values */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div>
                                <Label className="text-xs text-blue-700">Weight per {item.debrisType.unit} (lbs)</Label>
                                <Input
                                  type="number"
                                  value={item.customWeight ?? ""}
                                  onChange={(e) => updateCustomWeight(
                                    item.debrisType.id, 
                                    e.target.value === "" ? undefined : Number(e.target.value)
                                  )}
                                  placeholder={item.debrisType.weightPerUnit.toString()}
                                  className="h-8 text-xs border-blue-300 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-blue-700">Volume per {item.debrisType.unit} (yd³)</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={item.customVolume ?? ""}
                                  onChange={(e) => updateCustomVolume(
                                    item.debrisType.id, 
                                    e.target.value === "" ? undefined : Number(e.target.value)
                                  )}
                                  placeholder={item.debrisType.volumePerUnit.toString()}
                                  className="h-8 text-xs border-blue-300 focus:border-blue-500"
                                />
                              </div>
                            </div>

                            {/* Results */}
                            <div className="bg-blue-100 p-3 rounded border border-blue-200">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="font-medium text-blue-800">Total Weight:</div>
                                  <div className="text-blue-600 text-lg font-bold">
                                    {totalWeight.toLocaleString()} lbs
                                  </div>
                                  <div className="text-xs text-blue-500">
                                    ({(totalWeight / 2000).toFixed(2)} tons)
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-blue-800">Total Volume:</div>
                                  <div className="text-blue-600 text-lg font-bold">
                                    {totalVolume.toFixed(1)} yd³
                                  </div>
                                  <div className="text-xs text-blue-500">
                                    {item.quantity} {item.debrisType.unit}(s)
                                  </div>
                                </div>
                              </div>
                              {(item.customWeight || item.customVolume) && (
                                <div className="mt-2 text-center">
                                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                                    Custom values applied ✏️
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
