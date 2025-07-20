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

      if (searchQuery && /^\d{5}$/.test(searchQuery)) {
        params.set("zipCode", searchQuery);
        params.set("radius", searchRadius.toString());
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

      // Call backend API
      const response = await fetch(`/api/locations?${params.toString()}`);
      const data: LocationSearchResponse = await response.json();

      if (data.success) {
        setLocations(data.data);
        setSearchLocation(data.searchLocation || null);
        setSearchMessage(data.message);
      } else {
        console.error("API error:", data);
        setLocations([]);
        setSearchLocation(null);
        setSearchMessage("Error loading locations");
      }
    } catch (error) {
      console.error("Error loading locations:", error);
      setLocations([]);
      setSearchLocation(null);
      setSearchMessage("Error loading locations");
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
