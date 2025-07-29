import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Location } from "@shared/api";
import {
  validatePhoneNumber,
  formatPhoneNumber,
  validateAndFormatUrl,
} from "@/lib/utils";
import { sanitizeInput, validateEmail, validateUrl } from "@/lib/security";
import {
  Edit,
  MapPin,
  Phone,
  Clock,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface SuggestEditProps {
  location: Location;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (suggestion: any) => void;
}

// Form data interface
interface SuggestEditFormData {
  editType: string;
  // Basic info
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  googleBusinessUrl?: string;
  // Operating hours
  operatingHours?: Array<{
    dayOfWeek: number;
    dayName: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  // Payment methods
  paymentTypes?: string[];
  additionalPaymentDetails?: string;
  // Debris and pricing
  debrisTypes?: string[];
  debrisPricing?: Record<string, { price?: number; priceDetails?: string }>;
  // Additional info
  additionalLocationDetails?: string;
  // Submitter info
  submitterName: string;
  submitterEmail: string;
  reason: string;
}

const PAYMENT_OPTIONS = ["Cash", "Check", "Credit/Debit", "Net Terms"];

const DEBRIS_TYPES = [
  "Municipal Waste",
  "Yard Waste",
  "Construction Debris",
  "Appliances",
  "Tires",
  "Concrete",
  "Asphalt",
  "Metal",
  "Hazardous Materials",
];

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default function SuggestEdit({
  location,
  isOpen,
  onClose,
  onSubmit,
}: SuggestEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SuggestEditFormData>({
    defaultValues: {
      editType: "",
      submitterName: "",
      submitterEmail: "",
      reason: "",
    },
  });

  const watchedValues = watch();

  // Initialize form with current location data when edit type changes
  useEffect(() => {
    if (watchedValues.editType && location) {
      switch (watchedValues.editType) {
        case "basic_info":
          setValue("name", location.name);
          setValue("address", location.address);
          setValue("city", location.city);
          setValue("state", location.state);
          setValue("zipCode", location.zipCode);
          setValue("phone", location.phone);
          setValue("email", location.email || "");
          setValue("website", location.website || "");
          setValue("googleBusinessUrl", location.googleBusinessUrl || "");
          break;
        case "operating_hours":
          setValue(
            "operatingHours",
            location.operatingHours || getDefaultOperatingHours(),
          );
          break;
        case "payment_methods":
          setValue(
            "paymentTypes",
            location.paymentTypes?.map((p) => p.name) || [],
          );
          setValue(
            "additionalPaymentDetails",
            location.additionalPaymentDetails || "",
          );
          break;
        case "pricing_info":
          setValue(
            "debrisTypes",
            location.debrisTypes?.map((d) => d.name) || [],
          );
          const pricingMap: Record<
            string,
            { price?: number; priceDetails?: string }
          > = {};
          location.debrisTypes?.forEach((debris) => {
            pricingMap[debris.name] = {
              price: debris.price,
              priceDetails: debris.priceDetails || "",
            };
          });
          setValue("debrisPricing", pricingMap);
          break;
        case "additional_info":
          setValue("additionalLocationDetails", location.notes || "");
          break;
      }
    }
  }, [watchedValues.editType, location, setValue]);

  const getDefaultOperatingHours = () => [
    {
      dayOfWeek: 0,
      dayName: "Sunday",
      openTime: "",
      closeTime: "",
      isClosed: true,
    },
    {
      dayOfWeek: 1,
      dayName: "Monday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      dayOfWeek: 2,
      dayName: "Tuesday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      dayOfWeek: 3,
      dayName: "Wednesday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      dayOfWeek: 4,
      dayName: "Thursday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      dayOfWeek: 5,
      dayName: "Friday",
      openTime: "07:00",
      closeTime: "17:00",
      isClosed: false,
    },
    {
      dayOfWeek: 6,
      dayName: "Saturday",
      openTime: "08:00",
      closeTime: "15:00",
      isClosed: false,
    },
  ];

  const handlePaymentTypeChange = (type: string, checked: boolean) => {
    const currentTypes = watchedValues.paymentTypes || [];
    if (checked) {
      setValue("paymentTypes", [...currentTypes, type]);
    } else {
      setValue(
        "paymentTypes",
        currentTypes.filter((t) => t !== type),
      );
    }
  };

  const handleDebrisTypeChange = (type: string, checked: boolean) => {
    const currentTypes = watchedValues.debrisTypes || [];
    const currentPricing = watchedValues.debrisPricing || {};

    if (checked) {
      setValue("debrisTypes", [...currentTypes, type]);
      if (!currentPricing[type]) {
        setValue("debrisPricing", {
          ...currentPricing,
          [type]: { price: undefined, priceDetails: "" },
        });
      }
    } else {
      setValue(
        "debrisTypes",
        currentTypes.filter((t) => t !== type),
      );
      const newPricing = { ...currentPricing };
      delete newPricing[type];
      setValue("debrisPricing", newPricing);
    }
  };

  const handleDebrisPricingChange = (
    debrisType: string,
    field: "price" | "priceDetails",
    value: string | number,
  ) => {
    const currentPricing = watchedValues.debrisPricing || {};
    setValue("debrisPricing", {
      ...currentPricing,
      [debrisType]: {
        ...currentPricing[debrisType],
        [field]:
          field === "price"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
      },
    });
  };

  const handleOperatingHourChange = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const currentHours =
      watchedValues.operatingHours || getDefaultOperatingHours();
    const newHours = currentHours.map((hour, i) =>
      i === index ? { ...hour, [field]: value } : hour,
    );
    setValue("operatingHours", newHours);
  };

  const onSubmitForm = async (data: SuggestEditFormData) => {
    // Sanitize all inputs
    const sanitizedData = {
      ...data,
      name: data.name ? sanitizeInput(data.name, 100) : undefined,
      address: data.address ? sanitizeInput(data.address, 200) : undefined,
      city: data.city ? sanitizeInput(data.city, 100) : undefined,
      state: data.state
        ? sanitizeInput(data.state.toUpperCase(), 2)
        : undefined,
      zipCode: data.zipCode ? sanitizeInput(data.zipCode, 10) : undefined,
      phone: data.phone ? sanitizeInput(data.phone, 20) : undefined,
      email: data.email ? sanitizeInput(data.email, 254) : undefined,
      website: data.website ? sanitizeInput(data.website, 500) : undefined,
      notes: data.notes ? sanitizeInput(data.notes, 1000) : undefined,
    };

    // Validate inputs
    if (sanitizedData.email && !validateEmail(sanitizedData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (sanitizedData.website && !validateUrl(sanitizedData.website)) {
      alert("Please enter a valid website URL");
      return;
    }

    if (sanitizedData.phone && !validatePhoneNumber(sanitizedData.phone)) {
      alert("Please enter a valid phone number (10-15 digits)");
      return;
    }

    setIsSubmitting(true);
    try {
      const suggestion = {
        id: Date.now().toString(),
        locationId: location.id,
        type: "edit_location",
        editType: sanitizedData.editType,
        data: {
          ...sanitizedData,
          originalLocationName: location.name,
        },
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage for demo
      const savedSuggestions = JSON.parse(
        localStorage.getItem("pendingSuggestions") || "[]",
      );
      savedSuggestions.push(suggestion);
      localStorage.setItem(
        "pendingSuggestions",
        JSON.stringify(savedSuggestions),
      );

      onSubmit(suggestion);
      setSubmitSuccess(true);

      setTimeout(() => {
        onClose();
        reset();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      alert("Failed to submit suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editTypeOptions = [
    { value: "basic_info", label: "Basic Information", icon: MapPin },
    { value: "operating_hours", label: "Operating Hours", icon: Clock },
    { value: "payment_methods", label: "Payment Methods", icon: CreditCard },
    { value: "pricing_info", label: "Pricing Information", icon: DollarSign },
    { value: "additional_info", label: "Additional Information", icon: Edit },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Suggest Edit: {location.name}
          </DialogTitle>
          <DialogDescription>
            Help us keep location information accurate by suggesting updates
          </DialogDescription>
        </DialogHeader>

        {submitSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Thank you! Your suggestion has been submitted and will be reviewed
              by our team.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Edit Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>What would you like to edit?</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={watchedValues.editType}
                onValueChange={(value) => setValue("editType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select what you'd like to edit" />
                </SelectTrigger>
                <SelectContent>
                  {editTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Basic Information Edit */}
          {watchedValues.editType === "basic_info" && (
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
                    <Label htmlFor="name">Location Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter location name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="1234 Main St"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} placeholder="City" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select
                        value={watchedValues.state}
                        onValueChange={(value) => setValue("state", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        {...register("zipCode")}
                        placeholder="62701"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="info@location.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      {...register("website")}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Operating Hours Edit */}
          {watchedValues.editType === "operating_hours" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(
                    watchedValues.operatingHours || getDefaultOperatingHours()
                  ).map((hour, index) => (
                    <div
                      key={hour.dayOfWeek}
                      className="flex items-center gap-4"
                    >
                      <div className="w-20 text-sm font-medium">
                        {hour.dayName}
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={!hour.isClosed}
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
                      {!hour.isClosed && (
                        <>
                          <Input
                            type="time"
                            value={hour.openTime}
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
                            value={hour.closeTime}
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
                      {hour.isClosed && (
                        <span className="text-sm text-muted-foreground">
                          Closed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Methods Edit */}
          {watchedValues.editType === "payment_methods" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {PAYMENT_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        checked={
                          watchedValues.paymentTypes?.includes(option) || false
                        }
                        onCheckedChange={(checked) =>
                          handlePaymentTypeChange(option, checked as boolean)
                        }
                      />
                      <Label className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="additionalPaymentDetails">
                    Additional Payment Details
                  </Label>
                  <Textarea
                    id="additionalPaymentDetails"
                    {...register("additionalPaymentDetails")}
                    placeholder="Any additional payment information..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Information Edit */}
          {watchedValues.editType === "pricing_info" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Accepted Debris Types
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DEBRIS_TYPES.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          checked={
                            watchedValues.debrisTypes?.includes(option) || false
                          }
                          onCheckedChange={(checked) =>
                            handleDebrisTypeChange(option, checked as boolean)
                          }
                        />
                        <Label className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing for Selected Debris Types */}
                {watchedValues.debrisTypes &&
                  watchedValues.debrisTypes.length > 0 && (
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        Pricing Information
                      </Label>
                      <div className="space-y-4">
                        {watchedValues.debrisTypes.map((debrisType) => (
                          <div
                            key={debrisType}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="font-medium">{debrisType}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-sm">
                                  Price per ton ($)
                                </Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={
                                    watchedValues.debrisPricing?.[debrisType]
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
                                <Label className="text-sm">Price Details</Label>
                                <Input
                                  value={
                                    watchedValues.debrisPricing?.[debrisType]
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
              </CardContent>
            </Card>
          )}

          {/* Additional Information Edit */}
          {watchedValues.editType === "additional_info" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="additionalLocationDetails">
                    Additional Information
                  </Label>
                  <Textarea
                    id="additionalLocationDetails"
                    {...register("additionalLocationDetails")}
                    placeholder="Any additional information about the location..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submitter Information */}
          {watchedValues.editType && (
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="submitterName">Your Name *</Label>
                    <Input
                      id="submitterName"
                      {...register("submitterName", {
                        required: "Name is required",
                      })}
                      placeholder="Your full name"
                    />
                    {errors.submitterName && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.submitterName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="submitterEmail">Your Email *</Label>
                    <Input
                      id="submitterEmail"
                      type="email"
                      {...register("submitterEmail", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="your.email@example.com"
                    />
                    {errors.submitterEmail && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.submitterEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Reason for Changes (Optional)</Label>
                  <Textarea
                    id="reason"
                    {...register("reason")}
                    placeholder="Please explain why these changes are needed..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* reCAPTCHA Placeholder */}
          {watchedValues.editType && (
            <div className="p-4 border rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                reCAPTCHA verification will appear here
              </p>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmitForm)}
            disabled={
              !watchedValues.editType ||
              !watchedValues.submitterName ||
              !watchedValues.submitterEmail ||
              isSubmitting
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Suggestion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
