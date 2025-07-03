import { Link } from "react-router-dom";
import { Location } from "@shared/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  Trash2,
  Building2,
  HardHat,
} from "lucide-react";

interface LocationCardProps {
  location: Location;
}

const getFacilityIcon = (type: Location["facilityType"]) => {
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

const getFacilityLabel = (type: Location["facilityType"]) => {
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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {getFacilityIcon(location.facilityType)}
                {getFacilityLabel(location.facilityType)}
              </Badge>
              {location.distance && (
                <span className="text-sm text-muted-foreground">
                  {location.distance.toFixed(1)} miles away
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {location.name}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              {renderStars(location.rating)}
              <span className="text-sm text-muted-foreground ml-1">
                ({location.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-sm">
            <div>{location.address}</div>
            <div>
              {location.city}, {location.state} {location.zipCode}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <a
            href={`tel:${location.phone}`}
            className="text-sm text-primary hover:underline"
          >
            {location.phone}
          </a>
        </div>

        {/* Operating Hours */}
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-sm text-muted-foreground">
            {location.operatingHours.length > 0
              ? (() => {
                  const today = new Date().getDay();
                  const todayHours = location.operatingHours.find(
                    (h) => h.dayOfWeek === today,
                  );
                  if (todayHours) {
                    return todayHours.isClosed
                      ? "Closed today"
                      : `Open ${todayHours.openTime} - ${todayHours.closeTime}`;
                  }
                  return "Hours vary";
                })()
              : "Hours not available"}
          </div>
        </div>

        {/* Debris Types */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Accepts:</div>
          <div className="flex flex-wrap gap-1">
            {location.debrisTypes.slice(0, 3).map((debris) => (
              <Badge key={debris.id} variant="outline" className="text-xs">
                {debris.name}
              </Badge>
            ))}
            {location.debrisTypes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{location.debrisTypes.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1">
            <Link to={`/location/${location.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Navigation className="w-4 h-4" />
              Directions
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
