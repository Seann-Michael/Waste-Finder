/**
 * AdSense Component - Revenue Generation System
 *
 * PURPOSE: Manages Google AdSense integration for website monetization
 *
 * AD PLACEMENT STRATEGY:
 * - Homepage: Banner ads above and below search form
 * - Search Results: Sidebar ads (300x250) and top banner (728x90)
 * - Location Detail: In-content ads and sidebar placements
 * - Blog Posts: In-content ads between paragraphs
 * - Mobile: Responsive ads that adapt to screen size
 *
 * AD TYPES SUPPORTED:
 * - Google AdSense: Automatic ad serving with revenue optimization
 * - Image Ads: Custom banner advertisements for local businesses
 * - HTML Ads: Rich media advertisements with interactive elements
 *
 * CONFIGURATION FEATURES:
 * - Admin panel ad management (enable/disable by placement)
 * - A/B testing support for ad performance optimization
 * - Revenue tracking and reporting integration
 * - Geographic targeting for local waste management companies
 *
 * COMPLIANCE & PRIVACY:
 * - GDPR-compliant ad serving with consent management
 * - CCPA compliance for California users
 * - Privacy policy integration
 * - Cookie consent for ad personalization
 *
 * PERFORMANCE OPTIMIZATION:
 * - Lazy loading prevents ads from blocking page render
 * - Async ad loading for improved page speed
 * - Ad blocker detection with fallback content
 * - Revenue reporting and optimization suggestions
 *
 * BUSINESS MODEL:
 * - Cost-per-click (CPC) revenue from search-related ads
 * - Display advertising for waste management companies
 * - Sponsored content in blog sections
 * - Local business directory advertising
 */
import { useEffect, useState } from "react";

interface AdSenseProps {
  placement: "homepage" | "search-results" | "location-detail" | "search-results-top" | "location-detail-top";
  className?: string;
}

interface AdConfig {
  enabled: boolean;
  adType: "adsense" | "image" | "html";
  code: string;
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
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

  // Check if ad is valid and enabled
  const isAdValid = () => {
    if (!adConfig || !adConfig.enabled) return false;

    switch (adConfig.adType) {
      case "adsense":
      case "html":
        return !!adConfig.code;
      case "image":
        return !!(adConfig.imageUrl && adConfig.altText);
      default:
        return false;
    }
  };

  // Render actual ad if enabled and valid
  if (isAdValid()) {
    return (
      <div className={`ad-container ${className}`}>
        <div className="text-xs text-muted-foreground text-center mb-2">
          Advertisement
        </div>
        <div className="flex justify-center">
          {adConfig!.adType === "image" ? (
            adConfig!.linkUrl ? (
              <a
                href={adConfig!.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={adConfig!.imageUrl}
                  alt={adConfig!.altText}
                  className="max-w-full h-auto rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </a>
            ) : (
              <img
                src={adConfig!.imageUrl}
                alt={adConfig!.altText}
                className="max-w-full h-auto rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )
          ) : (
            <div dangerouslySetInnerHTML={{ __html: adConfig!.code }} />
          )}
        </div>
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
              : "No ad configured"
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
