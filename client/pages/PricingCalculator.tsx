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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  DollarSign,
  Save,
  Truck,
  Plus,
  Minus,
  Trash2,
  Settings,
  Clock,
  Weight,
  Package,
} from "lucide-react";

interface TruckConfig {
  capacity: number; // cubic yards
  payload: number; // tons
  name: string;
}

interface PricingConfig {
  dumpRatePerTon: number;
  dumpRatePerCubicYard: number;
  useTonRate: boolean; // true for per ton, false for per cubic yard
  laborRatePerHour: number;
  fuelCostPerMile: number;
  baseServiceFee: number;
  profitMargin: number;
  loadingTimeMultiplier: number; // minutes per cubic yard
}

interface DebrisItem {
  id: string;
  name: string;
  category: string;
  weightPerItem: number; // tons
  volumePerItem: number; // cubic yards
  loadingTimePerItem: number; // minutes
}

interface JobItem {
  debrisItem: DebrisItem;
  quantity: number;
}

interface JobEstimate {
  distance: number;
  additionalFees: number;
  notes: string;
}

const DEBRIS_ITEMS: DebrisItem[] = [
  // Furniture
  { id: "sofa", name: "Sofa/Couch", category: "Furniture", weightPerItem: 0.05, volumePerItem: 0.5, loadingTimePerItem: 8 },
  { id: "chair", name: "Chair", category: "Furniture", weightPerItem: 0.015, volumePerItem: 0.15, loadingTimePerItem: 3 },
  { id: "dresser", name: "Dresser", category: "Furniture", weightPerItem: 0.08, volumePerItem: 0.4, loadingTimePerItem: 6 },
  { id: "mattress", name: "Mattress", category: "Furniture", weightPerItem: 0.03, volumePerItem: 0.6, loadingTimePerItem: 5 },
  { id: "table", name: "Dining Table", category: "Furniture", weightPerItem: 0.04, volumePerItem: 0.25, loadingTimePerItem: 4 },
  { id: "desk", name: "Desk", category: "Furniture", weightPerItem: 0.035, volumePerItem: 0.2, loadingTimePerItem: 4 },
  
  // Appliances
  { id: "refrigerator", name: "Refrigerator", category: "Appliances", weightPerItem: 0.15, volumePerItem: 0.4, loadingTimePerItem: 12 },
  { id: "washer", name: "Washing Machine", category: "Appliances", weightPerItem: 0.125, volumePerItem: 0.3, loadingTimePerItem: 10 },
  { id: "dryer", name: "Dryer", category: "Appliances", weightPerItem: 0.075, volumePerItem: 0.25, loadingTimePerItem: 8 },
  { id: "stove", name: "Stove/Oven", category: "Appliances", weightPerItem: 0.1, volumePerItem: 0.35, loadingTimePerItem: 10 },
  { id: "dishwasher", name: "Dishwasher", category: "Appliances", weightPerItem: 0.06, volumePerItem: 0.2, loadingTimePerItem: 8 },
  { id: "microwave", name: "Microwave", category: "Appliances", weightPerItem: 0.02, volumePerItem: 0.05, loadingTimePerItem: 2 },
  
  // Electronics
  { id: "tv_large", name: "Large TV (50\"+)", category: "Electronics", weightPerItem: 0.04, volumePerItem: 0.15, loadingTimePerItem: 6 },
  { id: "tv_small", name: "Small TV (32\" or less)", category: "Electronics", weightPerItem: 0.015, volumePerItem: 0.08, loadingTimePerItem: 3 },
  { id: "computer", name: "Desktop Computer", category: "Electronics", weightPerItem: 0.01, volumePerItem: 0.05, loadingTimePerItem: 2 },
  { id: "monitor", name: "Computer Monitor", category: "Electronics", weightPerItem: 0.008, volumePerItem: 0.04, loadingTimePerItem: 2 },
  
  // Construction Debris
  { id: "drywall_sheet", name: "Drywall Sheet", category: "Construction", weightPerItem: 0.025, volumePerItem: 0.02, loadingTimePerItem: 3 },
  { id: "lumber_2x4", name: "2x4 Lumber (8ft)", category: "Construction", weightPerItem: 0.005, volumePerItem: 0.01, loadingTimePerItem: 1 },
  { id: "concrete_block", name: "Concrete Block", category: "Construction", weightPerItem: 0.02, volumePerItem: 0.008, loadingTimePerItem: 2 },
  { id: "carpet_roll", name: "Carpet Roll (12x10ft)", category: "Construction", weightPerItem: 0.04, volumePerItem: 0.3, loadingTimePerItem: 8 },
  
  // Yard Waste
  { id: "tree_branch", name: "Tree Branch (large)", category: "Yard Waste", weightPerItem: 0.015, volumePerItem: 0.2, loadingTimePerItem: 4 },
  { id: "lawn_mower", name: "Lawn Mower", category: "Yard Waste", weightPerItem: 0.04, volumePerItem: 0.15, loadingTimePerItem: 5 },
  { id: "bag_leaves", name: "Bag of Leaves", category: "Yard Waste", weightPerItem: 0.01, volumePerItem: 0.1, loadingTimePerItem: 1 },
  
  // Miscellaneous
  { id: "box_books", name: "Box of Books", category: "Miscellaneous", weightPerItem: 0.025, volumePerItem: 0.05, loadingTimePerItem: 2 },
  { id: "exercise_equipment", name: "Exercise Equipment", category: "Miscellaneous", weightPerItem: 0.06, volumePerItem: 0.2, loadingTimePerItem: 6 },
  { id: "water_heater", name: "Water Heater", category: "Miscellaneous", weightPerItem: 0.065, volumePerItem: 0.15, loadingTimePerItem: 10 },
];

