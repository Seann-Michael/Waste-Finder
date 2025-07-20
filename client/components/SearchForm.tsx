import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchFormProps {
  onSearch?: (params: SearchParams) => void;
  isLoading?: boolean;
  showAdvanced?: boolean;
}

export interface SearchParams {
  zipCode: string;
  radius: number;
  locationTypes: string[];
  debrisTypes: string[];
}

const locationTypeOptions = [
  { value: "landfill", label: "Landfills" },
  { value: "transfer_station", label: "Transfer Stations" },
  { value: "construction_landfill", label: "Construction Landfills" },
];

const debrisTypeOptions = [
  { value: "general", label: "General Waste" },
  { value: "construction", label: "Construction Debris" },
  { value: "yard_waste", label: "Yard Waste" },
  { value: "electronics", label: "Electronics" },
  { value: "hazardous", label: "Hazardous Materials" },
  { value: "recyclables", label: "Recyclables" },
];

export default function SearchForm({
  onSearch,
  isLoading = false,
  showAdvanced = true,
}: SearchFormProps) {
  const navigate = useNavigate();
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState(50);
  const [locationTypes, setLocationTypes] = useState<string[]>([
    "landfill",
    "transfer_station",
  ]);
  const [debrisTypes, setDebrisTypes] = useState<string[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!zipCode.trim()) return;

    const searchParams: SearchParams = {
      zipCode: zipCode.trim(),
      radius,
      locationTypes,
      debrisTypes,
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      // Navigate to all-locations page with zip code search populated
      const params = new URLSearchParams();
      params.set("zipCode", searchParams.zipCode);
      params.set("radius", searchParams.radius.toString());
      if (searchParams.locationTypes.length > 0) {
        params.set("locationTypes", searchParams.locationTypes.join(","));
      }
      if (searchParams.debrisTypes.length > 0) {
        params.set("debrisTypes", searchParams.debrisTypes.join(","));
      }
      navigate(`/all-locations?${params.toString()}`);
    }
  };

  const handleLocationTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setLocationTypes((prev) => [...prev, type]);
    } else {
      setLocationTypes((prev) => prev.filter((t) => t !== type));
    }
  };

  const handleDebrisTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setDebrisTypes((prev) => [...prev, type]);
    } else {
      setDebrisTypes((prev) => prev.filter((t) => t !== type));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Find Waste Disposal Facilities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ZIP Code Input */}
          <div className="space-y-2">
            <Input
              id="zipCode"
              type="text"
              placeholder="Enter your ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              pattern="[0-9]{5}"
              maxLength={5}
              required
              className="text-lg"
            />
          </div>

          {/* Advanced Options Toggle */}
          {showAdvanced && (
            <div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="text-sm text-muted-foreground"
              >
                {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
              </Button>
            </div>
          )}

          {/* Advanced Options */}
          {showAdvanced && showAdvancedOptions && (
            <div className="space-y-6 pt-4 border-t">
              {/* Search Radius */}
              <div className="space-y-2">
                <Label htmlFor="radius">Search Radius</Label>
                <Select
                  value={radius.toString()}
                  onValueChange={(value) => setRadius(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Within 10 miles</SelectItem>
                    <SelectItem value="25">Within 25 miles</SelectItem>
                    <SelectItem value="50">Within 50 miles</SelectItem>
                    <SelectItem value="75">Within 75 miles</SelectItem>
                    <SelectItem value="100">Within 100 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Facility Types */}
              <div className="space-y-3">
                <Label>Facility Types</Label>
                <div className="grid grid-cols-1 gap-3">
                  {facilityTypeOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={option.value}
                        checked={facilityTypes.includes(option.value)}
                        onCheckedChange={(checked) =>
                          handleFacilityTypeChange(
                            option.value,
                            checked as boolean,
                          )
                        }
                      />
                      <Label
                        htmlFor={option.value}
                        className="text-sm font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Debris Types */}
              <div className="space-y-3">
                <Label>Accepted Debris Types (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {debrisTypeOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={option.value}
                        checked={debrisTypes.includes(option.value)}
                        onCheckedChange={(checked) =>
                          handleDebrisTypeChange(
                            option.value,
                            checked as boolean,
                          )
                        }
                      />
                      <Label
                        htmlFor={option.value}
                        className="text-sm font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !zipCode.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Find Facilities
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
