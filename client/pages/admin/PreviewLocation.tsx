import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Trash2,
  Trash,
  Building2,
  HardHat,
  CheckCircle,
  AlertTriangle,
  Edit,
  ChevronLeft,
  Star,
} from "lucide-react";

interface SuggestedLocation {
  id: string;
  type: "new_location";
  locationName: string;
  submitter: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  details: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string;
    email?: string;
    website?: string;
    googleBusinessUrl?: string;
    facilityType: string;
    paymentTypes: string[];
    debrisTypes: string[];
    operatingHours?: string;
    notes?: string;
  };
}

// Mock data - in a real app this would come from API
const mockSuggestedLocations: SuggestedLocation[] = [
  {
    id: "new_1",
    type: "new_location",
    locationName: "Riverside Recycling Center",
    submitter: "Lisa K.",
    email: "lisa.k@email.com",
    status: "pending",
    submittedAt: "2024-01-20T10:30:00Z",
    details: {
      address: "456 River Road",
      city: "Portland",
      state: "OR",
      zipCode: "97202",
      phone: "(503) 555-0123",
      email: "info@riverside.com",
      website: "https://riverside-recycling.com",
      googleBusinessUrl:
        "https://maps.google.com/maps/place/Riverside+Recycling+Center",
      facilityType: "transfer_station",
      paymentTypes: ["Cash", "Credit Card"],
      debrisTypes: ["General Waste", "Recyclables", "Electronics"],
      operatingHours: "Mon-Fri 7AM-6PM, Sat 8AM-4PM",
      notes: "New eco-friendly facility with advanced recycling capabilities",
    },
  },
  {
    id: "new_2",
    type: "new_location",
    locationName: "Metro Waste Facility",
    submitter: "Tom B.",
    email: "tom.b@email.com",
    status: "rejected",
    submittedAt: "2024-01-18T16:15:00Z",
    moderatedAt: "2024-01-19T09:30:00Z",
    moderatedBy: "Admin",
    details: {
      address: "789 Industrial Ave",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      phone: "(312) 555-9876",
      googleBusinessUrl:
        "https://maps.google.com/maps/place/Metro+Waste+Facility",
      facilityType: "landfill",
      paymentTypes: ["Cash"],
      debrisTypes: ["General Waste"],
      operatingHours: "Mon-Fri 8AM-5PM",
      notes: "Large capacity facility",
    },
  },
];