const TRUCK_CONFIGURATIONS: TruckConfig[] = [
  { name: "Small Pickup Truck", capacity: 2, payload: 1 },
  { name: "Large Pickup Truck", capacity: 3, payload: 1.5 },
  { name: "Box Truck (10ft)", capacity: 8, payload: 3 },
  { name: "Box Truck (14ft)", capacity: 12, payload: 4 },
  { name: "Box Truck (16ft)", capacity: 16, payload: 5 },
  { name: "Small Trailer (6x10)", capacity: 6, payload: 2.5 },
  { name: "Medium Trailer (6x12)", capacity: 8, payload: 3 },
  { name: "Large Trailer (6x14)", capacity: 10, payload: 3.5 },
  { name: "Custom", capacity: 10, payload: 4 },
];

export default function PricingCalculator() {
  const [truckConfig, setTruckConfig] = useState<TruckConfig>(TRUCK_CONFIGURATIONS[2]);
  const [config, setConfig] = useState<PricingConfig>({
    dumpRatePerTon: 85,
    dumpRatePerCubicYard: 45,
    useTonRate: false,
    laborRatePerHour: 25,
    fuelCostPerMile: 0.65,
    baseServiceFee: 50,
    profitMargin: 35,
    loadingTimeMultiplier: 3, // 3 minutes per cubic yard
  });

  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [estimate, setEstimate] = useState<JobEstimate>({
    distance: 0,
    additionalFees: 0,
    notes: "",
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('debris-calculator-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.config) setConfig(parsed.config);
        if (parsed.truckConfig) setTruckConfig(parsed.truckConfig);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem('debris-calculator-config', JSON.stringify({
      config,
      truckConfig
    }));
    alert('Configuration saved successfully!');
  };

  const addJobItem = (debrisItem: DebrisItem) => {
    const existingItem = jobItems.find(item => item.debrisItem.id === debrisItem.id);
    if (existingItem) {
      setJobItems(jobItems.map(item => 
        item.debrisItem.id === debrisItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setJobItems([...jobItems, { debrisItem, quantity: 1 }]);
    }
  };

  const updateJobItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setJobItems(jobItems.filter(item => item.debrisItem.id !== itemId));
    } else {
      setJobItems(jobItems.map(item => 
        item.debrisItem.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const calculateJobTotals = () => {
    const totalWeight = jobItems.reduce((sum, item) => 
      sum + (item.debrisItem.weightPerItem * item.quantity), 0
    );
    
    const totalVolume = jobItems.reduce((sum, item) => 
      sum + (item.debrisItem.volumePerItem * item.quantity), 0
    );
    
    const totalLoadingTime = jobItems.reduce((sum, item) => 
      sum + (item.debrisItem.loadingTimePerItem * item.quantity), 0
    );

    const tripsNeeded = Math.ceil(Math.max(
      totalVolume / truckConfig.capacity,
      totalWeight / truckConfig.payload
    ));

    const dumpFee = config.useTonRate 
      ? totalWeight * config.dumpRatePerTon
      : totalVolume * config.dumpRatePerCubicYard;

    const laborCost = (totalLoadingTime / 60) * config.laborRatePerHour; // Convert minutes to hours
    const fuelCost = estimate.distance * 2 * config.fuelCostPerMile * tripsNeeded; // Round trip * trips
    const tripSurcharge = tripsNeeded > 1 ? (tripsNeeded - 1) * 50 : 0; // $50 per additional trip

    const subtotal = config.baseServiceFee + dumpFee + laborCost + fuelCost + tripSurcharge + estimate.additionalFees;
    const profitAmount = subtotal * (config.profitMargin / 100);
    const total = subtotal + profitAmount;

    return {
      totalWeight,
      totalVolume,
      totalLoadingTime,
      tripsNeeded,
      dumpFee,
      laborCost,
      fuelCost,
      tripSurcharge,
      subtotal,
      profitAmount,
      total,
      weightLimit: totalWeight <= truckConfig.payload,
      volumeLimit: totalVolume <= truckConfig.capacity,
    };
  };

  const totals = calculateJobTotals();
  const categories = ["All", ...Array.from(new Set(DEBRIS_ITEMS.map(item => item.category)))];
  const filteredItems = selectedCategory === "All" 
    ? DEBRIS_ITEMS 
    : DEBRIS_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Debris Removal Calculator</h1>
              <p className="text-muted-foreground">
                Advanced tool for calculating junk removal jobs with item-by-item estimates
              </p>
            </div>
            <Button onClick={saveConfig}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>

          <Tabs defaultValue="configure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="configure">Configure</TabsTrigger>
              <TabsTrigger value="build">Build Job</TabsTrigger>
              <TabsTrigger value="estimate">Estimate</TabsTrigger>
            </TabsList>

            <TabsContent value="configure" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Truck Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Truck/Trailer Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="truckType">Vehicle Type</Label>
                      <Select
                        value={truckConfig.name}
                        onValueChange={(value) => {
                          const selectedTruck = TRUCK_CONFIGURATIONS.find(truck => truck.name === value);
                          if (selectedTruck) {
                            setTruckConfig(selectedTruck);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRUCK_CONFIGURATIONS.map((truck) => (
                            <SelectItem key={truck.name} value={truck.name}>
                              {truck.name} ({truck.capacity} yd³, {truck.payload} tons)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="capacity">Capacity (cubic yards)</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={truckConfig.capacity}
                          onChange={(e) => setTruckConfig({
                            ...truckConfig,
                            capacity: Number(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="payload">Payload (tons)</Label>
                        <Input
                          id="payload"
                          type="number"
                          step="0.1"
                          value={truckConfig.payload}
                          onChange={(e) => setTruckConfig({
                            ...truckConfig,
                            payload: Number(e.target.value)
                          })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Pricing Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Dump Fee Calculation</Label>
                      <Select
                        value={config.useTonRate ? "ton" : "cubic"}
                        onValueChange={(value) => setConfig({
                          ...config,
                          useTonRate: value === "ton"
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ton">Per Ton</SelectItem>
                          <SelectItem value="cubic">Per Cubic Yard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dumpRate">
                          Dump Rate (${config.useTonRate ? "per ton" : "per yd³"})
                        </Label>
                        <Input
                          id="dumpRate"
                          type="number"
                          value={config.useTonRate ? config.dumpRatePerTon : config.dumpRatePerCubicYard}
                          onChange={(e) => setConfig({
                            ...config,
                            ...(config.useTonRate 
                              ? { dumpRatePerTon: Number(e.target.value) }
                              : { dumpRatePerCubicYard: Number(e.target.value) }
                            )
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="laborRate">Labor Rate ($/hour)</Label>
                        <Input
                          id="laborRate"
                          type="number"
                          value={config.laborRatePerHour}
                          onChange={(e) => setConfig({
                            ...config,
                            laborRatePerHour: Number(e.target.value)
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="baseServiceFee">Base Service Fee ($)</Label>
                        <Input
                          id="baseServiceFee"
                          type="number"
                          value={config.baseServiceFee}
                          onChange={(e) => setConfig({
                            ...config,
                            baseServiceFee: Number(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                        <Input
                          id="profitMargin"
                          type="number"
                          value={config.profitMargin}
                          onChange={(e) => setConfig({
                            ...config,
                            profitMargin: Number(e.target.value)
                          })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="build" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Item Library */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Item Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
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

                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                            onClick={() => addJobItem(item)}
                          >
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.weightPerItem} tons • {item.volumePerItem} yd³ • {item.loadingTimePerItem}min
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Job Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {jobItems.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Add items from the library to build your job
                        </p>
                      ) : (
                        jobItems.map((jobItem) => (
                          <div key={jobItem.debrisItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{jobItem.debrisItem.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {jobItem.debrisItem.category}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateJobItemQuantity(
                                  jobItem.debrisItem.id, 
                                  jobItem.quantity - 1
                                )}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{jobItem.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateJobItemQuantity(
                                  jobItem.debrisItem.id, 
                                  jobItem.quantity + 1
                                )}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateJobItemQuantity(jobItem.debrisItem.id, 0)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="estimate" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Job Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="distance">Distance to Dump (miles)</Label>
                      <Input
                        id="distance"
                        type="number"
                        value={estimate.distance}
                        onChange={(e) => setEstimate({
                          ...estimate,
                          distance: Number(e.target.value)
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="additionalFees">Additional Fees ($)</Label>
                      <Input
                        id="additionalFees"
                        type="number"
                        value={estimate.additionalFees}
                        onChange={(e) => setEstimate({
                          ...estimate,
                          additionalFees: Number(e.target.value)
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Capacity Check */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Capacity Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Volume:</span>
                        <div className="flex items-center gap-2">
                          <span>{totals.totalVolume.toFixed(1)} / {truckConfig.capacity} yd³</span>
                          <Badge variant={totals.volumeLimit ? "default" : "destructive"}>
                            {totals.volumeLimit ? "OK" : "OVER"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Weight:</span>
                        <div className="flex items-center gap-2">
                          <span>{totals.totalWeight.toFixed(2)} / {truckConfig.payload} tons</span>
                          <Badge variant={totals.weightLimit ? "default" : "destructive"}>
                            {totals.weightLimit ? "OK" : "OVER"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Trips Needed:</span>
                        <Badge variant={totals.tripsNeeded > 1 ? "secondary" : "default"}>
                          {totals.tripsNeeded}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Loading Time:</span>
                        <span>{Math.ceil(totals.totalLoadingTime)} minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Base Service Fee:</span>
                        <span className="font-medium">${config.baseServiceFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dump Fee ({config.useTonRate ? `${totals.totalWeight.toFixed(2)} tons` : `${totals.totalVolume.toFixed(1)} yd³`}):</span>
                        <span className="font-medium">${totals.dumpFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labor ({(totals.totalLoadingTime / 60).toFixed(1)}h):</span>
                        <span className="font-medium">${totals.laborCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel ({estimate.distance} mi × {totals.tripsNeeded} trips):</span>
                        <span className="font-medium">${totals.fuelCost.toFixed(2)}</span>
                      </div>
                      {totals.tripSurcharge > 0 && (
                        <div className="flex justify-between">
                          <span>Additional Trip Fee:</span>
                          <span className="font-medium">${totals.tripSurcharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Additional Fees:</span>
                        <span className="font-medium">${estimate.additionalFees.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit ({config.profitMargin}%):</span>
                        <span className="font-medium text-green-600">${totals.profitAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center bg-primary/5 rounded-lg p-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          ${totals.total.toFixed(2)}
                        </div>
                        <div className="text-lg text-muted-foreground mb-4">Total Job Price</div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Weight className="w-3 h-3" />
                              <span className="font-medium">{totals.totalWeight.toFixed(2)} tons</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Package className="w-3 h-3" />
                              <span className="font-medium">{totals.totalVolume.toFixed(1)} yd³</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Clock className="w-3 h-3" />
                              <span className="font-medium">{Math.ceil(totals.totalLoadingTime)}min</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Truck className="w-3 h-3" />
                              <span className="font-medium">{totals.tripsNeeded} trip{totals.tripsNeeded > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
