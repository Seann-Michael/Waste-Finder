import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Clock,
  Globe,
  Mail,
  Star,
  Save,
  CheckCircle,
  ChevronLeft,
  Calendar,
  DollarSign,
  CreditCard,
  Trash2,
  Building2,
  HardHat,
  AlertCircle,
  Navigation,
  Edit,
} from "lucide-react";
import { Location } from "@shared/api";

export default function EditLocation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
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
    additionalLocationDetails: "",
    additionalDebrisPricingDetails: "",
    latitude: "",
    longitude: "",
    isActive: true,
  });

  const [debrisPricing, setDebrisPricing] = useState<
    Record<
      string,
      {
        pricePerTon?: number;
        pricePerLoad?: number;
        priceNote?: string;
      }
    >
  >({});

  const [operatingHours, setOperatingHours] = useState([
    { day: 0, dayName: "Sunday", openTime: "", closeTime: "", isClosed: true },
    {
      day: 1,
      dayName: "Monday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      day: 2,
      dayName: "Tuesday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      day: 3,
      dayName: "Wednesday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      day: 4,
      dayName: "Thursday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      day: 5,
      dayName: "Friday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      day: 6,
      dayName: "Saturday",
      openTime: "08:00",
      closeTime: "15:00",
      isClosed: false,
    },
  ]);

  const facilityTypes = [
    { value: "landfill", label: "Municipal Landfill" },
    { value: "transfer_station", label: "Transfer Station" },
    { value: "construction_landfill", label: "Construction Landfill" },
  ];

  const paymentOptions = [
    "Cash",
    "Check",
    "Credit/Debit",
    "Net Terms",
  ];

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

  useEffect(() => {
    if (id) {
      loadLocationData();
    }
  }, [id]);

  const loadLocationData = async () => {
    setIsLoading(true);
    try {
      // Fetch location data from server/localStorage
      const response = await fetch(`/api/locations/${id}`);
      
      if (response.ok) {
        const locationData = await response.json();
        setLocation(locationData);
        populateFormData(locationData);
      } else {
        // Fallback to mock data for development
        const mockLocation = {
          id: id!,
          name: "Green Valley Landfill",
          address: "1234 Waste Drive",
          city: "Springfield",
          state: "IL",
          zipCode: "62701",
          phone: "(555) 123-4567",
          email: "info@greenvalleylandfill.com",
          website: "https://greenvalleylandfill.com",
          facilityType: "landfill",
          paymentTypes: ["Cash", "Credit/Debit"],
          debrisTypes: ["General Household Waste", "Yard Waste"],
          additionalLocationDetails: "Large municipal landfill serving Springfield area",
          additionalDebrisPricingDetails: "Volume discounts available for commercial customers",
          latitude: 39.7817,
          longitude: -89.6501,
          isActive: true,
        };
        setLocation(mockLocation);
        populateFormData(mockLocation);
      }
    } catch (error) {
      console.error("Error loading location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const populateFormData = (locationData: any) => {
    setFormData({
      name: locationData.name || "",
      address: locationData.address || "",
      city: locationData.city || "",
      state: locationData.state || "",
      zipCode: locationData.zipCode || "",
      phone: locationData.phone || "",
      email: locationData.email || "",
      website: locationData.website || "",
      googleBusinessUrl: locationData.googleBusinessUrl || "",
      facilityType: locationData.facilityType || "",
      paymentTypes: locationData.paymentTypes || [],
      additionalPaymentDetails: locationData.additionalPaymentDetails || "",
      debrisTypes: locationData.debrisTypes || [],
      additionalLocationDetails: locationData.additionalLocationDetails || "",
      additionalDebrisPricingDetails: locationData.additionalDebrisPricingDetails || "",
      latitude: locationData.latitude?.toString() || "",
      longitude: locationData.longitude?.toString() || "",
      isActive: locationData.isActive !== undefined ? locationData.isActive : true,
    });

    // Set operating hours if available
    if (locationData.operatingHours) {
      setOperatingHours(locationData.operatingHours);
    }

    // Set debris pricing if available
    if (locationData.debrisPricing) {
      setDebrisPricing(locationData.debrisPricing);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Validate required fields
      const errors: Record<string, string> = {};
      
      if (!formData.name.trim()) {
        errors.name = "Facility name is required";
      }
      if (!formData.address.trim()) {
        errors.address = "Address is required";
      }
      if (!formData.city.trim()) {
        errors.city = "City is required";
      }
      if (!formData.state.trim()) {
        errors.state = "State is required";
      }
      if (!formData.zipCode.trim()) {
        errors.zipCode = "ZIP code is required";
      }
      if (!formData.facilityType) {
        errors.facilityType = "Facility type is required";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setIsSubmitting(false);
        return;
      }

      // Prepare the data for submission
      const submissionData = {
        ...formData,
        operatingHours,
        debrisPricing,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      };

      // Submit to server
      const response = await fetch(`/api/locations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate("/admin/locations");
        }, 2000);
      } else {
        throw new Error("Failed to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      setFormErrors({ general: "Failed to update location. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      paymentTypes: checked
        ? [...prev.paymentTypes, type]
        : prev.paymentTypes.filter(t => t !== type)
    }));
  };

  const handleDebrisTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      debrisTypes: checked
        ? [...prev.debrisTypes, type]
        : prev.debrisTypes.filter(t => t !== type)
    }));
  };

  const handleOperatingHourChange = (index: number, field: string, value: string | boolean) => {
    setOperatingHours(prev => prev.map((hour, i) =>
      i === index ? { ...hour, [field]: value } : hour
    ));
  };

  const handleDebrisPricingChange = (debris: string, field: string, value: string | number) => {
    setDebrisPricing(prev => ({
      ...prev,
      [debris]: {
        ...prev[debris],
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading location...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!location) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Location Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The location you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild>
            <Link to="/admin/locations">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Locations
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin/locations">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Locations
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Location</h1>
              <p className="text-muted-foreground">
                Update facility information and settings
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Location updated successfully! Redirecting to locations list...
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {formErrors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formErrors.general}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <MapPin className="w-5 h-5" />
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Facility Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter facility name"
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facilityType">Facility Type *</Label>
                  <Select
                    value={formData.facilityType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, facilityType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.facilityType && (
                    <p className="text-sm text-red-600">{formErrors.facilityType}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="1234 Main St"
                  />
                  {formErrors.address && (
                    <p className="text-sm text-red-600">{formErrors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                  {formErrors.city && (
                    <p className="text-sm text-red-600">{formErrors.city}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="IL"
                      maxLength={2}
                    />
                    {formErrors.state && (
                      <p className="text-sm text-red-600">{formErrors.state}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      placeholder="62701"
                    />
                    {formErrors.zipCode && (
                      <p className="text-sm text-red-600">{formErrors.zipCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Phone className="w-5 h-5" />
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="info@facility.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleBusinessUrl">Google Business Profile</Label>
                  <Input
                    id="googleBusinessUrl"
                    value={formData.googleBusinessUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, googleBusinessUrl: e.target.value }))}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operatingHours.map((hour, index) => (
                  <div key={hour.day} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium">
                      {hour.dayName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={!hour.isClosed}
                        onCheckedChange={(checked) =>
                          handleOperatingHourChange(index, "isClosed", !checked)
                        }
                      />
                      <span className="text-sm">Open</span>
                    </div>
                    {!hour.isClosed && (
                      <>
                        <Input
                          type="time"
                          value={hour.openTime}
                          onChange={(e) =>
                            handleOperatingHourChange(index, "openTime", e.target.value)
                          }
                          className="w-32"
                        />
                        <span className="text-sm text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={hour.closeTime}
                          onChange={(e) =>
                            handleOperatingHourChange(index, "closeTime", e.target.value)
                          }
                          className="w-32"
                        />
                      </>
                    )}
                    {hour.isClosed && (
                      <span className="text-sm text-muted-foreground">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Types */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.paymentTypes.includes(option)}
                      onCheckedChange={(checked) =>
                        handlePaymentTypeChange(option, checked as boolean)
                      }
                    />
                    <Label className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalPaymentDetails">Additional Payment Details</Label>
                <Textarea
                  id="additionalPaymentDetails"
                  value={formData.additionalPaymentDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalPaymentDetails: e.target.value }))}
                  placeholder="Any additional payment information or special terms..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Debris Types */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Trash2 className="w-5 h-5" />
              <CardTitle>Accepted Debris Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {debrisOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.debrisTypes.includes(option)}
                      onCheckedChange={(checked) =>
                        handleDebrisTypeChange(option, checked as boolean)
                      }
                    />
                    <Label className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>

              {formData.debrisTypes.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="additionalDebrisPricingDetails">Debris Pricing Details</Label>
                  <Textarea
                    id="additionalDebrisPricingDetails"
                    value={formData.additionalDebrisPricingDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalDebrisPricingDetails: e.target.value }))}
                    placeholder="Pricing information, volume discounts, special rates..."
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Navigation className="w-5 h-5" />
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="39.7817"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="-89.6501"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalLocationDetails">Additional Location Details</Label>
                <Textarea
                  id="additionalLocationDetails"
                  value={formData.additionalLocationDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalLocationDetails: e.target.value }))}
                  placeholder="Any additional information about the facility, directions, restrictions, etc."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, isActive: checked as boolean }))
                  }
                />
                <Label>Location is active and visible to users</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/locations">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Location
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
