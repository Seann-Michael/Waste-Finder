import { supabase } from "./supabase";

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
  debrisTypes?: DebrisType[];
  operatingHours?: OperatingHour[];
  paymentTypes?: PaymentType[];
  reviews?: Review[];
  distance?: number;
}

export interface DebrisType {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price_per_ton?: number;
  price_note?: string;
}

export interface PaymentType {
  id: string;
  name: string;
  description?: string;
}

export interface OperatingHour {
  id: string;
  location_id: string;
  day_of_week: number; // 0-6, Sunday=0
  open_time?: string;
  close_time?: string;
  is_closed: boolean;
}

export interface Review {
  id: string;
  location_id: string;
  rating: number;
  title?: string;
  content?: string;
  author_name?: string;
  author_email?: string;
  is_approved: boolean;
  is_moderated: boolean;
  created_at: string;
}

// Get all active locations with related data
export async function getLocations(): Promise<Location[]> {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select(`
        *,
        debrisTypes:location_debris_types(
          debris_type:debris_types(*)
        ),
        paymentTypes:location_payment_types(
          payment_type:payment_types(*)
        ),
        operatingHours:operating_hours(*),
        reviews(*)
      `)
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching locations:", error);
      return [];
    }

    // Transform the data to flatten the relationships
    const locations = (data || []).map(location => ({
      ...location,
      debrisTypes: location.debrisTypes?.map((dt: any) => dt.debris_type) || [],
      paymentTypes: location.paymentTypes?.map((pt: any) => pt.payment_type) || [],
    }));

    return locations;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return [];
  }
}

// Get locations by state with related data
export async function getLocationsByState(state: string): Promise<Location[]> {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select(`
        *,
        debrisTypes:location_debris_types(
          debris_type:debris_types(*)
        ),
        paymentTypes:location_payment_types(
          payment_type:payment_types(*)
        ),
        operatingHours:operating_hours(*),
        reviews(*)
      `)
      .eq("state", state)
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching locations by state:", error);
      return [];
    }

    // Transform the data to flatten the relationships
    const locations = (data || []).map(location => ({
      ...location,
      debrisTypes: location.debrisTypes?.map((dt: any) => dt.debris_type) || [],
      paymentTypes: location.paymentTypes?.map((pt: any) => pt.payment_type) || [],
    }));

    return locations;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return [];
  }
}

// Get locations by city with related data
export async function getLocationsByCity(
  city: string,
  state?: string,
): Promise<Location[]> {
  try {
    let query = supabase
      .from("locations")
      .select(`
        *,
        debrisTypes:location_debris_types(
          debris_type:debris_types(*)
        ),
        paymentTypes:location_payment_types(
          payment_type:payment_types(*)
        ),
        operatingHours:operating_hours(*),
        reviews(*)
      `)
      .eq("city", city)
      .eq("is_active", true);

    if (state) {
      query = query.eq("state", state);
    }

    const { data, error } = await query.order("name");

    if (error) {
      console.error("Error fetching locations by city:", error);
      return [];
    }

    // Transform the data to flatten the relationships
    const locations = (data || []).map(location => ({
      ...location,
      debrisTypes: location.debrisTypes?.map((dt: any) => dt.debris_type) || [],
      paymentTypes: location.paymentTypes?.map((pt: any) => pt.payment_type) || [],
    }));

    return locations;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return [];
  }
}

// Get single location by ID
export async function getLocationById(id: string): Promise<Location | null> {
  try {
    const { data, error } = await supabase
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

// Search locations by name or address
export async function searchLocations(query: string): Promise<Location[]> {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .or(
        `name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`,
      )
      .eq("is_active", true)
      .order("name")
      .limit(50);

    if (error) {
      console.error("Error searching locations:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Supabase connection error:", error);
    return [];
  }
}

// Add a new location (admin only)
export async function addLocation(
  location: Omit<Location, "id" | "created_at" | "updated_at">,
): Promise<Location | null> {
  try {
    const { data, error } = await supabase
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

// Update location (admin only)
export async function updateLocation(
  id: string,
  updates: Partial<Location>,
): Promise<Location | null> {
  try {
    const { data, error } = await supabase
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

// Delete location (admin only - soft delete)
export async function deleteLocation(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
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

// Get location statistics
export async function getLocationStats() {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("state, type")
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching location stats:", error);
      return { totalLocations: 0, stateCount: {}, typeCount: {} };
    }

    const totalLocations = data?.length || 0;
    const stateCount =
      data?.reduce((acc: any, location) => {
        acc[location.state] = (acc[location.state] || 0) + 1;
        return acc;
      }, {}) || {};

    const typeCount =
      data?.reduce((acc: any, location) => {
        acc[location.type] = (acc[location.type] || 0) + 1;
        return acc;
      }, {}) || {};

    return { totalLocations, stateCount, typeCount };
  } catch (error) {
    console.error("Supabase connection error:", error);
    return { totalLocations: 0, stateCount: {}, typeCount: {} };
  }
}
