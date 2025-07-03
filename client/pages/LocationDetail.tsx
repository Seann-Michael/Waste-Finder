import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SuggestEdit from "@/components/SuggestEdit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewAuthor, setReviewAuthor] = useState("");

  useEffect(() => {
    if (id) {
      loadLocationData();
    }
  }, [id]);

  const loadLocationData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockLocation: Location = {
        id: id || "1",
        name: "Green Valley Municipal Landfill",
        address: "1234 Waste Management Drive",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
        phone: "(555) 123-4567",
        email: "info@greenvalley.gov",
        website: "https://greenvalley.gov",
        latitude: 39.7817,
        longitude: -89.6501,
        facilityType: "landfill",
        paymentTypes: [
          { id: "1", name: "Cash" },
          { id: "2", name: "Credit/Debit Card" },
          { id: "3", name: "Check" },
        ],
        debrisTypes: [
          {
            id: "1",
            name: "General Household Waste",
            category: "general",
            pricePerTon: 65,
          },
          { id: "2", name: "Yard Waste", category: "general", pricePerTon: 35 },
          {
            id: "3",
            name: "Appliances",
            category: "general",
            pricePerLoad: 25,
          },
          {
            id: "4",
            name: "Electronics",
            category: "recyclable",
            priceNote: "Free drop-off",
          },
          { id: "5", name: "Tires", category: "general", pricePerLoad: 15 },
        ],
        operatingHours: [
          {
            dayOfWeek: 1,
            openTime: "07:00",
            closeTime: "17:00",
            isClosed: false,
          },
          {
            dayOfWeek: 2,
            openTime: "07:00",
            closeTime: "17:00",
            isClosed: false,
          },
          {
            dayOfWeek: 3,
            openTime: "07:00",
            closeTime: "17:00",
            isClosed: false,
          },
          {
            dayOfWeek: 4,
            openTime: "07:00",
            closeTime: "17:00",
            isClosed: false,
          },
          {
            dayOfWeek: 5,
            openTime: "07:00",
            closeTime: "17:00",
            isClosed: false,
          },
          {
            dayOfWeek: 6,
            openTime: "08:00",
            closeTime: "15:00",
            isClosed: false,
          },
          {
            dayOfWeek: 0,
            openTime: "00:00",
            closeTime: "00:00",
            isClosed: true,
          },
        ],
        notes:
          "Large municipal facility accepting most household and commercial waste. Recycling center on-site. Special handling for hazardous materials available by appointment. Scale house for accurate weight-based pricing.",
        rating: 4.5,
        reviewCount: 127,
        distance: 3.2,
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
      };

      const mockReviews: Review[] = [
        {
          id: "1",
          locationId: id || "1",
          rating: 5,
          title: "Excellent service and fair pricing",
          content:
            "Very professional staff and clean facility. The scale house process was quick and efficient. Prices are reasonable compared to other facilities in the area.",
          authorName: "Mike T.",
          isApproved: true,
          isModerated: true,
          createdAt: "2024-01-10T00:00:00Z",
        },
        {
          id: "2",
          locationId: id || "1",
          rating: 4,
          title: "Good facility, long wait times",
          content:
            "The facility is well-maintained and staff is helpful. However, there can be long wait times during peak hours, especially on Saturdays.",
          authorName: "Sarah L.",
          isApproved: true,
          isModerated: true,
          createdAt: "2024-01-05T00:00:00Z",
        },
        {
          id: "3",
          locationId: id || "1",
          rating: 5,
          title: "Great recycling options",
          content:
            "Love that they have a comprehensive recycling center. Staff helped me properly dispose of old electronics and appliances.",
          authorName: "Jennifer R.",
          isApproved: true,
          isModerated: true,
          createdAt: "2023-12-28T00:00:00Z",
        },
      ];

      setLocation(mockLocation);
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

  const getFacilityIcon = (type: Location["facilityType"]) => {
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

  const getFacilityLabel = (type: Location["facilityType"]) => {
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
              <h1 className="text-2xl font-bold mb-2">Facility Not Found</h1>
              <p className="text-muted-foreground mb-4">
                The facility you're looking for doesn't exist or has been
                removed.
              </p>
              <Button asChild>
                <Link to="/">Search Facilities</Link>
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back to Results & Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
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
            <Button variant="outline" onClick={() => window.history.back()}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary">
                    {getFacilityIcon(location.facilityType)}
                  </div>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getFacilityLabel(location.facilityType)}
                  </Badge>
                </div>

                <h1 className="text-3xl font-bold mb-4">{location.name}</h1>

                <div className="flex items-center gap-2 mb-4">
                  {renderStars(location.rating, "w-5 h-5")}
                  <span className="text-lg font-medium">{location.rating}</span>
                  <span className="text-muted-foreground">
                    ({location.reviewCount} reviews)
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

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <a
                      href={`tel:${location.phone}`}
                      className="text-primary hover:underline"
                    >
                      {location.phone}
                    </a>
                  </div>

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
                            {debris.pricePerTon
                              ? `$${debris.pricePerTon}/ton`
                              : debris.pricePerLoad
                                ? `$${debris.pricePerLoad}/load`
                                : debris.priceNote || "Call for pricing"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      * Prices may vary based on quantity and material
                      condition. Contact facility for current rates and minimum
                      requirements.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Price table last updated:{" "}
                      {new Date(location.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
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
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {location.paymentTypes.map((payment) => (
                      <Badge key={payment.id} variant="outline">
                        {payment.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              {location.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{location.notes}</p>
                  </CardContent>
                </Card>
              )}

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
                      No reviews yet. Be the first to review this facility!
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
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{getFacilityLabel(location.facilityType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span>{location.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reviews:</span>
                    <span>{location.reviewCount}</span>
                  </div>
                  {location.distance && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance:</span>
                      <span>{location.distance} miles</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Interactive Map
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Coming Soon
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>Click address above for directions</p>
                  </div>
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
              <Label>Rating</Label>
              <Select
                value={reviewRating.toString()}
                onValueChange={(value) => setReviewRating(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Stars - Excellent</SelectItem>
                  <SelectItem value="4">4 Stars - Good</SelectItem>
                  <SelectItem value="3">3 Stars - Average</SelectItem>
                  <SelectItem value="2">2 Stars - Poor</SelectItem>
                  <SelectItem value="1">1 Star - Terrible</SelectItem>
                </SelectContent>
              </Select>
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
