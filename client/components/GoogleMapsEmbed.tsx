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
  className = ""
}: GoogleMapsEmbedProps) {
  const [mapUrl, setMapUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateMapUrl();
  }, [locations, searchQuery]);

  const generateMapUrl = () => {
    setIsLoading(true);
    
    // Create a center point based on locations or search query
    let centerLat = 39.8283; // Default to center of US
    let centerLng = -98.5795;
    let zoom = 4;

    if (locations.length > 0) {
      // Calculate center point from all locations
      const validLocations = locations.filter(loc => loc.latitude && loc.longitude);
      
      if (validLocations.length > 0) {
        const avgLat = validLocations.reduce((sum, loc) => sum + (loc.latitude || 0), 0) / validLocations.length;
        const avgLng = validLocations.reduce((sum, loc) => sum + (loc.longitude || 0), 0) / validLocations.length;
        centerLat = avgLat;
        centerLng = avgLng;
        zoom = validLocations.length === 1 ? 12 : 8;
      }
    }

    // Build the Google Maps embed URL
    const baseUrl = "https://www.google.com/maps/embed/v1/view";
    const apiKey = "AIzaSyBFw0Qbyq9zTFTd-tUY6dQHuFW6mZWRJRI"; // You'll need to replace with actual key
    
    // For demo purposes, create a simple map centered on the calculated location
    const params = new URLSearchParams({
      key: apiKey,
      center: `${centerLat},${centerLng}`,
      zoom: zoom.toString(),
      maptype: "roadmap"
    });

    // Alternative: Use search mode if we have a search query
    if (searchQuery) {
      const searchUrl = "https://www.google.com/maps/embed/v1/search";
      const searchParams = new URLSearchParams({
        key: apiKey,
        q: `waste disposal facilities near ${searchQuery}`,
        zoom: "10"
      });
      setMapUrl(`${searchUrl}?${searchParams.toString()}`);
    } else {
      setMapUrl(`${baseUrl}?${params.toString()}`);
    }

    // Simulate loading time
    setTimeout(() => setIsLoading(false), 1000);
  };

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
            title="Waste Disposal Facilities Map"
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
