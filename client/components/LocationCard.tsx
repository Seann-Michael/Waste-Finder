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

            {/* Prominent Debris Types */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {location.debrisTypes.slice(0, 2).map((debris) => (
                  <Badge
                    key={debris.id}
                    variant="default"
                    className="text-xs bg-primary/10 text-primary border-primary/20"
                  >
                    {debris.name}
                  </Badge>
                ))}
                {location.debrisTypes.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    +{location.debrisTypes.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Address - Clickable for directions */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            <div>{location.address}</div>
            <div>
              {location.city}, {location.state} {location.zipCode}
            </div>
          </a>
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
                    if (todayHours.isClosed) {
                      return "Closed today";
                    }
                    const openTime = formatTo12Hour(todayHours.openTime);
                    const closeTime = formatTo12Hour(todayHours.closeTime);
                    const timezone = getTimezone(location.state);
                    return `Open ${openTime} - ${closeTime} ${timezone}`;
                  }
                  return "Hours vary";
                })()
              : "Hours not available"}
          </div>
        </div>

        {/* Debris Types with Pricing */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Accepts:</div>
          <div className="space-y-1">
            {location.debrisTypes.slice(0, 3).map((debris) => (
              <div
                key={debris.id}
                className="flex justify-between items-center text-xs"
              >
                <Badge variant="outline" className="text-xs">
                  {debris.name}
                </Badge>
                <span className="text-muted-foreground">
                  {debris.pricePerTon
                    ? `$${debris.pricePerTon}/ton`
                    : debris.pricePerLoad
                      ? `$${debris.pricePerLoad}/load`
                      : debris.priceNote || "Call for pricing"}
                </span>
              </div>
            ))}
            {location.debrisTypes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{location.debrisTypes.length - 3} more types
              </Badge>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Payment Methods:</div>
          <div className="flex flex-wrap gap-1">
            {location.paymentTypes.map((payment) => (
              <Badge key={payment.id} variant="secondary" className="text-xs">
                {payment.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1">
            <Link to={`/location/${location.id}`}>View Details</Link>
          </Button>
          {/* Show edit button if user is admin (check localStorage) */}
          {localStorage.getItem("adminLoggedIn") && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/admin/edit-facility/${location.id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