export default function PreviewLocation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<SuggestedLocation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLocation, setEditedLocation] =
    useState<SuggestedLocation | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    // Find the suggested location by ID
    const foundLocation = mockSuggestedLocations.find((loc) => loc.id === id);
    if (foundLocation) {
      setLocation(foundLocation);
      setEditedLocation({ ...foundLocation });
    }
  }, [id]);

  const handleFieldChange = (field: string, value: any) => {
    if (!editedLocation) return;

    if (field.startsWith("details.")) {
      const detailField = field.replace("details.", "");
      setEditedLocation({
        ...editedLocation,
        details: {
          ...(editedLocation.details || {}),
          [detailField]: value,
        },
      });
    } else {
      setEditedLocation({
        ...editedLocation,
        [field]: value,
      });
    }
  };

  const handleApprove = () => {
    // In a real app, this would make an API call
    console.log("Approving location:", editedLocation);
    alert("Location approved and added to database!");
    navigate("/admin/suggestions");
  };

  const handleReject = () => {
    // In a real app, this would make an API call
    console.log("Rejecting location with reason:", rejectReason);
    alert("Location suggestion rejected!");
    setShowRejectDialog(false);
    navigate("/admin/suggestions");
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "landfill":
        return <Badge variant="outline">Landfill</Badge>;
      case "transfer_station":
        return <Badge variant="outline">Transfer Station</Badge>;
      case "construction_landfill":
        return <Badge variant="outline">Construction Landfill</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getFacilityIcon = (type: string) => {
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

  const getFacilityLabel = (type: string) => {
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

  if (!location) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The suggested location you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link to="/admin/suggestions">Back to Suggestions</Link>
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (isEditing && !editedLocation) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Loading location details</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const currentLocation =
    isEditing && editedLocation ? editedLocation : location;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin/suggestions">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Suggestions
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Preview Suggested Location</h1>
              <p className="text-muted-foreground">
                Review and moderate this location suggestion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(currentLocation.status)}
          </div>
        </div>

        {/* Action Buttons for Pending Suggestions */}
        {currentLocation.status === "pending" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    This suggestion is pending your review
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You can edit the details below before approving or rejecting
                    this suggestion.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel Edit" : "Edit Details"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button onClick={() => setShowApproveDialog(true)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Submitted By</Label>
              <p className="text-sm">{currentLocation.submitter}</p>
              <p className="text-xs text-muted-foreground">
                {currentLocation.email}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Submitted On</Label>
              <p className="text-sm">
                {new Date(currentLocation.submittedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">
                {getStatusBadge(currentLocation.status)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Preview - Matches /location page layout exactly */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header - Matches LocationDetail exactly */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-primary">
                  {getFacilityIcon(
                    currentLocation.details?.facilityType || "landfill",
                  )}
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getFacilityLabel(
                    currentLocation.details?.facilityType || "landfill",
                  )}
                </Badge>
              </div>

              {isEditing ? (
                <Input
                  value={currentLocation.locationName}
                  onChange={(e) =>
                    handleFieldChange("locationName", e.target.value)
                  }
                  className="text-3xl font-bold mb-4 border-none px-0"
                />
              ) : (
                <h1 className="text-3xl font-bold mb-4">
                  {currentLocation.locationName}
                </h1>
              )}

              <div className="flex items-center gap-2 mb-4">
                {renderStars(4.5, "w-5 h-5")}
                <span className="text-lg font-medium">4.5</span>
                <span className="text-muted-foreground">
                  (0 reviews - will show after approval)
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {currentLocation.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditing ? "Cancel Edit" : "Edit Details"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectDialog(true)}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button onClick={() => setShowApproveDialog(true)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
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
                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  {isEditing ? (
                    <div className="space-y-2 mt-1">
                      <Input
                        value={currentLocation.details?.address || ""}
                        onChange={(e) =>
                          handleFieldChange("details.address", e.target.value)
                        }
                        placeholder="Street Address"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          value={currentLocation.details?.city || ""}
                          onChange={(e) =>
                            handleFieldChange("details.city", e.target.value)
                          }
                          placeholder="City"
                        />
                        <Select
                          value={currentLocation.details?.state || ""}
                          onValueChange={(value) =>
                            handleFieldChange("details.state", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AL">AL</SelectItem>
                            <SelectItem value="AK">AK</SelectItem>
                            <SelectItem value="AZ">AZ</SelectItem>
                            <SelectItem value="AR">AR</SelectItem>
                            <SelectItem value="CA">CA</SelectItem>
                            <SelectItem value="CO">CO</SelectItem>
                            <SelectItem value="CT">CT</SelectItem>
                            <SelectItem value="DE">DE</SelectItem>
                            <SelectItem value="FL">FL</SelectItem>
                            <SelectItem value="GA">GA</SelectItem>
                            <SelectItem value="HI">HI</SelectItem>
                            <SelectItem value="ID">ID</SelectItem>
                            <SelectItem value="IL">IL</SelectItem>
                            <SelectItem value="IN">IN</SelectItem>
                            <SelectItem value="IA">IA</SelectItem>
                            <SelectItem value="KS">KS</SelectItem>
                            <SelectItem value="KY">KY</SelectItem>
                            <SelectItem value="LA">LA</SelectItem>
                            <SelectItem value="ME">ME</SelectItem>
                            <SelectItem value="MD">MD</SelectItem>
                            <SelectItem value="MA">MA</SelectItem>
                            <SelectItem value="MI">MI</SelectItem>
                            <SelectItem value="MN">MN</SelectItem>
                            <SelectItem value="MS">MS</SelectItem>
                            <SelectItem value="MO">MO</SelectItem>
                            <SelectItem value="MT">MT</SelectItem>
                            <SelectItem value="NE">NE</SelectItem>
                            <SelectItem value="NV">NV</SelectItem>
                            <SelectItem value="NH">NH</SelectItem>
                            <SelectItem value="NJ">NJ</SelectItem>
                            <SelectItem value="NM">NM</SelectItem>
                            <SelectItem value="NY">NY</SelectItem>
                            <SelectItem value="NC">NC</SelectItem>
                            <SelectItem value="ND">ND</SelectItem>
                            <SelectItem value="OH">OH</SelectItem>
                            <SelectItem value="OK">OK</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="RI">RI</SelectItem>
                            <SelectItem value="SC">SC</SelectItem>
                            <SelectItem value="SD">SD</SelectItem>
                            <SelectItem value="TN">TN</SelectItem>
                            <SelectItem value="TX">TX</SelectItem>
                            <SelectItem value="UT">UT</SelectItem>
                            <SelectItem value="VT">VT</SelectItem>
                            <SelectItem value="VA">VA</SelectItem>
                            <SelectItem value="WA">WA</SelectItem>
                            <SelectItem value="WV">WV</SelectItem>
                            <SelectItem value="WI">WI</SelectItem>
                            <SelectItem value="WY">WY</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={currentLocation.details?.zipCode || ""}
                          onChange={(e) =>
                            handleFieldChange("details.zipCode", e.target.value)
                          }
                          placeholder="ZIP Code"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">
                      {currentLocation.details?.address ||
                        "No address provided"}
                      <br />
                      {currentLocation.details?.city || ""},{" "}
                      {currentLocation.details?.state || ""}{" "}
                      {currentLocation.details?.zipCode || ""}
                    </p>
                  )}
                </div>

                {currentLocation.details?.operatingHours && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Operating Hours
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentLocation.details?.operatingHours || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "details.operatingHours",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Mon-Fri 7AM-6PM, Sat 8AM-4PM"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm">
                        {currentLocation.details?.operatingHours}
                      </p>
                    )}
                  </div>
                )}

                {currentLocation.details?.phone && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentLocation.details?.phone || ""}
                        onChange={(e) =>
                          handleFieldChange("details.phone", e.target.value)
                        }
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm">
                        {currentLocation.details?.phone}
                      </p>
                    )}
                  </div>
                )}

                {currentLocation.details?.email && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentLocation.details?.email || ""}
                        onChange={(e) =>
                          handleFieldChange("details.email", e.target.value)
                        }
                        placeholder="info@example.com"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm">
                        {currentLocation.details?.email}
                      </p>
                    )}
                  </div>
                )}

                {currentLocation.details?.website && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website
                    </Label>
                    {isEditing ? (
                      <Input
                        value={currentLocation.details?.website || ""}
                        onChange={(e) =>
                          handleFieldChange("details.website", e.target.value)
                        }
                        placeholder="https://example.com"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm">
                        <a
                          href={currentLocation.details?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {currentLocation.details?.website}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment & Debris Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(currentLocation.details?.paymentTypes || []).map(
                      (method) => (
                        <Badge key={method} variant="secondary">
                          {method}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash className="w-5 h-5" />
                    Accepted Debris
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(currentLocation.details?.debrisTypes || []).map(
                      (debris) => (
                        <Badge key={debris} variant="outline">
                          {debris}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            {currentLocation.details?.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={currentLocation.details?.notes || ""}
                      onChange={(e) =>
                        handleFieldChange("details.notes", e.target.value)
                      }
                      placeholder="Additional notes about this location..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm">{currentLocation.details?.notes}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-medium text-blue-900">
                    Location Preview
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    This is how the location will appear to users if approved.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mock Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">No reviews yet</p>
                  <p className="text-xs">
                    Reviews will appear here once the location is approved and
                    users start visiting.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions for Editing */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Save Changes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setLocation(editedLocation!);
                      setIsEditing(false);
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setEditedLocation(location);
                      setIsEditing(false);
                    }}
                  >
                    Cancel Changes
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Approve Dialog */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Location</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve "{currentLocation.locationName}
                "? This will add it to the public database and make it visible
                to all users.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowApproveDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Location</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this location suggestion.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="rejectReason">Reason for rejection</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this location suggestion is being rejected..."
                rows={3}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reject Location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
