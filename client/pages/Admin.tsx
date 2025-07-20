import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import RecentActivity from "@/components/admin/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  MapPin,
  MessageSquare,
  Edit,
  Upload,
  Download,
  Users,
  AlertTriangle,
  CheckCircle,
  LogOut,
} from "lucide-react";

const pendingReviews = [
  {
    id: "1",
    location: "Green Valley Landfill",
    locationId: "loc_1",
    author: "John D.",
    email: "john.d@email.com",
    rating: 4,
    title: "Good service overall",
    content:
      "Great service and fair pricing. The staff was helpful and the facility was well-organized. Only complaint is the wait time during peak hours can be a bit long, but that's understandable given how busy they are. Would definitely recommend for general waste disposal.",
    date: "2024-01-20T12:30:00Z",
    status: "pending",
  },
  {
    id: "2",
    location: "Metro Transfer Station",
    locationId: "loc_2",
    author: "Sarah M.",
    email: "sarah.m@email.com",
    rating: 5,
    title: "Excellent facility",
    content:
      "Very clean facility with helpful staff. They have clear signage and the pricing is transparent. The electronic waste recycling program is particularly impressive. Quick service and convenient location. Highly recommend!",
    date: "2024-01-20T10:15:00Z",
    status: "pending",
  },
  {
    id: "3",
    location: "Capitol Construction Landfill",
    locationId: "loc_3",
    author: "Mike R.",
    email: "mike.r@email.com",
    rating: 2,
    title: "Poor experience",
    content:
      "Long wait times and poor signage made this visit frustrating. The staff seemed overwhelmed and weren't very helpful. The pricing structure is confusing and they don't accept credit cards. The facility itself looks dated and could use some improvements.",
    date: "2024-01-20T08:45:00Z",
    status: "pending",
  },
];

