import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Search, Filter, SortAsc } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LocationCard from "../components/LocationCard";
import AdSense from "../components/AdSense";
import { Location } from "../shared/api";

interface SearchLocation {
  zipCode: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  radius: number;
}

interface ErrorState {
  hasError: boolean;
  message: string;
}

const fetchLocations = async (query?: string): Promise<Location[]> => {
  try {
    const searchParams = new URLSearchParams();
    if (query) {
      searchParams.append("search", query);
    }

    const response = await fetch(
      `/api/locations/all?${searchParams.toString()}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

export default function AllLocations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(
    null,
  );
  const [searchMessage, setSearchMessage] = useState("");
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: "",
  });

  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      setError({ hasError: false, message: "" });

      try {
        const zipFromParams = searchParams.get("zip");
        const radiusFromParams = searchParams.get("radius");

        const data = await fetchLocations(zipFromParams || undefined);
        setLocations(data);

        if (zipFromParams) {
          setSearchLocation({
            zipCode: zipFromParams,
            lat: 0,
            lng: 0,
            city: "Unknown",
            state: "Unknown",
            radius: parseInt(radiusFromParams || "50", 10),
          });
          setSearchMessage(
            `Found ${data.length} facilities within ${radiusFromParams || "50"} miles of ${zipFromParams}`,
          );
        } else {
          setSearchMessage(`Found ${data.length} facilities`);
        }
      } catch (err) {
        console.error("Error loading locations:", err);
        setError({
          hasError: true,
          message: "Failed to load locations. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, [searchParams]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const data = await fetchLocations(searchQuery);
      setLocations(data);
      setSearchMessage(
        `Found ${data.length} facilities matching "${searchQuery}"`,
      );
    } catch (err) {
      console.error("Error searching locations:", err);
      setError({
        hasError: true,
        message: "Search failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationClick = (location: Location) => {
    navigate(`/location/${location.id}`);
  };

  const filteredAndSortedLocations = locations
    .filter((location) => {
      if (filterBy === "all") return true;
      return location.locationType === filterBy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "city":
          return a.city.localeCompare(b.city);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            All Waste Disposal Facilities
          </h1>
          {searchLocation && (
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span>
                Within {searchLocation.radius} miles of {searchLocation.zipCode}
              </span>
            </div>
          )}
          <p className="text-muted-foreground">{searchMessage}</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, city, or ZIP code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                Search
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
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

              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error.hasError && (
          <Card className="mb-8 border-destructive">
            <CardContent className="p-6">
              <p className="text-destructive">{error.message}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading facilities...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error.hasError && (
          <div className="space-y-6">
            {filteredAndSortedLocations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No facilities found matching your criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredAndSortedLocations.length} of{" "}
                    {locations.length} facilities
                  </p>
                  {filterBy !== "all" && (
                    <Badge variant="secondary">
                      {filterBy.replace("_", " ")}
                    </Badge>
                  )}
                </div>

                {/* AdSense for Search Results */}
                <AdSense placement="search-results" className="my-6" />

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedLocations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      onClick={() => handleLocationClick(location)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
}