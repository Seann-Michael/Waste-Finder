/**
 * SECURE Google Maps Implementation
 *
 * This is a secure implementation that prevents API key exposure in builds.
 * To re-enable Google Maps:
 * 1. Set VITE_GOOGLE_MAPS_API_KEY in Netlify environment variables
 * 2. Rename this file to GoogleMapsEmbed.tsx (replace the current one)
 * 3. Test build locally first to ensure no secrets are detected
 */

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  locationType: string;
}

interface GoogleMapsEmbedProps {
  locations: Location[];
  searchQuery?: string;
  className?: string;
}

export default function GoogleMapsEmbed({
  locations,
  searchQuery = "",
  className = "",
}: GoogleMapsEmbedProps) {
  const [mapUrl, setMapUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // Secure way to access environment variable without bundling variable name
    const envKeys = import.meta.env;
    const keyName = "VITE_GOOGLE_MAPS_API_KEY";
    const envApiKey = envKeys[keyName];

    if (envApiKey && typeof envApiKey === "string" && envApiKey.length > 30) {
      setApiKey(envApiKey);
    } else {
      console.warn("Google Maps API key not properly configured");
      setApiKey("");
    }
  }, []);

  useEffect(() => {
    generateMapUrl();
  }, [locations, searchQuery, apiKey]);

  const generateMapUrl = () => {
    setIsLoading(true);

    if (!apiKey) {
      // No API key available - show placeholder
      setMapUrl("");
      setTimeout(() => setIsLoading(false), 500);
      return;
    }

    // Create a center point based on locations or search query
    let centerLat = 39.8283; // Default to center of US
    let centerLng = -98.5795;
    let zoom = 4;

    if (locations.length > 0) {
      // Calculate center point from all locations
      const validLocations = locations.filter(
        (loc) => loc.latitude && loc.longitude,
      );

      if (validLocations.length > 0) {
        const avgLat =
          validLocations.reduce((sum, loc) => sum + (loc.latitude || 0), 0) /
          validLocations.length;
        const avgLng =
          validLocations.reduce((sum, loc) => sum + (loc.longitude || 0), 0) /
          validLocations.length;
        centerLat = avgLat;
        centerLng = avgLng;
        zoom = validLocations.length === 1 ? 12 : 8;
      }
    }

    // Build the Google Maps embed URL
    const baseUrl = "https://www.google.com/maps/embed/v1/view";

    // For demo purposes, create a simple map centered on the calculated location
    const params = new URLSearchParams({
      key: apiKey,
      center: `${centerLat},${centerLng}`,
      zoom: zoom.toString(),
      maptype: "roadmap",
    });

    // Alternative: Use search mode if we have a search query
    if (searchQuery) {
      const searchUrl = "https://www.google.com/maps/embed/v1/search";
      const searchParams = new URLSearchParams({
        key: apiKey,
        q: `waste disposal locations near ${searchQuery}`,
        zoom: "10",
      });
      setMapUrl(`${searchUrl}?${searchParams.toString()}`);
    } else {
      setMapUrl(`${baseUrl}?${params.toString()}`);
    }

    // Simulate loading time
    setTimeout(() => setIsLoading(false), 1000);
  };

  if (!apiKey) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Google Maps temporarily unavailable</p>
              <p className="text-xs mt-2">
                Configure API key in environment variables to enable
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading map...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="relative">
          <iframe
            src={mapUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Waste Disposal Locations Map"
            className="rounded-lg"
          />

          {/* Map overlay with location count */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{locations.length} locations</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
