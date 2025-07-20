import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";
import { CustomAd } from "@shared/api";

interface AdvertisementProps {
  placement: "home" | "search" | "location" | "all";
  className?: string;
}

export default function Advertisement({
  placement,
  className = "",
}: AdvertisementProps) {
  const [adSettings, setAdSettings] = useState({
    adsenseEnabled: false,
    adsenseCode: "",
    customAdsEnabled: false,
    customAds: [] as CustomAd[],
  });
  const [displayAd, setDisplayAd] = useState<CustomAd | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    // Load ad settings from localStorage (admin settings)
    const savedSettings = localStorage.getItem("adSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAdSettings(settings);

        // Find custom ads for this placement
        if (settings.customAdsEnabled && settings.customAds) {
          const relevantAds = settings.customAds.filter(
            (ad: CustomAd) =>
              ad.isActive &&
              (ad.placement === placement || ad.placement === "all"),
          );

          if (relevantAds.length > 0) {
            // Sort by priority and select the highest priority ad
            const sortedAds = relevantAds.sort(
              (a: CustomAd, b: CustomAd) => b.priority - a.priority,
            );
            setDisplayAd(sortedAds[0]);
          }
        }
      } catch (error) {
        console.error("Error loading ad settings:", error);
      }
    }

    // Load dismissed ads
    const dismissedAds = localStorage.getItem("dismissedAds");
    if (dismissedAds) {
      try {
        setDismissed(JSON.parse(dismissedAds));
      } catch (error) {
        console.error("Error loading dismissed ads:", error);
      }
    }
  }, [placement]);

  const handleDismissAd = (adId: string) => {
    const newDismissed = [...dismissed, adId];
    setDismissed(newDismissed);
    localStorage.setItem("dismissedAds", JSON.stringify(newDismissed));
    setDisplayAd(null);
  };

  const handleAdClick = (ad: CustomAd) => {
    if (ad.linkUrl) {
      window.open(ad.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Don't show if ad is dismissed
  if (displayAd && dismissed.includes(displayAd.id)) {
    return null;
  }

  return (
    <div className={className}>
      {/* AdSense Integration */}
      {adSettings.adsenseEnabled && adSettings.adsenseCode && (
        <div className="mb-4">
          <div className="text-xs text-center text-muted-foreground mb-2">
            Advertisement
          </div>
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Google AdSense</p>
              <p className="text-xs">Ad will appear here</p>
              <p className="text-xs mt-1">Code: {adSettings.adsenseCode}</p>
            </div>
            {/* In production, this would be replaced with actual AdSense code */}
            {/* <ins className="adsbygoogle"
                 style={{display: "block"}}
                 data-ad-client={adSettings.adsenseCode}
                 data-ad-slot="..."
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins> */}
          </div>
        </div>
      )}

      {/* Custom Ads */}
      {displayAd && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-orange-900">
                    {displayAd.title}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded">
                    Sponsored
                  </span>
                </div>

                {displayAd.imageUrl && (
                  <div className="mb-3">
                    <img
                      src={displayAd.imageUrl}
                      alt={displayAd.title}
                      className="w-full max-h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <p className="text-sm text-orange-800 mb-3">
                  {displayAd.content}
                </p>

                <div className="flex gap-2">
                  {displayAd.linkUrl && (
                    <Button
                      size="sm"
                      onClick={() => handleAdClick(displayAd)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDismissAd(displayAd.id)}
                    className="border-orange-200 text-orange-700 hover:bg-orange-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
