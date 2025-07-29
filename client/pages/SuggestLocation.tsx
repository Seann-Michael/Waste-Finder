import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import {
  MapPin,
  Phone,
  Clock,
  DollarSign,
  CreditCard,
  Trash2,
  Building2,
  HardHat,
  Plus,
  Info,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToastNotifications } from "../hooks/use-toast-notifications";
import { validatePhoneNumber, formatPhoneNumber, validateAndFormatUrl } from "../lib/utils";

// Form data interface matching AddLocation
interface SuggestLocationFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  website?: string;
  googleBusinessUrl?: string;
  latitude?: string;
  longitude?: string;
  locationType: "landfill" | "transfer_station" | "construction_landfill";
  paymentTypes: string[];
  additionalPaymentDetails?: string;
  debrisTypes: string[];
  debrisPricing: Record<string, { price?: number; priceDetails?: string; }>;
  debrisAdditionalDetails?: string;
  additionalDebrisPricingDetails?: string;
  operatingHours: OperatingHour[];
  additionalNotes?: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string;
}

interface OperatingHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// Constants matching AddLocation
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

const PAYMENT_TYPES = ["Cash", "Check", "Credit/Debit", "Net Terms"] as const;

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
  "Fluorescent Bulbs",
  "Hazardous Materials"
];

