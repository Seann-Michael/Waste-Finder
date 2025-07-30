import { useState, useEffect } from "react";
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
  customLineItemCost?: number;
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
  // Hot Tubs & Spas (7'x7'x3.5' = ~6.5 yd³, 8'x8'x4' = ~9.5 yd³)
  {
    id: "hot_tub_small",
    name: "Hot Tub (4-6 Person)",
    category: "Hot Tubs",
    weightPerItem: 1.0,
    volumePerItem: 6.5,
    loadingTimePerItem: 60,
  },
  {
    id: "hot_tub_large",
    name: "Hot Tub (7+ Person)",
    category: "Hot Tubs",
    weightPerItem: 1.6,
    volumePerItem: 9.5,
    loadingTimePerItem: 90,
  },

  // Living Room Furniture (Realistic dimensions)
  {
    id: "sectional_couch",
    name: "Sectional Couch",
    category: "Furniture",
    weightPerItem: 0.15,
    volumePerItem: 7.0,
    loadingTimePerItem: 25,
  },
  {
    id: "standard_couch",
    name: "Standard Couch",
    category: "Furniture",
    weightPerItem: 0.08,
    volumePerItem: 2.3,
    loadingTimePerItem: 15,
  },
  {
    id: "reclining_couch",
    name: "Reclining Couch",
    category: "Furniture",
    weightPerItem: 0.12,
    volumePerItem: 4.5,
    loadingTimePerItem: 22,
  },
  {
    id: "sofa_bed",
    name: "Sofa Bed",
    category: "Furniture",
    weightPerItem: 0.1,
    volumePerItem: 3.5,
    loadingTimePerItem: 20,
  },
  {
    id: "recliner",
    name: "Recliner Chair",
    category: "Furniture",
    weightPerItem: 0.06,
    volumePerItem: 1.3,
    loadingTimePerItem: 12,
  },
  {
    id: "coffee_table",
    name: "Coffee Table",
    category: "Furniture",
    weightPerItem: 0.04,
    volumePerItem: 0.4,
    loadingTimePerItem: 8,
  },
  {
    id: "entertainment_center",
    name: "Entertainment Center",
    category: "Furniture",
    weightPerItem: 0.1,
    volumePerItem: 2.2,
    loadingTimePerItem: 18,
  },

  // Bedroom Furniture (Mattress set = mattress + box spring)
  {
    id: "mattress_set_twin",
    name: "Twin Mattress Set",
    category: "Bedroom",
    weightPerItem: 0.04,
    volumePerItem: 1.8,
    loadingTimePerItem: 12,
  },
  {
    id: "mattress_set_full",
    name: "Full Mattress Set",
    category: "Bedroom",
    weightPerItem: 0.05,
    volumePerItem: 2.2,
    loadingTimePerItem: 15,
  },
  {
    id: "mattress_set_queen",
    name: "Queen Mattress Set",
    category: "Bedroom",
    weightPerItem: 0.06,
    volumePerItem: 2.6,
    loadingTimePerItem: 18,
  },
  {
    id: "mattress_set_king",
    name: "King Mattress Set",
    category: "Bedroom",
    weightPerItem: 0.08,
    volumePerItem: 3.2,
    loadingTimePerItem: 22,
  },
  {
    id: "bed_frame",
    name: "Bed Frame",
    category: "Bedroom",
    weightPerItem: 0.05,
    volumePerItem: 1.0,
    loadingTimePerItem: 12,
  },
  {
    id: "dresser",
    name: "Dresser",
    category: "Bedroom",
    weightPerItem: 0.08,
    volumePerItem: 1.5,
    loadingTimePerItem: 15,
  },
  {
    id: "nightstand",
    name: "Nightstand",
    category: "Bedroom",
    weightPerItem: 0.03,
    volumePerItem: 0.3,
    loadingTimePerItem: 6,
  },
  {
    id: "armoire",
    name: "Armoire/Wardrobe",
    category: "Bedroom",
    weightPerItem: 0.12,
    volumePerItem: 2.5,
    loadingTimePerItem: 20,
  },

  // Dining Room Furniture
  {
    id: "dining_table",
    name: "Dining Table",
    category: "Furniture",
    weightPerItem: 0.08,
    volumePerItem: 1.2,
    loadingTimePerItem: 15,
  },
  {
    id: "dining_chairs",
    name: "Dining Chairs (set of 4)",
    category: "Furniture",
    weightPerItem: 0.06,
    volumePerItem: 1.0,
    loadingTimePerItem: 12,
  },
  {
    id: "china_cabinet",
    name: "China Cabinet",
    category: "Furniture",
    weightPerItem: 0.1,
    volumePerItem: 2.0,
    loadingTimePerItem: 18,
  },

  // Office Furniture
  {
    id: "office_desk",
    name: "Office Desk",
    category: "Furniture",
    weightPerItem: 0.06,
    volumePerItem: 1.0,
    loadingTimePerItem: 12,
  },
  {
    id: "file_cabinet",
    name: "File Cabinet",
    category: "Furniture",
    weightPerItem: 0.05,
    volumePerItem: 0.4,
    loadingTimePerItem: 8,
  },
  {
    id: "bookshelf",
    name: "Bookshelf",
    category: "Furniture",
    weightPerItem: 0.06,
    volumePerItem: 0.8,
    loadingTimePerItem: 12,
  },

  // Major Appliances (Standard fridge: 2.5'x2.5'x6' = ~1.4 yd³)
  {
    id: "refrigerator",
    name: "Refrigerator (Standard)",
    category: "Appliances",
    weightPerItem: 0.15,
    volumePerItem: 1.4,
    loadingTimePerItem: 25,
  },
  {
    id: "refrigerator_large",
    name: "Refrigerator (Large/French Door)",
    category: "Appliances",
    weightPerItem: 0.2,
    volumePerItem: 1.8,
    loadingTimePerItem: 35,
  },
  {
    id: "washer",
    name: "Washing Machine",
    category: "Appliances",
    weightPerItem: 0.125,
    volumePerItem: 0.7,
    loadingTimePerItem: 20,
  },
  {
    id: "dryer",
    name: "Dryer",
    category: "Appliances",
    weightPerItem: 0.075,
    volumePerItem: 0.7,
    loadingTimePerItem: 18,
  },
  {
    id: "stove",
    name: "Stove/Range",
    category: "Appliances",
    weightPerItem: 0.1,
    volumePerItem: 0.8,
    loadingTimePerItem: 20,
  },
  {
    id: "dishwasher",
    name: "Dishwasher",
    category: "Appliances",
    weightPerItem: 0.06,
    volumePerItem: 0.6,
    loadingTimePerItem: 15,
  },
  {
    id: "freezer_chest",
    name: "Chest Freezer",
    category: "Appliances",
    weightPerItem: 0.08,
    volumePerItem: 0.9,
    loadingTimePerItem: 18,
  },
  {
    id: "freezer_upright",
    name: "Upright Freezer",
    category: "Appliances",
    weightPerItem: 0.1,
    volumePerItem: 1.2,
    loadingTimePerItem: 22,
  },
  {
    id: "water_heater",
    name: "Water Heater",
    category: "Appliances",
    weightPerItem: 0.065,
    volumePerItem: 0.4,
    loadingTimePerItem: 18,
  },

  // Electronics & Equipment
  {
    id: "tv_large",
    name: 'Large TV (55"+)',
    category: "Electronics",
    weightPerItem: 0.04,
    volumePerItem: 0.3,
    loadingTimePerItem: 10,
  },
  {
    id: "tv_medium",
    name: 'Medium TV (32-54")',
    category: "Electronics",
    weightPerItem: 0.025,
    volumePerItem: 0.2,
    loadingTimePerItem: 8,
  },
  {
    id: "computer_setup",
    name: "Computer Setup",
    category: "Electronics",
    weightPerItem: 0.02,
    volumePerItem: 0.15,
    loadingTimePerItem: 8,
  },
  {
    id: "exercise_equipment",
    name: "Exercise Equipment",
    category: "Electronics",
    weightPerItem: 0.08,
    volumePerItem: 0.6,
    loadingTimePerItem: 15,
  },
  {
    id: "piano_upright",
    name: "Upright Piano",
    category: "Electronics",
    weightPerItem: 0.35,
    volumePerItem: 2.0,
    loadingTimePerItem: 60,
  },
  {
    id: "piano_baby_grand",
    name: "Baby Grand Piano",
    category: "Electronics",
    weightPerItem: 0.5,
    volumePerItem: 3.5,
    loadingTimePerItem: 90,
  },

  // Construction & Renovation (Per unit pricing)
  {
    id: "drywall",
    name: "Drywall (per sheet)",
    category: "Construction",
    weightPerItem: 0.025,
    volumePerItem: 0.03,
    loadingTimePerItem: 2,
  },
  {
    id: "flooring",
    name: "Flooring Materials (per sq ft)",
    category: "Construction",
    weightPerItem: 0.002,
    volumePerItem: 0.002,
    loadingTimePerItem: 0.3,
  },
  {
    id: "lumber",
    name: "Lumber Bundle",
    category: "Construction",
    weightPerItem: 0.1,
    volumePerItem: 0.3,
    loadingTimePerItem: 10,
  },
  {
    id: "shingles",
    name: "Shingles (bundle)",
    category: "Construction",
    weightPerItem: 0.04,
    volumePerItem: 0.05,
    loadingTimePerItem: 5,
  },
  {
    id: "concrete_debris",
    name: "Concrete Debris (cubic yard)",
    category: "Construction",
    weightPerItem: 2.0,
    volumePerItem: 1.0,
    loadingTimePerItem: 30,
  },
  {
    id: "brick_debris",
    name: "Brick/Block Debris (cubic yard)",
    category: "Construction",
    weightPerItem: 1.8,
    volumePerItem: 1.0,
    loadingTimePerItem: 25,
  },

  // Bathroom Fixtures
  {
    id: "bathtub",
    name: "Bathtub",
    category: "Bathroom",
    weightPerItem: 0.15,
    volumePerItem: 1.8,
    loadingTimePerItem: 35,
  },
  {
    id: "toilet",
    name: "Toilet",
    category: "Bathroom",
    weightPerItem: 0.05,
    volumePerItem: 0.3,
    loadingTimePerItem: 10,
  },
  {
    id: "vanity",
    name: "Bathroom Vanity",
    category: "Bathroom",
    weightPerItem: 0.08,
    volumePerItem: 0.8,
    loadingTimePerItem: 15,
  },

  // Outdoor & Yard Items
  {
    id: "patio_furniture_set",
    name: "Patio Furniture Set",
    category: "Outdoor",
    weightPerItem: 0.1,
    volumePerItem: 2.5,
    loadingTimePerItem: 20,
  },
  {
    id: "lawn_mower",
    name: "Lawn Mower",
    category: "Outdoor",
    weightPerItem: 0.04,
    volumePerItem: 0.3,
    loadingTimePerItem: 10,
  },
  {
    id: "grill",
    name: "Outdoor Grill",
    category: "Outdoor",
    weightPerItem: 0.08,
    volumePerItem: 0.6,
    loadingTimePerItem: 12,
  },
  {
    id: "shed_contents",
    name: "Shed Contents (cubic yard)",
    category: "Outdoor",
    weightPerItem: 0.3,
    volumePerItem: 1.0,
    loadingTimePerItem: 15,
  },

  // Bulk Items
  {
    id: "household_boxes",
    name: "Household Boxes (per box)",
    category: "Miscellaneous",
    weightPerItem: 0.025,
    volumePerItem: 0.05,
    loadingTimePerItem: 2,
  },
  {
    id: "clothing_bags",
    name: "Clothing/Textile Bags (per bag)",
    category: "Miscellaneous",
    weightPerItem: 0.015,
    volumePerItem: 0.08,
    loadingTimePerItem: 2,
  },
  {
    id: "mixed_debris",
    name: "Mixed Debris (cubic yard)",
    category: "Miscellaneous",
    weightPerItem: 0.4,
    volumePerItem: 1.0,
    loadingTimePerItem: 12,
  },
  {
    id: "yard_waste",
    name: "Yard Waste (cubic yard)",
    category: "Outdoor",
    weightPerItem: 0.2,
    volumePerItem: 1.0,
    loadingTimePerItem: 10,
  },
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
    height: 0,
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

  const [currentStep, setCurrentStep] = useState(1);
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
    fuelPricePerGallon: 3.5, // default fuel price
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sort items alphabetically
  const sortedItems = [...DEBRIS_ITEMS].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  // Cookie helper functions
  const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  useEffect(() => {
    // Load saved configuration from cookies
    const savedConfig = getCookie("debris-calculator-config");
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
            ...parsed.config,
          });
        }
        if (parsed.truckConfig) {
          // Ensure all properties exist with proper defaults
          setTruckConfig({
            ...parsed.truckConfig,
            length: parsed.truckConfig.length ?? 0,
            width: parsed.truckConfig.width ?? 0,
            height: parsed.truckConfig.height ?? 0,
          });
        }
      } catch (error) {
        console.error("Error loading config:", error);
      }
    }
  }, []);

  const saveConfig = () => {
    const configData = JSON.stringify({ config, truckConfig });
    setCookie("debris-calculator-config", encodeURIComponent(configData), 30);
    alert("Configuration saved to your browser for 30 days! 🍪");
  };

  const addJobItem = (debrisItem: DebrisItem) => {
    const existingItem = jobItems.find(
      (item) => item.debrisItem.id === debrisItem.id,
    );
    if (existingItem) {
      setJobItems(
        jobItems.map((item) =>
          item.debrisItem.id === debrisItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setJobItems([...jobItems, { debrisItem, quantity: 1 }]);
    }
  };

  const updateJobItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setJobItems(jobItems.filter((item) => item.debrisItem.id !== itemId));
    } else {
      setJobItems(
        jobItems.map((item) =>
          item.debrisItem.id === itemId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    }
  };

  const updateJobItemProperty = (
    itemId: string,
    property:
      | "customWeight"
      | "customVolume"
      | "customLoadingTime"
      | "customLineItemCost",
    value: number | undefined,
  ) => {
    setJobItems(
      jobItems.map((item) =>
        item.debrisItem.id === itemId ? { ...item, [property]: value } : item,
      ),
    );
  };

  const calculateJobTotals = () => {
    const totalWeight = jobItems.reduce((sum, item) => {
      const weight = item.customWeight ?? item.debrisItem?.weightPerItem ?? 0;
      return sum + weight * item.quantity;
    }, 0);

    const totalVolume = jobItems.reduce((sum, item) => {
      const volume = item.customVolume ?? item.debrisItem?.volumePerItem ?? 0;
      return sum + volume * item.quantity;
    }, 0);

    let baseLoadingTime = jobItems.reduce((sum, item) => {
      const loadingTime =
        item.customLoadingTime ?? item.debrisItem?.loadingTimePerItem ?? 0;
      return sum + loadingTime * item.quantity;
    }, 0);

    // Calculate walking time: 2 mph average walking speed
    // Each item needs to be carried from pickup location to truck
    const totalItems = jobItems.reduce((sum, item) => sum + item.quantity, 0);
    const walkingTimePerTrip = (estimate.walkingDistance / 5280 / 2) * 60; // minutes per round trip
    const walkingTime = totalItems * walkingTimePerTrip;

    // Calculate steps time: Add 30 seconds per step for items requiring steps
    let stepsTime = 0;
    if (estimate.hasSteps && estimate.numberOfSteps > 0) {
      const itemsRequiringSteps =
        totalItems * (estimate.percentageRequiringSteps / 100);
      stepsTime = itemsRequiringSteps * estimate.numberOfSteps * 0.5; // 30 seconds per step
    }

    const totalLoadingTime = baseLoadingTime + walkingTime + stepsTime;

    const tripsNeeded = Math.ceil(
      Math.max(
        totalVolume / truckConfig.capacity,
        totalWeight / truckConfig.payload,
      ),
    );

    const dumpFee = config.useTonRate
      ? totalWeight * config.dumpRatePerTon
      : totalVolume * config.dumpRatePerCubicYard;

    // Note: Manpower rate is for calculating labor expenses, not added to customer price
    const laborCost = 0; // Labor cost not included in customer pricing

    // Calculate fuel cost: (distance * 2 for round trip * trips) / MPG * price per gallon
    const totalMiles = estimate.distance * 2 * tripsNeeded; // Round trip * number of trips
    const gallonsUsed = totalMiles / estimate.averageMpg;
    const fuelCost = gallonsUsed * estimate.fuelPricePerGallon;

    const tripSurcharge = tripsNeeded > 1 ? (tripsNeeded - 1) * 50 : 0; // $50 per additional trip

    const removalFee = totalVolume * config.removalRatePerCubicYard; // New removal rate charge

    // Calculate total line item costs (use custom costs if set, otherwise calculate from volume/dump rates)
    const totalLineItemCosts = jobItems.reduce((sum, item) => {
      if (item.customLineItemCost !== undefined) {
        return sum + item.customLineItemCost;
      } else {
        const weight = item.customWeight ?? item.debrisItem?.weightPerItem ?? 0;
        const volume = item.customVolume ?? item.debrisItem?.volumePerItem ?? 0;
        const itemVolumeCost =
          volume * item.quantity * config.removalRatePerCubicYard;
        const itemDumpCost = config.useTonRate
          ? weight * item.quantity * config.dumpRatePerTon
          : volume * item.quantity * config.dumpRatePerCubicYard;
        return sum + itemVolumeCost + itemDumpCost;
      }
    }, 0);

    // Use line item costs instead of separate removal and dump fees when items are present
    const adjustedRemovalFee = jobItems.length > 0 ? 0 : removalFee;
    const adjustedDumpFee = jobItems.length > 0 ? 0 : dumpFee;

    const subtotal =
      adjustedDumpFee +
      laborCost +
      fuelCost +
      tripSurcharge +
      adjustedRemovalFee +
      totalLineItemCosts +
      estimate.additionalFees;
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
      dumpFee: adjustedDumpFee,
      laborCost,
      fuelCost,
      tripSurcharge,
      removalFee: adjustedRemovalFee,
      totalLineItemCosts,
      subtotal,
      profitAmount,
      total,
      weightLimit: totalWeight <= truckConfig.payload,
      volumeLimit: totalVolume <= truckConfig.capacity,
    };
  };

  const totals = calculateJobTotals();
  const categories = [
    "All",
    ...Array.from(new Set(sortedItems.map((item) => item.category))),
  ];

  // Filter items by category and search term
  const filteredItems = sortedItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const generatePDF = () => {
    const currentDate = new Date().toLocaleDateString();
    const totalItems = jobItems.reduce((sum, item) => sum + item.quantity, 0);

    const itemsList = jobItems
      .map((item) => {
        const weight = item.customWeight ?? item.debrisItem?.weightPerItem ?? 0;
        const volume = item.customVolume ?? item.debrisItem?.volumePerItem ?? 0;
        const loadTime =
          item.customLoadingTime ?? item.debrisItem?.loadingTimePerItem ?? 0;
        const customNote =
          item.customWeight || item.customVolume || item.customLoadingTime
            ? " (Custom)"
            : "";

        return `${item.quantity}× ${item.debrisItem.name}${customNote}
        Category: ${item.debrisItem.category}
        Weight: ${weight} tons each (Total: ${(weight * item.quantity).toFixed(2)} tons)
        Volume: ${volume} yd³ each (Total: ${(volume * item.quantity).toFixed(1)} yd³)
        Load Time: ${loadTime} min each (Total: ${loadTime * item.quantity} min)`;
      })
      .join("\n\n");

    // Calculate fuel details
    const totalMiles = estimate.distance * 2 * totals.tripsNeeded;
    const gallonsUsed = totalMiles / estimate.averageMpg;

    const pdfContent = `DEBRIS REMOVAL ESTIMATE
Generated on: ${currentDate}

COMPANY INFORMATION
─────────────────────────────────────────────────────────────
Company: ________________________________
Customer: _______________________________
Job Address: ____________________________
Phone: __________________________________
Email: __________________________________

VEHICLE & SITE CONFIGURATION
─────────────────────────────────────────────────────────────
Vehicle: ${truckConfig.name}
Capacity: ${truckConfig.capacity} cubic yards
Payload: ${truckConfig.payload} tons
Distance to Dump: ${estimate.distance} miles
Walking Distance: ${estimate.walkingDistance} feet
${estimate.hasSteps ? `Steps: ${estimate.numberOfSteps} steps (${estimate.percentageRequiringSteps}% of items)` : "No steps involved"}

DEBRIS ITEMS
─────────────────────────────────────────────────────────────
Total Items: ${jobItems.length} types, ${totalItems} pieces
Total Weight: ${totals.totalWeight.toFixed(2)} tons
Total Volume: ${totals.totalVolume.toFixed(1)} cubic yards
Trips Required: ${totals.tripsNeeded}
Total Labor Time: ${Math.ceil(totals.totalLoadingTime)} minutes

ITEMIZED LIST:
${itemsList}

FUEL & TRAVEL DETAILS
───────────────────────────��─��───────────────────────────────
Vehicle MPG: ${estimate.averageMpg}
Fuel Price: $${estimate.fuelPricePerGallon}/gallon
Total Miles: ${estimate.distance} × 2 (round trip) × ${totals.tripsNeeded} trips = ${totalMiles} miles
Fuel Needed: ${gallonsUsed.toFixed(1)} gallons
Fuel Cost: $${totals.fuelCost.toFixed(2)}

LABOR BREAKDOWN
─────────────────────────────────────────────────────────────
Base Loading Time: ${Math.ceil(totals.baseLoadingTime)} minutes
Walking Time: ${Math.ceil(totals.walkingTime)} minutes
${totals.stepsTime > 0 ? `Steps Time: ${Math.ceil(totals.stepsTime)} minutes` : ""}
Total Labor Time: ${Math.ceil(totals.totalLoadingTime)} minutes

COST BREAKDOWN
─────────────────────────────────────────────────────────────
Removal Fee (${totals.totalVolume.toFixed(1)} yd³ @ $${config.removalRatePerCubicYard}/yd³):        $${totals.removalFee.toFixed(2)}
Dump Fee (${config.useTonRate ? `${totals.totalWeight.toFixed(2)} tons` : `${totals.totalVolume.toFixed(1)} yd³`}):                           $${totals.dumpFee.toFixed(2)}
Labor (${(totals.totalLoadingTime / 60).toFixed(1)} hours @ $${config.laborRatePerHour}/hr):      $${totals.laborCost.toFixed(2)}
Fuel (${gallonsUsed.toFixed(1)} gallons @ $${estimate.fuelPricePerGallon}/gal):              $${totals.fuelCost.toFixed(2)}${
      totals.tripSurcharge > 0
        ? `
Additional Trip Fee:                         $${totals.tripSurcharge.toFixed(2)}`
        : ""
    }
Additional Fees:                             $${estimate.additionalFees.toFixed(2)}
                                           ─────────────
Subtotal:                                    $${totals.subtotal.toFixed(2)}
Profit Margin (${config.profitMargin}%):                       $${totals.profitAmount.toFixed(2)}
                                           ═════════════
TOTAL JOB PRICE:                             $${totals.total.toFixed(2)}
                                           ═════════════

TERMS & CONDITIONS
──────────────��──────────────────────────────────────────────
• This estimate is valid for 30 days
• Final price may vary based on actual site conditions
• Payment due upon completion
• Additional fees apply for hazardous materials
• Manpower rate ($${config.laborRatePerHour}/hr) is for internal labor cost calculation only

Customer Signature: ____________________  Date: ____________

Company Signature: _____________________  Date: ____________`;

    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `debris-removal-estimate-${currentDate.replace(/\//g, "-")}.txt`;
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
                          const selectedTruck = TRUCK_CONFIGURATIONS.find(
                            (truck) => truck.name === value,
                          );
                          if (selectedTruck) {
                            if (selectedTruck.name === "Custom") {
                              // For custom vehicles, don't pre-fill capacity and payload
                              setTruckConfig({
                                name: selectedTruck.name,
                                capacity: 0,
                                payload: 0,
                                length: 0,
                                width: 0,
                                height: 0,
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
                              {truck.name === "Custom"
                                ? "Custom Vehicle"
                                : `${truck.name} (${truck.capacity} yd³, ${truck.payload} tons)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {truckConfig.name === "Custom" && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800">
                          Custom Vehicle Dimensions (Optional)
                        </h4>
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
                                const calculatedCapacity =
                                  length && width && height
                                    ? (length * width * height) / 27
                                    : truckConfig.capacity; // convert cubic feet to cubic yards

                                setTruckConfig({
                                  ...truckConfig,
                                  length,
                                  capacity: calculatedCapacity,
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
                                const calculatedCapacity =
                                  length && width && height
                                    ? (length * width * height) / 27
                                    : truckConfig.capacity;

                                setTruckConfig({
                                  ...truckConfig,
                                  width,
                                  capacity: calculatedCapacity,
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
                                const calculatedCapacity =
                                  length && width && height
                                    ? (length * width * height) / 27
                                    : truckConfig.capacity;

                                setTruckConfig({
                                  ...truckConfig,
                                  height,
                                  capacity: calculatedCapacity,
                                });
                              }}
                            />
                          </div>
                        </div>
                        {truckConfig.length &&
                          truckConfig.width &&
                          truckConfig.height && (
                            <div className="text-sm text-blue-700 bg-blue-100 p-2 rounded">
                              Calculated capacity:{" "}
                              {(
                                (truckConfig.length *
                                  truckConfig.width *
                                  truckConfig.height) /
                                27
                              ).toFixed(1)}{" "}
                              yd³
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
                          onChange={(e) =>
                            setTruckConfig({
                              ...truckConfig,
                              capacity: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="payload">Payload (tons)</Label>
                        <Input
                          id="payload"
                          type="number"
                          step="0.1"
                          value={truckConfig.payload ?? 0}
                          onChange={(e) =>
                            setTruckConfig({
                              ...truckConfig,
                              payload: Number(e.target.value),
                            })
                          }
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
                        onValueChange={(value) =>
                          setConfig({
                            ...config,
                            useTonRate: value === "ton",
                          })
                        }
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
                          Dump Rate ($
                          {config.useTonRate ? "per ton" : "per yd³"})
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            id="dumpRate"
                            type="number"
                            className="pl-8"
                            value={
                              config.useTonRate
                                ? (config.dumpRatePerTon ?? 85)
                                : (config.dumpRatePerCubicYard ?? 45)
                            }
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                ...(config.useTonRate
                                  ? { dumpRatePerTon: Number(e.target.value) }
                                  : {
                                      dumpRatePerCubicYard: Number(
                                        e.target.value,
                                      ),
                                    }),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="laborRate">
                          Manpower Rate ($/hour)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            id="laborRate"
                            type="number"
                            className="pl-8"
                            value={config.laborRatePerHour ?? 25}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                laborRatePerHour: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          For calculating worker wages (expense only)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="removalRate">
                          Removal Rate ($/yd³)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            id="removalRate"
                            type="number"
                            className="pl-8"
                            value={config.removalRatePerCubicYard ?? 35}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                removalRatePerCubicYard: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                        <Input
                          id="profitMargin"
                          type="number"
                          value={config.profitMargin ?? 35}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              profitMargin: Number(e.target.value),
                            })
                          }
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
                        <Label htmlFor="distance" className="text-yellow-700">
                          Distance to Dump (miles)
                        </Label>
                        <Input
                          id="distance"
                          type="number"
                          value={estimate.distance ?? 0}
                          onChange={(e) =>
                            setEstimate({
                              ...estimate,
                              distance: Number(e.target.value),
                            })
                          }
                          className="border-yellow-300 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="averageMpg" className="text-yellow-700">
                          Vehicle MPG
                        </Label>
                        <Input
                          id="averageMpg"
                          type="number"
                          step="0.1"
                          value={estimate.averageMpg ?? 12}
                          onChange={(e) =>
                            setEstimate({
                              ...estimate,
                              averageMpg: Number(e.target.value),
                            })
                          }
                          className="border-yellow-300 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fuelPrice" className="text-yellow-700">
                          Fuel Price ($/gallon)
                        </Label>
                        <Input
                          id="fuelPrice"
                          type="number"
                          step="0.01"
                          value={estimate.fuelPricePerGallon ?? 3.5}
                          onChange={(e) =>
                            setEstimate({
                              ...estimate,
                              fuelPricePerGallon: Number(e.target.value),
                            })
                          }
                          className="border-yellow-300 focus:border-yellow-500"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="walkingDistance"
                          className="text-yellow-700"
                        >
                          Walking Distance (feet)
                        </Label>
                        <Input
                          id="walkingDistance"
                          type="number"
                          value={estimate.walkingDistance ?? 50}
                          onChange={(e) =>
                            setEstimate({
                              ...estimate,
                              walkingDistance: Number(e.target.value),
                            })
                          }
                          className="border-yellow-300 focus:border-yellow-500"
                        />
                      </div>
                    </div>

                    {/* Fuel calculation preview */}
                    {estimate.distance > 0 && totals.tripsNeeded > 0 && (
                      <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-300">
                        <div className="text-sm text-yellow-800">
                          <div>
                            Total Miles: {estimate.distance} × 2 (round trip) ×{" "}
                            {totals.tripsNeeded} trips ={" "}
                            {estimate.distance * 2 * totals.tripsNeeded} miles
                          </div>
                          <div>
                            Fuel Needed:{" "}
                            {(
                              (estimate.distance * 2 * totals.tripsNeeded) /
                              estimate.averageMpg
                            ).toFixed(1)}{" "}
                            gallons
                          </div>
                          <div>
                            Fuel Cost:{" "}
                            {(
                              ((estimate.distance * 2 * totals.tripsNeeded) /
                                estimate.averageMpg) *
                              estimate.fuelPricePerGallon
                            ).toFixed(2)}{" "}
                            @ ${estimate.fuelPricePerGallon}/gal
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Fees */}
                  <div>
                    <Label
                      htmlFor="additionalFees"
                      className="text-gray-700 font-medium"
                    >
                      Additional Fees ($)
                    </Label>
                    <Input
                      id="additionalFees"
                      type="number"
                      value={estimate.additionalFees ?? 0}
                      onChange={(e) =>
                        setEstimate({
                          ...estimate,
                          additionalFees: Number(e.target.value),
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  {/* Steps Configuration */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hasSteps"
                        checked={estimate.hasSteps}
                        onChange={(e) =>
                          setEstimate({
                            ...estimate,
                            hasSteps: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <Label
                        htmlFor="hasSteps"
                        className="text-gray-700 font-medium"
                      >
                        Job involves steps or stairs
                      </Label>
                    </div>

                    {estimate.hasSteps && (
                      <div className="grid grid-cols-2 gap-4 ml-6">
                        <div>
                          <Label htmlFor="numberOfSteps">Number of Steps</Label>
                          <Input
                            id="numberOfSteps"
                            type="number"
                            value={estimate.numberOfSteps ?? 0}
                            onChange={(e) =>
                              setEstimate({
                                ...estimate,
                                numberOfSteps: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="percentageRequiringSteps">
                            % of Items Using Steps
                          </Label>
                          <Input
                            id="percentageRequiringSteps"
                            type="number"
                            max="100"
                            value={estimate.percentageRequiringSteps ?? 0}
                            onChange={(e) =>
                              setEstimate({
                                ...estimate,
                                percentageRequiringSteps: Number(
                                  e.target.value,
                                ),
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estimate" className="space-y-6">
              {/* Cost Breakdown - Moved to Top */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-yellow-50">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    Professional Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {jobItems.length > 0 ? (
                        <div className="flex justify-between">
                          <span>
                            Line Item Costs ({jobItems.length} item types):
                          </span>
                          <span className="font-medium">
                            ${totals.totalLineItemCosts.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span>
                              Removal Fee ({totals.totalVolume.toFixed(1)} yd³):
                            </span>
                            <span className="font-medium">
                              ${totals.removalFee.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              Dump Fee (
                              {config.useTonRate
                                ? `${totals.totalWeight.toFixed(2)} tons`
                                : `${totals.totalVolume.toFixed(1)} yd³`}
                              ):
                            </span>
                            <span className="font-medium">
                              ${totals.dumpFee.toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span>
                          Labor ({(totals.totalLoadingTime / 60).toFixed(1)}h):
                        </span>
                        <span className="font-medium">
                          ${totals.laborCost.toFixed(2)}
                        </span>
                      </div>
                      <div className="ml-4 text-sm text-muted-foreground">
                        <div>
                          • Loading: {Math.ceil(totals.baseLoadingTime)}min
                        </div>
                        <div>• Walking: {Math.ceil(totals.walkingTime)}min</div>
                        {totals.stepsTime > 0 && (
                          <div>• Steps: {Math.ceil(totals.stepsTime)}min</div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Fuel ({estimate.distance * 2 * totals.tripsNeeded} mi,{" "}
                          {(
                            (estimate.distance * 2 * totals.tripsNeeded) /
                            estimate.averageMpg
                          ).toFixed(1)}{" "}
                          gal):
                        </span>
                        <span className="font-medium">
                          ${totals.fuelCost.toFixed(2)}
                        </span>
                      </div>
                      {totals.tripSurcharge > 0 && (
                        <div className="flex justify-between">
                          <span>Additional Trip Fee:</span>
                          <span className="font-medium">
                            ${totals.tripSurcharge.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Additional Fees:</span>
                        <span className="font-medium">
                          ${estimate.additionalFees.toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">
                          ${totals.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit ({config.profitMargin}%):</span>
                        <span className="font-medium text-green-600">
                          ${totals.profitAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-xl p-8 text-white shadow-2xl">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative z-10 text-center">
                        <div className="mb-4">
                          <div className="text-sm text-green-100 mb-2">
                            💰 Total Job Price
                          </div>
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
                              <span className="font-bold text-lg">
                                {totals.totalWeight.toFixed(2)} tons
                              </span>
                            </div>
                            <div className="text-xs text-blue-100">
                              Total Weight
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Package className="w-4 h-4 text-yellow-300" />
                              <span className="font-bold text-lg">
                                {totals.totalVolume.toFixed(1)} yd³
                              </span>
                            </div>
                            <div className="text-xs text-blue-100">
                              Total Volume
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-yellow-300" />
                              <span className="font-bold text-lg">
                                {Math.ceil(totals.totalLoadingTime)}min
                              </span>
                            </div>
                            <div className="text-xs text-blue-100">
                              Labor Time
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Truck className="w-4 h-4 text-yellow-300" />
                              <span className="font-bold text-lg">
                                {totals.tripsNeeded} trip
                                {totals.tripsNeeded > 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="text-xs text-blue-100">
                              Trips Needed
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Button
                            className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-6 py-3 shadow-lg flex-1"
                            onClick={() => {
                              const quote = `DEBRIS REMOVAL ESTIMATE\n\nTotal Price: $${totals.total.toFixed(2)}\n\nItems: ${jobItems.length} types, ${jobItems.reduce((sum, item) => sum + item.quantity, 0)} total\nWeight: ${totals.totalWeight.toFixed(2)} tons\nVolume: ${totals.totalVolume.toFixed(1)} cubic yards\nTrips: ${totals.tripsNeeded}\n\nGenerated by WasteFinder Calculator`;
                              navigator.clipboard.writeText(quote);
                              alert("Quote copied to clipboard! 📋");
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

              {/* Job Items - Full Width Below Cost Breakdown */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Calculator className="w-5 h-5" />
                    </div>
                    🛠️ Job Items ({jobItems.length} types,{" "}
                    {jobItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    total)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Item Library Integration */}
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        📦 Add Items from Library
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Search Input */}
                        <div>
                          <Label htmlFor="searchItems">🔍 Search Items</Label>
                          <Input
                            id="searchItems"
                            type="text"
                            placeholder="Type to search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-blue-300 focus:border-blue-500"
                          />
                        </div>

                        {/* Category Filter */}
                        <div>
                          <Label>Filter by Category</Label>
                          <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                          >
                            <SelectTrigger className="border-blue-300 focus:border-blue-500">
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
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                          {(searchTerm || selectedCategory !== "All") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("All");
                              }}
                              className="w-full border-blue-300 text-blue-600 hover:bg-blue-100"
                            >
                              🗑️ Clear Filters
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                        {filteredItems.length === 0 ? (
                          <div className="col-span-full text-center py-8 text-muted-foreground">
                            No items found matching your search
                          </div>
                        ) : (
                          filteredItems.map((item) => {
                            // Function to get appropriate icon for each item type
                            const getItemIcon = (
                              itemName: string,
                              category: string,
                            ) => {
                              const name = itemName.toLowerCase();
                              const id = item.id;

                              // Hot Tubs & Spas
                              if (id === "hot_tub_small") return "🛁";
                              if (id === "hot_tub_large") return "♨️";

                              // Living Room Furniture
                              if (id === "sectional_couch") return "🛋️";
                              if (id === "standard_couch") return "🛋️";
                              if (id === "reclining_couch") return "💺";
                              if (id === "sofa_bed") return "🛏️";
                              if (id === "recliner") return "💺";
                              if (id === "coffee_table") return "🪑";
                              if (id === "entertainment_center") return "📺";

                              // Bedroom Furniture
                              if (id === "mattress_set_twin") return "🛏️";
                              if (id === "mattress_set_full") return "🛏️";
                              if (id === "mattress_set_queen") return "🛏️";
                              if (id === "mattress_set_king") return "🛏️";
                              if (id === "bed_frame") return "🛏️";
                              if (id === "dresser") return "🗄️";
                              if (id === "nightstand") return "🕯️";
                              if (id === "armoire") return "👔";

                              // Dining Room Furniture
                              if (id === "dining_table") return "🍽️";
                              if (id === "dining_chairs") return "🪑";
                              if (id === "china_cabinet") return "🏺";

                              // Office Furniture
                              if (id === "office_desk") return "💼";
                              if (id === "file_cabinet") return "🗃️";
                              if (id === "bookshelf") return "📚";

                              // Major Appliances
                              if (id === "refrigerator") return "❄️";
                              if (id === "refrigerator_large") return "🧊";
                              if (id === "washer") return "🧺";
                              if (id === "dryer") return "🌪️";
                              if (id === "stove") return "🔥";
                              if (id === "dishwasher") return "🍽️";
                              if (id === "freezer_chest") return "📦";
                              if (id === "freezer_upright") return "🧊";
                              if (id === "water_heater") return "♨️";

                              // Electronics & Equipment
                              if (id === "tv_large") return "📺";
                              if (id === "tv_medium") return "📺";
                              if (id === "computer_setup") return "💻";
                              if (id === "exercise_equipment") return "💪";
                              if (id === "piano_upright") return "🎹";
                              if (id === "piano_baby_grand") return "����";

                              // Construction & Renovation
                              if (id === "drywall") return "⬜";
                              if (id === "flooring") return "🟫";
                              if (id === "lumber") return "🪵";
                              if (id === "shingles") return "🏠";
                              if (id === "concrete_debris") return "🧱";
                              if (id === "brick_debris") return "🧱";

                              // Bathroom Fixtures
                              if (id === "bathtub") return "🛁";
                              if (id === "toilet") return "🚽";
                              if (id === "vanity") return "🪞";

                              // Outdoor & Yard Items
                              if (id === "patio_furniture_set") return "🏡";
                              if (id === "lawn_mower") return "🚜";
                              if (id === "grill") return "🍖";
                              if (id === "shed_contents") return "🏠";

                              // Bulk Items
                              if (id === "household_boxes") return "📦";
                              if (id === "clothing_bags") return "👕";
                              if (id === "mixed_debris") return "🗑️";
                              if (id === "yard_waste") return "🍃";

                              return "📋"; // default icon
                            };

                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors shadow-sm"
                                onClick={() => addJobItem(item)}
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <div className="text-2xl">
                                    {getItemIcon(item.name, item.category)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-blue-800 text-sm">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-blue-600">
                                      <Badge
                                        variant="outline"
                                        className="mr-1 text-xs border-blue-300"
                                      >
                                        {item.category}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-blue-500 mt-1">
                                      {Math.round(item.weightPerItem * 2000)}lbs
                                      • {item.volumePerItem}yd³ •{" "}
                                      {item.loadingTimePerItem}min
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="ml-2 border-blue-300 text-blue-600 hover:bg-blue-200"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Added Job Items - Full Width */}
                    <div className="space-y-3">
                      {jobItems.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                          <p className="text-blue-600 font-medium">
                            Add items from the library above to build your job
                          </p>
                          <p className="text-sm text-blue-500 mt-2">
                            Click on any item to add it to your job
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Summary Header */}
                          <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg border border-blue-300">
                            <span className="text-sm text-blue-700 font-medium">
                              📊 Total Weight: {totals.totalWeight.toFixed(2)}{" "}
                              tons | Volume: {totals.totalVolume.toFixed(1)} yd³
                              | Items:{" "}
                              {jobItems.reduce(
                                (sum, item) => sum + item.quantity,
                                0,
                              )}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setJobItems([])}
                              className="border-blue-300 text-blue-600 hover:bg-blue-200"
                            >
                              Clear All
                            </Button>
                          </div>

                          {/* Items List - Full Width */}
                          <div className="space-y-3">
                            {jobItems.map((jobItem) => {
                              const currentWeight =
                                jobItem.customWeight ??
                                jobItem.debrisItem?.weightPerItem ??
                                0;
                              const currentVolume =
                                jobItem.customVolume ??
                                jobItem.debrisItem?.volumePerItem ??
                                0;
                              const currentLoadingTime =
                                jobItem.customLoadingTime ??
                                jobItem.debrisItem?.loadingTimePerItem ??
                                0;

                              // Calculate default line item cost for reference only
                              const itemVolumeCost =
                                currentVolume *
                                jobItem.quantity *
                                config.removalRatePerCubicYard;
                              const itemDumpCost = config.useTonRate
                                ? currentWeight *
                                  jobItem.quantity *
                                  config.dumpRatePerTon
                                : currentVolume *
                                  jobItem.quantity *
                                  config.dumpRatePerCubicYard;
                              const defaultLineItemCost =
                                itemVolumeCost + itemDumpCost;

                              // Use custom line item cost if set (manual override), otherwise use calculated cost
                              const lineItemCost =
                                jobItem.customLineItemCost !== undefined
                                  ? jobItem.customLineItemCost
                                  : defaultLineItemCost;

                              return (
                                <div
                                  key={jobItem.debrisItem.id}
                                  className="border border-blue-200 rounded-lg bg-blue-50/50 p-4 shadow-sm"
                                >
                                  {/* Item Header */}
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="font-medium text-blue-800">
                                        {jobItem.debrisItem.name}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="text-xs border-blue-300 text-blue-600"
                                      >
                                        {jobItem.debrisItem.category}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          updateJobItemQuantity(
                                            jobItem.debrisItem.id,
                                            jobItem.quantity - 1,
                                          )
                                        }
                                        className="border-blue-300 text-blue-600 hover:bg-blue-100"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={jobItem.quantity}
                                        onChange={(e) =>
                                          updateJobItemQuantity(
                                            jobItem.debrisItem.id,
                                            Math.max(1, Number(e.target.value)),
                                          )
                                        }
                                        className="w-16 text-center border-blue-300 focus:border-blue-500"
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          updateJobItemQuantity(
                                            jobItem.debrisItem.id,
                                            jobItem.quantity + 1,
                                          )
                                        }
                                        className="border-blue-300 text-blue-600 hover:bg-blue-100"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          updateJobItemQuantity(
                                            jobItem.debrisItem.id,
                                            0,
                                          )
                                        }
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Editable Properties with Line Item Cost */}
                                  <div className="grid grid-cols-5 gap-3">
                                    <div>
                                      <Label
                                        htmlFor={`weight-${jobItem.debrisItem.id}`}
                                        className="text-xs text-blue-700"
                                      >
                                        Weight (lbs)
                                      </Label>
                                      <Input
                                        id={`weight-${jobItem.debrisItem.id}`}
                                        type="number"
                                        step="1"
                                        value={Math.round(currentWeight * 2000)} // Convert tons to pounds
                                        onChange={(e) =>
                                          updateJobItemProperty(
                                            jobItem.debrisItem.id,
                                            "customWeight",
                                            Number(e.target.value) / 2000, // Convert pounds back to tons
                                          )
                                        }
                                        className="h-8 text-xs border-blue-300 focus:border-blue-500"
                                        placeholder={Math.round(
                                          jobItem.debrisItem.weightPerItem *
                                            2000,
                                        ).toString()}
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor={`volume-${jobItem.debrisItem.id}`}
                                        className="text-xs text-blue-700"
                                      >
                                        Volume (yd³)
                                      </Label>
                                      <Input
                                        id={`volume-${jobItem.debrisItem.id}`}
                                        type="number"
                                        step="0.1"
                                        value={currentVolume}
                                        onChange={(e) =>
                                          updateJobItemProperty(
                                            jobItem.debrisItem.id,
                                            "customVolume",
                                            Number(e.target.value),
                                          )
                                        }
                                        className="h-8 text-xs border-blue-300 focus:border-blue-500"
                                        placeholder={jobItem.debrisItem.volumePerItem.toString()}
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor={`time-${jobItem.debrisItem.id}`}
                                        className="text-xs text-blue-700"
                                      >
                                        Load Time (min)
                                      </Label>
                                      <Input
                                        id={`time-${jobItem.debrisItem.id}`}
                                        type="number"
                                        step="0.5"
                                        value={currentLoadingTime}
                                        onChange={(e) =>
                                          updateJobItemProperty(
                                            jobItem.debrisItem.id,
                                            "customLoadingTime",
                                            Number(e.target.value),
                                          )
                                        }
                                        className="h-8 text-xs border-blue-300 focus:border-blue-500"
                                        placeholder={jobItem.debrisItem.loadingTimePerItem.toString()}
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor={`cost-${jobItem.debrisItem.id}`}
                                        className="text-xs text-blue-700"
                                      >
                                        Price Per Item ($)
                                      </Label>
                                      <div className="relative">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                                          $
                                        </span>
                                        <Input
                                          id={`cost-${jobItem.debrisItem.id}`}
                                          type="text"
                                          value={
                                            jobItem.customLineItemCost !==
                                            undefined
                                              ? (
                                                  jobItem.customLineItemCost /
                                                  jobItem.quantity
                                                ).toFixed(2)
                                              : ""
                                          }
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow empty value
                                            if (value === "") {
                                              updateJobItemProperty(
                                                jobItem.debrisItem.id,
                                                "customLineItemCost",
                                                undefined,
                                              );
                                              return;
                                            }

                                            // Allow typing decimal numbers
                                            if (/^\d*\.?\d*$/.test(value)) {
                                              const numValue = parseFloat(value);
                                              if (!isNaN(numValue) && numValue >= 0) {
                                                // Store total cost (per item price × quantity)
                                                updateJobItemProperty(
                                                  jobItem.debrisItem.id,
                                                  "customLineItemCost",
                                                  numValue * jobItem.quantity,
                                                );
                                              }
                                            }
                                          }}
                                          className="h-8 text-xs border-blue-300 focus:border-blue-500 pl-6"
                                          placeholder={`${(defaultLineItemCost / jobItem.quantity).toFixed(2)}`}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor={`total-${jobItem.debrisItem.id}`}
                                        className="text-xs text-blue-700"
                                      >
                                        Total Price ($)
                                      </Label>
                                      <div className="relative">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
                                          $
                                        </span>
                                        <Input
                                          id={`total-${jobItem.debrisItem.id}`}
                                          type="number"
                                          step="0.01"
                                          value={
                                            jobItem.customLineItemCost !==
                                            undefined
                                              ? jobItem.customLineItemCost.toFixed(
                                                  2,
                                                )
                                              : ""
                                          }
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "") {
                                              updateJobItemProperty(
                                                jobItem.debrisItem.id,
                                                "customLineItemCost",
                                                undefined,
                                              );
                                            } else {
                                              // Allow decimal input and validate on blur
                                              const numValue = parseFloat(value);
                                              if (!isNaN(numValue) && numValue >= 0) {
                                                // Store total cost directly
                                                updateJobItemProperty(
                                                  jobItem.debrisItem.id,
                                                  "customLineItemCost",
                                                  numValue,
                                                );
                                              }
                                            }
                                          }}
                                          className="h-8 text-xs border-blue-300 focus:border-blue-500 pl-6"
                                          placeholder={`${defaultLineItemCost.toFixed(2)}`}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Totals */}
                                  <div className="mt-2 text-xs text-blue-600">
                                    Totals:{" "}
                                    {Math.round(
                                      currentWeight * jobItem.quantity * 2000,
                                    )}{" "}
                                    lbs •{" "}
                                    {(currentVolume * jobItem.quantity).toFixed(
                                      1,
                                    )}{" "}
                                    yd³ •{" "}
                                    {currentLoadingTime * jobItem.quantity} min
                                    {(jobItem.customWeight ||
                                      jobItem.customVolume ||
                                      jobItem.customLoadingTime ||
                                      jobItem.customLineItemCost) && (
                                      <span className="ml-2 text-orange-600 font-medium">
                                        (Custom values ✏️)
                                      </span>
                                    )}
                                  </div>

                                  {/* Reset to Defaults */}
                                  {(jobItem.customWeight ||
                                    jobItem.customVolume ||
                                    jobItem.customLoadingTime ||
                                    jobItem.customLineItemCost) && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setJobItems(
                                          jobItems.map((item) =>
                                            item.debrisItem.id ===
                                            jobItem.debrisItem.id
                                              ? {
                                                  ...item,
                                                  customWeight: undefined,
                                                  customVolume: undefined,
                                                  customLoadingTime: undefined,
                                                  customLineItemCost: undefined,
                                                }
                                              : item,
                                          ),
                                        );
                                      }}
                                      className="mt-2 h-6 text-xs text-blue-600 hover:bg-blue-100"
                                    >
                                      �� Reset to Defaults
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
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
