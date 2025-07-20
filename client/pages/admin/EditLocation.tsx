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
} from "lucide-react";
import { Location } from "@shared/api";

export default function EditFacility() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [facility, setFacility] = useState<Location | null>(null);
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
    "Wood",
    "Hazardous Materials",
    "Recyclables",
  ];

  useEffect(() => {
    loadFacility();
  }, [id]);

  const loadFacility = async () => {
    setIsLoading(true);
    try {
      // Fetch facility data from server API
      const response = await fetch(`/api/locations/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch facility data");
      }

      const data = await response.json();
      const facility = data.data;

      if (!facility) {
        throw new Error("Facility not found");
      }

      setFacility(facility);

      // Populate form with facility data
      setFormData({
        name: facility.name,
        address: facility.address,
        city: facility.city,
        state: facility.state,
        zipCode: facility.zipCode,
        phone: facility.phone,
        email: facility.email || "",
        website: facility.website || "",
        facilityType: facility.locationType,
        paymentTypes: facility.paymentTypes.map((p) => p.name),
        additionalPaymentDetails: facility.additionalPaymentDetails || "",
        debrisTypes: facility.debrisTypes.map((d) => d.name),
        additionalLocationDetails: facility.notes || "",
        latitude: facility.latitude.toString(),
        longitude: facility.longitude.toString(),
        isActive: facility.isActive,
      });

      // Convert operating hours
      const hoursMap = facility.operatingHours.reduce(
        (acc, hour) => {
          acc[hour.dayOfWeek] = hour;
          return acc;
        },
        {} as Record<number, any>,
      );

      setOperatingHours((prev) =>
        prev.map((hour) => ({
          ...hour,
          openTime: hoursMap[hour.day]?.openTime || "",
          closeTime: hoursMap[hour.day]?.closeTime || "",
          isClosed: hoursMap[hour.day]?.isClosed || false,
        })),
      );
    } catch (error) {
      console.error("Error loading facility:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      console.error("Error updating facility:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (
      !confirm(
        "Are you sure you want to archive this facility? It will be hidden from public view.",
      )
    ) {
      return;
    }

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Facility archived successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Error archiving facility:", error);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this facility? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Facility deleted successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Error deleting facility:", error);
    }
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading facility data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (submitSuccess) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <Card className="max-w-md">
            <CardContent className="pt-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Facility Updated Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                The facility information has been updated and changes are now
                live.
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Back to Results & Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/admin" className="hover:text-primary">
              Admin
            </Link>
            <span>/</span>
            <Link to="/admin/locations" className="hover:text-primary">
              Locations
            </Link>
            <span>/</span>
            <span>Edit Location</span>
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin/locations">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Locations
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-primary">
                  {getFacilityIcon(
                    formData.facilityType as Location["facilityType"],
                  )}
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getFacilityLabel(
                    formData.facilityType as Location["facilityType"],
                  )}
                </Badge>
              </div>

              <div className="space-y-4">
                <Label htmlFor="name" className="text-2xl font-bold">
                  Facility Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="text-3xl font-bold border-none px-0 text-foreground"
                  placeholder="e.g., Green Valley Landfill"
                />
              </div>

              <div className="flex items-center gap-2 mb-4">
                {renderStars(facility?.rating || 4.5, "w-5 h-5")}
                <span className="text-lg font-medium">
                  {facility?.rating || 4.5}
                </span>
                <span className="text-muted-foreground">
                  ({facility?.reviewCount || 127} reviews)
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
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
                <div className="space-y-2">
                  <Label className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    Address
                  </Label>
                  <div className="space-y-2 ml-8">
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Street Address"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        placeholder="City"
                      />
                      <Input
                        value={formData.state}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            state: e.target.value.toUpperCase(),
                          }))
                        }
                        placeholder="State"
                        maxLength={2}
                      />
                      <Input
                        value={formData.zipCode}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }))
                        }
                        placeholder="ZIP Code"
                        maxLength={5}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    Phone
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="(555) 123-4567"
                    className="ml-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="info@facility.com"
                    className="ml-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    Website
                  </Label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    placeholder="https://facility.com"
                    className="ml-8"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    Google My Business URL
                  </Label>
                  <Input
                    type="url"
                    value={formData.googleBusinessUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        googleBusinessUrl: e.target.value,
                      }))
                    }
                    placeholder="https://maps.google.com/maps/place/..."
                    className="ml-8"
                  />
                  <p className="text-xs text-muted-foreground ml-8">
                    Link to your Google Business Profile for reviews and
                    directions
                  </p>
                </div>
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
                  {operatingHours.map((hour, index) => (
                    <div
                      key={hour.day}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium w-24">{hour.dayName}</span>
                      <div className="flex items-center gap-2">
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
                  <div>
                    <Label className="text-base font-medium">
                      Accepted Materials & Pricing
                    </Label>
                    <div className="space-y-4 mt-3">
                      {debrisOptions.map((debris) => (
                        <div
                          key={debris}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={debris}
                              checked={formData.debrisTypes.includes(debris)}
                              onCheckedChange={(checked) =>
                                handleDebrisChange(debris, checked as boolean)
                              }
                            />
                            <Label
                              htmlFor={debris}
                              className="text-sm font-medium"
                            >
                              {debris}
                            </Label>
                          </div>

                          {formData.debrisTypes.includes(debris) && (
                            <div className="ml-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs">
                                  Price per Ton ($)
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="65.00"
                                  value={
                                    debrisPricing[debris]?.pricePerTon || ""
                                  }
                                  onChange={(e) =>
                                    setDebrisPricing({
                                      ...debrisPricing,
                                      [debris]: {
                                        ...debrisPricing[debris],
                                        pricePerTon: e.target.value
                                          ? parseFloat(e.target.value)
                                          : undefined,
                                      },
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">
                                  Price per Load ($)
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="25.00"
                                  value={
                                    debrisPricing[debris]?.pricePerLoad || ""
                                  }
                                  onChange={(e) =>
                                    setDebrisPricing({
                                      ...debrisPricing,
                                      [debris]: {
                                        ...debrisPricing[debris],
                                        pricePerLoad: e.target.value
                                          ? parseFloat(e.target.value)
                                          : undefined,
                                      },
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">Special Note</Label>
                                <Input
                                  placeholder="Free drop-off"
                                  value={debrisPricing[debris]?.priceNote || ""}
                                  onChange={(e) =>
                                    setDebrisPricing({
                                      ...debrisPricing,
                                      [debris]: {
                                        ...debrisPricing[debris],
                                        priceNote: e.target.value,
                                      },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {paymentOptions.map((payment) => (
                    <div key={payment} className="flex items-center space-x-2">
                      <Checkbox
                        id={payment}
                        checked={formData.paymentTypes.includes(payment)}
                        onCheckedChange={(checked) =>
                          handlePaymentChange(payment, checked as boolean)
                        }
                      />
                      <Label htmlFor={payment} className="text-sm font-normal">
                        {payment}
                      </Label>
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="additionalPaymentDetails">Additional Payment Details</Label>
                  <Textarea
                    id="additionalPaymentDetails"
                    value={formData.additionalPaymentDetails}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        additionalPaymentDetails: e.target.value,
                      }))
                    }
                    placeholder="Any additional payment information, terms, or special arrangements..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Location Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Location Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.additionalLocationDetails}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      additionalLocationDetails: e.target.value,
                    }))
                  }
                  placeholder="Any additional information about the location, special services, restrictions, etc."
                  rows={4}
                />
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
                  <Select
                    value={formData.facilityType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        facilityType: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-auto">
                      <SelectValue />
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="isActive" className="text-sm">
                      Active
                    </Label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <span>{facility?.rating || 4.5}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviews:</span>
                  <span>{facility?.reviewCount || 127}</span>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Coordinates</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      placeholder="Latitude (e.g., 40.7128)"
                    />
                    <Input
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      placeholder="Longitude (e.g., -74.0060)"
                    />
                  </div>
                </div>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mt-4">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Interactive Map
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Preview Location
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
