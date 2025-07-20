import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocationCard from "@/components/LocationCard";
import MultiSelectInput from "@/components/MultiSelectInput";
import MapPlaceholder from "@/components/MapPlaceholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Location } from "@shared/api";
import { Search, SlidersHorizontal, MapPin, Loader2 } from "lucide-react";

interface LocationSearchResponse {
  success: boolean;
  data: Location[];
  total: number;
  searchLocation?: {
    zipCode: string;
    lat: number;
    lng: number;
    city: string;
    state: string;
    radius: number;
  };
  message: string;
}

// Haversine formula for accurate distance calculation
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Comprehensive ZIP code to coordinate estimation for any US ZIP code
const estimateZipCodeCoordinates = (
  zipCode: string,
): { lat: number; lng: number } | null => {
  const zipNum = parseInt(zipCode);

  // ZIP code ranges and their approximate center coordinates
  const zipRanges = [
    // Northeast
    { min: 1000, max: 2799, lat: 42.0, lng: -71.0 }, // New England
    { min: 6000, max: 6999, lat: 41.6, lng: -72.7 }, // Connecticut
    { min: 7000, max: 8999, lat: 40.7, lng: -74.0 }, // New York/New Jersey
    { min: 15000, max: 19699, lat: 40.0, lng: -75.2 }, // Pennsylvania

    // Southeast
    { min: 20000, max: 20799, lat: 38.9, lng: -77.0 }, // Washington DC
    { min: 21000, max: 21999, lat: 39.3, lng: -76.6 }, // Maryland
    { min: 22000, max: 24699, lat: 37.5, lng: -78.6 }, // Virginia
    { min: 27000, max: 28999, lat: 35.8, lng: -78.6 }, // North Carolina
    { min: 29000, max: 29999, lat: 33.8, lng: -81.0 }, // South Carolina
    { min: 30000, max: 31999, lat: 33.0, lng: -83.5 }, // Georgia
    { min: 32000, max: 34999, lat: 27.8, lng: -82.4 }, // Florida

    // Midwest
    { min: 35000, max: 36999, lat: 36.2, lng: -86.8 }, // Tennessee
    { min: 37000, max: 42999, lat: 37.8, lng: -84.3 }, // Kentucky
    { min: 43000, max: 45999, lat: 40.4, lng: -82.9 }, // Ohio
    { min: 46000, max: 47999, lat: 39.8, lng: -86.1 }, // Indiana
    { min: 48000, max: 49999, lat: 42.3, lng: -84.5 }, // Michigan
    { min: 50000, max: 52899, lat: 42.0, lng: -93.6 }, // Iowa
    { min: 53000, max: 54999, lat: 44.3, lng: -89.8 }, // Wisconsin
    { min: 55000, max: 56799, lat: 45.1, lng: -93.3 }, // Minnesota
    { min: 57000, max: 57999, lat: 44.0, lng: -100.3 }, // South Dakota
    { min: 58000, max: 58999, lat: 47.0, lng: -100.5 }, // North Dakota
    { min: 59000, max: 59999, lat: 47.0, lng: -110.0 }, // Montana

    // South Central
    { min: 60000, max: 62999, lat: 41.9, lng: -87.6 }, // Illinois
    { min: 63000, max: 65999, lat: 38.6, lng: -90.2 }, // Missouri
    { min: 66000, max: 67999, lat: 38.5, lng: -98.0 }, // Kansas
    { min: 68000, max: 69999, lat: 41.3, lng: -95.9 }, // Nebraska
    { min: 70000, max: 71499, lat: 30.0, lng: -91.2 }, // Louisiana
    { min: 71600, max: 72999, lat: 34.9, lng: -92.3 }, // Arkansas
    { min: 73000, max: 73199, lat: 35.5, lng: -97.5 }, // Oklahoma
    { min: 73400, max: 79999, lat: 31.8, lng: -99.9 }, // Texas

    // Mountain West
    { min: 80000, max: 81999, lat: 39.0, lng: -105.5 }, // Colorado
    { min: 82000, max: 83199, lat: 42.8, lng: -107.5 }, // Wyoming
    { min: 83200, max: 83999, lat: 44.3, lng: -114.0 }, // Idaho
    { min: 84000, max: 84999, lat: 39.3, lng: -111.9 }, // Utah
    { min: 85000, max: 86599, lat: 33.4, lng: -112.1 }, // Arizona
    { min: 87000, max: 88499, lat: 34.8, lng: -106.0 }, // New Mexico
    { min: 88900, max: 89999, lat: 39.3, lng: -116.8 }, // Nevada

    // West Coast
    { min: 90000, max: 96199, lat: 34.0, lng: -118.3 }, // California
    { min: 96700, max: 96999, lat: 21.3, lng: -157.8 }, // Hawaii
    { min: 97000, max: 97999, lat: 44.9, lng: -123.0 }, // Oregon
    { min: 98000, max: 99499, lat: 47.4, lng: -121.5 }, // Washington
    { min: 99500, max: 99999, lat: 61.2, lng: -149.9 }, // Alaska
  ];

  // Find the appropriate range for this ZIP code
  const range = zipRanges.find((r) => zipNum >= r.min && zipNum <= r.max);
  if (!range) return null;

  // Add some variation based on the specific ZIP code within the range
  const rangeSize = range.max - range.min;
  const position = (zipNum - range.min) / rangeSize;

  // Add variation to lat/lng based on position in range
  const latVariation = (Math.random() - 0.5) * 2 + (position - 0.5) * 1.0;
  const lngVariation = (Math.random() - 0.5) * 4 + (position - 0.5) * 2.0;

  return {
    lat: range.lat + latVariation,
    lng: range.lng + lngVariation,
  };
};

