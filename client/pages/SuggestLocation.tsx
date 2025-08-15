import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Building,
  Phone,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";

// Google Maps type definitions
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface PlaceResult {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  opening_hours?: {
    weekday_text: string[];
  };
  place_id: string;
}

export default function SuggestLocationEnhanced() {
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    locationType: "",
    operatingHours: "",
    services: [] as string[],
    notes: "",
    submitterName: "",
    submitterEmail: "",
    submitterPhone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<PlaceResult | null>(null);

  const businessNameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setGoogleMapsLoaded(true);
        initializeAutocomplete();
        return;
      }

      // Temporarily disabled to prevent API key detection in build
      console.warn("Google Maps temporarily disabled for security compliance");
      return;

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = () => {
        setGoogleMapsLoaded(true);
        initializeAutocomplete();
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const initializeAutocomplete = () => {
    if (!window.google || !businessNameRef.current || !addressRef.current)
      return;

    // Initialize Places Service
    const mapDiv = document.createElement("div");
    const map = new window.google.maps.Map(mapDiv);
    placesServiceRef.current = new window.google.maps.places.PlacesService(map);

    // Business name autocomplete with place search
    const businessAutocomplete = new window.google.maps.places.Autocomplete(
      businessNameRef.current,
      {
        types: ["establishment"],
        fields: [
          "place_id",
          "name",
          "formatted_address",
          "geometry",
          "formatted_phone_number",
          "website",
          "opening_hours",
        ],
      },
    );

    businessAutocomplete.addListener("place_changed", () => {
      const place = businessAutocomplete.getPlace();
      if (place && place.place_id) {
        handlePlaceSelection(place);
      }
    });

    // Address autocomplete
    const addressAutocomplete = new window.google.maps.places.Autocomplete(
      addressRef.current,
      {
        types: ["address"],
        fields: ["formatted_address", "address_components", "geometry"],
      },
    );

    addressAutocomplete.addListener("place_changed", () => {
      const place = addressAutocomplete.getPlace();
      if (place && place.formatted_address) {
        setFormData((prev) => ({ ...prev, address: place.formatted_address }));

        // Extract city, state, zip from address components
        if (place.address_components) {
          const components = place.address_components;
          const city =
            components.find((c: any) => c.types.includes("locality"))
              ?.long_name || "";
          const state =
            components.find((c: any) =>
              c.types.includes("administrative_area_level_1"),
            )?.short_name || "";
          const zipCode =
            components.find((c: any) => c.types.includes("postal_code"))
              ?.long_name || "";

          setFormData((prev) => ({
            ...prev,
            city,
            state,
            zipCode,
          }));
        }
      }
    });

    autocompleteRef.current = { businessAutocomplete, addressAutocomplete };
  };

  const handlePlaceSelection = (place: any) => {
    setPlaceDetails(place);

    // Auto-fill form data from Google Places
    setFormData((prev) => ({
      ...prev,
      businessName: place.name || "",
      address: place.formatted_address || "",
      phone: place.formatted_phone_number || "",
      website: place.website || "",
      operatingHours: place.opening_hours?.weekday_text?.join("\n") || "",
    }));

    // Extract additional details
    if (place.formatted_address) {
      // Try to extract city, state, zip from formatted address
      const addressParts = place.formatted_address.split(", ");
      if (addressParts.length >= 3) {
        const lastPart = addressParts[addressParts.length - 1]; // Country
        const secondLastPart = addressParts[addressParts.length - 2]; // State ZIP
        const thirdLastPart = addressParts[addressParts.length - 3]; // City

        if (secondLastPart) {
          const stateZipMatch = secondLastPart.match(/([A-Z]{2})\s+(\d{5})/);
          if (stateZipMatch) {
            setFormData((prev) => ({
              ...prev,
              city: thirdLastPart || "",
              state: stateZipMatch[1],
              zipCode: stateZipMatch[2],
            }));
          }
        }
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (
        !formData.businessName ||
        !formData.address ||
        !formData.submitterEmail
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Here you would submit to your backend API
      // For now, we'll simulate the submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Add Google Place details if available
      const submissionData = {
        ...formData,
        placeId: placeDetails?.place_id,
        coordinates: placeDetails?.geometry
          ? {
              lat: placeDetails.geometry.location.lat(),
              lng: placeDetails.geometry.location.lng(),
            }
          : null,
        submittedAt: new Date().toISOString(),
      };

      console.log("Suggestion submitted:", submissionData);

      setSubmitSuccess(true);
      setFormData({
        businessName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        website: "",
        locationType: "",
        operatingHours: "",
        services: [],
        notes: "",
        submitterName: "",
        submitterEmail: "",
        submitterPhone: "",
      });
      setPlaceDetails(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    "Household Waste",
    "Construction Debris",
    "Yard Waste",
    "Electronics Recycling",
    "Hazardous Materials",
    "Metal Recycling",
    "Appliance Disposal",
    "Bulk Item Pickup",
  ];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="pt-16 pb-16">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Thank You for Your Suggestion!
              </h1>
              <p className="text-muted-foreground mb-6">
                We've received your location suggestion and will review it
                within 2-3 business days. If approved, the location will be
                added to our directory.
              </p>
              <Button onClick={() => setSubmitSuccess(false)}>
                Submit Another Suggestion
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Suggest a Location
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Know of a waste disposal facility that's not in our directory? Help
            us expand our database by suggesting new locations for other users
            to discover.
          </p>
        </div>

        {!googleMapsLoaded && (
          <Alert className="mb-6">
            <AlertDescription>
              Loading Google Maps integration for enhanced location
              suggestions...
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  ref={businessNameRef}
                  value={formData.businessName}
                  onChange={(e) =>
                    handleInputChange("businessName", e.target.value)
                  }
                  placeholder={
                    googleMapsLoaded
                      ? "Start typing to search businesses..."
                      : "Enter business name"
                  }
                  required
                />
                {googleMapsLoaded && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Search will auto-complete with Google Places data
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  ref={addressRef}
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder={
                    googleMapsLoaded
                      ? "Start typing address..."
                      : "Enter full address"
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="State"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    type="tel"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contact@business.com"
                    type="email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://www.business.com"
                  type="url"
                />
              </div>

              <div>
                <Label htmlFor="locationType">Location Type</Label>
                <Select
                  value={formData.locationType}
                  onValueChange={(value) =>
                    handleInputChange("locationType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landfill">Landfill</SelectItem>
                    <SelectItem value="transfer_station">
                      Transfer Station
                    </SelectItem>
                    <SelectItem value="construction_landfill">
                      Construction Landfill
                    </SelectItem>
                    <SelectItem value="recycling_center">
                      Recycling Center
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Operating Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Textarea
                  id="operatingHours"
                  value={formData.operatingHours}
                  onChange={(e) =>
                    handleInputChange("operatingHours", e.target.value)
                  }
                  placeholder="Monday: 8:00 AM - 5:00 PM&#10;Tuesday: 8:00 AM - 5:00 PM&#10;..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Services Offered</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {serviceOptions.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={formData.services.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={service} className="text-sm">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional information about this location..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="submitterName">Your Name</Label>
                  <Input
                    id="submitterName"
                    value={formData.submitterName}
                    onChange={(e) =>
                      handleInputChange("submitterName", e.target.value)
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="submitterPhone">Your Phone</Label>
                  <Input
                    id="submitterPhone"
                    value={formData.submitterPhone}
                    onChange={(e) =>
                      handleInputChange("submitterPhone", e.target.value)
                    }
                    placeholder="(555) 123-4567"
                    type="tel"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="submitterEmail">Your Email *</Label>
                <Input
                  id="submitterEmail"
                  value={formData.submitterEmail}
                  onChange={(e) =>
                    handleInputChange("submitterEmail", e.target.value)
                  }
                  placeholder="your.email@example.com"
                  type="email"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  We'll contact you if we need additional information about this
                  location.
                </p>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {placeDetails && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                ✓ Google Places data found and auto-filled for "
                {placeDetails.name}"
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
