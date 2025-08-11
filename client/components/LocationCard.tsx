import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPhoneNumber, generateLocationUrl } from "@/lib/utils";
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

// Supabase Location interface matching the database structure
interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  location_type: "landfill" | "transfer_station" | "construction_landfill";
  notes?: string;
  rating?: number;
  review_count?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // Optional fields that might come from joins
  debrisTypes?: any[];
  operatingHours?: any[];
  paymentTypes?: any[];
  distance?: number;
}

interface LocationCardProps {
  location: Location;
  searchedDebrisTypes?: string[]; // Debris types that user searched/filtered for
  showContactDetails?: boolean; // Whether to show phone and hours
}

const getLocationIcon = (type: Location["location_type"]) => {
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

const getLocationLabel = (type: Location["location_type"]) => {
  switch (type) {
    case "landfill":
      return "Landfill";
    case "transfer_station":
      return "Transfer Station";
    case "construction_landfill":
      return "Construction Landfill";
    default:
      return "Location";
  }
};

export default function LocationCard({
  location,
  searchedDebrisTypes = [],
  showContactDetails = false,
}: LocationCardProps) {
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

  const sortDebrisTypesByPriority = (
    debrisTypes: typeof location.debrisTypes,
  ) => {
    // Return empty array if debrisTypes is null/undefined
    if (!debrisTypes || !Array.isArray(debrisTypes)) {
      return [];
    }

    // Priority order:
    // 1. User searched/filtered debris types
    // 2. Municipal waste
    // 3. Construction debris
    // 4. Yard debris
    // 5. All others

    const priorityKeywords = {
      searched: searchedDebrisTypes.map((type) => type.toLowerCase()),
      municipal: [
        "municipal",
        "general",
        "household",
        "residential",
        "domestic",
      ],
      construction: [
        "construction",
        "c&d",
        "demolition",
        "building",
        "concrete",
        "drywall",
        "lumber",
      ],
      yard: [
        "yard",
        "green",
        "organic",
        "garden",
        "landscaping",
        "tree",
        "grass",
        "leaves",
      ],
    };

    const getDebrisTypePriority = (debrisType: any) => {
      // Safety check for debrisType
      if (!debrisType || !debrisType.name) {
        return 5; // Lowest priority for invalid entries
      }

      const name = debrisType.name.toLowerCase();

      // Check if it matches user search/filter (highest priority)
      if (
        priorityKeywords.searched.some(
          (searched) => name.includes(searched) || searched.includes(name),
        )
      ) {
        return 1;
      }

      // Check municipal waste
      if (
        priorityKeywords.municipal.some((keyword) => name.includes(keyword))
      ) {
        return 2;
      }

      // Check construction debris
      if (
        priorityKeywords.construction.some((keyword) => name.includes(keyword))
      ) {
        return 3;
      }

      // Check yard waste
      if (priorityKeywords.yard.some((keyword) => name.includes(keyword))) {
        return 4;
      }

      // All others
      return 5;
    };

    return [...debrisTypes].sort((a, b) => {
      const priorityA = getDebrisTypePriority(a);
      const priorityB = getDebrisTypePriority(b);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // If same priority, sort alphabetically
      // Add safety check for name property
      const nameA = a?.name || "";
      const nameB = b?.name || "";
      return nameA.localeCompare(nameB);
    });
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 text-sm"
            >
              {getLocationIcon(location.locationType)}
              {getLocationLabel(location.locationType)}
            </Badge>
            {location.distance && (
              <span className="text-sm text-muted-foreground">
                {location.distance.toFixed(1)}mi
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base leading-snug mb-2">
            {location.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">{renderStars(location.rating)}</div>
            <span className="text-sm text-muted-foreground">
              ({location.reviewCount})
            </span>
          </div>
        </div>

        {/* Middle Column - Contact & Hours */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline leading-relaxed"
              >
                <div>{location.address}</div>
                <div>
                  {location.city}, {location.state} {location.zipCode}
                </div>
              </a>
            </div>
          </div>
          {showContactDetails && (
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
              <a
                href={`tel:${location.phone}`}
                className="text-sm text-primary hover:underline"
              >
                {formatPhoneNumber(location.phone)}
              </a>
            </div>
          )}
          {showContactDetails && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground leading-relaxed">
                {location.operatingHours.length > 0
                  ? (() => {
                      // Group consecutive days with same hours
                      const hourGroups: { [key: string]: number[] } = {};
                      const closedDays: number[] = [];

                      location.operatingHours.forEach((h) => {
                        if (h.isClosed) {
                          closedDays.push(h.dayOfWeek);
                          return;
                        }
                        const timeKey = `${formatTo12Hour(h.openTime)}-${formatTo12Hour(h.closeTime)}`;
                        if (!hourGroups[timeKey]) hourGroups[timeKey] = [];
                        hourGroups[timeKey].push(h.dayOfWeek);
                      });

                      const dayNames = [
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                      ];
                      const results: string[] = [];

                      // Process hour groups
                      Object.entries(hourGroups).forEach(
                        ([timeRange, days]) => {
                          days.sort((a, b) => a - b);

                          // Check for consecutive weekdays (Mon-Fri)
                          if (
                            days.length >= 5 &&
                            days.includes(1) &&
                            days.includes(2) &&
                            days.includes(3) &&
                            days.includes(4) &&
                            days.includes(5)
                          ) {
                            results.push(
                              `Mon-Fri: ${timeRange.replace(/\s?(AM|PM)/g, "$1")}`,
                            );
                            // Remove weekdays from the days array for other processing
                            days = days.filter(
                              (d) => ![1, 2, 3, 4, 5].includes(d),
                            );
                          }

                          // Group remaining consecutive days
                          let i = 0;
                          while (i < days.length) {
                            let endIndex = i;
                            // Find consecutive days
                            while (
                              endIndex + 1 < days.length &&
                              days[endIndex + 1] === days[endIndex] + 1
                            ) {
                              endIndex++;
                            }

                            if (i === endIndex) {
                              // Single day
                              results.push(
                                `${dayNames[days[i]]}: ${timeRange.replace(/\s?(AM|PM)/g, "$1")}`,
                              );
                            } else {
                              // Range of days
                              results.push(
                                `${dayNames[days[i]]}-${dayNames[days[endIndex]]}: ${timeRange.replace(/\s?(AM|PM)/g, "$1")}`,
                              );
                            }
                            i = endIndex + 1;
                          }
                        },
                      );

                      // Handle closed days if any
                      if (closedDays.length > 0 && closedDays.length < 7) {
                        const closedDayNames = closedDays
                          .sort()
                          .map((d) => dayNames[d]);
                        if (closedDays.length === 1) {
                          results.push(`${closedDayNames[0]}: Closed`);
                        } else {
                          results.push(`${closedDayNames.join(", ")}: Closed`);
                        }
                      }

                      // If we have more than 2 different time groups, show condensed version
                      if (results.length > 2) {
                        const primaryHours = results[0]; // Usually Mon-Fri
                        return (
                          <div>
                            <div>{primaryHours}</div>
                            <div className="text-xs text-muted-foreground/70 mt-0.5">
                              +{results.length - 1} more schedules
                            </div>
                          </div>
                        );
                      }

                      return results.length > 0
                        ? results.join(" • ")
                        : "Hours vary";
                    })()
                  : "Call for hours"}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Services & Actions */}
        <div className="lg:col-span-4">
          <div className="flex flex-wrap gap-1 mb-3">
            {(() => {
              const sortedDebrisTypes = sortDebrisTypesByPriority(
                location.debrisTypes || [],
              );
              return (
                <>
                  {sortedDebrisTypes.slice(0, 2).map((debris) => (
                    <Badge
                      key={debris.id || Math.random()}
                      variant="outline"
                      className={`text-sm px-2 py-1 ${
                        searchedDebrisTypes.some(
                          (searched) =>
                            debris?.name
                              ?.toLowerCase()
                              .includes(searched.toLowerCase()) ||
                            searched
                              .toLowerCase()
                              .includes(debris?.name?.toLowerCase() || ""),
                        )
                          ? "bg-blue-50 border-blue-300 text-blue-800"
                          : ""
                      }`}
                    >
                      {debris?.name || "Unknown Type"}
                    </Badge>
                  ))}
                  {sortedDebrisTypes.length > 2 && (
                    <Badge variant="outline" className="text-sm px-2 py-1">
                      +{sortedDebrisTypes.length - 2}
                    </Badge>
                  )}
                </>
              );
            })()}
          </div>

          {/* Pricing Information */}
          <div className="mb-3">
            {(location.debrisTypes || []).some((debris) => debris?.price) ? (
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-800">
                  Pricing:
                </span>
                {(() => {
                  // Priority order for pricing display
                  const priorityOrder = [
                    "Municipal Waste",
                    "General Waste",
                    "Household Waste",
                    "Construction Debris",
                    "Construction Waste",
                    "C&D Debris",
                    "Yard Waste",
                    "Green Waste",
                    "Organic Waste",
                  ];

                  const pricedDebris = (location.debrisTypes || []).filter(
                    (debris) => debris?.price,
                  );
                  const prioritized: typeof pricedDebris = [];
                  const remaining: typeof pricedDebris = [];

                  // Sort by priority
                  priorityOrder.forEach((priority) => {
                    const found = pricedDebris.find(
                      (debris) =>
                        debris?.name
                          ?.toLowerCase()
                          .includes(priority.toLowerCase()) ||
                        priority
                          .toLowerCase()
                          .includes(debris?.name?.toLowerCase() || ""),
                    );
                    if (found && !prioritized.includes(found)) {
                      prioritized.push(found);
                    }
                  });

                  // Add remaining items
                  pricedDebris.forEach((debris) => {
                    if (!prioritized.includes(debris)) {
                      remaining.push(debris);
                    }
                  });

                  const sortedDebris = [...prioritized, ...remaining];

                  return (
                    <>
                      {sortedDebris.slice(0, 3).map((debris) => (
                        <div
                          key={debris?.id || Math.random()}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-700">
                            {debris?.name || "Unknown"}:
                          </span>
                          <span className="text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                            ${debris?.price || 0}
                            {debris?.priceDetails
                              ? `/${debris.priceDetails}`
                              : "/ton"}
                          </span>
                        </div>
                      ))}
                      {sortedDebris.length > 3 && (
                        <div className="text-sm text-primary font-medium cursor-pointer hover:underline">
                          See {sortedDebris.length - 3} more pricing options →
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Call for pricing</div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {location.paymentTypes.slice(0, 2).map((payment) => (
              <Badge
                key={payment.id}
                variant="secondary"
                className="text-sm px-2 py-1"
              >
                {payment.name}
              </Badge>
            ))}
          </div>
          <Button asChild size="sm" className="w-full text-sm h-8">
            <Link to={generateLocationUrl(location)}>View More Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
