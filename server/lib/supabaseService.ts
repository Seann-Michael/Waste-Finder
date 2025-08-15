import { createClient } from "@supabase/supabase-js";

// For server-side, we use the service role key for admin operations
const supabaseUrl =
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ADMIN_KEY;

// Validate environment variables
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isPlaceholder = (value: string | undefined) =>
  !value ||
  value.startsWith("YOUR_") ||
  value === "your_supabase_" ||
  value.length < 10;

// Server-side Supabase client with admin privileges
let supabaseAdmin: any;

if (
  !supabaseUrl ||
  !supabaseServiceKey ||
  isPlaceholder(supabaseUrl) ||
  isPlaceholder(supabaseServiceKey) ||
  !isValidUrl(supabaseUrl)
) {
  console.error("❌ Server-side Supabase configuration missing or invalid!");
  console.error("📋 To connect to your database:");
  console.error("1. Set VITE_SUPABASE_URL to your Supabase project URL");
  console.error("2. Set VITE_SUPABASE_ADMIN_KEY to your Supabase service role key");

  // Throw error instead of creating invalid client
  throw new Error(
    "Server-side Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ADMIN_KEY environment variables."
  );
} else {
  console.log("✅ Server-side Supabase admin client initialized successfully");
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
}

export { supabaseAdmin };

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

// Get all locations with related data
export async function getAllLocations(): Promise<Location[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .select(
        `
        *,
        debrisTypes:location_debris_types(
          debris_type:debris_types(*)
        ),
        paymentTypes:location_payment_types(
          payment_type:payment_types(*)
        ),
        operatingHours:operating_hours(*),
        reviews(*)
      `,
      )
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching locations:", error);
      return [];
    }

    // Transform the data to flatten the relationships
    const locations = (data || []).map((location) => ({
      ...location,
      debrisTypes: location.debrisTypes?.map((dt: any) => dt.debris_type) || [],
      paymentTypes:
        location.paymentTypes?.map((pt: any) => pt.payment_type) || [],
    }));

    return locations;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return [];
  }
}

// Get locations with filters and related data
export async function getFilteredLocations(filters: {
  state?: string;
  location_type?: string;
  city?: string;
  search?: string;
}): Promise<Location[]> {
  try {
    let query = supabaseAdmin
      .from("locations")
      .select(
        `
        *,
        debrisTypes:location_debris_types(
          debris_type:debris_types(*)
        ),
        paymentTypes:location_payment_types(
          payment_type:payment_types(*)
        ),
        operatingHours:operating_hours(*),
        reviews(*)
      `,
      )
      .eq("is_active", true);

    if (filters.state) {
      query = query.eq("state", filters.state);
    }

    if (filters.location_type) {
      query = query.eq("location_type", filters.location_type);
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

    // Transform the data to flatten the relationships
    const locations = (data || []).map((location) => ({
      ...location,
      debrisTypes: location.debrisTypes?.map((dt: any) => dt.debris_type) || [],
      paymentTypes:
        location.paymentTypes?.map((pt: any) => pt.payment_type) || [],
    }));

    return locations;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return [];
  }
}

// Get single location by ID with related data
export async function getLocationById(id: string): Promise<Location | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .select(
        `
        *,
        debrisTypes:location_debris_types(
          debris_type:debris_types(*)
        ),
        paymentTypes:location_payment_types(
          payment_type:payment_types(*)
        ),
        operatingHours:operating_hours(*),
        reviews!reviews_location_id_fkey(*)
      `,
      )
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching location by ID:", error);
      return null;
    }

    // Transform the data to flatten the relationships
    const location = {
      ...data,
      debrisTypes: data.debrisTypes?.map((dt: any) => dt.debris_type) || [],
      paymentTypes: data.paymentTypes?.map((pt: any) => pt.payment_type) || [],
    };

    return location;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return null;
  }
}

// Add new location
export async function addLocation(
  location: Omit<Location, "id" | "created_at" | "updated_at">,
): Promise<Location | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("locations")
      .insert([
        {
          ...location,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
