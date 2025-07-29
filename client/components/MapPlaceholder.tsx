import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MapPlaceholderProps {
  locations?: any[];
  className?: string;
}

export default function MapPlaceholder({
  locations = [],
  className = "",
}: MapPlaceholderProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-0">
        <div className="h-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Mock markers */}
          {locations.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className="absolute w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 2) * 20}%`,
              }}
            >
              <MapPin className="w-3 h-3 text-white" />
            </div>
          ))}

          {/* Center content */}
          <div className="text-center z-10">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Interactive Map Coming Soon
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              View location details with interactive Google Maps integration
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              {locations.length} facilities will be shown on the map
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
