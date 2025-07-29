import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { formatPhoneNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ArrowLeft,
  Navigation,
  DollarSign,
  AlertCircle,
  Share2,
  Heart,
  Eye,
  Calendar,
  Edit,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Globe,
  Building2,
  Trash2,
  HardHat,
} from "lucide-react";

interface PendingLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  website?: string;
  googleBusinessUrl?: string;
  locationType: "landfill" | "transfer_station" | "construction_landfill";
  paymentTypes: string[];
  debrisTypes: Array<{
    name: string;
    price?: number;
    priceDetails?: string;
  }>;
  operatingHours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
  additionalNotes?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export default function PreviewLocation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<PendingLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageViews] = useState(42); // Mock page views for preview

  useEffect(() => {
    if (id) {
      loadLocationData();
    }
  }, [id]);

  const loadLocationData = () => {
    setIsLoading(true);
    try {
      // Load from localStorage (in production, this would be from API)
      const pendingSuggestions = JSON.parse(localStorage.getItem("pendingSuggestions") || "[]");
      const foundLocation = pendingSuggestions.find((loc: PendingLocation) => loc.id === id);

      if (foundLocation) {
        setLocation(foundLocation);
      }
    } catch (error) {
      console.error("Error loading location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (!location) return;

    // Move to approved locations (in real app, this would be an API call)
    const existingLocations = JSON.parse(localStorage.getItem("locations") || "[]");
    const newLocation = {
      ...location,
      id: `location-${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("locations", JSON.stringify([...existingLocations, newLocation]));

    // Remove from pending suggestions
    const pendingSuggestions = JSON.parse(localStorage.getItem("pendingSuggestions") || "[]");
    const updated = pendingSuggestions.filter((loc: PendingLocation) => loc.id !== id);
    localStorage.setItem("pendingSuggestions", JSON.stringify(updated));

    alert("Location approved and added to active listings!");
    navigate("/admin/suggestions");
  };

  const handleReject = () => {
    if (!location) return;

    if (confirm("Are you sure you want to reject this location suggestion?")) {
      // Remove from pending suggestions
      const pendingSuggestions = JSON.parse(localStorage.getItem("pendingSuggestions") || "[]");
      const updated = pendingSuggestions.filter((loc: PendingLocation) => loc.id !== id);
      localStorage.setItem("pendingSuggestions", JSON.stringify(updated));

      alert("Location suggestion rejected.");
      navigate("/admin/suggestions");
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "landfill":
        return <Trash2 className="w-6 h-6" />;
      case "transfer_station":
        return <Building2 className="w-6 h-6" />;
      case "construction_landfill":
        return <HardHat className="w-6 h-6" />;
      default:
        return <Trash2 className="w-6 h-6" />;
    }
  };

  const getLocationLabel = (type: string) => {
    switch (type) {
      case "landfill":
        return "Municipal Landfill";
      case "transfer_station":
        return "Transfer Station";
      case "construction_landfill":
        return "Construction Landfill";
      default:
        return "Waste Facility";
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayOfWeek];
  };

  const formatTime = (time: string) => {
    if (time === "00:00") return "";
    const [hours, minutes] = time.split(":");
    const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
    const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
    return `${hour12 === 0 ? 12 : hour12}:${minutes} ${ampm}`;
  };

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getDirectionsUrl = () => {
    if (!location) return "#";
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`
    )}`;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!location) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Location Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The suggested location you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <a href="/admin/suggestions">Back to Suggestions</a>
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Admin Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/suggestions")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Suggestions
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReject}
              className="text-red-600 hover:text-red-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve & Add
            </Button>
          </div>
        </div>

        {/* Submission Details Alert */}
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            <strong>Submitted by:</strong> {location.submitterName} ({location.submitterEmail})
            {location.submitterPhone && ` • ${formatPhoneNumber(location.submitterPhone)}`}
            <br />
            <strong>Submitted:</strong> {new Date(location.submittedAt).toLocaleDateString()} at {new Date(location.submittedAt).toLocaleTimeString()}
            {location.additionalNotes && (
              <>
                <br />
                <strong>Notes:</strong> {location.additionalNotes}
              </>
            )}
          </AlertDescription>
        </Alert>

        {/* Location Preview - Styled like LocationDetail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  {getLocationIcon(location.locationType)}
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getLocationLabel(location.locationType)}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold mb-4">{location.name}</h1>

                <div className="flex items-center gap-2 mb-4">
                  {renderStars(0, "w-5 h-5")} {/* No rating for pending locations */}
                  <span className="text-lg font-medium">New Location</span>
                  <span className="text-muted-foreground">(0 reviews)</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Page views: {pageViews.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Debris Types & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Accepted Materials & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {location.debrisTypes.map((debris, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{debris.name}</span>
                      </div>
                      <div className="text-right">
                        {debris.price ? (
                          <div>
                            <span className="font-semibold text-green-600">
                              ${debris.price.toFixed(2)}
                            </span>
                            {debris.priceDetails && (
                              <span className="text-muted-foreground text-sm ml-1">
                                {debris.priceDetails}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Call for pricing</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {location.paymentTypes.map((payment) => (
                    <Badge key={payment} variant="outline">
                      {payment}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <a
                    href={getDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    <div>{location.address}</div>
                    <div>{location.city}, {location.state} {location.zipCode}</div>
                  </a>
                </div>

                {location.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <a
                      href={`tel:${location.phone}`}
                      className="text-primary hover:underline"
                    >
                      {formatPhoneNumber(location.phone)}
                    </a>
                  </div>
                )}

                {location.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <a
                      href={`mailto:${location.email}`}
                      className="text-primary hover:underline"
                    >
                      {location.email}
                    </a>
                  </div>
                )}

                {location.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <a
                      href={location.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {location.googleBusinessUrl && (
                  <div className="mt-4">
                    <Button
                      onClick={() => window.open(location.googleBusinessUrl, "_blank")}
                      className="w-full"
                      variant="outline"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      View Google Business Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {location.operatingHours.map((hours) => (
                    <div
                      key={hours.dayOfWeek}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium">
                        {getDayName(hours.dayOfWeek)}
                      </span>
                      <span className={hours.isClosed ? "text-muted-foreground" : ""}>
                        {hours.isClosed
                          ? "Closed"
                          : `${formatTime(hours.openTime)} - ${formatTime(hours.closeTime)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats for Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline">Pending Review</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Debris Types:</span>
                    <span>{location.debrisTypes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Methods:</span>
                    <span>{location.paymentTypes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Page Views:</span>
                    <span>{pageViews.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
