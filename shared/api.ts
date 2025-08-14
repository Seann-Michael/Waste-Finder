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
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  location_type: "landfill" | "transfer_station" | "construction_landfill";
  paymentTypes?: PaymentType[];
  debrisTypes?: DebrisType[];
  operatingHours?: OperatingHours[];
  notes?: string;
  rating?: number;
  review_count?: number;
  distance?: number; // Distance from search location in miles
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OperatingHours {
  id: string;
  location_id: string;
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  open_time?: string; // HH:MM format
  close_time?: string; // HH:MM format
  is_closed: boolean;
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
  category?: string;
  price_per_ton?: number;
  price_note?: string; // e.g., "per ton", "per load", "per cubic yard"
  // For compatibility with LocationCard component
  price?: number;
  priceDetails?: string;
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