const LOCATION_TYPES = [
  { value: "landfill", label: "Landfill", icon: Trash2 },
  { value: "transfer_station", label: "Transfer Station", icon: Building2 },
  { value: "construction_landfill", label: "Construction Landfill", icon: HardHat },
];

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export default function SuggestLocation() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SuggestLocationFormData>({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      website: "",
      googleBusinessUrl: "",
      latitude: "",
      longitude: "",
      locationType: "landfill",
      paymentTypes: [],
      additionalPaymentDetails: "",
      debrisTypes: [],
      debrisPricing: {},
      debrisAdditionalDetails: "",
      additionalDebrisPricingDetails: "",
      operatingHours: DAYS_OF_WEEK.map((_, index) => ({
        dayOfWeek: index,
        openTime: "08:00",
        closeTime: "17:00",
        isClosed: index === 0, // Closed on Sunday by default
      })),
      additionalNotes: "",
      submitterName: "",
      submitterEmail: "",
      submitterPhone: "",
    },
  });

  const watchedValues = watch();



  const onSubmit = async (data: SuggestLocationFormData) => {
    // Validate phone number if provided
    if (data.phone && !validatePhoneNumber(data.phone)) {
      showError("Please enter a valid phone number (10-15 digits)");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save to localStorage for admin review
      const existingSuggestions = JSON.parse(localStorage.getItem("pendingSuggestions") || "[]");
      const newSuggestion = {
        id: Date.now().toString(),
        ...data,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };

      localStorage.setItem("pendingSuggestions", JSON.stringify([...existingSuggestions, newSuggestion]));

      setShowSuccessAlert(true);
      showSuccess("Location suggestion submitted successfully! We'll review it and add it to our database.");

      // Reset form or redirect after success
      setTimeout(() => {
        navigate("/all-locations");
      }, 2000);

    } catch (error) {
      showError("Failed to submit suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArrayFieldChange = (
    fieldName: "paymentTypes" | "debrisTypes",
    value: string,
    checked: boolean
  ) => {
    const currentValues = watchedValues[fieldName] || [];
    if (checked) {
      setValue(fieldName, [...currentValues, value]);
    } else {
      setValue(fieldName, currentValues.filter((item) => item !== value));

      // Clear pricing data if debris type is unchecked
      if (fieldName === "debrisTypes") {
        const currentPricing = watchedValues.debrisPricing || {};
        delete currentPricing[value];
        setValue("debrisPricing", currentPricing);

        // Clear additional details if no debris types selected
        if (watchedValues.debrisTypes?.length === 1) {
          setValue("debrisAdditionalDetails", "");
          setValue("additionalDebrisPricingDetails", "");
        }
      }
    }
  };

  const updateDebrisPricing = (debrisType: string, field: "price" | "priceDetails", value: string | number) => {
    const currentPricing = watchedValues.debrisPricing || {};
    const currentDebrisData = currentPricing[debrisType] || {};

    setValue("debrisPricing", {
      ...currentPricing,
      [debrisType]: {
        ...currentDebrisData,
        [field]: field === "price" ? (value === "" ? undefined : Number(value)) : value,
      },
    });
  };

  const updateOperatingHours = (dayIndex: number, field: "openTime" | "closeTime" | "isClosed", value: string | boolean) => {
    const currentHours = [...watchedValues.operatingHours];
    currentHours[dayIndex] = {
      ...currentHours[dayIndex],
      [field]: value,
    };
    setValue("operatingHours", currentHours);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Suggest a Location</h1>
              <p className="text-muted-foreground mt-2">
                Help us expand our database by suggesting a waste disposal location
              </p>
            </div>
          </div>

          {showSuccessAlert && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Thank you for your suggestion! We'll review it and add it to our database if approved.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Essential details about the waste disposal location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Location Name *</Label>
                    <Input
                      id="name"
                      {...register("name", {
                        required: "Location name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                      })}
                      placeholder="Enter the business or facility name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      {...register("address", {
                        required: "Address is required",
                      })}
                      placeholder="e.g., 123 Industrial Drive"
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register("city", { required: "City is required" })}
                      placeholder="e.g., Springfield"
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={watchedValues.state}
                      onValueChange={(value) => setValue("state", value)}
                    >
                      <SelectTrigger
                        className={errors.state ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      {...register("zipCode", {
                        required: "ZIP code is required",
                        pattern: {
                          value: /^\d{5}(-\d{4})?$/,
                          message: "Enter a valid ZIP code",
                        },
                      })}
                      placeholder="e.g., 12345"
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                      placeholder="e.g., (555) 123-4567"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="locationType">Facility Type *</Label>
                    <Select
                      value={watchedValues.locationType}
                      onValueChange={(value) => setValue("locationType", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATION_TYPES.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Additional Contact Information
                </CardTitle>
                <CardDescription>
                  Optional contact details (if known)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="contact@facility.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      {...register("website")}
                      placeholder="https://facility.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="googleBusinessUrl">Google Business Profile URL</Label>
                    <Input
                      id="googleBusinessUrl"
                      {...register("googleBusinessUrl")}
                      placeholder="https://goo.gl/maps/..."
                    />
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
                <CardDescription>
                  What payment types does this location accept?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PAYMENT_TYPES.map((payment) => (
                    <div key={payment} className="flex items-center space-x-2">
                      <Checkbox
                        id={payment}
                        checked={
                          watchedValues.paymentTypes?.includes(payment) || false
                        }
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "paymentTypes",
                            payment,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={payment} className="text-sm font-medium">
                        {payment}
                      </Label>
                    </div>
                  ))}
                </div>

                {watchedValues.paymentTypes && watchedValues.paymentTypes.length > 0 && (
                  <div>
                    <Label htmlFor="additionalPaymentDetails">Additional Payment Details</Label>
                    <Textarea
                      id="additionalPaymentDetails"
                      placeholder="Special payment requirements, credit terms, deposits..."
                      rows={2}
                      {...register("additionalPaymentDetails")}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Debris Types & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Accepted Debris Types & Pricing
                </CardTitle>
                <CardDescription>
                  Select the types of waste this location accepts (pricing optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label className="text-base font-medium">
                  Accepted Debris Types & Pricing
                </Label>
                <div className="space-y-4 mt-2">
                  {DEBRIS_TYPES.map((debris) => (
                    <div key={debris} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Checkbox
                          id={debris}
                          checked={
                            watchedValues.debrisTypes?.includes(debris) || false
                          }
                          onCheckedChange={(checked) => {
                            handleArrayFieldChange(
                              "debrisTypes",
                              debris,
                              checked as boolean
                            );
                          }}
                        />
                        <Label htmlFor={debris} className="text-sm font-medium">
                          {debris}
                        </Label>
                      </div>

                      {watchedValues.debrisTypes?.includes(debris) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                          <div>
                            <Label className="text-xs">Price (USD)</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="pl-7"
                                value={
                                  watchedValues.debrisPricing?.[debris]?.price || ""
                                }
                                onChange={(e) =>
                                  updateDebrisPricing(debris, "price", e.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Price Details</Label>
                            <Input
                              placeholder="per ton, per load, etc."
                              value={
                                watchedValues.debrisPricing?.[debris]?.priceDetails || ""
                              }
                              onChange={(e) =>
                                updateDebrisPricing(debris, "priceDetails", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {watchedValues.debrisTypes && watchedValues.debrisTypes.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="debrisAdditionalDetails">General Requirements & Restrictions</Label>
                      <Textarea
                        placeholder="General requirements, restrictions, preparation instructions for debris types..."
                        rows={3}
                        {...register("debrisAdditionalDetails")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="additionalDebrisPricingDetails">Additional Debris Type Pricing Details</Label>
                      <Textarea
                        id="additionalDebrisPricingDetails"
                        placeholder="Special pricing information, volume discounts, seasonal rates, or other pricing details that apply to debris disposal..."
                        rows={3}
                        {...register("additionalDebrisPricingDetails")}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Include any special pricing arrangements, bulk discounts, seasonal variations, or additional fees that customers should know about.
                      </p>
                    </div>
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
                <CardDescription>
                  When is this location open for business?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DAYS_OF_WEEK.map((day, index) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-20">
                        <Label className="text-sm">{day}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={!watchedValues.operatingHours[index]?.isClosed}
                          onCheckedChange={(checked) =>
                            updateOperatingHours(index, "isClosed", !checked)
                          }
                        />
                        <Label className="text-sm">Open</Label>
                      </div>
                      {!watchedValues.operatingHours[index]?.isClosed && (
                        <>
                          <Input
                            type="time"
                            value={watchedValues.operatingHours[index]?.openTime || "08:00"}
                            onChange={(e) =>
                              updateOperatingHours(index, "openTime", e.target.value)
                            }
                            className="w-32"
                          />
                          <span className="text-muted-foreground">to</span>
                          <Input
                            type="time"
                            value={watchedValues.operatingHours[index]?.closeTime || "17:00"}
                            onChange={(e) =>
                              updateOperatingHours(index, "closeTime", e.target.value)
                            }
                            className="w-32"
                          />
                        </>
                      )}
                      {watchedValues.operatingHours[index]?.isClosed && (
                        <span className="text-muted-foreground text-sm">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Your Information
                </CardTitle>
                <CardDescription>
                  We need your contact information in case we have questions about this suggestion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="submitterName">Your Name *</Label>
                    <Input
                      id="submitterName"
                      {...register("submitterName", {
                        required: "Your name is required",
                      })}
                      placeholder="John Doe"
                      className={errors.submitterName ? "border-red-500" : ""}
                    />
                    {errors.submitterName && (
                      <p className="text-red-500 text-sm mt-1">
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
                        required: "Your email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Enter a valid email address",
                        },
                      })}
                      placeholder="john@example.com"
                      className={errors.submitterEmail ? "border-red-500" : ""}
                    />
                    {errors.submitterEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.submitterEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="submitterPhone">Your Phone (Optional)</Label>
                    <Input
                      id="submitterPhone"
                      {...register("submitterPhone")}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    {...register("additionalNotes")}
                    placeholder="Any additional information about this location that might be helpful..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/all-locations")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Suggestion"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
