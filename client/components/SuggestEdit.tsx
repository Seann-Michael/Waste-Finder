import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Location } from "@shared/api";
import { Edit } from "lucide-react";

interface SuggestEditProps {
  location: Location;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (suggestion: any) => void;
}

export default function SuggestEdit({
  location,
  isOpen,
  onClose,
  onSubmit,
}: SuggestEditProps) {
  const [editType, setEditType] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [suggestedValue, setSuggestedValue] = useState("");
  const [reason, setReason] = useState("");
  const [submitterName, setSubmitterName] = useState("");

  const editOptions = [
    { value: "name", label: "Facility Name", current: location.name },
    { value: "address", label: "Address", current: location.address },
    { value: "phone", label: "Phone Number", current: location.phone },
    {
      value: "website",
      label: "Website",
      current: location.website || "Not provided",
    },
    {
      value: "hours",
      label: "Operating Hours",
      current: "Current schedule",
    },
    {
      value: "payment",
      label: "Payment Methods",
      current: location.paymentTypes.map((p) => p.name).join(", "),
    },
    {
      value: "pricing",
      label: "Pricing Information",
      current: "Current pricing",
    },
    {
      value: "additional_info",
      label: "Additional Information",
      current: location.notes || "No additional information",
    },
  ];

  const handleEditTypeChange = (value: string) => {
    setEditType(value);
    const option = editOptions.find((opt) => opt.value === value);
    setCurrentValue(option?.current || "");
    setSuggestedValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const suggestion = {
      id: Date.now().toString(),
      locationId: location.id,
      type: "edit_location",
      editField: editType,
      currentValue,
      suggestedValue,
      reason,
      submitterName,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    onSubmit(suggestion);
    onClose();

    // Reset form
    setEditType("");
    setCurrentValue("");
    setSuggestedValue("");
    setReason("");
    setSubmitterName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Suggest Edit: {location.name}
          </DialogTitle>
          <DialogDescription>
            Help us keep facility information accurate by suggesting updates
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Field Selection */}
          <div>
            <Label htmlFor="editType">What would you like to edit? *</Label>
            <Select value={editType} onValueChange={handleEditTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select field to edit" />
              </SelectTrigger>
              <SelectContent>
                {editOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Value Display */}
          {editType && (
            <div>
              <Label>Current Information</Label>
              <div className="p-3 bg-muted rounded-md text-sm">
                {currentValue}
              </div>
            </div>
          )}

          {/* Suggested Value */}
          {editType && (
            <div>
              <Label htmlFor="suggestedValue">
                Suggested{" "}
                {editOptions.find((opt) => opt.value === editType)?.label} *
              </Label>
              {editType === "hours" || editType === "additional_info" ? (
                <Textarea
                  id="suggestedValue"
                  value={suggestedValue}
                  onChange={(e) => setSuggestedValue(e.target.value)}
                  placeholder={
                    editType === "hours"
                      ? "e.g., Mon-Fri 7AM-5PM, Sat 8AM-3PM, Closed Sundays"
                      : "Provide updated information or additional details"
                  }
                  rows={4}
                  required
                />
              ) : (
                <Input
                  id="suggestedValue"
                  value={suggestedValue}
                  onChange={(e) => setSuggestedValue(e.target.value)}
                  placeholder={`Enter corrected ${editOptions.find((opt) => opt.value === editType)?.label.toLowerCase()}`}
                  required
                />
              )}
            </div>
          )}

          {/* Reason */}
          <div>
            <Label htmlFor="reason">
              Why is this change needed? (Optional)
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this information should be updated"
              rows={3}
            />
          </div>

          {/* Submitter Name */}
          <div>
            <Label htmlFor="submitterName">Your Name *</Label>
            <Input
              id="submitterName"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
              placeholder="Your name (for verification purposes)"
              required
            />
          </div>

          {/* reCAPTCHA Placeholder */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              reCAPTCHA verification will appear here
            </p>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              (Google reCAPTCHA integration required)
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!editType || !suggestedValue || !submitterName}
          >
            Submit Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
