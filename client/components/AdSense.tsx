import { useEffect, useState } from "react";

interface AdSenseProps {
  placement: "homepage" | "search-results" | "location-detail" | "search-results-top" | "location-detail-top";
  className?: string;
}

interface AdConfig {
  enabled: boolean;
  code: string;
  placement: string;
  displayName: string;
}

export default function AdSense({ placement, className = "" }: AdSenseProps) {
  const [adConfig, setAdConfig] = useState<AdConfig | null>(null);

  useEffect(() => {
    // Load ad configuration from localStorage
    const savedConfigs = localStorage.getItem("adConfigs");
    if (savedConfigs) {
      const configs = JSON.parse(savedConfigs);
      setAdConfig(configs[placement]);
    }
  }, [placement]);

  const getPlacementDisplayName = () => {
    switch (placement) {
      case "homepage":
        return "Homepage Banner";
      case "search-results":
        return "Search Results";
      case "search-results-top":
        return "Search Results Top Banner";
      case "location-detail":
        return "Location Detail";
      case "location-detail-top":
        return "Location Detail Top Banner";
      default:
        return "Advertisement";
    }
  };

  // Show actual ad if enabled and has code
  if (adConfig && adConfig.enabled && adConfig.code) {
    return (
      <div className={`ad-container ${className}`}>
        <div className="text-xs text-muted-foreground text-center mb-2">
          Advertisement
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: adConfig.code }}
          className="flex justify-center"
        />
      </div>
    );
  }

  // Show placeholder when ad is disabled or no code
  return (
    <div className={`ad-placeholder ${className}`}>
      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center bg-muted/20">
        <div className="text-xs text-muted-foreground mb-2">
          {getPlacementDisplayName()} Ad Placement
        </div>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
          </div>
          <div className="text-sm">
            {!adConfig || !adConfig.enabled
              ? "Ad placement disabled"
              : "No ad code configured"
            }
          </div>
          <div className="text-xs text-muted-foreground/70">
            Configure in Admin → Marketing
          </div>
        </div>
      </div>
    </div>
  );
}
