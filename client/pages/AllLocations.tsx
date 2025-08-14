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
import GoogleMapsEmbed from "../components/GoogleMapsEmbed";
import { Location } from "../shared/api";
import { generateLocationUrl } from "../lib/utils";
import { searchLocations } from "../lib/supabaseQueries";
import { geocodeZipCode } from "../lib/geocoding";

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

const fetchLocations = async (
  searchQuery?: string,
  zipCode?: string,
  latitude?: number,
  longitude?: number,
  radius?: number,
  locationTypes?: string[],
  debrisTypes?: string[]
): Promise<Location[]> => {
  try {
    // Use Supabase search with all parameters
    const result = await searchLocations({
      search: searchQuery,
      zipCode,
      latitude,
      longitude,
      radius: radius || 50,
      locationType: locationTypes?.[0], // supabaseQueries expects single type for now
      page: 1,
      limit: 100,
    });

    if (result.success) {
      console.log(`Found ${result.locations.length} locations via Supabase`);
      return result.locations;
    } else {
      console.error("Supabase search failed:", result);
      return [];
    }
  } catch (error) {
    console.error("Error searching locations:", error);
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
        // Extract parameters from URL
        const zipFromParams = searchParams.get("zipCode");
        const latFromParams = searchParams.get("latitude");
        const lngFromParams = searchParams.get("longitude");
        const radiusFromParams = searchParams.get("radius");
        const locationTypesParam = searchParams.get("locationTypes");
        const debrisTypesParam = searchParams.get("debrisTypes");

        // Parse coordinates and radius
        const latitude = latFromParams ? parseFloat(latFromParams) : undefined;
        const longitude = lngFromParams ? parseFloat(lngFromParams) : undefined;
        const radius = parseInt(radiusFromParams || "50", 10);
        const locationTypes = locationTypesParam ? locationTypesParam.split(",") : undefined;
        const debrisTypes = debrisTypesParam ? debrisTypesParam.split(",") : undefined;

        // Search with all parameters
        const data = await fetchLocations(
          undefined, // searchQuery
          zipFromParams || undefined,
          latitude,
          longitude,
          radius,
          locationTypes,
          debrisTypes
        );

        // Ensure data is an array before setting
        setLocations(Array.isArray(data) ? data : []);

        if (zipFromParams) {
          setSearchLocation({
            zipCode: zipFromParams,
            lat: latitude || 0,
            lng: longitude || 0,
            city: "Search Area",
            state: "",
            radius,
          });
          setSearchMessage(
            `Found ${data.length} locations within ${radius} miles of ${zipFromParams}`,
          );
        } else {
          setSearchMessage(`Found ${data.length} locations`);
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
      const data = await fetchLocations(searchQuery.trim());
      const locationsArray = Array.isArray(data) ? data : [];
      setLocations(locationsArray);
      setSearchMessage(
        `Found ${locationsArray.length} locations matching "${searchQuery}"`,
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
    navigate(generateLocationUrl(location));
  };

  // Safe filtering with error handling
  const filteredAndSortedLocations = React.useMemo(() => {
    try {
      if (!Array.isArray(locations)) {
        console.warn('Locations is not an array:', locations);
        return [];
      }

      return locations
        .filter((location) => {
          try {
            // Ensure location is valid
            if (!location || typeof location !== 'object') {
              console.warn('Invalid location object:', location);
              return false;
            }

            // Apply search filter first
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase().trim();
              const matchesSearch =
                (location.name || '').toLowerCase().includes(query) ||
                (location.city || '').toLowerCase().includes(query) ||
                (location.zip_code || location.zipCode || '').toLowerCase().includes(query) ||
                (location.address || '').toLowerCase().includes(query) ||
                (location.state || '').toLowerCase().includes(query);

              if (!matchesSearch) return false;
            }

            // Then apply type filter
            if (filterBy === "all") return true;
            return (location.location_type || location.locationType) === filterBy;
          } catch (filterError) {
            console.error('Error filtering location:', location, filterError);
            return false;
          }
        })
        .sort((a, b) => {
          try {
            switch (sortBy) {
              case "name":
                return (a.name || '').localeCompare(b.name || '');
              case "rating":
                return (b.rating || 0) - (a.rating || 0);
              case "city":
                return (a.city || '').localeCompare(b.city || '');
              default:
                return 0;
            }
          } catch (sortError) {
            console.error('Error sorting locations:', a, b, sortError);
            return 0;
          }
        });
    } catch (error) {
      console.error('Error in filteredAndSortedLocations:', error);
      return [];
    }
  }, [locations, searchQuery, filterBy, sortBy]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              All Waste Disposal Locations
            </h1>
            {searchLocation && (
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>
                  Within {searchLocation.radius} miles of{" "}
                  {searchLocation.zipCode}
                </span>
              </div>
            )}
            <p className="text-muted-foreground">{searchMessage}</p>
          </div>

          {/* Google Maps */}
          <GoogleMapsEmbed
            locations={filteredAndSortedLocations}
            searchQuery={searchLocation?.zipCode || searchQuery}
            className="mb-8"
          />

          {/* Banner Ad under Google Maps */}
          <AdSense placement="search-results-top" className="py-4 mb-8" />

          {/* Layout with Search/Filters on Left and Results on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Search and Filters - Left Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Search & Filter</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search by Zip Code, Name or City"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSearch()
                          }
                        />
                      </div>
                      <Button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="w-full mt-2"
                        size="sm"
                      >
                        Search
                      </Button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Filter by Type
                        </span>
                      </div>
                      <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger>
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

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <SortAsc className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Sort by</span>
                      </div>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
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
            </div>

            {/* Results - Right Side */}
            <div className="lg:col-span-3">
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
                  <p className="text-muted-foreground">Loading locations...</p>
                </div>
              )}

              {/* Results */}
              {!isLoading && !error.hasError && (
                <div className="space-y-6">
                  {filteredAndSortedLocations.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">
                          No locations found matching your criteria.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Showing {filteredAndSortedLocations.length} of{" "}
                          {locations.length} locations
                        </p>
                        {filterBy !== "all" && (
                          <Badge variant="secondary">
                            {filterBy.replace("_", " ")}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        {filteredAndSortedLocations.map((location) => (
                          <LocationCard
                            key={location.id}
                            location={location}
                            onClick={() => handleLocationClick(location)}
                            searchedDebrisTypes={(() => {
                              const debrisFromParams = searchParams.get('debrisTypes');
                              return debrisFromParams ? debrisFromParams.split(',') : [];
                            })()}
                          />
                        ))}
                      </div>

                      {/* Bottom Ad - Full Width */}
                      <AdSense placement="search-results" className="my-8" />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
