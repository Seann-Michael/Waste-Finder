/**
 * Add Location Admin Page
 *
 * Purpose: Provides a comprehensive form for waste management administrators
 * to add new disposal locations to the system
 *
 * Dependencies:
 * - Requires admin authentication (protected by AdminRoute)
 * - Uses React Hook Form for form state management and validation
 * - Integrates with the server API at /api/locations
 * - Utilizes toast notifications for user feedback
 *
 * Features:
 * - Complete location information capture
 * - Real-time form validation
 * - Mobile-responsive design
 * - Bulk debris type selection
 * - Operating hours configuration
 * - Payment method selection
 * - Coordinate input validation
 * - Success/error handling with toast notifications
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Clock,
  CreditCard,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useToastNotifications } from "@/hooks/use-toast-notifications";

/**
 * Form data interface for location creation
 * Defines all required and optional fields for a new location
 */
interface LocationFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  website?: string;
  googleBusinessUrl?: string;
  latitude: string;
  longitude: string;
  locationType: "landfill" | "transfer_station" | "construction_landfill";
  paymentTypes: string[];
  additionalPaymentDetails?: string;
  debrisTypes: string[];
  debrisPricing: Record<string, { pricePerTon?: number; pricePerLoad?: number; priceNote?: string; }>;
  additionalLocationDetails?: string;
  isActive: boolean;
}

/**
 * Configuration arrays for form dropdowns
 * These could be moved to a configuration file or fetched from API
 */
const LOCATION_TYPES = [
  { value: "landfill", label: "Municipal Landfill" },
  { value: "transfer_station", label: "Transfer Station" },
  { value: "construction_landfill", label: "Construction Landfill" },
] as const;

const PAYMENT_TYPES = [
  "Cash",
  "Check",
  "Credit/Debit",
  "New Terms",
] as const;

const DEBRIS_TYPES = [
  "General Household Waste",
  "Yard Waste",
  "Construction Debris",
  "Electronics",
  "Appliances",
  "Tires",
  "Concrete",
  "Asphalt",
  "Metal",
  "Wood",
  "Hazardous Materials",
] as const;

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
] as const;

/**
 * AddLocation Component
 * Renders the complete add location form with validation and submission
 */
