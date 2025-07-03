import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import LocationCard from "@/components/LocationCard";
import SearchForm, { SearchParams } from "@/components/SearchForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Location } from "@shared/api";
import { MapPin, SlidersHorizontal, Loader2 } from "lucide-react";

export default function Locations() {
  const [searchParams] = useSearchParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("distance");
  const [showFilters, setShowFilters] = useState(false);

  // Parse search params
  const zipCode = searchParams.get("zipCode") || "";
  const radius = parseInt(searchParams.get("radius") || "25");
  const facilityTypes =
    searchParams.get("facilityTypes")?.split(",").filter(Boolean) || [];
  const debrisTypes =
    searchParams.get("debrisTypes")?.split(",").filter(Boolean) || [];

  useEffect(() => {
    if (zipCode) {
      searchLocations();
    }
  }, [zipCode, radius, facilityTypes, debrisTypes, sortBy]);

  const searchLocations = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if searching for Cleveland area (44111)
      const isClevelendSearch =
        zipCode === "44111" || zipCode.startsWith("441");

      const mockLocations: Location[] = isClevelendSearch
        ? [
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
          ]
        : [
            {
              id: "1",
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
                { id: "1", name: "General Waste", category: "general" },
                { id: "2", name: "Yard Waste", category: "general" },
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
              distance: 3.2,
              isActive: true,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-15T00:00:00Z",
            },
            {
              id: "2",
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
                { id: "1", name: "General Waste", category: "general" },
                { id: "3", name: "Electronics", category: "recyclable" },
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
              id: "3",
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
                },
                { id: "5", name: "Concrete", category: "construction" },
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
              distance: 8.1,
              isActive: true,
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-20T00:00:00Z",
            },
          ];

      // Sort locations based on sortBy
      const sortedLocations = [...mockLocations].sort((a, b) => {
        switch (sortBy) {
          case "distance":
            return (a.distance || 0) - (b.distance || 0);
          case "rating":
            return b.rating - a.rating;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

      setLocations(sortedLocations);
    } catch (error) {
      console.error("Error searching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = (params: SearchParams) => {
    const newSearchParams = new URLSearchParams({
      zipCode: params.zipCode,
      radius: params.radius.toString(),
      facilityTypes: params.facilityTypes.join(","),
      debrisTypes: params.debrisTypes.join(","),
    });
    window.location.href = `/locations?${newSearchParams.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <h2 className="text-lg font-semibold mb-2">
                Searching facilities...
              </h2>
              <p className="text-muted-foreground">
                Finding the best disposal options near you
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
        {/* Search Summary */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span>Search results for ZIP code {zipCode}</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {locations.length} facilities found within {radius} miles
          </h1>

          {/* Active Filters */}
          {(facilityTypes.length > 0 || debrisTypes.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {facilityTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              ))}
              {debrisTypes.map((type) => (
                <Badge key={type} variant="outline">
                  {type
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* New Search */}
                  <div>
                    <h3 className="font-semibold mb-3">New Search</h3>
                    <SearchForm
                      onSearch={handleNewSearch}
                      showAdvanced={false}
                    />
                  </div>

                  {/* Filters Toggle */}
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="w-full"
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Sort by
                        </label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="distance">Distance</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {locations.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No facilities found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try expanding your search radius or adjusting your filters
                  </p>
                  <Button onClick={() => setShowFilters(true)}>
                    Adjust Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {locations.map((location) => (
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