export default function Admin() {
  const navigate = useNavigate();
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [pendingReviewsList, setPendingReviewsList] = useState(pendingReviews);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  const handleApproveReview = (reviewId: string) => {
    setPendingReviewsList(
      pendingReviewsList.filter((review) => review.id !== reviewId),
    );
    setSelectedReview(null);
    alert("Review approved successfully!");
  };

  const handleRejectReview = (reviewId: string) => {
    setPendingReviewsList(
      pendingReviewsList.filter((review) => review.id !== reviewId),
    );
    setSelectedReview(null);
    alert("Review rejected successfully!");
  };

  const stats = [
    {
      label: "Total Locations",
      value: "2,647",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      label: "Pending Reviews",
      value: pendingReviewsList.length.toString(),
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: "Pending Suggestions",
      value: "8",
      icon: <Edit className="w-5 h-5" />,
    },
    {
      label: "Monthly Searches",
      value: "1,892",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const pendingSuggestions = [
    {
      id: "1",
      type: "New Location",
      name: "Riverside Recycling Center",
      submitter: "Lisa K.",
      date: "1 day ago",
      details: {
        address: "456 River Road, Portland, OR 97202",
        phone: "(503) 555-0123",
        facilityType: "transfer_station",
        paymentTypes: ["Cash", "Credit/Debit"],
        debrisTypes: ["General Waste", "Recyclables", "Electronics"],
        operatingHours: "Mon-Fri 7AM-6PM, Sat 8AM-4PM",
        notes: "New eco-friendly facility with advanced recycling capabilities",
        submitterEmail: "lisa.k@email.com",
      },
    },
    {
      id: "2",
      type: "Edit Location",
      name: "Downtown Transfer Station",
      submitter: "Tom B.",
      date: "2 days ago",
      details: {
        originalData: "Phone: (555) 123-4567",
        suggestedChange: "Phone: (555) 987-6543",
        reason:
          "Phone number has changed - I called and confirmed the new number",
        submitterEmail: "tom.builder@email.com",
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage locations, reviews, and suggestions
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="text-primary">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Locations */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Pending Locations
                </CardTitle>
                <Badge variant="secondary">3</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      New Location
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      1 day ago
                    </span>
                  </div>
                  <h4 className="font-medium text-sm">
                    Riverside Recycling Center
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Submitted by Lisa K.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    456 River Road, Portland, OR 97202
                  </p>
                </div>
                <div className="border rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      New Location
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      2 days ago
                    </span>
                  </div>
                  <h4 className="font-medium text-sm">Metro Waste Facility</h4>
                  <p className="text-xs text-muted-foreground">
                    Submitted by Tom B.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    789 Industrial Ave, Chicago, IL 60601
                  </p>
                </div>
                <div className="border rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      New Location
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      3 days ago
                    </span>
                  </div>
                  <h4 className="font-medium text-sm">
                    EcoWaste Transfer Station
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Submitted by Sarah M.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    321 Green Street, Denver, CO 80202
                  </p>
                </div>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/admin/suggestions?tab=locations">View All Pending</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pending Reviews */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Pending Reviews
                </CardTitle>
                <Badge variant="secondary">{pendingReviewsList.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReviewsList.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{review.location}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {review.author}
                      </span>
                      <div className="flex">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-yellow-400 rounded-full"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-medium">{review.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {review.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click to view full review and approve/reject
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/admin/reviews">View All Reviews</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pending Edits */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Pending Edits
                </CardTitle>
                <Badge variant="secondary">2</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Edit Location
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      2 days ago
                    </span>
                  </div>
                  <h4 className="font-medium text-sm">
                    Downtown Transfer Station
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Submitted by Tom B.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Phone number update request
                  </p>
                </div>
                <div className="border rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Edit Location
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      1 week ago
                    </span>
                  </div>
                  <h4 className="font-medium text-sm">Green Valley Landfill</h4>
                  <p className="text-xs text-muted-foreground">
                    Submitted by Mike R.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Operating hours update
                  </p>
                </div>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/admin/suggestions">View All Edits</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>

        {/* System Analytics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2,847</div>
                  <div className="text-sm text-muted-foreground">
                    Total Searches This Month
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-muted-foreground">
                    User Satisfaction Rate
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-muted-foreground">
                    New Reviews This Week
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Detail Dialog */}
        <Dialog
          open={!!selectedReview}
          onOpenChange={() => setSelectedReview(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
              <DialogDescription>
                Review submitted for {selectedReview?.location} by{" "}
                {selectedReview?.author} •{" "}
                {selectedReview?.date &&
                  new Date(selectedReview.date).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            {selectedReview && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Author</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedReview.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedReview.email}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Rating</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from(
                          { length: selectedReview.rating },
                          (_, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 bg-yellow-400 rounded-full mr-1"
                            ></div>
                          ),
                        )}
                      </div>
                      <span className="text-sm">
                        {selectedReview.rating}/5 stars
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Review Title</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.title}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Review Content</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedReview.content}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.location}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedReview(null)}>
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRejectReview(selectedReview?.id)}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reject Review
              </Button>
              <Button onClick={() => handleApproveReview(selectedReview?.id)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suggestion Detail Dialog */}
        <Dialog
          open={!!selectedSuggestion}
          onOpenChange={() => setSelectedSuggestion(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedSuggestion?.type}: {selectedSuggestion?.name}
              </DialogTitle>
              <DialogDescription>
                Submitted by {selectedSuggestion?.submitter} •{" "}
                {selectedSuggestion?.date}
              </DialogDescription>
            </DialogHeader>

            {selectedSuggestion && (
              <div className="space-y-4">
                {selectedSuggestion.type === "New Location" ? (
                  // New location details
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.address}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Contact</h4>
                      <p className="text-sm text-muted-foreground">
                        Phone: {selectedSuggestion.details.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Email: {selectedSuggestion.details.submitterEmail}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Facility Type</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.facilityType.replace(
                          "_",
                          " ",
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Operating Hours</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.operatingHours}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Payment Methods</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.paymentTypes.join(", ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Debris Types</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.debrisTypes.join(", ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Notes</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.notes}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Edit suggestion details
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Current Information</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.originalData}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Suggested Change</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.suggestedChange}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Reason</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.reason}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Submitter Email</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.submitterEmail}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedSuggestion(null)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Handle rejection
                  setSelectedSuggestion(null);
                }}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => {
                  // Handle approval
                  setSelectedSuggestion(null);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
