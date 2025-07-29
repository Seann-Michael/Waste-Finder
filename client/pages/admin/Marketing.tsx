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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  adType: "adsense" | "image" | "html";
  code: string; // For AdSense and HTML ads
  imageUrl?: string; // For image ads
  linkUrl?: string; // For image ads
  altText?: string; // For image ads
  placement: string;
  displayName: string;
  desktop: {
    enabled: boolean;
    code?: string;
    imageUrl?: string;
    linkUrl?: string;
    altText?: string;
  };
  mobile: {
    enabled: boolean;
    code?: string;
    imageUrl?: string;
    linkUrl?: string;
    altText?: string;
  };
}

export default function Marketing() {
  const { showSuccess, showError } = useToastNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [adConfigs, setAdConfigs] = useState<Record<string, AdConfig>>({
    homepage: {
      enabled: false,
      adType: "adsense",
      code: "",
      placement: "homepage",
      displayName: "Homepage Banner",
      desktop: { enabled: false },
      mobile: { enabled: false },
    },
    searchResults: {
      enabled: false,
      adType: "adsense",
      code: "",
      placement: "search-results",
      displayName: "Search Results Content",
      desktop: { enabled: false },
      mobile: { enabled: false },
    },
    searchResultsTop: {
      enabled: false,
      adType: "adsense",
      code: "",
      placement: "search-results-top",
      displayName: "Search Results Top Banner",
      desktop: { enabled: false },
      mobile: { enabled: false },
    },
    locationDetail: {
      enabled: false,
      adType: "adsense",
      code: "",
      placement: "location-detail",
      displayName: "Location Detail Content",
      desktop: { enabled: false },
      mobile: { enabled: false },
    },
    locationDetailTop: {
      enabled: false,
      adType: "adsense",
      code: "",
      placement: "location-detail-top",
      displayName: "Location Detail Top Banner",
      desktop: { enabled: false },
      mobile: { enabled: false },
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

  const validateAdCode = (code: string, adType: string): boolean => {
    if (code.length === 0) return true;

    switch (adType) {
      case "adsense":
        return code.includes("data-ad-client") || code.includes("google_ad_client");
      case "html":
        return true; // Allow any HTML
      default:
        return true;
    }
  };

  const validateImageAd = (config: AdConfig): boolean => {
    return !!(config.imageUrl && config.altText);
  };

  const isAdConfigValid = (config: AdConfig): boolean => {
    switch (config.adType) {
      case "adsense":
      case "html":
        return !!config.code;
      case "image":
        return validateImageAd(config);
      default:
        return false;
    }
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
                    {Object.values(adConfigs).filter(config => config.enabled && isAdConfigValid(config)).length}
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
                    {Object.values(adConfigs).filter(config => isAdConfigValid(config)).length}
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
                  <Label htmlFor={`${placement}-adtype`}>Ad Type</Label>
                  <Select
                    value={config.adType}
                    onValueChange={(value) => updateAdConfig(placement, "adType", value as "adsense" | "image" | "html")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ad type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adsense">Google AdSense</SelectItem>
                      <SelectItem value="image">Image Ad</SelectItem>
                      <SelectItem value="html">Custom HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.adType === "adsense" && (
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
                          config.code && !validateAdCode(config.code, config.adType) ? "border-red-500" : ""
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
                    {config.code && !validateAdCode(config.code, config.adType) && (
                      <Alert className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This doesn't appear to be a valid AdSense code. Please check the format.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {config.adType === "image" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`${placement}-image-url`}>Image URL</Label>
                      <Input
                        id={`${placement}-image-url`}
                        placeholder="https://example.com/banner.jpg"
                        value={config.imageUrl || ""}
                        onChange={(e) => updateAdConfig(placement, "imageUrl", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${placement}-link-url`}>Link URL (Optional)</Label>
                      <Input
                        id={`${placement}-link-url`}
                        placeholder="https://example.com/landing-page"
                        value={config.linkUrl || ""}
                        onChange={(e) => updateAdConfig(placement, "linkUrl", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${placement}-alt-text`}>Alt Text</Label>
                      <Input
                        id={`${placement}-alt-text`}
                        placeholder="Advertisement description"
                        value={config.altText || ""}
                        onChange={(e) => updateAdConfig(placement, "altText", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {config.adType === "html" && (
                  <div>
                    <Label htmlFor={`${placement}-html-code`}>Custom HTML Code</Label>
                    <div className="relative mt-1">
                      <Textarea
                        id={`${placement}-html-code`}
                        placeholder="Paste your custom HTML/JS code here..."
                        value={config.code}
                        onChange={(e) => updateAdConfig(placement, "code", e.target.value)}
                        rows={6}
                        className="font-mono text-sm"
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
                  </div>
                )}

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
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Google AdSense:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Go to your Google AdSense dashboard</li>
                  <li>Navigate to "Ads" → "Overview"</li>
                  <li>Click "Get code" next to your ad unit</li>
                  <li>Copy the HTML code and paste it in the placement</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium">Image Ads:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Upload your banner image to a hosting service</li>
                  <li>Enter the direct image URL (must be publicly accessible)</li>
                  <li>Add a destination URL where clicks should go</li>
                  <li>Provide descriptive alt text for accessibility</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium">Custom HTML:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Use for other ad networks (Media.net, PropellerAds, etc.)</li>
                  <li>Paste the HTML/JavaScript code provided by your ad network</li>
                  <li>Ensure code is from trusted sources only</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Placement Descriptions:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li><strong>Homepage Banner:</strong> Displays at the top of the homepage</li>
                <li><strong>Search Results Content:</strong> Shows in the main content area on search/browse pages</li>
                <li><strong>Search Results Top Banner:</strong> Horizontal banner at the top of search results page</li>
                <li><strong>Location Detail Content:</strong> Appears in the main content on individual location pages</li>
                <li><strong>Location Detail Top Banner:</strong> Horizontal banner at the top of location detail page</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
