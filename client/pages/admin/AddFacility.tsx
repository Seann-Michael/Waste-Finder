import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronLeft,
  MapPin,
  Plus,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function AddFacility() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    website: "",
    facilityType: "",
    operatingHours: "",
    notes: "",
    paymentMethods: [] as string[],
    debrisTypes: [] as string[],
  });

  const facilityTypes = [
    { value: "landfill", label: "Landfill" },
    { value: "transfer_station", label: "Transfer Station" },
    { value: "construction_landfill", label: "Construction Landfill" },
  ];

  const paymentOptions = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Check",
    "Account",
    "Mobile Payment",
  ];

  const debrisOptions = [
    "General Waste",
    "Construction Debris",
    "Yard Waste",
    "Electronics",
    "Appliances",
    "Metal",
    "Wood",
    "Concrete",
    "Asphalt",
    "Recyclables",
  ];

  const usStates = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (
    field: "paymentMethods" | "debrisTypes",
    value: string,
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error) {
      console.error("Error creating facility:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardContent className="pt-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Location Added Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                The new location has been added to the database and is now
                available to users.
              </p>
              <Button asChild>
                <Link to="/admin">Return to Admin Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/admin">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Location</h1>
            <p className="text-muted-foreground">
              Add a new waste disposal location to the database
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    placeholder="e.g., Green Valley Landfill"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilityType">Location Type *</Label>
                  <Select
                    value={formData.facilityType}
                    onValueChange={(value) =>
                      handleInputChange("facilityType", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                    placeholder="Springfield"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    required
                    placeholder="62701"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="info@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://www.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input
                  id="operatingHours"
                  value={formData.operatingHours}
                  onChange={(e) =>
                    handleInputChange("operatingHours", e.target.value)
                  }
                  placeholder="Mon-Fri 7AM-5PM, Sat 8AM-4PM"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {paymentOptions.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={`payment-${method}`}
                      checked={formData.paymentMethods.includes(method)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "paymentMethods",
                          method,
                          checked as boolean,
                        )
                      }
                    />
                    <Label
                      htmlFor={`payment-${method}`}
                      className="text-sm font-normal"
                    >
                      {method}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Debris Types */}
          <Card>
            <CardHeader>
              <CardTitle>Accepted Debris Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {debrisOptions.map((debris) => (
                  <div key={debris} className="flex items-center space-x-2">
                    <Checkbox
                      id={`debris-${debris}`}
                      checked={formData.debrisTypes.includes(debris)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "debrisTypes",
                          debris,
                          checked as boolean,
                        )
                      }
                    />
                    <Label
                      htmlFor={`debris-${debris}`}
                      className="text-sm font-normal"
                    >
                      {debris}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional information about this location..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Plus className="w-4 h-4 mr-2 animate-spin" />
                  Adding Location...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
