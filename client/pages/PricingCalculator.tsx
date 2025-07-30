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
  // Custom dimensions for custom vehicles
  length?: number; // feet
  width?: number; // feet
  height?: number; // feet
}

interface PricingConfig {
  dumpRatePerTon: number;
  dumpRatePerCubicYard: number;
  useTonRate: boolean; // true for per ton, false for per cubic yard
  laborRatePerHour: number;
  fuelCostPerMile: number;
  removalRatePerCubicYard: number; // new removal rate
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
  // Custom values (if null, use default from debrisItem)
  customWeight?: number;
  customVolume?: number;
  customLoadingTime?: number;
}

interface JobEstimate {
  distance: number;
  additionalFees: number;
  notes: string;
  walkingDistance: number; // feet from truck to pickup location
  hasSteps: boolean;
  numberOfSteps: number;
  percentageRequiringSteps: number; // percentage of debris that needs to go up/down steps
  averageMpg: number; // vehicle fuel efficiency
  fuelPricePerGallon: number; // current fuel price
}

const DEBRIS_ITEMS: DebrisItem[] = [
  // Hot Tubs
  { id: "hot_tub_4", name: "4 Person Hot Tub", category: "Hot Tubs", weightPerItem: 0.8, volumePerItem: 1.2, loadingTimePerItem: 45 },
  { id: "hot_tub_6", name: "6 Person Hot Tub", category: "Hot Tubs", weightPerItem: 1.2, volumePerItem: 1.8, loadingTimePerItem: 60 },
  { id: "hot_tub_8", name: "8 Person Hot Tub", category: "Hot Tubs", weightPerItem: 1.6, volumePerItem: 2.4, loadingTimePerItem: 75 },

  // Couches & Seating
  { id: "couch_3_person", name: "Couch (3 Person)", category: "Furniture", weightPerItem: 0.06, volumePerItem: 0.6, loadingTimePerItem: 10 },
  { id: "couch_sectional", name: "Sectional Couch", category: "Furniture", weightPerItem: 0.12, volumePerItem: 1.2, loadingTimePerItem: 18 },
  { id: "sofa_bed", name: "Sofa Bed", category: "Furniture", weightPerItem: 0.08, volumePerItem: 0.7, loadingTimePerItem: 12 },
  { id: "chair", name: "Chair", category: "Furniture", weightPerItem: 0.015, volumePerItem: 0.15, loadingTimePerItem: 3 },

  // Beds & Mattresses
  { id: "twin_mattress", name: "Twin Mattress", category: "Furniture", weightPerItem: 0.02, volumePerItem: 0.4, loadingTimePerItem: 4 },
  { id: "full_mattress", name: "Full Mattress", category: "Furniture", weightPerItem: 0.025, volumePerItem: 0.5, loadingTimePerItem: 5 },
  { id: "queen_mattress", name: "Queen Mattress", category: "Furniture", weightPerItem: 0.03, volumePerItem: 0.6, loadingTimePerItem: 6 },
  { id: "king_mattress", name: "King Mattress", category: "Furniture", weightPerItem: 0.04, volumePerItem: 0.8, loadingTimePerItem: 8 },
  { id: "twin_box_spring", name: "Twin Box Spring", category: "Furniture", weightPerItem: 0.015, volumePerItem: 0.4, loadingTimePerItem: 4 },
  { id: "full_box_spring", name: "Full Box Spring", category: "Furniture", weightPerItem: 0.02, volumePerItem: 0.5, loadingTimePerItem: 5 },
  { id: "queen_box_spring", name: "Queen Box Spring", category: "Furniture", weightPerItem: 0.025, volumePerItem: 0.6, loadingTimePerItem: 6 },
  { id: "king_box_spring", name: "King Box Spring", category: "Furniture", weightPerItem: 0.03, volumePerItem: 0.8, loadingTimePerItem: 8 },
  { id: "bed_frame", name: "Bed Frame", category: "Furniture", weightPerItem: 0.04, volumePerItem: 0.3, loadingTimePerItem: 6 },

  // Dressers & Storage
  { id: "dresser_chest", name: "Dresser of Drawers", category: "Furniture", weightPerItem: 0.08, volumePerItem: 0.4, loadingTimePerItem: 8 },
  { id: "dresser", name: "Dresser", category: "Furniture", weightPerItem: 0.06, volumePerItem: 0.35, loadingTimePerItem: 6 },
  { id: "nightstand", name: "Night Stand", category: "Furniture", weightPerItem: 0.025, volumePerItem: 0.15, loadingTimePerItem: 3 },

  // Desks & Tables
  { id: "computer_desk", name: "Computer Desk", category: "Furniture", weightPerItem: 0.04, volumePerItem: 0.25, loadingTimePerItem: 5 },
  { id: "dining_table", name: "Dining Table", category: "Furniture", weightPerItem: 0.06, volumePerItem: 0.3, loadingTimePerItem: 6 },

  // Appliances
  { id: "refrigerator", name: "Refrigerator", category: "Appliances", weightPerItem: 0.15, volumePerItem: 0.4, loadingTimePerItem: 15 },
  { id: "sub_zero_fridge", name: "Sub Zero Refrigerator", category: "Appliances", weightPerItem: 0.25, volumePerItem: 0.6, loadingTimePerItem: 25 },
  { id: "deep_freezer", name: "Deep Freezer", category: "Appliances", weightPerItem: 0.12, volumePerItem: 0.35, loadingTimePerItem: 12 },
  { id: "washer", name: "Washing Machine", category: "Appliances", weightPerItem: 0.125, volumePerItem: 0.3, loadingTimePerItem: 12 },
  { id: "dryer", name: "Dryer", category: "Appliances", weightPerItem: 0.075, volumePerItem: 0.25, loadingTimePerItem: 10 },
  { id: "stove", name: "Stove/Oven", category: "Appliances", weightPerItem: 0.1, volumePerItem: 0.35, loadingTimePerItem: 12 },
  { id: "dishwasher", name: "Dishwasher", category: "Appliances", weightPerItem: 0.06, volumePerItem: 0.2, loadingTimePerItem: 10 },
  { id: "microwave", name: "Microwave", category: "Appliances", weightPerItem: 0.02, volumePerItem: 0.05, loadingTimePerItem: 2 },

  // Electronics
  { id: "dlp_tv", name: "DLP TV", category: "Electronics", weightPerItem: 0.06, volumePerItem: 0.2, loadingTimePerItem: 8 },
  { id: "tv_large", name: "Large TV (50\"+)", category: "Electronics", weightPerItem: 0.04, volumePerItem: 0.15, loadingTimePerItem: 6 },
  { id: "tv_small", name: "Small TV (32\" or less)", category: "Electronics", weightPerItem: 0.015, volumePerItem: 0.08, loadingTimePerItem: 3 },
  { id: "computer", name: "Desktop Computer", category: "Electronics", weightPerItem: 0.01, volumePerItem: 0.05, loadingTimePerItem: 2 },
  { id: "monitor", name: "Computer Monitor", category: "Electronics", weightPerItem: 0.008, volumePerItem: 0.04, loadingTimePerItem: 2 },

  // Construction Materials
  { id: "brick", name: "Brick", category: "Construction", weightPerItem: 0.0025, volumePerItem: 0.001, loadingTimePerItem: 0.5 },
  { id: "cinderblock", name: "Cinder Block", category: "Construction", weightPerItem: 0.02, volumePerItem: 0.008, loadingTimePerItem: 2 },
  { id: "shingles", name: "Shingles (bundle)", category: "Construction", weightPerItem: 0.04, volumePerItem: 0.02, loadingTimePerItem: 3 },
  { id: "cut_decking", name: "Cut Decking (board)", category: "Construction", weightPerItem: 0.01, volumePerItem: 0.015, loadingTimePerItem: 2 },
  { id: "cut_2x4", name: "Cut 2x4 (piece)", category: "Construction", weightPerItem: 0.005, volumePerItem: 0.008, loadingTimePerItem: 1 },
  { id: "drywall_sheet", name: "Drywall Sheet", category: "Construction", weightPerItem: 0.025, volumePerItem: 0.02, loadingTimePerItem: 3 },
  { id: "carpet_roll", name: "Carpet Roll (12x10ft)", category: "Construction", weightPerItem: 0.04, volumePerItem: 0.3, loadingTimePerItem: 8 },

  // Bathroom Items
  { id: "bathtub", name: "Bathtub", category: "Bathroom", weightPerItem: 0.15, volumePerItem: 0.5, loadingTimePerItem: 20 },

  // Miscellaneous Items
  { id: "books", name: "Books (box)", category: "Miscellaneous", weightPerItem: 0.03, volumePerItem: 0.05, loadingTimePerItem: 2 },
  { id: "dirt", name: "Dirt (cubic yard)", category: "Miscellaneous", weightPerItem: 1.3, volumePerItem: 1.0, loadingTimePerItem: 15 },
  { id: "clothes", name: "Clothes (bag)", category: "Miscellaneous", weightPerItem: 0.01, volumePerItem: 0.1, loadingTimePerItem: 1 },
  { id: "moving_boxes", name: "Moving Boxes", category: "Miscellaneous", weightPerItem: 0.02, volumePerItem: 0.05, loadingTimePerItem: 1 },
  { id: "exercise_equipment", name: "Exercise Equipment", category: "Miscellaneous", weightPerItem: 0.06, volumePerItem: 0.2, loadingTimePerItem: 8 },
  { id: "water_heater", name: "Water Heater", category: "Miscellaneous", weightPerItem: 0.065, volumePerItem: 0.15, loadingTimePerItem: 12 },

  // Yard Waste
  { id: "tree_branch", name: "Tree Branch (large)", category: "Yard Waste", weightPerItem: 0.015, volumePerItem: 0.2, loadingTimePerItem: 4 },
  { id: "lawn_mower", name: "Lawn Mower", category: "Yard Waste", weightPerItem: 0.04, volumePerItem: 0.15, loadingTimePerItem: 6 },
  { id: "bag_leaves", name: "Bag of Leaves", category: "Yard Waste", weightPerItem: 0.01, volumePerItem: 0.1, loadingTimePerItem: 1 },
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
  const [truckConfig, setTruckConfig] = useState<TruckConfig>({
    ...TRUCK_CONFIGURATIONS[2],
    length: 0,
    width: 0,
    height: 0
  });
  const [config, setConfig] = useState<PricingConfig>({
    dumpRatePerTon: 85,
    dumpRatePerCubicYard: 45,
    useTonRate: false,
    laborRatePerHour: 25,
    fuelCostPerMile: 0.65,
    removalRatePerCubicYard: 35,
    profitMargin: 35,
    loadingTimeMultiplier: 3, // 3 minutes per cubic yard
  });

  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [estimate, setEstimate] = useState<JobEstimate>({
    distance: 0,
    additionalFees: 0,
    notes: "",
    walkingDistance: 50, // default 50 feet
    hasSteps: false,
    numberOfSteps: 0,
    percentageRequiringSteps: 0,
    averageMpg: 12, // typical truck MPG
    fuelPricePerGallon: 3.50, // default fuel price
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sort items alphabetically
  const sortedItems = [...DEBRIS_ITEMS].sort((a, b) => a.name.localeCompare(b.name));

  // Cookie helper functions
  const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  useEffect(() => {
    // Load saved configuration from cookies
    const savedConfig = getCookie('debris-calculator-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(decodeURIComponent(savedConfig));
        if (parsed.config) {
          setConfig({
            dumpRatePerTon: 85,
            dumpRatePerCubicYard: 45,
            useTonRate: false,
            laborRatePerHour: 25,
            fuelCostPerMile: 0.65,
            removalRatePerCubicYard: 35,
            profitMargin: 35,
            loadingTimeMultiplier: 3,
            ...parsed.config
          });
        }
        if (parsed.truckConfig) {
          // Ensure all properties exist with proper defaults
          setTruckConfig({
            ...parsed.truckConfig,
            length: parsed.truckConfig.length ?? 0,
            width: parsed.truckConfig.width ?? 0,
            height: parsed.truckConfig.height ?? 0
          });
        }
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }
  }, []);

  const saveConfig = () => {
    const configData = JSON.stringify({ config, truckConfig });
    setCookie('debris-calculator-config', encodeURIComponent(configData), 30);
    alert('Configuration saved to your browser for 30 days! 🍪');
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

  const updateJobItemProperty = (itemId: string, property: 'customWeight' | 'customVolume' | 'customLoadingTime', value: number) => {
    setJobItems(jobItems.map(item =>
      item.debrisItem.id === itemId
        ? { ...item, [property]: value }
        : item
    ));
  };

  const calculateJobTotals = () => {
    const totalWeight = jobItems.reduce((sum, item) => {
      const weight = item.customWeight ?? item.debrisItem?.weightPerItem ?? 0;
      return sum + (weight * item.quantity);
    }, 0);

    const totalVolume = jobItems.reduce((sum, item) => {
      const volume = item.customVolume ?? item.debrisItem?.volumePerItem ?? 0;
      return sum + (volume * item.quantity);
    }, 0);

    let baseLoadingTime = jobItems.reduce((sum, item) => {
      const loadingTime = item.customLoadingTime ?? item.debrisItem?.loadingTimePerItem ?? 0;
      return sum + (loadingTime * item.quantity);
    }, 0);

    // Calculate walking time: 2 mph average walking speed
    // Each item needs to be carried from pickup location to truck
    const totalItems = jobItems.reduce((sum, item) => sum + item.quantity, 0);
    const walkingTimePerTrip = (estimate.walkingDistance / 5280) / 2 * 60; // minutes per round trip
    const walkingTime = totalItems * walkingTimePerTrip;

    // Calculate steps time: Add 30 seconds per step for items requiring steps
    let stepsTime = 0;
    if (estimate.hasSteps && estimate.numberOfSteps > 0) {
      const itemsRequiringSteps = totalItems * (estimate.percentageRequiringSteps / 100);
      stepsTime = itemsRequiringSteps * estimate.numberOfSteps * 0.5; // 30 seconds per step
    }

    const totalLoadingTime = baseLoadingTime + walkingTime + stepsTime;

    const tripsNeeded = Math.ceil(Math.max(
      totalVolume / truckConfig.capacity,
      totalWeight / truckConfig.payload
    ));

    const dumpFee = config.useTonRate
      ? totalWeight * config.dumpRatePerTon
      : totalVolume * config.dumpRatePerCubicYard;

    const laborCost = (totalLoadingTime / 60) * config.laborRatePerHour; // Convert minutes to hours

    // Calculate fuel cost: (distance * 2 for round trip * trips) / MPG * price per gallon
    const totalMiles = estimate.distance * 2 * tripsNeeded; // Round trip * number of trips
    const gallonsUsed = totalMiles / estimate.averageMpg;
    const fuelCost = gallonsUsed * estimate.fuelPricePerGallon;

    const tripSurcharge = tripsNeeded > 1 ? (tripsNeeded - 1) * 50 : 0; // $50 per additional trip

    const removalFee = totalVolume * config.removalRatePerCubicYard; // New removal rate charge

    const subtotal = dumpFee + laborCost + fuelCost + tripSurcharge + removalFee + estimate.additionalFees;
    const profitAmount = subtotal * (config.profitMargin / 100);
    const total = subtotal + profitAmount;

    return {
      totalWeight,
      totalVolume,
      baseLoadingTime,
      walkingTime,
      stepsTime,
      totalLoadingTime,
      tripsNeeded,
      dumpFee,
      laborCost,
      fuelCost,
      tripSurcharge,
      removalFee,
      subtotal,
      profitAmount,
      total,
      weightLimit: totalWeight <= truckConfig.payload,
      volumeLimit: totalVolume <= truckConfig.capacity,
    };
  };

  const totals = calculateJobTotals();
  const categories = ["All", ...Array.from(new Set(sortedItems.map(item => item.category)))];

  // Filter items by category and search term
  const filteredItems = sortedItems.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // PDF Generation Function
  const generatePDF = () => {
    const currentDate = new Date().toLocaleDateString();
    const totalItems = jobItems.reduce((sum, item) => sum + item.quantity, 0);

    // Create detailed items list
    const itemsList = jobItems.map(item => {
      const weight = item.customWeight ?? item.debrisItem.weightPerItem;
      const volume = item.customVolume ?? item.debrisItem.volumePerItem;
      const loadTime = item.customLoadingTime ?? item.debrisItem.loadingTimePerItem;
      const customNote = (item.customWeight || item.customVolume || item.customLoadingTime) ? ' (Custom)' : '';

      return `${item.quantity}× ${item.debrisItem.name}${customNote}
        Category: ${item.debrisItem.category}
        Weight: ${(weight * item.quantity).toFixed(2)} tons | Volume: ${(volume * item.quantity).toFixed(1)} yd³ | Load Time: ${loadTime * item.quantity} min`;
    }).join('\n\n');

    // Calculate fuel details
    const totalMiles = estimate.distance * 2 * totals.tripsNeeded;
    const gallonsUsed = totalMiles / estimate.averageMpg;

    const pdfContent = `
═══════════════════════════════════════════════════════════════
                    DEBRIS REMOVAL ESTIMATE
═════════════════════════��═��═══════════════════════════════════

Generated: ${currentDate}
Company: ________________________________
Customer: _______________________________
Job Address: ____________________________

VEHICLE CONFIGURATION
────────────────────────���────────────────────────────────────
Vehicle: ${truckConfig.name}
Capacity: ${truckConfig.capacity} cubic yards
Payload: ${truckConfig.payload} tons

JOB SUMMARY
───────────────────────────────────────────────────────────��─
Total Items: ${jobItems.length} types, ${totalItems} pieces
Total Weight: ${totals.totalWeight.toFixed(2)} tons
Total Volume: ${totals.totalVolume.toFixed(1)} cubic yards
Trips Required: ${totals.tripsNeeded}
Total Labor Time: ${Math.ceil(totals.totalLoadingTime)} minutes

DETAILED ITEMS LIST
─────────���────────────────────────���──────────────────────────
${itemsList}

JOB SITE CONDITIONS
��──��─────────────────────────────────────────────────────────
Distance to Dump: ${estimate.distance} miles
Walking Distance: ${estimate.walkingDistance} feet
${estimate.hasSteps ? `Steps Required: ${estimate.numberOfSteps} steps (${estimate.percentageRequiringSteps}% of items)` : 'No Steps Required'}

FUEL & TRAVEL CALCULATION
──────────────��────────────────────────────���─────────────────
Vehicle MPG: ${estimate.averageMpg}
Fuel Price: $${estimate.fuelPricePerGallon}/gallon
Total Miles: ${estimate.distance} × 2 (round trip) × ${totals.tripsNeeded} trips = ${totalMiles} miles
Fuel Needed: ${gallonsUsed.toFixed(1)} gallons
Fuel Cost: $${totals.fuelCost.toFixed(2)}

LABOR TIME BREAKDOWN
─────────────────────────────────────────────────────────────
Base Loading Time: ${Math.ceil(totals.baseLoadingTime)} minutes
Walking Time: ${Math.ceil(totals.walkingTime)} minutes
${totals.stepsTime > 0 ? `Steps Time: ${Math.ceil(totals.stepsTime)} minutes` : ''}
Total Labor Time: ${Math.ceil(totals.totalLoadingTime)} minutes

COST BREAKDOWN
─────────────────────────────────────────────────────────────
Removal Fee (${totals.totalVolume.toFixed(1)} yd³ @ $${config.removalRatePerCubicYard}/yd³):        $${totals.removalFee.toFixed(2)}
Dump Fee (${config.useTonRate ? `${totals.totalWeight.toFixed(2)} tons` : `${totals.totalVolume.toFixed(1)} yd³`}):                           $${totals.dumpFee.toFixed(2)}
Labor (${(totals.totalLoadingTime / 60).toFixed(1)} hours @ $${config.laborRatePerHour}/hr):      $${totals.laborCost.toFixed(2)}
Fuel (${gallonsUsed.toFixed(1)} gallons @ $${estimate.fuelPricePerGallon}/gal):              $${totals.fuelCost.toFixed(2)}${totals.tripSurcharge > 0 ? `
Additional Trip Fee:                         $${totals.tripSurcharge.toFixed(2)}` : ''}
Additional Fees:                             $${estimate.additionalFees.toFixed(2)}
                                           ─────────────
Subtotal:                                    $${totals.subtotal.toFixed(2)}
Profit Margin (${config.profitMargin}%):                       $${totals.profitAmount.toFixed(2)}
                                           ═══���═════════
TOTAL JOB PRICE:                             $${totals.total.toFixed(2)}
                                           ═════════════

TERMS & CONDITIONS
──────────────────��──────────────────────────────────────────
• This estimate is valid for 30 days
• Final price may vary based on actual site conditions
• Payment due upon completion
• Additional fees apply for hazardous materials

Customer Signature: ____________________  Date: ____________

Company Signature: _____________________  Date: ____________

═════════════════════════════════════════════════��═════════════
                Generated by WasteFinder Calculator
                    www.wastefinder.com
═══════════════════════════════════════════════════════════════
`;

    // Create and download the PDF as a text file (for now)
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Debris_Removal_Estimate_${currentDate.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                    <Calculator className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Debris Removal Calculator
                    </h1>
                    <p className="text-blue-100 text-lg">
                      Professional tool for accurate junk removal estimates 💪
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={saveConfig}
                className="bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm text-white shadow-lg transition-all duration-200"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                💾 Save Settings
              </Button>
            </div>

            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 -left-8 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
              <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>

          <Tabs defaultValue="configure" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="configure">⚙️ Configure & Setup</TabsTrigger>
              <TabsTrigger value="estimate">🧮 Build & Estimate</TabsTrigger>
            </TabsList>

            <TabsContent value="configure" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Truck Configuration */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Truck className="w-5 h-5" />
                      </div>
                      Truck/Trailer Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <Label htmlFor="truckType">Vehicle Type</Label>
                      <Select
                        value={truckConfig.name}
                        onValueChange={(value) => {
                          const selectedTruck = TRUCK_CONFIGURATIONS.find(truck => truck.name === value);
                          if (selectedTruck) {
                            if (selectedTruck.name === "Custom") {
                              // For custom vehicles, don't pre-fill capacity and payload
                              setTruckConfig({
                                name: selectedTruck.name,
                                capacity: 0,
                                payload: 0,
                                length: 0,
                                width: 0,
                                height: 0
                              });
                            } else {
                              setTruckConfig(selectedTruck);
                            }
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRUCK_CONFIGURATIONS.map((truck) => (
                            <SelectItem key={truck.name} value={truck.name}>
                              {truck.name === "Custom" ? "Custom Vehicle" : `${truck.name} (${truck.capacity} yd³, ${truck.payload} tons)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {truckConfig.name === "Custom" && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800">Custom Vehicle Dimensions (Optional)</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="length">Length (ft)</Label>
                            <Input
                              id="length"
                              type="number"
                              step="0.1"
                              value={truckConfig.length ?? 0}
                              placeholder="0"
                              onChange={(e) => {
                                const value = e.target.value;
                                const length = value === "" ? 0 : Number(value);
                                const width = truckConfig.width ?? 0;
                                const height = truckConfig.height ?? 0;
                                const calculatedCapacity = length && width && height ?
                                  (length * width * height) / 27 : truckConfig.capacity; // convert cubic feet to cubic yards

                                setTruckConfig({
                                  ...truckConfig,
                                  length,
                                  capacity: calculatedCapacity
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor="width">Width (ft)</Label>
                            <Input
                              id="width"
                              type="number"
                              step="0.1"
                              value={truckConfig.width ?? 0}
                              placeholder="0"
                              onChange={(e) => {
                                const value = e.target.value;
                                const width = value === "" ? 0 : Number(value);
                                const length = truckConfig.length ?? 0;
                                const height = truckConfig.height ?? 0;
                                const calculatedCapacity = length && width && height ?
                                  (length * width * height) / 27 : truckConfig.capacity;

                                setTruckConfig({
                                  ...truckConfig,
                                  width,
                                  capacity: calculatedCapacity
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor="height">Height (ft)</Label>
                            <Input
                              id="height"
                              type="number"
                              step="0.1"
                              value={truckConfig.height ?? 0}
                              placeholder="0"
                              onChange={(e) => {
                                const value = e.target.value;
                                const height = value === "" ? 0 : Number(value);
                                const length = truckConfig.length ?? 0;
                                const width = truckConfig.width ?? 0;
                                const calculatedCapacity = length && width && height ?
                                  (length * width * height) / 27 : truckConfig.capacity;

                                setTruckConfig({
                                  ...truckConfig,
                                  height,
                                  capacity: calculatedCapacity
                                });
                              }}
                            />
                          </div>
                        </div>
                        {truckConfig.length && truckConfig.width && truckConfig.height && (
                          <div className="text-sm text-blue-700 bg-blue-100 p-2 rounded">
                            Calculated capacity: {((truckConfig.length * truckConfig.width * truckConfig.height) / 27).toFixed(1)} yd³
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="capacity">Capacity (cubic yards)</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={truckConfig.capacity ?? 0}
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
                          value={truckConfig.payload ?? 0}
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
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Settings className="w-5 h-5" />
                      </div>
                      Pricing Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
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
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="dumpRate"
                            type="number"
                            className="pl-8"
                            value={config.useTonRate ? (config.dumpRatePerTon ?? 85) : (config.dumpRatePerCubicYard ?? 45)}
                            onChange={(e) => setConfig({
                              ...config,
                              ...(config.useTonRate
                                ? { dumpRatePerTon: Number(e.target.value) }
                                : { dumpRatePerCubicYard: Number(e.target.value) }
                              )
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="laborRate">Manpower Rate ($/hour)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="laborRate"
                            type="number"
                            className="pl-8"
                            value={config.laborRatePerHour ?? 25}
                            onChange={(e) => setConfig({
                              ...config,
                              laborRatePerHour: Number(e.target.value)
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="removalRate">Removal Rate ($/yd³)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="removalRate"
                            type="number"
                            className="pl-8"
                            value={config.removalRatePerCubicYard ?? 35}
                            onChange={(e) => setConfig({
                              ...config,
                              removalRatePerCubicYard: Number(e.target.value)
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                        <Input
                          id="profitMargin"
                          type="number"
                          value={config.profitMargin ?? 35}
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

              {/* Job Site Details & Conditions */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-yellow-50">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Calculator className="w-5 h-5" />
                    </div>
                    Job Site Details & Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {/* Distance & Vehicle Info */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Travel & Fuel Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="distance" className="text-yellow-700">Distance to Dump (miles)</Label>
                        <Input
                          id="distance"
                          type="number"
                          value={estimate.distance}
                          onChange={(e) => setEstimate({
                            ...estimate,
                            distance: Number(e.target.value)
                          })}
                          className="border-yellow-300 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="averageMpg" className="text-yellow-700">Vehicle MPG</Label>
                        <Input
                          id="averageMpg"
                          type="number"
                          step="0.1"
                          value={estimate.averageMpg}
                          onChange={(e) => setEstimate({
                            ...estimate,
                            averageMpg: Number(e.target.value)
                          })}
                          className="border-yellow-300 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuelPrice" className="text-yellow-700">Fuel Price ($/gallon)</Label>
                        <Input
                          id="fuelPrice"
                          type="number"
                          step="0.01"
                          value={estimate.fuelPricePerGallon}
                          onChange={(e) => setEstimate({
                            ...estimate,
                            fuelPricePerGallon: Number(e.target.value)
                          })}
                          className="border-yellow-300 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="walkingDistance" className="text-yellow-700">Walking Distance (feet)</Label>
                        <Input
                          id="walkingDistance"
                          type="number"
                          value={estimate.walkingDistance}
                          onChange={(e) => setEstimate({
                            ...estimate,
                            walkingDistance: Number(e.target.value)
                          })}
                          className="border-yellow-300 focus:border-yellow-500"
                        />
                      </div>
                    </div>

                    {/* Fuel calculation preview */}
                    {estimate.distance > 0 && totals.tripsNeeded > 0 && (
                      <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-300">
                        <div className="text-sm text-yellow-800">
                          <div>Total Miles: {estimate.distance} × 2 (round trip) × {totals.tripsNeeded} trips = {estimate.distance * 2 * totals.tripsNeeded} miles</div>
                          <div>Fuel Needed: {(estimate.distance * 2 * totals.tripsNeeded / estimate.averageMpg).toFixed(1)} gallons</div>
                          <div>Fuel Cost: {(estimate.distance * 2 * totals.tripsNeeded / estimate.averageMpg * estimate.fuelPricePerGallon).toFixed(2)} @ ${estimate.fuelPricePerGallon}/gal</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Fees */}
                  <div>
                    <Label htmlFor="additionalFees" className="text-gray-700 font-medium">Additional Fees ($)</Label>
                    <Input
                      id="additionalFees"
                      type="number"
                      value={estimate.additionalFees}
                      onChange={(e) => setEstimate({
                        ...estimate,
                        additionalFees: Number(e.target.value)
                      })}
                      className="mt-1"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Steps & Access</h4>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasSteps"
                        checked={estimate.hasSteps}
                        onChange={(e) => setEstimate({
                          ...estimate,
                          hasSteps: e.target.checked,
                          numberOfSteps: e.target.checked ? estimate.numberOfSteps || 10 : 0,
                          percentageRequiringSteps: e.target.checked ? estimate.percentageRequiringSteps || 50 : 0
                        })}
                      />
                      <Label htmlFor="hasSteps">Job involves steps</Label>
                    </div>

                    {estimate.hasSteps && (
                      <div className="grid grid-cols-2 gap-4 ml-6">
                        <div>
                          <Label htmlFor="numberOfSteps">Number of Steps</Label>
                          <Input
                            id="numberOfSteps"
                            type="number"
                            value={estimate.numberOfSteps}
                            onChange={(e) => setEstimate({
                              ...estimate,
                              numberOfSteps: Number(e.target.value)
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="percentageRequiringSteps">% of Items Using Steps</Label>
                          <Input
                            id="percentageRequiringSteps"
                            type="number"
                            max="100"
                            value={estimate.percentageRequiringSteps}
                            onChange={(e) => setEstimate({
                              ...estimate,
                              percentageRequiringSteps: Number(e.target.value)
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estimate" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Item Library */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Package className="w-5 h-5" />
                      </div>
                      📦 Item Library ({filteredItems.length} items)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Search Input */}
                      <div>
                        <Label htmlFor="searchItems">🔍 Search Items</Label>
                        <Input
                          id="searchItems"
                          type="text"
                          placeholder="Type to search items..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full border-purple-300 focus:border-purple-500"
                        />
                      </div>

                      {/* Category Filter */}
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="border-purple-300 focus:border-purple-500">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

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

                      {/* Items List */}
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {filteredItems.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No items found matching your search
                          </div>
                        ) : (
                          filteredItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors shadow-sm"
                              onClick={() => addJobItem(item)}
                            >
                              <div className="flex-1">
                                <div className="font-medium text-purple-800">{item.name}</div>
                                <div className="text-sm text-purple-600">
                                  <Badge variant="outline" className="mr-1 text-xs border-purple-300">
                                    {item.category}
                                  </Badge>
                                  {item.weightPerItem} tons • {item.volumePerItem} yd³ • {item.loadingTimePerItem}min
                                </div>
                              </div>
                              <Button size="sm" variant="outline" className="ml-2 border-purple-300 text-purple-600 hover:bg-purple-100">
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Items */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Calculator className="w-5 h-5" />
                      </div>
                      🛠️ Job Items ({jobItems.length} types, {jobItems.reduce((sum, item) => sum + item.quantity, 0)} total)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {jobItems.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                          <p className="text-blue-600 font-medium">
                            Add items from the library to build your job
                          </p>
                          <p className="text-sm text-blue-500 mt-2">
                            Click on any item to add it to your job
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Clear All Button */}
                          <div className="flex justify-between items-center bg-blue-50 p-3 rounded border border-blue-200">
                            <span className="text-sm text-blue-700 font-medium">
                              📊 Total Weight: {totals.totalWeight.toFixed(2)} tons | Volume: {totals.totalVolume.toFixed(1)} yd³
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setJobItems([])}
                              className="border-blue-300 text-blue-600 hover:bg-blue-100"
                            >
                              Clear All
                            </Button>
                          </div>

                          {/* Items List */}
                          <div className="space-y-3 max-h-80 overflow-y-auto">
                            {jobItems.map((jobItem) => {
                              const currentWeight = jobItem.customWeight ?? jobItem.debrisItem?.weightPerItem ?? 0;
                              const currentVolume = jobItem.customVolume ?? jobItem.debrisItem?.volumePerItem ?? 0;
                              const currentLoadingTime = jobItem.customLoadingTime ?? jobItem.debrisItem?.loadingTimePerItem ?? 0;

                              return (
                                <div key={jobItem.debrisItem.id} className="border border-blue-200 rounded-lg bg-blue-50/50 p-4 shadow-sm">
                                  {/* Item Header */}
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="font-medium text-blue-800">{jobItem.debrisItem.name}</div>
                                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-600">
                                        {jobItem.debrisItem.category}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateJobItemQuantity(
                                          jobItem.debrisItem.id,
                                          jobItem.quantity - 1
                                        )}
                                        className="border-blue-300 text-blue-600 hover:bg-blue-100"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={jobItem.quantity}
                                        onChange={(e) => updateJobItemQuantity(
                                          jobItem.debrisItem.id,
                                          Math.max(1, Number(e.target.value))
                                        )}
                                        className="w-16 text-center border-blue-300 focus:border-blue-500"
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateJobItemQuantity(
                                          jobItem.debrisItem.id,
                                          jobItem.quantity + 1
                                        )}
                                        className="border-blue-300 text-blue-600 hover:bg-blue-100"
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

                                  {/* Editable Properties */}
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <Label htmlFor={`weight-${jobItem.debrisItem.id}`} className="text-xs text-blue-700">
                                        Weight (tons)
                                      </Label>
                                      <Input
                                        id={`weight-${jobItem.debrisItem.id}`}
                                        type="number"
                                        step="0.001"
                                        value={currentWeight}
                                        onChange={(e) => updateJobItemProperty(
                                          jobItem.debrisItem.id,
                                          'customWeight',
                                          Number(e.target.value)
                                        )}
                                        className="h-8 text-xs border-blue-300 focus:border-blue-500"
                                        placeholder={jobItem.debrisItem.weightPerItem.toString()}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`volume-${jobItem.debrisItem.id}`} className="text-xs text-blue-700">
                                        Volume (yd³)
                                      </Label>
                                      <Input
                                        id={`volume-${jobItem.debrisItem.id}`}
                                        type="number"
                                        step="0.1"
                                        value={currentVolume}
                                        onChange={(e) => updateJobItemProperty(
                                          jobItem.debrisItem.id,
                                          'customVolume',
                                          Number(e.target.value)
                                        )}
                                        className="h-8 text-xs border-blue-300 focus:border-blue-500"
                                        placeholder={jobItem.debrisItem.volumePerItem.toString()}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`time-${jobItem.debrisItem.id}`} className="text-xs text-blue-700">
                                        Load Time (min)
                                      </Label>
                                      <Input
                                        id={`time-${jobItem.debrisItem.id}`}
                                        type="number"
                                        step="0.5"
                                        value={currentLoadingTime}
                                        onChange={(e) => updateJobItemProperty(
                                          jobItem.debrisItem.id,
                                          'customLoadingTime',
                                          Number(e.target.value)
                                        )}
                                        className="h-8 text-xs border-blue-300 focus:border-blue-500"
                                        placeholder={jobItem.debrisItem.loadingTimePerItem.toString()}
                                      />
                                    </div>
                                  </div>

                                  {/* Totals */}
                                  <div className="mt-2 text-xs text-blue-600">
                                    Total: {(currentWeight * jobItem.quantity).toFixed(2)} tons • {(currentVolume * jobItem.quantity).toFixed(1)} yd³ • {(currentLoadingTime * jobItem.quantity)} min
                                    {(jobItem.customWeight || jobItem.customVolume || jobItem.customLoadingTime) && (
                                      <span className="ml-2 text-orange-600 font-medium">(Custom values ✏️)</span>
                                    )}
                                  </div>

                                  {/* Reset to Defaults */}
                                  {(jobItem.customWeight || jobItem.customVolume || jobItem.customLoadingTime) && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setJobItems(jobItems.map(item =>
                                          item.debrisItem.id === jobItem.debrisItem.id
                                            ? {
                                                ...item,
                                                customWeight: undefined,
                                                customVolume: undefined,
                                                customLoadingTime: undefined
                                              }
                                            : item
                                        ));
                                      }}
                                      className="mt-2 h-6 text-xs text-blue-600 hover:bg-blue-100"
                                    >
                                      🔄 Reset to Defaults
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>



              {/* Selected Items Summary */}
              {jobItems.length > 0 && (
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Package className="w-5 h-5" />
                      </div>
                      Selected Items ({jobItems.length} types, {jobItems.reduce((sum, item) => sum + item.quantity, 0)} total items)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {jobItems.map((jobItem) => {
                        const currentWeight = jobItem.customWeight ?? jobItem.debrisItem?.weightPerItem ?? 0;
                        const currentVolume = jobItem.customVolume ?? jobItem.debrisItem?.volumePerItem ?? 0;
                        const currentLoadingTime = jobItem.customLoadingTime ?? jobItem.debrisItem?.loadingTimePerItem ?? 0;

                        // Calculate individual item pricing
                        const itemVolumeCost = (currentVolume * jobItem.quantity) * config.removalRatePerCubicYard;
                        const itemDumpCost = config.useTonRate
                          ? (currentWeight * jobItem.quantity) * config.dumpRatePerTon
                          : (currentVolume * jobItem.quantity) * config.dumpRatePerCubicYard;
                        const itemLaborCost = ((currentLoadingTime * jobItem.quantity) / 60) * config.laborRatePerHour;
                        const itemTotalCost = itemVolumeCost + itemDumpCost + itemLaborCost;

                        return (
                          <div key={jobItem.debrisItem.id} className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
                                  {jobItem.quantity}×
                                </Badge>
                                <div>
                                  <div className="font-medium text-gray-800">{jobItem.debrisItem.name}</div>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {jobItem.debrisItem.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <div className="font-bold text-green-600">${itemTotalCost.toFixed(2)}</div>
                                  <div className="text-xs text-gray-500">Total Price</div>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setJobItems(jobItems.filter(item => item.debrisItem.id !== jobItem.debrisItem.id));
                                  }}
                                  className="p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
                              <div className="flex justify-between">
                                <span>Weight:</span>
                                <span className="font-medium">{(currentWeight * jobItem.quantity).toFixed(2)}t</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Volume:</span>
                                <span className="font-medium">{(currentVolume * jobItem.quantity).toFixed(1)}yd³</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Load Time:</span>
                                <span className="font-medium">{Math.ceil(currentLoadingTime * jobItem.quantity)}min</span>
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-gray-200">
                              <div className="grid grid-cols-3 gap-3 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Removal:</span>
                                  <span className="font-medium">${itemVolumeCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Dump:</span>
                                  <span className="font-medium">${itemDumpCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Labor:</span>
                                  <span className="font-medium">${itemLaborCost.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {(jobItem.customWeight || jobItem.customVolume || jobItem.customLoadingTime) && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                                  Custom Values ✏️
                                </Badge>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cost Breakdown */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-yellow-50">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    Professional Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Removal Fee ({totals.totalVolume.toFixed(1)} yd³):</span>
                        <span className="font-medium">${totals.removalFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dump Fee ({config.useTonRate ? `${totals.totalWeight.toFixed(2)} tons` : `${totals.totalVolume.toFixed(1)} yd³`}):</span>
                        <span className="font-medium">${totals.dumpFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labor ({(totals.totalLoadingTime / 60).toFixed(1)}h):</span>
                        <span className="font-medium">${totals.laborCost.toFixed(2)}</span>
                      </div>
                      <div className="ml-4 text-sm text-muted-foreground">
                        <div>• Loading: {Math.ceil(totals.baseLoadingTime)}min</div>
                        <div>• Walking: {Math.ceil(totals.walkingTime)}min</div>
                        {totals.stepsTime > 0 && <div>• Steps: {Math.ceil(totals.stepsTime)}min</div>}
                      </div>
                      <div className="flex justify-between">
                        <span>Fuel ({estimate.distance * 2 * totals.tripsNeeded} mi, {(estimate.distance * 2 * totals.tripsNeeded / estimate.averageMpg).toFixed(1)} gal):</span>
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

                    <div className="relative overflow-hidden bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl p-8 text-white shadow-2xl">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative z-10 text-center">
                        <div className="mb-4">
                          <div className="text-sm text-green-100 mb-2">💰 Total Job Price</div>
                          <div className="text-6xl font-black mb-2 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent animate-pulse">
                            ${totals.total.toFixed(2)}
                          </div>
                          <div className="text-green-100 text-lg">
                            Professional Quote Ready! 🎯
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Weight className="w-4 h-4 text-yellow-300" />
                              <span className="font-bold text-lg">{totals.totalWeight.toFixed(2)} tons</span>
                            </div>
                            <div className="text-xs text-blue-100">Total Weight</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Package className="w-4 h-4 text-yellow-300" />
                              <span className="font-bold text-lg">{totals.totalVolume.toFixed(1)} yd³</span>
                            </div>
                            <div className="text-xs text-blue-100">Total Volume</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-yellow-300" />
                              <span className="font-bold text-lg">{Math.ceil(totals.totalLoadingTime)}min</span>
                            </div>
                            <div className="text-xs text-blue-100">Labor Time</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Truck className="w-4 h-4 text-yellow-300" />
                              <span className="font-bold text-lg">{totals.tripsNeeded} trip{totals.tripsNeeded > 1 ? 's' : ''}</span>
                            </div>
                            <div className="text-xs text-blue-100">Trips Needed</div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Button
                            className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-6 py-3 shadow-lg flex-1"
                            onClick={() => {
                              const quote = `DEBRIS REMOVAL ESTIMATE\n\nTotal Price: $${totals.total.toFixed(2)}\n\nItems: ${jobItems.length} types, ${jobItems.reduce((sum, item) => sum + item.quantity, 0)} total\nWeight: ${totals.totalWeight.toFixed(2)} tons\nVolume: ${totals.totalVolume.toFixed(1)} cubic yards\nTrips: ${totals.tripsNeeded}\n\nGenerated by WasteFinder Calculator`;
                              navigator.clipboard.writeText(quote);
                              alert('Quote copied to clipboard! 📋');
                            }}
                          >
                            📋 Copy Quote
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 font-bold text-lg px-6 py-3 shadow-lg flex-1"
                            onClick={generatePDF}
                          >
                            📄 Download PDF
                          </Button>
                        </div>
                      </div>

                      {/* Animated background elements */}
                      <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 bg-yellow-300/30 rounded-full animate-pulse"></div>
                      <div className="absolute top-1/2 left-2 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
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
