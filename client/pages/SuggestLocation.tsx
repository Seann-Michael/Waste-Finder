import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, CheckCircle, Plus } from "lucide-react";

export default function SuggestLocation() {
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
    operatingHours: "",
    notes: "",
    submitterName: "",
    submitterEmail: "",
    submitterPhone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const facilityTypes = [
    { value: "landfill", label: "Municipal Landfill" },
    { value: "transfer_station", label: "Transfer Station" },
    { value: "construction_landfill", label: "Construction Landfill" },
  ];

  const paymentOptions = [
    "Cash",
    "Check",
    "Credit/Debit",
    "New Terms",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting suggestion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 py-16">
            <Card>
              <CardContent className="pt-8 text-center">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">
                  Suggestion Submitted!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for helping us improve our database. Your suggestion
                  has been submitted and will be reviewed by our team within 2-3
                  business days.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setIsSubmitted(false)}>
                    Suggest Another Location
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/">Back to Search</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Suggest a New Location</h1>
            <p className="text-muted-foreground">
              Help us expand our database by suggesting a waste disposal
              facility that's not currently listed. All submissions are reviewed
              by our team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Facility Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Facility Information
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
                      required
                      placeholder="e.g., Green Valley Landfill"
                    />
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
                      required
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
                    required
                    placeholder="e.g., 1234 Main Street"
                  />
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
                      required
                      placeholder="e.g., Springfield"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      required
                      placeholder="e.g., IL"
                      maxLength={2}
                    />
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
                      required
                      placeholder="e.g., 62701"
                      maxLength={5}
                    />
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
                      placeholder="e.g., (555) 123-4567"
                    />
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
                      placeholder="e.g., info@facility.com"
                    />
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
                    placeholder="e.g., https://facility.com"
                  />
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
                  <Label htmlFor="operatingHours">Operating Hours</Label>
                  <Textarea
                    id="operatingHours"
                    value={formData.operatingHours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        operatingHours: e.target.value,
                      }))
                    }
                    placeholder="e.g., Mon-Fri 7AM-5PM, Sat 8AM-3PM, Closed Sundays"
                    rows={3}
                  />
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
                    placeholder="Any additional information about pricing, special services, restrictions, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Your Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="submitterName">Your Name *</Label>
                  <Input
                    id="submitterName"
                    value={formData.submitterName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        submitterName: e.target.value,
                      }))
                    }
                    required
                    placeholder="Your full name"
                  />
                </div>

                {/* Google reCAPTCHA Placeholder */}
                <div className="p-4 border rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground text-center">
                    reCAPTCHA verification will appear here
                  </p>
                  <div className="mt-2 text-xs text-center text-muted-foreground">
                    (Google reCAPTCHA integration required)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
