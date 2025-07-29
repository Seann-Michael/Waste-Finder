import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FacebookCTA from "@/components/FacebookCTA";
import AdSense from "@/components/AdSense";
import SuggestEdit from "@/components/SuggestEdit";
import { formatPhoneNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import StarRating from "@/components/ui/star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Location, Review } from "@shared/api";
import {
  MapPin,
  Phone,
  Clock,
  Globe,
  Mail,
  Star,
  Navigation,
  Edit,
  MessageSquare,
  CreditCard,
  Trash2,
  Building2,
  HardHat,
  ChevronLeft,
  Calendar,
  DollarSign,
  AlertCircle,
  Facebook,
  Users,
  Save,
  X,
} from "lucide-react";

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [pageViews, setPageViews] = useState(0);

  // Admin inline editing state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    googleBusinessUrl: "",
    facilityType: "",
    paymentTypes: [] as string[],
    additionalPaymentDetails: "",
    debrisTypes: [] as string[],
    debrisPricing: {} as Record<
      string,
      { price?: number; priceDetails?: string }
    >,
    notes: "",
    operatingHours: [] as any[],
  });

  // Payment and debris options for editing
  const paymentOptions = ["Cash", "Check", "Credit/Debit", "Net Terms"];
  const debrisOptions = [
    "General Household Waste",
    "Yard Waste",
    "Construction Debris",
    "Appliances",
    "Electronics",
    "Tires",
    "Concrete",
    "Asphalt",
    "Metal",
    "Hazardous Waste",
  ];

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewAuthor, setReviewAuthor] = useState("");

  useEffect(() => {
    if (id) {
      loadLocationData();
      incrementPageView();
    }
  }, [id]);

  const incrementPageView = () => {
    if (!id) return;

    const viewKey = `pageviews_${id}`;
    const currentViews = parseInt(localStorage.getItem(viewKey) || "0");
    const newViews = currentViews + 1;
    localStorage.setItem(viewKey, newViews.toString());
    setPageViews(newViews);
  };

  const getLocationIdNumber = (locationId: string): string => {
    // Extract numerical part from location ID (e.g., "location-4" -> "4")
    const match = locationId.match(/\d+/);
    return match ? match[0] : locationId;
  };

  const loadLocationData = async () => {
    setIsLoading(true);
    try {
      // Fetch location data from server
      const response = await fetch(`/api/locations/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();
      const fetchedLocation = data.data;

      if (!fetchedLocation) {
        throw new Error("Location not found");
      }

      // Mock reviews data (this would typically come from a separate API endpoint)
      const mockReviews: Review[] = [
        {
          id: "1",
          locationId: fetchedLocation.id,
          rating: 5,
          content:
            "Excellent facility with friendly staff. Very organized and clean. Pricing is fair and competitive.",
          authorName: "Mike T.",
          isApproved: true,
          isModerated: true,
          createdAt: "2024-01-15T00:00:00Z",
        },
        {
          id: "2",
          locationId: fetchedLocation.id,
          rating: 4,
          content:
            "Good location for construction debris disposal. Quick service, though parking can be limited during peak hours.",
          authorName: "Sarah L.",
          isApproved: true,
          isModerated: true,
          createdAt: "2024-01-08T00:00:00Z",
        },
        {
          id: "3",
          locationId: fetchedLocation.id,
          rating: 5,
          content:
            "Love that they have a comprehensive recycling center. Staff helped me properly dispose of old electronics and appliances.",
          authorName: "Jennifer R.",
          isApproved: true,
          isModerated: true,
          createdAt: "2023-12-28T00:00:00Z",
        },
      ];

      setLocation(fetchedLocation);
      setReviews(mockReviews);
    } catch (error) {
      console.error("Error loading location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    // Mock review submission
    const newReview: Review = {
      id: Date.now().toString(),
      locationId: id || "1",
      rating: reviewRating,
      title: reviewTitle,
      content: reviewContent,
      authorName: reviewAuthor,
      isApproved: false,
      isModerated: false,
      createdAt: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    setReviewRating(5);
    setReviewTitle("");
    setReviewContent("");
    setReviewAuthor("");
  };

  const getLocationIcon = (type: Location["locationType"]) => {
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

  const getLocationLabel = (type: Location["locationType"]) => {
    switch (type) {
      case "landfill":
        return "Municipal Landfill";
      case "transfer_station":
        return "Transfer Station";
      case "construction_landfill":
        return "Construction Landfill";
      default:
        return "Waste Location";
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayOfWeek];
  };

  const formatTime = (time: string) => {
    if (time === "00:00") return "";
    const [hours, minutes] = time.split(":");
    const hour12 =
      parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
    const ampm = parseInt(hours) >= 12 ? "PM" : "AM";
    return `${hour12 === 0 ? 12 : hour12}:${minutes} ${ampm}`;
  };

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getDirectionsUrl = () => {
    if (!location) return "#";
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`,
    )}`;
  };

  // Admin editing functions
  const handleEditMode = () => {
    if (!location) return;

    // Create debris pricing map from location data
    const debrisPricingMap: Record<
      string,
      { price?: number; priceDetails?: string }
    > = {};
    location.debrisTypes?.forEach((debris) => {
      debrisPricingMap[debris.name] = {
        price: debris.price,
        priceDetails: debris.priceDetails || "",
      };
    });

    setEditFormData({
      name: location.name || "",
      address: location.address || "",
      city: location.city || "",
      state: location.state || "",
      zipCode: location.zipCode || "",
      phone: location.phone || "",
      email: location.email || "",
      website: location.website || "",
      googleBusinessUrl: location.googleBusinessUrl || "",
      facilityType: location.locationType || "",
      paymentTypes: location.paymentTypes?.map((p) => p.name) || [],
      additionalPaymentDetails: location.additionalPaymentDetails || "",
      debrisTypes: location.debrisTypes?.map((d) => d.name) || [],
      debrisPricing: debrisPricingMap,
      notes: location.notes || "",
      operatingHours: location.operatingHours || [],
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      website: "",
      googleBusinessUrl: "",
      facilityType: "",
      paymentTypes: [],
      additionalPaymentDetails: "",
      debrisTypes: [],
      debrisPricing: {},
      notes: "",
      operatingHours: [],
    });
  };

  const handleSaveEdit = async () => {
    if (!location || !id) return;

    setIsSubmitting(true);
    try {
      const updatedLocation = {
        ...location,
        ...editFormData,
        paymentTypes: editFormData.paymentTypes.map((name, index) => ({
          id: index.toString(),
          name,
        })),
        debrisTypes: editFormData.debrisTypes.map((name, index) => ({
          id: index.toString(),
          name,
          price: editFormData.debrisPricing[name]?.price,
          priceDetails: editFormData.debrisPricing[name]?.priceDetails || "",
        })),
        locationType: editFormData.facilityType,
        updatedAt: new Date().toISOString(),
      };

      // Update via API
      const response = await fetch(`/api/locations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLocation),
      });

      if (response.ok) {
        setLocation(updatedLocation);
        setIsEditMode(false);
        alert("Location updated successfully!");
      } else {
        throw new Error("Failed to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Failed to update location. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOperatingHourChange = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((hour, i) =>
        i === index ? { ...hour, [field]: value } : hour,
      ),
    }));
  };

  const handlePaymentTypeChange = (type: string, checked: boolean) => {
    setEditFormData((prev) => ({
      ...prev,
      paymentTypes: checked
        ? [...prev.paymentTypes, type]
        : prev.paymentTypes.filter((t) => t !== type),
    }));
  };

  const handleDebrisTypeChange = (type: string, checked: boolean) => {
    setEditFormData((prev) => {
      const newDebrisTypes = checked
        ? [...prev.debrisTypes, type]
        : prev.debrisTypes.filter((t) => t !== type);

      // Initialize pricing for new debris type or remove it
      const newDebrisPricing = { ...prev.debrisPricing };
      if (checked && !newDebrisPricing[type]) {
        newDebrisPricing[type] = { price: undefined, priceDetails: "" };
      } else if (!checked) {
        delete newDebrisPricing[type];
      }

      return {
        ...prev,
        debrisTypes: newDebrisTypes,
        debrisPricing: newDebrisPricing,
      };
    });
  };

  const handleDebrisPricingChange = (
    debrisType: string,
    field: "price" | "priceDetails",
    value: string | number,
  ) => {
    setEditFormData((prev) => ({
      ...prev,
      debrisPricing: {
        ...prev.debrisPricing,
        [debrisType]: {
          ...prev.debrisPricing[debrisType],
          [field]:
            field === "price"
              ? value === ""
                ? undefined
                : Number(value)
              : value,
        },
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
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
        </main>
        <Footer />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Location Not Found</h1>
              <p className="text-muted-foreground mb-4">
                The location you're looking for doesn't exist or has been
                removed.
              </p>
              <Button asChild>
                <Link to="/">Search Locations</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Top Banner Ad */}
        <AdSense placement="location-detail-top" className="py-4" />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back to Results & Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
                <span>/</span>
                <Link to="/all-locations" className="hover:text-primary">
                  Locations
                </Link>
                <span>/</span>
                <span>{location.name}</span>
              </div>

              {/* Edit button for super admin only */}
              {localStorage.getItem("adminLoggedIn") && !isEditMode && (
                <Button variant="outline" size="sm" onClick={handleEditMode}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}

              {/* Save/Cancel buttons when in edit mode */}
              {localStorage.getItem("adminLoggedIn") && isEditMode && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary">
                    {getLocationIcon(location.locationType)}
                  </div>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getLocationLabel(location.locationType)}
                  </Badge>
                </div>

                {isEditMode ? (
                  <div className="mb-4">
                    <Label htmlFor="edit-name" className="text-sm font-medium">
                      Location Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={editFormData.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      className="text-3xl font-bold border-2 border-primary/30 focus:border-primary"
                      placeholder="Enter location name"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold mb-4">{location.name}</h1>
                )}

                <div className="flex items-center gap-2 mb-4">
                  {renderStars(
                    reviews.length > 0
                      ? reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0,
                        ) / reviews.length
                      : 0,
                    "w-5 h-5",
                  )}
                  <span className="text-lg font-medium">
                    {reviews.length > 0
                      ? (
                          reviews.reduce(
                            (acc, review) => acc + review.rating,
                            0,
                          ) / reviews.length
                        ).toFixed(1)
                      : "0"}
                  </span>
                  <span className="text-muted-foreground">
                    ({reviews.length} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Write Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSuggestionForm(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Suggest Edit
                  </Button>
                </div>
              </div>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditMode ? (
                    <>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="edit-address">Street Address</Label>
                          <Input
                            id="edit-address"
                            value={editFormData.address}
                            onChange={(e) =>
                              handleFormChange("address", e.target.value)
                            }
                            placeholder="1234 Main St"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor="edit-city">City</Label>
                            <Input
                              id="edit-city"
                              value={editFormData.city}
                              onChange={(e) =>
                                handleFormChange("city", e.target.value)
                              }
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-state">State</Label>
                            <Input
                              id="edit-state"
                              value={editFormData.state}
                              onChange={(e) =>
                                handleFormChange("state", e.target.value)
                              }
                              placeholder="IL"
                              maxLength={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-zipCode">ZIP</Label>
                            <Input
                              id="edit-zipCode"
                              value={editFormData.zipCode}
                              onChange={(e) =>
                                handleFormChange("zipCode", e.target.value)
                              }
                              placeholder="62701"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="edit-phone">Phone Number</Label>
                          <Input
                            id="edit-phone"
                            value={editFormData.phone}
                            onChange={(e) =>
                              handleFormChange("phone", e.target.value)
                            }
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-email">Email Address</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={editFormData.email}
                            onChange={(e) =>
                              handleFormChange("email", e.target.value)
                            }
                            placeholder="info@location.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-website">Website</Label>
                          <Input
                            id="edit-website"
                            value={editFormData.website}
                            onChange={(e) =>
                              handleFormChange("website", e.target.value)
                            }
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-googleBusinessUrl">
                            Google Business Profile
                          </Label>
                          <Input
                            id="edit-googleBusinessUrl"
                            value={editFormData.googleBusinessUrl}
                            onChange={(e) =>
                              handleFormChange(
                                "googleBusinessUrl",
                                e.target.value,
                              )
                            }
                            placeholder="https://maps.google.com/..."
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <a
                          href={getDirectionsUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <div>{location.address}</div>
                          <div>
                            {location.city}, {location.state} {location.zipCode}
                          </div>
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
                            onClick={() =>
                              window.open(location.googleBusinessUrl, "_blank")
                            }
                            className="w-full"
                            variant="outline"
                          >
                            <Building2 className="w-4 h-4 mr-2" />
                            View Google Business Profile
                          </Button>
                        </div>
                      )}
                    </>
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
                  {isEditMode ? (
                    <div className="space-y-4">
                      {editFormData.operatingHours.map((hours, index) => (
                        <div
                          key={hours.dayOfWeek}
                          className="flex items-center gap-4"
                        >
                          <div className="w-20 text-sm font-medium">
                            {getDayName(hours.dayOfWeek)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={!hours.isClosed}
                              onCheckedChange={(checked) =>
                                handleOperatingHourChange(
                                  index,
                                  "isClosed",
                                  !checked,
                                )
                              }
                            />
                            <span className="text-sm">Open</span>
                          </div>
                          {!hours.isClosed && (
                            <>
                              <Input
                                type="time"
                                value={hours.openTime}
                                onChange={(e) =>
                                  handleOperatingHourChange(
                                    index,
                                    "openTime",
                                    e.target.value,
                                  )
                                }
                                className="w-32"
                              />
                              <span className="text-sm text-muted-foreground">
                                to
                              </span>
                              <Input
                                type="time"
                                value={hours.closeTime}
                                onChange={(e) =>
                                  handleOperatingHourChange(
                                    index,
                                    "closeTime",
                                    e.target.value,
                                  )
                                }
                                className="w-32"
                              />
                            </>
                          )}
                          {hours.isClosed && (
                            <span className="text-sm text-muted-foreground">
                              Closed
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {location.operatingHours.map((hours) => (
                          <div
                            key={hours.dayOfWeek}
                            className="flex justify-between items-center"
                          >
                            <span className="font-medium">
                              {getDayName(hours.dayOfWeek)}
                            </span>
                            <span
                              className={
                                hours.isClosed ? "text-muted-foreground" : ""
                              }
                            >
                              {hours.isClosed
                                ? "Closed"
                                : `${formatTime(hours.openTime)} - ${formatTime(hours.closeTime)}`}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          * Please call to verify hours and check for holiday
                          schedules. Hours may vary during peak seasons or
                          special circumstances.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Accepted Materials with Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Accepted Materials & Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditMode ? (
                    <div className="space-y-6">
                      {/* Debris Type Selection */}
                      <div>
                        <Label className="text-base font-medium mb-3 block">
                          Select Accepted Debris Types
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {debrisOptions.map((option) => (
                            <div
                              key={option}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                checked={editFormData.debrisTypes.includes(
                                  option,
                                )}
                                onCheckedChange={(checked) =>
                                  handleDebrisTypeChange(
                                    option,
                                    checked as boolean,
                                  )
                                }
                              />
                              <Label className="text-sm">{option}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing for Selected Debris Types */}
                      {editFormData.debrisTypes.length > 0 && (
                        <div>
                          <Label className="text-base font-medium mb-3 block">
                            Pricing Information
                          </Label>
                          <div className="space-y-4">
                            {editFormData.debrisTypes.map((debrisType) => (
                              <div
                                key={debrisType}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2 h-2 bg-success rounded-full"></div>
                                  <span className="font-medium">
                                    {debrisType}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <Label
                                      htmlFor={`price-${debrisType}`}
                                      className="text-sm"
                                    >
                                      Price per ton ($)
                                    </Label>
                                    <Input
                                      id={`price-${debrisType}`}
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={
                                        editFormData.debrisPricing[debrisType]
                                          ?.price ?? ""
                                      }
                                      onChange={(e) =>
                                        handleDebrisPricingChange(
                                          debrisType,
                                          "price",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor={`priceDetails-${debrisType}`}
                                      className="text-sm"
                                    >
                                      Price Details
                                    </Label>
                                    <Input
                                      id={`priceDetails-${debrisType}`}
                                      value={
                                        editFormData.debrisPricing[debrisType]
                                          ?.priceDetails ?? ""
                                      }
                                      onChange={(e) =>
                                        handleDebrisPricingChange(
                                          debrisType,
                                          "priceDetails",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="per ton, minimum, etc."
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {location.debrisTypes.map((debris) => (
                          <div
                            key={debris.id}
                            className="flex justify-between items-center p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-success rounded-full"></div>
                              <span className="font-medium">{debris.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-primary">
                                {debris.price !== undefined
                                  ? `$${debris.price.toFixed(2)} ${debris.priceDetails || ""}`
                                  : "Call for pricing"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          * Prices may vary based on quantity and material
                          condition. Contact location for current rates and
                          minimum requirements.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Price table last updated:{" "}
                          {new Date(location.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isEditMode ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {paymentOptions.map((option) => (
                          <div
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={editFormData.paymentTypes.includes(
                                option,
                              )}
                              onCheckedChange={(checked) =>
                                handlePaymentTypeChange(
                                  option,
                                  checked as boolean,
                                )
                              }
                            />
                            <Label className="text-sm">{option}</Label>
                          </div>
                        ))}
                      </div>
                      <div>
                        <Label htmlFor="edit-additionalPaymentDetails">
                          Additional Payment Details
                        </Label>
                        <Textarea
                          id="edit-additionalPaymentDetails"
                          value={editFormData.additionalPaymentDetails}
                          onChange={(e) =>
                            handleFormChange(
                              "additionalPaymentDetails",
                              e.target.value,
                            )
                          }
                          placeholder="Any additional payment information..."
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-3">
                        {location.paymentTypes.map((payment) => (
                          <Badge key={payment.id} variant="outline">
                            {payment.name}
                          </Badge>
                        ))}
                      </div>
                      {location.additionalPaymentDetails && (
                        <div className="text-sm text-muted-foreground border-t pt-3">
                          <strong>Additional Payment Details:</strong>{" "}
                          {location.additionalPaymentDetails}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Additional Location Details */}
              {(location.notes || isEditMode) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Location Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <div>
                        <Label htmlFor="edit-notes">
                          Additional Information
                        </Label>
                        <Textarea
                          id="edit-notes"
                          value={editFormData.notes}
                          onChange={(e) =>
                            handleFormChange("notes", e.target.value)
                          }
                          placeholder="Any additional information about the location, directions, restrictions, etc."
                          rows={4}
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground">{location.notes}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* AdSense for Location Detail */}
              <AdSense placement="location-detail" className="my-6" />

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Reviews ({reviews.length})</span>
                    <Button onClick={() => setShowReviewForm(true)}>
                      Write Review
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No reviews yet. Be the first to review this location!
                    </p>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-border pb-6 last:border-b-0"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="font-medium">
                            {review.authorName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {!review.isApproved && (
                            <Badge variant="outline" className="text-xs">
                              Pending Approval
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold mb-2">{review.title}</h4>
                        <p className="text-muted-foreground">
                          {review.content}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Facebook CTA - Smaller Height */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Facebook className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 text-sm mb-1">
                        Join Our Community!
                      </h3>
                      <p className="text-xs text-blue-700 mb-2">
                        Connect with waste management professionals.
                      </p>
                      <Button
                        onClick={() =>
                          window.open(
                            "https://facebook.com/groups/wastefindergroup",
                            "_blank",
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        Join Group
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Spacer to align with Contact Information */}
              <div className="h-2"></div>

              {/* Google Map Embed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4!2d${location.longitude}!3d${location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus`}
                      title="Location Map"
                      className="border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getDirectionsUrl(), "_blank")}
                      className="w-full"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location ID:</span>
                    <span className="font-mono text-sm">
                      {getLocationIdNumber(location.id)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{getLocationLabel(location.locationType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span>{location.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reviews:</span>
                    <span>{reviews.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Page Views:</span>
                    <span>{pageViews}</span>
                  </div>
                  {location.distance && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance:</span>
                      <span>{location.distance} miles</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Review Form Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {location.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="block mb-2">Rating</Label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={reviewRating}
                  onRatingChange={setReviewRating}
                  size="lg"
                />
                <span className="text-sm text-muted-foreground">
                  {reviewRating > 0
                    ? `${reviewRating} star${reviewRating > 1 ? "s" : ""}`
                    : "Click to rate"}
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="review-title">Title</Label>
              <Input
                id="review-title"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Brief summary of your experience"
              />
            </div>
            <div>
              <Label htmlFor="review-content">Review</Label>
              <Textarea
                id="review-content"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Describe your experience in detail..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="review-author">Your Name</Label>
              <Input
                id="review-author"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="How should we display your name?"
              />
            </div>

            {/* Google reCAPTCHA Placeholder */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                reCAPTCHA verification will appear here
              </p>
              <div className="mt-2 text-xs text-center text-muted-foreground">
                (Google reCAPTCHA integration required)
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={!reviewTitle || !reviewContent || !reviewAuthor}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suggestion Edit Component */}
      <SuggestEdit
        location={location}
        isOpen={showSuggestionForm}
        onClose={() => setShowSuggestionForm(false)}
        onSubmit={(suggestion) => {
          console.log("Suggestion submitted:", suggestion);
          // In real app, send to API
        }}
      />

      <Footer />
    </div>
  );
}
