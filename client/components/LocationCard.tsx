import { Link } from "react-router-dom";
import { Location } from "@shared/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPhoneNumber } from "@/lib/utils";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  Trash2,
  Building2,
  HardHat,
  Edit,
} from "lucide-react";

interface LocationCardProps {
  location: Location;
}

const getLocationIcon = (type: Location["locationType"]) => {
  switch (type) {
    case "landfill":
      return <Trash2 className="w-4 h-4" />;
    case "transfer_station":
      return <Building2 className="w-4 h-4" />;
    case "construction_landfill":
      return <HardHat className="w-4 h-4" />;
    default:
      return <Trash2 className="w-4 h-4" />;
  }
};

const getLocationLabel = (type: Location["locationType"]) => {
  switch (type) {
    case "landfill":
      return "Landfill";
    case "transfer_station":
      return "Transfer Station";
    case "construction_landfill":
      return "Construction Landfill";
    default:
      return "Facility";
  }
};

export default function LocationCard({ location }: LocationCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`,
    )}`;
  };

  const formatTo12Hour = (time: string) => {
    if (!time || time === "00:00") return "";
    const [hours, minutes] = time.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getTimezone = (state: string) => {
    // Simplified timezone mapping - in real app, use proper timezone detection
    const easternStates = [
      "NY",
      "FL",
      "GA",
      "NC",
      "SC",
      "VA",
      "WV",
      "OH",
      "PA",
      "NJ",
      "CT",
      "RI",
      "MA",
      "VT",
      "NH",
      "ME",
      "DE",
      "MD",
    ];
    const centralStates = [
      "IL",
      "IN",
      "MI",
      "WI",
      "MN",
      "IA",
      "MO",
      "AR",
      "LA",
      "MS",
      "AL",
      "TN",
      "KY",
      "TX",
      "OK",
      "KS",
      "NE",
      "SD",
      "ND",
    ];
    const mountainStates = ["MT", "WY", "CO", "NM", "ID", "UT", "AZ"];
    const pacificStates = ["CA", "OR", "WA", "NV"];

    if (easternStates.includes(state)) return "ET";
    if (centralStates.includes(state)) return "CT";
    if (mountainStates.includes(state)) return "MT";
    if (pacificStates.includes(state)) return "PT";
    return "Local";
  };

  return (
    <div className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              {getLocationIcon(location.locationType)}
              {getLocationLabel(location.locationType)}
            </Badge>
            {location.distance && (
              <span className="text-xs text-muted-foreground">
                {location.distance.toFixed(1)}mi
              </span>
            )}
          </div>
          <h3 className="font-semibold text-sm leading-tight mb-1">
            {location.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {renderStars(location.rating)}
            </div>
            <span className="text-xs text-muted-foreground">
              ({location.reviewCount})
            </span>
          </div>
        </div>

        {/* Middle Column - Contact & Hours */}
        <div className="lg:col-span-4 space-y-1">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              {location.address}, {location.city}, {location.state}
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <a
              href={`tel:${location.phone}`}
              className="text-xs text-primary hover:underline"
            >
              {formatPhoneNumber(location.phone)}
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {location.operatingHours.length > 0
                ? (() => {
                    const today = new Date().getDay();
                    const todayHours = location.operatingHours.find(
                      (h) => h.dayOfWeek === today,
                    );
                    if (todayHours) {
                      if (todayHours.isClosed) {
                        return "Closed today";
                      }
                      const openTime = formatTo12Hour(todayHours.openTime);
                      const closeTime = formatTo12Hour(todayHours.closeTime);
                      return `${openTime} - ${closeTime}`;
                    }
                    return "Hours vary";
                  })()
                : "Call for hours"}
            </span>
          </div>
        </div>

        {/* Right Column - Services & Actions */}
        <div className="lg:col-span-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {location.debrisTypes.slice(0, 2).map((debris) => (
              <Badge
                key={debris.id}
                variant="outline"
                className="text-xs px-1 py-0"
              >
                {debris.name}
              </Badge>
            ))}
            {location.debrisTypes.length > 2 && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                +{location.debrisTypes.length - 2}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {location.paymentTypes.slice(0, 2).map((payment) => (
              <Badge key={payment.id} variant="secondary" className="text-xs px-1 py-0">
                {payment.name}
              </Badge>
            ))}
          </div>
          <Button asChild size="sm" className="w-full text-xs h-7">
            <Link to={`/location/${location.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
