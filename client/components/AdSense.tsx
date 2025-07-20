import { useEffect, useState } from "react";

interface AdSenseProps {
  placement: "homepage" | "search-results" | "location-detail";
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

  // Don't render if ad is disabled or no code
  if (!adConfig || !adConfig.enabled || !adConfig.code) {
    return null;
  }

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
