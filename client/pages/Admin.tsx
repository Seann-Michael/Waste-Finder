import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

export default function Admin() {
  const navigate = useNavigate();
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);

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

  const stats = [
    {
      label: "Total Locations",
      value: "2,647",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      label: "Pending Reviews",
      value: "23",
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

  const pendingReviews = [
    {
      id: "1",
      location: "Green Valley Landfill",
      author: "John D.",
      rating: 4,
      preview: "Great service and fair pricing...",
      date: "2 hours ago",
    },
    {
      id: "2",
      location: "Metro Transfer Station",
      author: "Sarah M.",
      rating: 5,
      preview: "Very clean facility with helpful staff...",
      date: "4 hours ago",
    },
    {
      id: "3",
      location: "Capitol Construction Landfill",
      author: "Mike R.",
      rating: 2,
      preview: "Long wait times and poor signage...",
      date: "6 hours ago",
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
        paymentTypes: ["Cash", "Credit Card"],
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            {/* Main Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link to="/admin/bulk-upload">
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Upload Facilities
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      // Mock export function
                      const csvContent =
                        "facility_id,name,address,city,state,zip_code\n1,Sample Facility,123 Main St,Springfield,IL,62701";
                      const blob = new Blob([csvContent], { type: "text/csv" });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "facilities_export.csv";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Database
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link to="/admin/add-facility">
                      <MapPin className="w-4 h-4 mr-2" />
                      Add New Facility
                    </Link>
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    asChild
                  >
                    <Link to="/all-locations">
                      <Edit className="w-4 h-4 mr-2" />
                      Browse & Edit Facilities
                    </Link>
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
                  <Badge variant="secondary">{pendingReviews.length}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">
                          {review.location}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {review.date}
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
                      <p className="text-xs text-muted-foreground">
                        {review.preview}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" size="sm">
                    View All Reviews
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Pending Suggestions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Pending Suggestions
                  </CardTitle>
                  <Badge variant="secondary">{pendingSuggestions.length}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="border rounded-lg p-3 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedSuggestion(suggestion)}
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {suggestion.date}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm">{suggestion.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Submitted by {suggestion.submitter}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click to view details and approve/reject
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" size="sm">
                    View All Suggestions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <RecentActivity />
          </div>

          {/* System Analytics */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      2,847
                    </div>
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
                    <div className="text-2xl font-bold text-purple-600">
                      156
                    </div>
                    <div className="text-sm text-muted-foreground">
                      New Reviews This Week
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

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

      <Footer />
    </div>
  );
}
