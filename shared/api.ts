/**
 * Shared code between client and server
 * Types and interfaces for the waste management facility finder
 */

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email?: string;
  website?: string;
  googleBusinessUrl?: string; // Google My Business profile URL
  latitude: number;
  longitude: number;
  locationType: "landfill" | "transfer_station" | "construction_landfill";
  paymentTypes: PaymentType[];
  debrisTypes: DebrisType[];
  operatingHours: OperatingHours[];
  notes?: string;
  rating: number;
  reviewCount: number;
  distance?: number; // Distance from search location in miles
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isClosed: boolean;
}

export interface PaymentType {
  id: string;
  name: string;
  description?: string;
}

export interface DebrisType {
  id: string;
  name: string;
  description?: string;
  category: "general" | "construction" | "hazardous" | "recyclable";
  pricePerTon?: number;
  pricePerLoad?: number;
  priceNote?: string; // e.g., "Minimum 2 tons", "Price varies by size"
}

export interface Review {
  id: string;
  locationId: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  authorName: string;
  isApproved: boolean;
  isModerated: boolean;
  createdAt: string;
  moderatedAt?: string;
  moderatorNote?: string;
}

export interface LocationSuggestion {
  id: string;
  locationId?: string; // If editing existing location
  type: "new_location" | "edit_location";
  suggestedData: Partial<Location>;
  submitterName: string;
  submitterEmail: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
}

// API Request/Response types
export interface LocationSearchRequest {
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // Miles
  locationTypes?: Location["locationType"][];
  debrisTypes?: string[];
}

export interface LocationSearchResponse {
  locations: Location[];
  totalCount: number;
  searchLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface ReviewCreateRequest {
  locationId: string;
  rating: number;
  title: string;
  content: string;
  authorName: string;
}

export interface LocationSuggestionRequest {
  locationId?: string;
  type: "new_location" | "edit_location";
  suggestedData: Partial<Location>;
  submitterName: string;
  submitterEmail: string;
  notes?: string;
}

// Example response type for /api/demo
export interface DemoResponse {
  message: string;
}
