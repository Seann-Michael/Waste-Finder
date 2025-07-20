import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DollarSign,
  Eye,
  Code,
  Copy,
  CheckCircle,
  AlertCircle,
  Monitor,
  Smartphone,
  Search,
  MapPin,
  Home,
  Save,
} from "lucide-react";
import { useToastNotifications } from "@/hooks/use-toast-notifications";

interface AdConfig {
  enabled: boolean;
  code: string;
  placement: string;
  displayName: string;
}

export default function Marketing() {
  const { showSuccess, showError } = useToastNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [adConfigs, setAdConfigs] = useState<Record<string, AdConfig>>({
    homepage: {
      enabled: false,
      code: "",
      placement: "homepage",
      displayName: "Homepage Banner",
    },
    searchResults: {
      enabled: false,
      code: "",
      placement: "search-results",
      displayName: "Search Results Sidebar",
    },
    locationDetail: {
      enabled: false,
      code: "",
      placement: "location-detail",
      displayName: "Location Detail Page",
    },
  });

  useEffect(() => {
    loadAdConfigs();
  }, []);

  const loadAdConfigs = () => {
    // Load from localStorage (in production, this would be from API)
    const savedConfigs = localStorage.getItem("adConfigs");
    if (savedConfigs) {
      setAdConfigs(JSON.parse(savedConfigs));
    }
  };

  const saveAdConfigs = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage (in production, this would be API call)
      localStorage.setItem("adConfigs", JSON.stringify(adConfigs));
      showSuccess("Ad configurations saved successfully!");
    } catch (error) {
      showError("Failed to save ad configurations");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdConfig = (placement: string, field: keyof AdConfig, value: any) => {
    setAdConfigs(prev => ({
      ...prev,
      [placement]: {
        ...prev[placement],
        [field]: value,
      },
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Code copied to clipboard!");
    } catch (error) {
      showError("Failed to copy code");
    }
  };

  const getPlacementIcon = (placement: string) => {
    switch (placement) {
      case "homepage":
        return <Home className="w-4 h-4" />;
      case "search-results":
        return <Search className="w-4 h-4" />;
      case "location-detail":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const validateAdCode = (code: string): boolean => {
    // Basic validation for AdSense code
    return code.includes("data-ad-client") || code.includes("google_ad_client") || code.length === 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Marketing & Advertising</h1>
              <p className="text-muted-foreground">
                Manage AdSense and advertising across your site
              </p>
            </div>
          </div>
          <Button onClick={saveAdConfigs} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Ads</p>
                  <p className="text-2xl font-bold">
                    {Object.values(adConfigs).filter(config => config.enabled && config.code).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Placements</p>
                  <p className="text-2xl font-bold">{Object.keys(adConfigs).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Codes</p>
                  <p className="text-2xl font-bold">
                    {Object.values(adConfigs).filter(config => config.code).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ad Placements */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Ad Placements</h2>
            <p className="text-muted-foreground">
              Configure AdSense codes for different sections of your website
            </p>
          </div>

          {Object.entries(adConfigs).map(([placement, config]) => (
            <Card key={placement}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPlacementIcon(placement)}
                    {config.displayName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={config.enabled ? "default" : "secondary"}>
                      {config.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(checked) => updateAdConfig(placement, "enabled", checked)}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`${placement}-code`}>AdSense Code</Label>
                  <div className="relative mt-1">
                    <Textarea
                      id={`${placement}-code`}
                      placeholder="Paste your Google AdSense code here..."
                      value={config.code}
                      onChange={(e) => updateAdConfig(placement, "code", e.target.value)}
                      rows={6}
                      className={`font-mono text-sm ${
                        config.code && !validateAdCode(config.code) ? "border-red-500" : ""
                      }`}
                    />
                    {config.code && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(config.code)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  {config.code && !validateAdCode(config.code) && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This doesn't appear to be a valid AdSense code. Please check the format.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Monitor className="w-4 h-4" />
                    Desktop
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>AdSense Integration Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">How to get your AdSense code:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Go to your Google AdSense dashboard</li>
                <li>Navigate to "Ads" → "Overview"</li>
                <li>Click "Get code" next to your ad unit</li>
                <li>Copy the HTML code provided</li>
                <li>Paste it in the appropriate placement above</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Placement Descriptions:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li><strong>Homepage Banner:</strong> Displays at the top of the homepage</li>
                <li><strong>Search Results Sidebar:</strong> Shows in the sidebar on search/browse pages</li>
                <li><strong>Location Detail Page:</strong> Appears on individual location pages</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
