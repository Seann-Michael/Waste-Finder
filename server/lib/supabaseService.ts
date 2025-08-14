import { createClient } from "@supabase/supabase-js";

// For server-side, we use the service role key for admin operations
const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://omnuzylsdxpcqumbhhim.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbnV6eWxzZHhwY3F1bWJoaGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODMwNjg4MiwiZXhwIjoyMDYzODgyODgyfQ.Eb4O4NFEc4dQCdXFe5Xg4WnsIRptMJbn2TK8H1Z2XZM";

// Server-side Supabase client with admin privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Location interface matching the actual database schema
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
  notes?: string;
  rating?: number;
  review_count?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // Related data from joins
  debrisTypes?: any[];
  operatingHours?: any[];
  paymentTypes?: any[];
  reviews?: any[];
}

// Get all locations
export async function getAllLocations(): Promise<Location[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching locations:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Supabase connection error:", error);
    return [];
  }
}

// Get locations with filters
export async function getFilteredLocations(filters: {
  state?: string;
  locationType?: string;
  city?: string;
  search?: string;
}): Promise<Location[]> {
  try {
    let query = supabaseAdmin
      .from("locations")
      .select("*")
      .eq("is_active", true);

    if (filters.state) {
      query = query.eq("state", filters.state);
    }

    if (filters.locationType) {
      query = query.eq("locationType", filters.locationType);
    }

    if (filters.city) {
      query = query.eq("city", filters.city);
    }

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,address.ilike.%${filters.search}%,city.ilike.%${filters.search}%`,
      );
    }

    const { data, error } = await query.order("name");

    if (error) {
      console.error("Error fetching filtered locations:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Supabase connection error:", error);
    return [];
  }
}

// Get single location by ID
export async function getLocationById(id: string): Promise<Location | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching location by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return null;
  }
}

// Add new location
export async function addLocation(
  location: Omit<Location, "id" | "createdAt" | "updatedAt">,
): Promise<Location | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .insert([
        {
          ...location,
          is_active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding location:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return null;
  }
}

// Update location
export async function updateLocation(
  id: string,
  updates: Partial<Location>,
): Promise<Location | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating location:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return null;
  }
}

// Delete location (soft delete)
export async function deleteLocation(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("locations")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error deleting location:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return false;
  }
}

// Toggle location active status
export async function toggleLocationStatus(
  id: string,
  isActive: boolean,
): Promise<Location | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error toggling location status:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return null;
  }
}
