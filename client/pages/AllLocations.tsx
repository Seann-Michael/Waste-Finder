import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocationCard from "@/components/LocationCard";
import MultiSelectInput from "@/components/MultiSelectInput";
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

export default function AllLocations() {
  const [searchParams] = useSearchParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [filterType, setFilterType] = useState("all");
  const [selectedDebrisTypes, setSelectedDebrisTypes] = useState<string[]>([]);

  useEffect(() => {
    loadAllLocations();
  }, []);

  useEffect(() => {
    // Populate search query from URL params if present
    const zipFromParams = searchParams.get("zipCode");
    if (zipFromParams) {
      setSearchQuery(zipFromParams);
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSortLocations();
  }, [locations, searchQuery, sortBy, filterType, selectedDebrisTypes]);

  const loadAllLocations = async () => {
    setIsLoading(true);
    try {
      // Mock data including the new 44111 listing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockLocations: Location[] = [
        // Cleveland, OH (44111) location
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
            {
              id: "2",
              name: "Yard Waste",
              category: "general",
              pricePerTon: 35,
            },
            {
              id: "3",
              name: "Appliances",
              category: "general",
              pricePerLoad: 25,
            },
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
            {
              dayOfWeek: 0,
              openTime: "00:00",
              closeTime: "00:00",
              isClosed: true,
            },
          ],
          notes:
            "Cleveland's primary municipal waste facility. Accepts most household waste and recycling. Special drop-off events for hazardous materials.",
          rating: 4.2,
          reviewCount: 89,
          distance: 2.1,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z",
        },
        {
          id: "cleveland-2",
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
            {
              dayOfWeek: 0,
              openTime: "00:00",
              closeTime: "00:00",
              isClosed: true,
            },
          ],
          rating: 3.8,
          reviewCount: 67,
          distance: 8.4,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        },
        // Springfield, IL locations (existing)
        {
          id: "springfield-1",
          name: "Green Valley Municipal Landfill",
          address: "1234 Waste Management Drive",
          city: "Springfield",
          state: "IL",
          zipCode: "62701",
          phone: "(555) 123-4567",
          email: "info@greenvalley.gov",
          website: "https://greenvalley.gov",
          latitude: 39.7817,
          longitude: -89.6501,
          facilityType: "landfill",
          paymentTypes: [
            { id: "1", name: "Cash" },
            { id: "2", name: "Credit Card" },
          ],
          debrisTypes: [
            {
              id: "1",
              name: "General Waste",
              category: "general",
              pricePerTon: 60,
            },
            {
              id: "2",
              name: "Yard Waste",
              category: "general",
              pricePerTon: 30,
            },
          ],
          operatingHours: [
            {
              dayOfWeek: 1,
              openTime: "07:00",
              closeTime: "17:00",
              isClosed: false,
            },
            {
              dayOfWeek: 2,
              openTime: "07:00",
              closeTime: "17:00",
              isClosed: false,
            },
            {
              dayOfWeek: 3,
              openTime: "07:00",
              closeTime: "17:00",
              isClosed: false,
            },
            {
              dayOfWeek: 4,
              openTime: "07:00",
              closeTime: "17:00",
              isClosed: false,
            },
            {
              dayOfWeek: 5,
              openTime: "07:00",
              closeTime: "17:00",
              isClosed: false,
            },
            {
              dayOfWeek: 6,
              openTime: "08:00",
              closeTime: "15:00",
              isClosed: false,
            },
            {
              dayOfWeek: 0,
              openTime: "00:00",
              closeTime: "00:00",
              isClosed: true,
            },
          ],
          notes:
            "Accepts most household and commercial waste. Recycling available on-site.",
          rating: 4.5,
          reviewCount: 127,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z",
        },
        {
          id: "springfield-2",
          name: "Metro Transfer Station",
          address: "5678 Industrial Boulevard",
          city: "Springfield",
          state: "IL",
          zipCode: "62702",
          phone: "(555) 987-6543",
          latitude: 39.7567,
          longitude: -89.6301,
          facilityType: "transfer_station",
          paymentTypes: [
            { id: "1", name: "Cash" },
            { id: "3", name: "Check" },
          ],
          debrisTypes: [
            {
              id: "1",
              name: "General Waste",
              category: "general",
              pricePerTon: 55,
            },
            {
              id: "3",
              name: "Electronics",
              category: "recyclable",
              priceNote: "Free drop-off",
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
              closeTime: "16:00",
              isClosed: false,
            },
            {
              dayOfWeek: 0,
              openTime: "00:00",
              closeTime: "00:00",
              isClosed: true,
            },
          ],
          rating: 4.2,
          reviewCount: 89,
          distance: 5.7,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-10T00:00:00Z",
        },
        {
          id: "springfield-3",
          name: "Capitol Construction Landfill",
          address: "9012 Construction Way",
          city: "Springfield",
          state: "IL",
          zipCode: "62703",
          phone: "(555) 456-7890",
          latitude: 39.7317,
          longitude: -89.6701,
          facilityType: "construction_landfill",
          paymentTypes: [
            { id: "1", name: "Cash" },
            { id: "2", name: "Credit Card" },
            { id: "3", name: "Check" },
          ],
          debrisTypes: [
            {
              id: "4",
              name: "Construction Debris",
              category: "construction",
              pricePerTon: 95,
            },
            {
              id: "5",
              name: "Concrete",
              category: "construction",
              pricePerTon: 45,
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
              openTime: "00:00",
              closeTime: "00:00",
              isClosed: true,
            },
            {
              dayOfWeek: 0,
              openTime: "00:00",
              closeTime: "00:00",
              isClosed: true,
            },
          ],
          rating: 4.8,
          reviewCount: 156,
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-20T00:00:00Z",
        },
      ];

      setLocations(mockLocations);
    } catch (error) {
      console.error("Error loading locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortLocations = () => {
    let filtered = [...locations];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.zipCode.includes(searchQuery.trim()),
      );
    }

    // Filter by facility type
    if (filterType !== "all") {
      filtered = filtered.filter(
        (location) => location.facilityType === filterType,
      );
    }

    // Filter by debris types
    if (selectedDebrisTypes.length > 0) {
      filtered = filtered.filter((location) =>
        selectedDebrisTypes.some((selectedType) =>
          location.debrisTypes.some((debris) =>
            debris.name.toLowerCase().includes(selectedType.toLowerCase()),
          ),
        ),
      );
    }

    // Sort locations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return (a.distance || 999) - (b.distance || 999);
        case "city":
          return a.city.localeCompare(b.city);
        case "state":
          return a.state.localeCompare(b.state);
        default:
          return 0;
      }
    });

    setFilteredLocations(filtered);
  };

  const availableDebrisTypes = [
    "General Household Waste",
    "Yard Waste",
    "Construction Debris",
    "Appliances",
    "Electronics",
    "Tires",
    "Concrete",
    "Asphalt",
    "Metal",
    "Wood",
    "Hazardous Materials",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Facilities</h1>
          <p className="text-muted-foreground">
            Browse our complete database of {locations.length} waste disposal
            facilities across the United States
            {searchQuery && ` • Showing results for "${searchQuery}"`}
          </p>
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sort by
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                      <SelectItem value="distance">Closest Distance</SelectItem>
                      <SelectItem value="city">City A-Z</SelectItem>
                      <SelectItem value="state">State A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Debris Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Debris Types
                  </label>
                  <MultiSelectInput
                    options={availableDebrisTypes}
                    selectedValues={selectedDebrisTypes}
                    onSelectionChange={setSelectedDebrisTypes}
                    placeholder="Search debris types..."
                  />
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
                      <SelectItem value="landfill">Landfills</SelectItem>
                      <SelectItem value="transfer_station">
                        Transfer Stations
                      </SelectItem>
                      <SelectItem value="construction_landfill">
                        Construction Landfills
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredLocations.length} of {locations.length}{" "}
                    facilities
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {filteredLocations.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No facilities found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("all");
                      setSelectedDebrisTypes([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredLocations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
