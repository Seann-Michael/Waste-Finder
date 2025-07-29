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
      // Fetch locations from server API
      const response = await fetch(`/api/locations/search?zipCode=${zipCode}&radius=${radius}&locationType=${locationTypes.join(',')}&debrisTypes=${debrisTypes.join(',')}&sortBy=${sortBy}`);

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      const fetchedLocations = data.data || [];

      // Sort locations based on sortBy
      const sortedLocations = [...fetchedLocations].sort((a, b) => {
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
                Searching locations...
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
            {locations.length} locations found within {radius} miles
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
                    No locations found
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
