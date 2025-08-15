import { createClient } from "@supabase/supabase-js";

// For server-side, we use the service role key for admin operations
const supabaseUrl =
  process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ADMIN_KEY;

// Check if environment variables are set to placeholder values
const isPlaceholder = (value: string | undefined) =>
  !value ||
  value.startsWith("YOUR_") ||
  value === "your_supabase_" ||
  value.length < 10;

// Create mock supabase admin client for development without credentials
const createMockSupabaseAdmin = () => {
  const mockQueryBuilder = {
    select: function (columns?: string) {
      return this;
    },
    insert: function (data: any) {
      return this;
    },
    update: function (data: any) {
      return this;
    },
    delete: function () {
      return this;
    },
    eq: function (column: string, value: any) {
      return this;
    },
    neq: function (column: string, value: any) {
      return this;
    },
    or: function (query: string) {
      return this;
    },
    and: function (query: string) {
      return this;
    },
    order: function (column: string) {
      return this;
    },
    limit: function (count: number) {
      return this;
    },
    single: function () {
      return Promise.resolve({
        data: null,
        error: { message: "Supabase server not configured - using mock data" },
      });
    },
    // Make the query builder thenable (Promise-like) for async/await
    then: function (onFulfilled: any, onRejected?: any) {
      const mockResponse = {
        data: [],
        error: null,
      };
      return Promise.resolve(mockResponse).then(onFulfilled, onRejected);
    },
  };

  return {
    from: () => mockQueryBuilder,
  };
};

// Server-side Supabase client with admin privileges
let supabaseAdmin: any;

if (
  !supabaseUrl ||
  !supabaseServiceKey ||
  isPlaceholder(supabaseUrl) ||
  isPlaceholder(supabaseServiceKey)
) {
  console.warn(
    "Server-side Supabase environment variables not configured properly. Using mock client.",
  );
  supabaseAdmin = createMockSupabaseAdmin();
} else {
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
  // Return mock data if Supabase is not configured
  if (isMockMode()) {
    console.log("Using mock location data - Supabase not configured");
    return mockLocations.filter((loc) => loc.is_active !== false);
  }

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
  // Return filtered mock data if Supabase is not configured
  if (isMockMode()) {
    console.log("Using filtered mock location data - Supabase not configured");
    let filteredLocations = mockLocations.filter(
      (loc) => loc.is_active !== false,
    );

    if (filters.state) {
      filteredLocations = filteredLocations.filter(
        (loc) => loc.state.toLowerCase() === filters.state?.toLowerCase(),
      );
    }

    if (filters.location_type) {
      filteredLocations = filteredLocations.filter(
        (loc) => loc.location_type === filters.location_type,
      );
    }

    if (filters.city) {
      filteredLocations = filteredLocations.filter(
        (loc) => loc.city.toLowerCase() === filters.city?.toLowerCase(),
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredLocations = filteredLocations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchTerm) ||
          loc.address.toLowerCase().includes(searchTerm) ||
          loc.city.toLowerCase().includes(searchTerm),
      );
    }

    return filteredLocations.sort((a, b) => a.name.localeCompare(b.name));
  }

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
  // Return mock data if Supabase is not configured
  if (isMockMode()) {
    console.log(
      `Using mock location data for ID ${id} - Supabase not configured`,
    );
    const location = mockLocations.find(
      (loc) => loc.id === id && loc.is_active !== false,
    );
    return location || null;
  }

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
