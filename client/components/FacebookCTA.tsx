import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Users } from "lucide-react";

interface FacebookCTAProps {
  className?: string;
}

export default function FacebookCTA({ className = "" }: FacebookCTAProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [facebookSettings, setFacebookSettings] = useState({
    enabled: true,
    groupUrl: "https://facebook.com/groups/wastefinder",
    ctaText:
      "Join our Facebook community to connect with other users, get waste disposal tips, and stay updated on new facilities!",
  });

  useEffect(() => {
    // Load Facebook settings from localStorage (admin settings)
    const savedSettings = localStorage.getItem("adSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.facebookGroupEnabled) {
          setFacebookSettings({
            enabled: settings.facebookGroupEnabled,
            groupUrl:
              settings.facebookGroupUrl ||
              "https://facebook.com/groups/wastefinder",
            ctaText: settings.facebookGroupCta || facebookSettings.ctaText,
          });
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.error("Error loading Facebook settings:", error);
      }
    }

    // Check if user has dismissed this CTA before
    const dismissed = localStorage.getItem("facebookCTADismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("facebookCTADismissed", "true");
  };

  const handleJoinGroup = () => {
    window.open(facebookSettings.groupUrl, "_blank", "noopener,noreferrer");
  };

  if (!isVisible || !facebookSettings.enabled) {
    return null;
  }

  return (
    <Card className={`border-l-4 border-l-blue-500 bg-blue-50/50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                Join Our Community
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                {facebookSettings.ctaText}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleJoinGroup}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Facebook Group
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-blue-600 hover:bg-blue-100 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