export default function AddLocation() {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToastNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize React Hook Form with default values
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LocationFormData>({
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
      additionalLocationDetails: "",
      isActive: true,
    },
  });

  // Watch form values for dynamic updates
  const watchedValues = watch();

  /**
   * Validates coordinate input to ensure proper latitude/longitude format
   */
  const validateCoordinates = (lat: string, lng: string): boolean => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      showError("Coordinates must be valid numbers");
      return false;
    }

    if (latitude < -90 || latitude > 90) {
      showError("Latitude must be between -90 and 90 degrees");
      return false;
    }

    if (longitude < -180 || longitude > 180) {
      showError("Longitude must be between -180 and 180 degrees");
      return false;
    }

    return true;
  };

  /**
   * Handles form submission with comprehensive validation and API call
   */
  const onSubmit = async (data: LocationFormData) => {
    try {
      setIsSubmitting(true);

      // Validate coordinates
      if (!validateCoordinates(data.latitude, data.longitude)) {
        return;
      }

      // Validate required arrays
      if (data.paymentTypes.length === 0) {
        showWarning("Please select at least one payment method");
        return;
      }

      if (data.debrisTypes.length === 0) {
        showWarning("Please select at least one debris type");
        return;
      }

      // Prepare API payload
      const payload = {
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        paymentTypes: data.paymentTypes.map((type, index) => ({
          id: (index + 1).toString(),
          name: type,
        })),
        additionalPaymentDetails: data.additionalPaymentDetails,
        debrisTypes: data.debrisTypes.map((type, index) => ({
          id: (index + 1).toString(),
          name: type,
          category: "general", // Default category, could be made configurable
          ...(data.debrisPricing[type] || {}),
        })),
        notes: data.additionalLocationDetails,
        // Add default operating hours (Monday-Friday 7AM-5PM)
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
            openTime: "00:00",
            closeTime: "00:00",
            isClosed: true,
          },
          {
            dayOfWeek: 0,
            openTime: "00:00",
            closeTime: "00:00",
            isClosed: true,
          },
        ],
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Submit to API
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create location");
      }

      const result = await response.json();

      showSuccess("Location created successfully!");
      reset(); // Clear form

      // Navigate to the new location or back to locations list
      setTimeout(() => {
        navigate("/admin/locations");
      }, 1500);
    } catch (error) {
      console.error("Error creating location:", error);
      showError(
        error instanceof Error ? error.message : "Failed to create location",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles checkbox changes for multi-select fields
   */
  const handleArrayFieldChange = (
    fieldName: "paymentTypes" | "debrisTypes",
    value: string,
    checked: boolean,
  ) => {
    const currentValues = watchedValues[fieldName] || [];
    if (checked) {
      setValue(fieldName, [...currentValues, value]);
    } else {
      setValue(
        fieldName,
        currentValues.filter((item) => item !== value),
      );
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Add New Location
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new waste disposal location entry
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/locations")}
            className="self-start sm:self-auto"
          >
            Back to Locations
          </Button>
        </div>

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
                    placeholder="e.g., Springfield Municipal Landfill"
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
                        message: "Invalid ZIP code format",
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
                      pattern: {
                        value: /^\(\d{3}\) \d{3}-\d{4}$/,
                        message: "Phone format: (555) 123-4567",
                      },
                    })}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="info@location.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    {...register("website", {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Website must start with http:// or https://",
                      },
                    })}
                    placeholder="https://location.com"
                    className={errors.website ? "border-red-500" : ""}
                  />
                  {errors.website && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.website.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="googleBusinessUrl">Google Business URL</Label>
                <Input
                  id="googleBusinessUrl"
                  {...register("googleBusinessUrl")}
                  placeholder="https://maps.google.com/maps/place/..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    {...register("latitude", {
                      required: "Latitude is required",
                      pattern: {
                        value: /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
                        message: "Invalid latitude format",
                      },
                    })}
                    placeholder="e.g., 39.7817"
                    className={errors.latitude ? "border-red-500" : ""}
                  />
                  {errors.latitude && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.latitude.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    {...register("longitude", {
                      required: "Longitude is required",
                      pattern: {
                        value: /^-?((1[0-7]\d)|([1-9]?\d))(\.\d+)?$/,
                        message: "Invalid longitude format",
                      },
                    })}
                    placeholder="e.g., -89.6501"
                    className={errors.longitude ? "border-red-500" : ""}
                  />
                  {errors.longitude && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.longitude.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Type and Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Location Type & Services
              </CardTitle>
              <CardDescription>
                Specify the type of location and services offered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="locationType">Location Type *</Label>
                <Select
                  value={watchedValues.locationType}
                  onValueChange={(value) =>
                    setValue("locationType", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Payment Methods *
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {PAYMENT_TYPES.map((payment) => (
                    <div key={payment} className="flex items-center space-x-2">
                      <Checkbox
                        id={`payment-${payment}`}
                        checked={
                          watchedValues.paymentTypes?.includes(payment) || false
                        }
                        onCheckedChange={(checked) =>
                          handleArrayFieldChange(
                            "paymentTypes",
                            payment,
                            checked as boolean,
                          )
                        }
                      />
                      <Label
                        htmlFor={`payment-${payment}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {payment}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="additionalPaymentDetails">Additional Payment Details</Label>
                <Textarea
                  id="additionalPaymentDetails"
                  {...register("additionalPaymentDetails")}
                  placeholder="Any additional payment information, terms, or special arrangements..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-base font-medium">
                  Accepted Debris Types & Pricing *
                </Label>
                <div className="space-y-4 mt-2">
                  {DEBRIS_TYPES.map((debris) => (
                    <div key={debris} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Checkbox
                          id={`debris-${debris}`}
                          checked={
                            watchedValues.debrisTypes?.includes(debris) || false
                          }
                          onCheckedChange={(checked) => {
                            handleArrayFieldChange(
                              "debrisTypes",
                              debris,
                              checked as boolean,
                            );
                            if (!checked) {
                              // Clear pricing data when unchecked
                              const currentPricing = watchedValues.debrisPricing || {};
                              delete currentPricing[debris];
                              setValue("debrisPricing", currentPricing);
                            }
                          }}
                        />
                        <Label
                          htmlFor={`debris-${debris}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {debris}
                        </Label>
                      </div>

                      {watchedValues.debrisTypes?.includes(debris) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-6">
                          <div>
                            <Label className="text-xs">Price per Ton ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="65.00"
                              value={watchedValues.debrisPricing?.[debris]?.pricePerTon || ""}
                              onChange={(e) => {
                                const currentPricing = watchedValues.debrisPricing || {};
                                setValue("debrisPricing", {
                                  ...currentPricing,
                                  [debris]: {
                                    ...currentPricing[debris],
                                    pricePerTon: e.target.value ? parseFloat(e.target.value) : undefined,
                                  },
                                });
                              }}
                            />
                          </div>

                          <div>
                            <Label className="text-xs">Price per Load ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="25.00"
                              value={watchedValues.debrisPricing?.[debris]?.pricePerLoad || ""}
                              onChange={(e) => {
                                const currentPricing = watchedValues.debrisPricing || {};
                                setValue("debrisPricing", {
                                  ...currentPricing,
                                  [debris]: {
                                    ...currentPricing[debris],
                                    pricePerLoad: e.target.value ? parseFloat(e.target.value) : undefined,
                                  },
                                });
                              }}
                            />
                          </div>

                          <div>
                            <Label className="text-xs">Price Note</Label>
                            <Input
                              placeholder="Free drop-off"
                              value={watchedValues.debrisPricing?.[debris]?.priceNote || ""}
                              onChange={(e) => {
                                const currentPricing = watchedValues.debrisPricing || {};
                                setValue("debrisPricing", {
                                  ...currentPricing,
                                  [debris]: {
                                    ...currentPricing[debris],
                                    priceNote: e.target.value,
                                  },
                                });
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Location Details</CardTitle>
              <CardDescription>
                Optional additional information about the location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="additionalLocationDetails">Additional Location Details</Label>
                <Textarea
                  id="additionalLocationDetails"
                  {...register("additionalLocationDetails")}
                  placeholder="Any additional information about the location, special services, restrictions, etc."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={watchedValues.isActive}
                  onCheckedChange={(checked) =>
                    setValue("isActive", checked as boolean)
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Location is active and visible to users
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/locations")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Location
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