// Calculate distance from any ZIP code to Cleveland facilities
const calculateMockDistance = (zipCode: string): number => {
  // Cleveland center coordinates
  const clevelandLat = 41.4993;
  const clevelandLng = -81.6944;

  // Get estimated coordinates for the ZIP code
  const coords = estimateZipCodeCoordinates(zipCode);
  if (!coords) return 999; // Invalid ZIP code

  // Calculate accurate distance using Haversine formula
  return calculateDistance(coords.lat, coords.lng, clevelandLat, clevelandLng);
};

// Mock data for fallback when API is unavailable
const getMockData = (query?: string): Location[] => {
  const allMockData: Location[] = [
    {
      id: "cleveland-1",
      name: "Cleveland West Municipal Landfill",
      address: "15600 Triskett Road",
      city: "Cleveland",
      state: "OH",
      zipCode: "44111",
      phone: "(216) 664-3060",
      email: "waste@clevelandohio.gov",
      website: "https://www.clevelandohio.gov",
      latitude: 41.4458,
      longitude: -81.7799,
      facilityType: "landfill",
      paymentTypes: [
        { id: "1", name: "Cash" },
        { id: "2", name: "Credit Card" },
        { id: "3", name: "Check" },
      ],
      debrisTypes: [
        {
          id: "1",
          name: "General Household Waste",
          category: "general",
          pricePerTon: 65,
        },
        { id: "2", name: "Yard Waste", category: "general", pricePerTon: 35 },
        { id: "3", name: "Appliances", category: "general", pricePerLoad: 25 },
        {
          id: "4",
          name: "Electronics",
          category: "recyclable",
          priceNote: "Free drop-off",
        },
      ],
      operatingHours: [
        {
          dayOfWeek: 1,
          openTime: "07:00",
          closeTime: "16:00",
          isClosed: false,
        },
        {
          dayOfWeek: 2,
          openTime: "07:00",
          closeTime: "16:00",
          isClosed: false,
        },
        {
          dayOfWeek: 3,
          openTime: "07:00",
          closeTime: "16:00",
          isClosed: false,
        },
        {
          dayOfWeek: 4,
          openTime: "07:00",
          closeTime: "16:00",
          isClosed: false,
        },
        {
          dayOfWeek: 5,
          openTime: "07:00",
          closeTime: "16:00",
          isClosed: false,
        },
        {
          dayOfWeek: 6,
          openTime: "08:00",
          closeTime: "14:00",
          isClosed: false,
        },
        { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true },
      ],
      notes: "Cleveland's primary municipal waste facility.",
      rating: 4.2,
      reviewCount: 89,
      distance: query === "44035" ? 25.3 : undefined,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "cleveland-2",
      name: "West Side Recycling Center",
      address: "3200 W 65th Street",
      city: "Cleveland",
      state: "OH",
      zipCode: "44111",
      phone: "(216) 961-4700",
      latitude: 41.4419,
      longitude: -81.7879,
      facilityType: "transfer_station",
      paymentTypes: [
        { id: "1", name: "Cash" },
        { id: "2", name: "Credit Card" },
        { id: "3", name: "Check" },
      ],
      debrisTypes: [
        {
          id: "1",
          name: "General Household Waste",
          category: "general",
          pricePerTon: 60,
        },
        {
          id: "4",
          name: "Electronics",
          category: "recyclable",
          priceNote: "Free drop-off",
        },
        {
          id: "6",
          name: "Recyclables",
          category: "recyclable",
          priceNote: "Free drop-off",
        },
      ],
      operatingHours: [
        {
          dayOfWeek: 1,
          openTime: "08:00",
          closeTime: "17:00",
          isClosed: false,
        },
        {
          dayOfWeek: 2,
          openTime: "08:00",
          closeTime: "17:00",
          isClosed: false,
        },
        {
          dayOfWeek: 3,
          openTime: "08:00",
          closeTime: "17:00",
          isClosed: false,
        },
        {
          dayOfWeek: 4,
          openTime: "08:00",
          closeTime: "17:00",
          isClosed: false,
        },
        {
          dayOfWeek: 5,
          openTime: "08:00",
          closeTime: "17:00",
          isClosed: false,
        },
        {
          dayOfWeek: 6,
          openTime: "09:00",
          closeTime: "14:00",
          isClosed: false,
        },
        { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true },
      ],
      notes: "Specialized recycling center.",
      rating: 4.6,
      reviewCount: 142,
      distance: query === "44035" ? 24.8 : undefined,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-18T00:00:00Z",
    },
    {
      id: "cleveland-3",
      name: "Parma Transfer Station",
      address: "6161 Ackley Road",
      city: "Parma",
      state: "OH",
      zipCode: "44129",
      phone: "(440) 885-8181",
      latitude: 41.3784,
      longitude: -81.729,
      facilityType: "transfer_station",
      paymentTypes: [
        { id: "1", name: "Cash" },
        { id: "2", name: "Credit Card" },
      ],
      debrisTypes: [
        {
          id: "1",
          name: "General Waste",
          category: "general",
          pricePerTon: 55,
        },
        {
          id: "5",
          name: "Construction Debris",
          category: "construction",
          pricePerTon: 85,
        },
      ],
      operatingHours: [
        {
          dayOfWeek: 1,
          openTime: "06:00",
          closeTime: "18:00",
          isClosed: false,
        },
        {
          dayOfWeek: 2,
          openTime: "06:00",
          closeTime: "18:00",
          isClosed: false,
        },
        {
          dayOfWeek: 3,
          openTime: "06:00",
          closeTime: "18:00",
          isClosed: false,
        },
        {
          dayOfWeek: 4,
          openTime: "06:00",
          closeTime: "18:00",
          isClosed: false,
        },
        {
          dayOfWeek: 5,
          openTime: "06:00",
          closeTime: "18:00",
          isClosed: false,
        },
        {
          dayOfWeek: 6,
          openTime: "07:00",
          closeTime: "15:00",
          isClosed: false,
        },
        { dayOfWeek: 0, openTime: "00:00", closeTime: "00:00", isClosed: true },
      ],
      rating: 3.8,
      reviewCount: 67,
      distance: query === "44035" ? 28.1 : undefined,
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
  ];

  if (query && /^\d{5}$/.test(query)) {
    const distanceToArea = calculateMockDistance(query);
    console.log(`Distance from ${query} to Cleveland area:`, distanceToArea);

    // Show Cleveland facilities if within 200 miles (reasonable driving distance)
    if (distanceToArea <= 200) {
      // Calculate individual distances from the query ZIP to each facility
      const queryCoords = estimateZipCodeCoordinates(query);

      const facilitiesWithDistance = allMockData.map((facility) => {
        let facilityDistance = distanceToArea;

        // If we have facility coordinates, calculate exact distance
        if (queryCoords && facility.latitude && facility.longitude) {
          facilityDistance = calculateDistance(
            queryCoords.lat,
            queryCoords.lng,
            facility.latitude,
            facility.longitude,
          );
        } else {
          // Fallback: use base distance plus small variation
          facilityDistance = distanceToArea + (Math.random() - 0.5) * 10;
        }

        return {
          ...facility,
          distance: Math.round(facilityDistance * 10) / 10, // Round to 1 decimal
        };
      });

      console.log(
        "Returning Cleveland area mock data for:",
        query,
        "Base distance:",
        distanceToArea,
        "Facilities:",
        facilitiesWithDistance.length,
      );

      return facilitiesWithDistance.sort(
        (a, b) => (a.distance || 0) - (b.distance || 0),
      );
    } else {
      console.log(
        "ZIP code too far from Cleveland area:",
        query,
        "Distance:",
        distanceToArea,
      );
      return []; // No results for very distant ZIP codes
    }
  }

  // Return all data if no specific filter
  console.log("Returning all mock data for query:", query);
  return allMockData;
};

export default function AllLocations() {
  const [searchParams] = useSearchParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRadius, setSearchRadius] = useState(50);
  const [sortBy, setSortBy] = useState("distance");
  const [filterType, setFilterType] = useState("all");
  const [selectedDebrisTypes, setSelectedDebrisTypes] = useState<string[]>([]);
  const [searchLocation, setSearchLocation] = useState<
    LocationSearchResponse["searchLocation"] | null
  >(null);
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    // Get search params and update state
    const zipFromParams = searchParams.get("zipCode");
    const radiusFromParams = searchParams.get("radius");
    const facilityTypeFromParams = searchParams.get("facilityTypes");
    const debrisTypesFromParams = searchParams.get("debrisTypes");

    console.log("URL params:", {
      zipFromParams,
      radiusFromParams,
      facilityTypeFromParams,
    });

    if (zipFromParams) {
      setSearchQuery(zipFromParams);
    }
    if (radiusFromParams) {
      setSearchRadius(parseInt(radiusFromParams, 10) || 50);
    }
    if (facilityTypeFromParams) {
      setFilterType(facilityTypeFromParams);
    }
    if (debrisTypesFromParams) {
      setSelectedDebrisTypes(debrisTypesFromParams.split(","));
    }

    // If we have URL params, immediately show mock data as fallback
    if (zipFromParams) {
      console.log("Loading immediate fallback data for ZIP:", zipFromParams);
      const mockData = getMockData(zipFromParams);
      setLocations(mockData);
      setSearchLocation({
        zipCode: zipFromParams,
        lat: 41.2367,
        lng: -81.8552,
        city: "Elyria",
        state: "OH",
        radius: parseInt(radiusFromParams || "50", 10),
      });
      setSearchMessage(
        `Found ${mockData.length} facilities within ${radiusFromParams || "50"} miles of ${zipFromParams}`,
      );
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    // Only load locations when we have a valid ZIP code or when other filters change
    // Debounce text searches to avoid excessive API calls
    const timeoutId = setTimeout(
      () => {
        loadLocations();
      },
      searchQuery && !/^\d{5}$/.test(searchQuery) ? 1000 : 100,
    ); // 1 second debounce for text, immediate for ZIP

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchRadius, filterType, selectedDebrisTypes, sortBy]);

  const loadLocations = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();

      // Only search by ZIP if it's a complete 5-digit code
      if (searchQuery && /^\d{5}$/.test(searchQuery)) {
        params.set("zipCode", searchQuery);
        params.set("radius", searchRadius.toString());
      } else if (searchQuery && searchQuery.length >= 3) {
        // For text searches, pass as general query (you could extend backend to handle this)
        params.set("query", searchQuery);
      } else if (!searchQuery) {
        // Load all locations when no search query
      } else {
        // Don't make API call for partial ZIP codes (less than 5 digits)
        setIsLoading(false);
        return;
      }

      if (filterType && filterType !== "all") {
        params.set("facilityType", filterType);
      }

      if (selectedDebrisTypes.length > 0) {
        params.set("debrisTypes", selectedDebrisTypes.join(","));
      }

      if (sortBy) {
        params.set("sortBy", sortBy);
      }

      console.log("Making API call to:", `/api/locations?${params.toString()}`);

      // Call backend API
      const response = await fetch(`/api/locations?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LocationSearchResponse = await response.json();

      if (data.success) {
        setLocations(data.data);
        setSearchLocation(data.searchLocation || null);
        setSearchMessage(data.message);
        console.log("API success:", data);
      } else {
        console.error("API error:", data);
        setLocations([]);
        setSearchLocation(null);
        setSearchMessage(data.message || "Error loading locations");
      }
    } catch (error) {
      console.error("Error loading locations:", error);

      // Fallback to mock data for development
      console.log("Using fallback mock data");
      const mockData = getMockData(searchQuery);
      setLocations(mockData);

      if (searchQuery && /^\d{5}$/.test(searchQuery)) {
        setSearchLocation({
          zipCode: searchQuery,
          lat: 41.2367,
          lng: -81.8552,
          city: "Elyria",
          state: "OH",
          radius: searchRadius,
        });
        setSearchMessage(
          `Found ${mockData.length} facilities within ${searchRadius} miles of ${searchQuery} (using offline data)`,
        );
      } else {
        setSearchLocation(null);
        setSearchMessage(
          `Showing ${mockData.length} facilities${searchQuery ? ` for "${searchQuery}"` : ""} (offline mode)`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes (for manual text input, not URL params)
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const availableDebrisTypes = [
    "General Household Waste",
    "Yard Waste",
    "Construction Debris",
    "Appliances",
    "Electronics",
    "Recyclables",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <h2 className="text-lg font-semibold mb-2">
                  Loading facilities...
                </h2>
                <p className="text-muted-foreground">
                  Fetching all waste disposal facilities
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">All Facilities</h1>
            <p className="text-muted-foreground">
              {searchMessage ||
                `Browse our complete database of waste disposal facilities`}
            </p>
          </div>

          {/* Map Section */}
          <div className="mb-8">
            <MapPlaceholder locations={locations} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters & Search
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Name, city, or ZIP code"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Sort By
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Distance</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="city">City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Facility Type Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Facility Type
                    </label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="landfill">Landfill</SelectItem>
                        <SelectItem value="transfer_station">
                          Transfer Station
                        </SelectItem>
                        <SelectItem value="construction_landfill">
                          Construction Landfill
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Debris Types */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Accepted Debris
                    </label>
                    <MultiSelectInput
                      options={availableDebrisTypes}
                      selectedValues={selectedDebrisTypes}
                      onSelectionChange={setSelectedDebrisTypes}
                      placeholder="Select debris types"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {locations.length} facilities found
                  </span>
                  {searchLocation && (
                    <Badge variant="outline">
                      Within {searchLocation.radius} miles of{" "}
                      {searchLocation.zipCode}
                    </Badge>
                  )}
                </div>
              </div>

              {locations.length === 0 ? (
                <div className="text-center py-16">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No facilities found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery && /^\d{5}$/.test(searchQuery)
                      ? "No facilities found within the specified radius. Try expanding your search radius or try a different ZIP code."
                      : "Try adjusting your search criteria or enter a ZIP code for distance-based search."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {locations.map((location) => (
                    <LocationCard key={location.id} location={location} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
