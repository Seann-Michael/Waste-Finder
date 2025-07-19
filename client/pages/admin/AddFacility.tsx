import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  Save,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
} from "lucide-react";

export default function AddFacility() {
  const navigate = useNavigate();
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
    facilityType: "",
    paymentTypes: [] as string[],
    debrisTypes: [] as string[],
    notes: "",
    latitude: "",
    longitude: "",
  });

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
    "Credit Card",
    "Debit Card",
    "Check",
    "ACH/Bank Transfer",
    "Digital Payment",
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
    "Wood",
    "Hazardous Materials",
    "Recyclables",
  ];

  const handlePaymentChange = (payment: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        paymentTypes: [...prev.paymentTypes, payment],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        paymentTypes: prev.paymentTypes.filter((p) => p !== payment),
      }));
    }
  };

  const handleDebrisChange = (debris: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        debrisTypes: [...prev.debrisTypes, debris],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        debrisTypes: prev.debrisTypes.filter((d) => d !== debris),
      }));
    }
  };

  const handleHoursChange = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    setOperatingHours((prev) =>
      prev.map((hour, i) => (i === index ? { ...hour, [field]: value } : hour)),
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name) errors.name = "Facility name is required";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.zipCode) errors.zipCode = "ZIP code is required";
    else if (!/^\d{5}$/.test(formData.zipCode))
      errors.zipCode = "ZIP code must be 5 digits";
    if (!formData.facilityType)
      errors.facilityType = "Facility type is required";
    if (formData.phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
      errors.phone = "Phone must be in format (XXX) XXX-XXXX";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitSuccess(true);
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
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Facility Added Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                The new facility has been added to the database and is now
                available to users.
              </p>
              <Button asChild>
                <Link to="/admin">Return to Admin Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" asChild>
              <Link to="/admin">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Facility</h1>
              <p className="text-muted-foreground">
                Create a new waste disposal facility listing
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Facility Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g., Green Valley Landfill"
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="facilityType">Facility Type *</Label>
                    <Select
                      value={formData.facilityType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          facilityType: value,
                        }))
                      }
                    >
                      <SelectTrigger
                        className={
                          formErrors.facilityType ? "border-red-500" : ""
                        }
                      >
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
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.facilityType}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="e.g., 1234 Main Street"
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="e.g., Springfield"
                      className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && (
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="e.g., IL"
                      maxLength={2}
                      className={formErrors.state ? "border-red-500" : ""}
                    />
                    {formErrors.state && (
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      placeholder="e.g., 62701"
                      maxLength={5}
                      className={formErrors.zipCode ? "border-red-500" : ""}
                    />
                    {formErrors.zipCode && (
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="(555) 123-4567"
                      className={formErrors.phone ? "border-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="info@facility.com"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    placeholder="https://facility.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude (Optional)</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      placeholder="e.g., 40.7128"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude (Optional)</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      placeholder="e.g., -74.0060"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operatingHours.map((hour, index) => (
                    <div key={hour.day} className="flex items-center gap-4">
                      <div className="w-20">
                        <Label className="text-sm">{hour.dayName}</Label>
                      </div>
                      <Checkbox
                        checked={hour.isClosed}
                        onCheckedChange={(checked) =>
                          handleHoursChange(
                            index,
                            "isClosed",
                            checked as boolean,
                          )
                        }
                      />
                      <Label className="text-sm">Closed</Label>
                      {!hour.isClosed && (
                        <>
                          <Input
                            type="time"
                            value={hour.openTime}
                            onChange={(e) =>
                              handleHoursChange(
                                index,
                                "openTime",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={hour.closeTime}
                            onChange={(e) =>
                              handleHoursChange(
                                index,
                                "closeTime",
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services & Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    Payment Methods Accepted
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {paymentOptions.map((payment) => (
                      <div
                        key={payment}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={payment}
                          checked={formData.paymentTypes.includes(payment)}
                          onCheckedChange={(checked) =>
                            handlePaymentChange(payment, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={payment}
                          className="text-sm font-normal"
                        >
                          {payment}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">
                    Debris Types Accepted
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {debrisOptions.map((debris) => (
                      <div key={debris} className="flex items-center space-x-2">
                        <Checkbox
                          id={debris}
                          checked={formData.debrisTypes.includes(debris)}
                          onCheckedChange={(checked) =>
                            handleDebrisChange(debris, checked as boolean)
                          }
                        />
                        <Label htmlFor={debris} className="text-sm font-normal">
                          {debris}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Any additional information about the facility, pricing, special services, restrictions, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  "Creating Facility..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Facility
                  </>
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
