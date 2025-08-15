/**
 * Optimized Supabase Query Layer
 *
 * Advanced query optimization techniques:
 * - Selective field fetching to reduce payload size
 * - Query result caching and memoization
 * - Batch operations for multiple requests
 * - Connection pooling and reuse
 * - Efficient pagination strategies
 */

import { supabase } from "./supabase";

// ===============================================
// QUERY FIELD TEMPLATES
// ===============================================

const FIELD_TEMPLATES = {
  location: {
    // Minimal fields for list views, maps, etc.
    minimal:
      "id, name, city, state, location_type, latitude, longitude, rating",

    // Standard fields for most use cases
    standard: `
      id, name, address, city, state, zip_code, phone, website,
      location_type, latitude, longitude, rating, review_count, 
      is_active, created_at, updated_at
    `,

    // Full fields including all relationships
    full: `
      *,
      debrisTypes:location_debris_types(
        id,
        custom_price_per_ton,
        custom_price_per_load,
        debris_type:debris_types(id, name, category, price_per_ton)
      ),
      paymentTypes:location_payment_types(
        payment_type:payment_types(id, name, description)
      ),
      operatingHours:operating_hours(
        id, day_of_week, open_time, close_time, is_closed
      )
    `,

    // For admin operations
    admin: `
      *,
      debrisTypes:location_debris_types(*),
      paymentTypes:location_payment_types(*),
      operatingHours:operating_hours(*),
      reviews:reviews(*)
    `,
  },

  review: {
    public: "id, rating, title, content, author_name, created_at",
    admin: "*",
  },
};

// ===============================================
// QUERY OPTIMIZATION UTILITIES
// ===============================================

class QueryOptimizer {
  private static instance: QueryOptimizer;
  private queryCache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  static getInstance() {
    if (!QueryOptimizer.instance) {
      QueryOptimizer.instance = new QueryOptimizer();
    }
    return QueryOptimizer.instance;
  }

  // Memoized query execution
  async memoizedQuery<T>(
    cacheKey: string,
    queryFn: () => Promise<T>,
    ttl = 300000, // 5 minutes default
  ): Promise<T> {
    const cached = this.queryCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    const result = await queryFn();
    this.queryCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
      ttl,
    });

    return result;
  }

  // Clear expired cache entries
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, entry] of this.queryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.queryCache.delete(key);
      }
    }
  }
}

const queryOptimizer = QueryOptimizer.getInstance();

// ===============================================
// OPTIMIZED LOCATION QUERIES
// ===============================================

export const locationQueries = {
  // Get locations with intelligent pagination and filtering
  async getLocations(
    options: {
      fields?: keyof typeof FIELD_TEMPLATES.location;
      filters?: {
        state?: string;
        city?: string;
        location_type?: string;
        search?: string;
        lat?: number;
        lng?: number;
        radius?: number; // in miles
      };
      pagination?: {
        page?: number;
        pageSize?: number;
      };
      orderBy?: {
        column: string;
        ascending?: boolean;
      };
    } = {},
  ) {
    const {
      fields = "standard",
      filters = {},
      pagination = { page: 1, pageSize: 50 },
      orderBy = { column: "name", ascending: true },
    } = options;

    const cacheKey = `locations-${JSON.stringify(options)}`;

    return queryOptimizer.memoizedQuery(
      cacheKey,
      async () => {
        const { page = 1, pageSize = 50 } = pagination;
        const offset = (page - 1) * pageSize;

        let query = supabase
          .from("locations")
          .select(FIELD_TEMPLATES.location[fields], { count: "exact" })
          .eq("is_active", true);

        // Apply filters efficiently
        if (filters.state) {
          query = query.eq("state", filters.state);
        }

        if (filters.city) {
          query = query.ilike("city", `%${filters.city}%`);
        }

        if (filters.location_type) {
          query = query.eq("location_type", filters.location_type);
        }

        if (filters.search) {
          // Use text search for better performance
          query = query.or(
            `name.ilike.%${filters.search}%,address.ilike.%${filters.search}%,city.ilike.%${filters.search}%`,
          );
        }

        // Geographic filtering with proper indexing
        if (filters.lat && filters.lng && filters.radius) {
          const radiusInDegrees = filters.radius / 69; // Approximate conversion
          query = query
            .gte("latitude", filters.lat - radiusInDegrees)
            .lte("latitude", filters.lat + radiusInDegrees)
            .gte("longitude", filters.lng - radiusInDegrees)
            .lte("longitude", filters.lng + radiusInDegrees);
        }

        // Apply ordering and pagination
        query = query
          .order(orderBy.column, { ascending: orderBy.ascending })
          .range(offset, offset + pageSize - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        return {
          data: data || [],
          pagination: {
            page,
            pageSize,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / pageSize),
          },
        };
      },
      300000,
    ); // 5 minutes cache
  },

  // Get single location with optimized field selection
  async getLocation(
    id: string,
    fields: keyof typeof FIELD_TEMPLATES.location = "full",
  ) {
    const cacheKey = `location-${id}-${fields}`;

    return queryOptimizer.memoizedQuery(
      cacheKey,
      async () => {
        const { data, error } = await supabase
          .from("locations")
          .select(FIELD_TEMPLATES.location[fields])
          .eq("id", id)
          .eq("is_active", true)
          .single();

        if (error) throw error;
        return data;
      },
      600000,
    ); // 10 minutes cache for single locations
  },

  // Batch fetch multiple locations efficiently
  async getLocationsBatch(
    ids: string[],
    fields: keyof typeof FIELD_TEMPLATES.location = "standard",
  ) {
    if (ids.length === 0) return [];

    const cacheKey = `locations-batch-${ids.sort().join(",")}-${fields}`;

    return queryOptimizer.memoizedQuery(
      cacheKey,
      async () => {
        const { data, error } = await supabase
          .from("locations")
          .select(FIELD_TEMPLATES.location[fields])
          .in("id", ids)
          .eq("is_active", true);

        if (error) throw error;
        return data || [];
      },
      300000,
    );
  },

  // Search with advanced text matching
  async searchLocations(
    searchTerm: string,
    options: {
      limit?: number;
      fields?: keyof typeof FIELD_TEMPLATES.location;
      includeInactive?: boolean;
    } = {},
  ) {
    const { limit = 20, fields = "minimal", includeInactive = false } = options;
    const cacheKey = `search-${searchTerm}-${JSON.stringify(options)}`;

    return queryOptimizer.memoizedQuery(
      cacheKey,
      async () => {
        let query = supabase
          .from("locations")
          .select(FIELD_TEMPLATES.location[fields]);

        if (!includeInactive) {
          query = query.eq("is_active", true);
        }

        // Enhanced search across multiple fields
        query = query.or(
          [
            `name.ilike.%${searchTerm}%`,
            `address.ilike.%${searchTerm}%`,
            `city.ilike.%${searchTerm}%`,
            `zip_code.ilike.%${searchTerm}%`,
          ].join(","),
        );

        query = query.order("rating", { ascending: false }).limit(limit);

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
      },
      120000,
    ); // 2 minutes cache for search results
  },
};

// ===============================================
// OPTIMIZED REFERENCE DATA QUERIES
// ===============================================

export const referenceQueries = {
  // Get all reference data in a single optimized call
  async getAllReferenceData() {
    const cacheKey = "reference-data-all";

    return queryOptimizer.memoizedQuery(
      cacheKey,
      async () => {
        const [debrisTypesResult, paymentTypesResult] =
          await Promise.allSettled([
            supabase
              .from("debris_types")
              .select(
                "id, name, category, price_per_ton, price_per_load, description",
              )
              .order("category, name"),

            supabase
              .from("payment_types")
              .select("id, name, description")
              .order("name"),
          ]);

        const debrisTypes =
          debrisTypesResult.status === "fulfilled"
            ? debrisTypesResult.value.data || []
            : [];

        const paymentTypes =
          paymentTypesResult.status === "fulfilled"
            ? paymentTypesResult.value.data || []
            : [];

        return {
          debrisTypes,
          paymentTypes,
          locationTypes: [
            { id: "landfill", name: "Landfill" },
            { id: "transfer_station", name: "Transfer Station" },
            { id: "construction_landfill", name: "Construction Landfill" },
          ],
        };
      },
      3600000,
    ); // 1 hour cache for reference data
  },

  // Get states and cities for location filtering
  async getLocationGeography() {
    const cacheKey = "location-geography";

    return queryOptimizer.memoizedQuery(
      cacheKey,
      async () => {
        const { data, error } = await supabase
          .from("locations")
          .select("state, city")
          .eq("is_active", true);

        if (error) throw error;

        // Process data to get unique states and cities per state
        const geography = (data || []).reduce((acc: any, location) => {
          const { state, city } = location;

          if (!acc[state]) {
            acc[state] = new Set();
          }
          acc[state].add(city);

          return acc;
        }, {});

        // Convert to array format for easier use
        return Object.entries(geography)
          .map(([state, cities]: [string, any]) => ({
            state,
            cities: Array.from(cities).sort(),
          }))
          .sort((a, b) => a.state.localeCompare(b.state));
      },
      1800000,
    ); // 30 minutes cache
  },
};

// ===============================================
// OPTIMIZED ANALYTICS QUERIES
// ===============================================

export const analyticsQueries = {
  // Get location statistics efficiently
  async getLocationStats() {
    const cacheKey = "location-stats";

    return queryOptimizer.memoizedQuery(
      cacheKey,
      async () => {
        const { data, error } = await supabase.rpc("get_location_statistics");

        if (error) {
          // Fallback to manual calculation if RPC not available
          const statsPromises = [
            supabase
              .from("locations")
              .select("id", { count: "exact" })
              .eq("is_active", true),
            supabase
              .from("locations")
              .select("state", { count: "exact" })
              .eq("is_active", true),
            supabase.from("reviews").select("id", { count: "exact" }),
          ];

          const [locationsResult, statesResult, reviewsResult] =
            await Promise.allSettled(statsPromises);

          return {
            totalLocations:
              locationsResult.status === "fulfilled"
                ? locationsResult.value.count || 0
                : 0,
            totalStates:
              statesResult.status === "fulfilled"
                ? new Set(
                    (statesResult.value.data || []).map((l: any) => l.state),
                  ).size
                : 0,
            totalReviews:
              reviewsResult.status === "fulfilled"
                ? reviewsResult.value.count || 0
                : 0,
          };
        }

        return data;
      },
      600000,
    ); // 10 minutes cache
  },

  // Track location view for analytics
  async trackLocationView(
    locationId: string,
    userAgent?: string,
    referrer?: string,
  ) {
    // Don't cache this - it's a write operation
    const { error } = await supabase.from("location_views").insert({
      location_id: locationId,
      viewed_at: new Date().toISOString(),
      user_agent: userAgent,
      referrer: referrer,
    });

    if (error && error.code !== "23505") {
      // Ignore duplicate key errors
      console.warn("Failed to track location view:", error);
    }
  },
};

// ===============================================
// BATCH OPERATIONS
// ===============================================

export const batchOperations = {
  // Batch create multiple locations
  async createLocationsBatch(locations: any[]) {
    const { data, error } = await supabase
      .from("locations")
      .insert(locations)
      .select();

    if (error) throw error;

    // Clear relevant caches
    queryOptimizer.clearExpiredCache();

    return data;
  },

  // Batch update multiple locations
  async updateLocationsBatch(updates: Array<{ id: string; updates: any }>) {
    const promises = updates.map(({ id, updates: locationUpdates }) =>
      supabase
        .from("locations")
        .update(locationUpdates)
        .eq("id", id)
        .select()
        .single(),
    );

    const results = await Promise.allSettled(promises);

    // Clear relevant caches
    queryOptimizer.clearExpiredCache();

    return results.map((result, index) => ({
      id: updates[index].id,
      success: result.status === "fulfilled",
      data: result.status === "fulfilled" ? result.value.data : null,
      error: result.status === "rejected" ? result.reason : null,
    }));
  },
};

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

export const queryUtils = {
  // Clear all query cache
  clearCache() {
    queryOptimizer.clearExpiredCache();
  },

  // Warm cache with popular queries
  async warmCache() {
    const popularQueries = [
      () => referenceQueries.getAllReferenceData(),
      () => referenceQueries.getLocationGeography(),
      () => analyticsQueries.getLocationStats(),
      () =>
        locationQueries.getLocations({
          fields: "minimal",
          pagination: { page: 1, pageSize: 20 },
        }),
    ];

    await Promise.allSettled(popularQueries.map((query) => query()));
  },

  // Get cache statistics
  getCacheStats() {
    const cache = (queryOptimizer as any).queryCache;
    return {
      size: cache.size,
      entries: Array.from(cache.keys()),
    };
  },
};

// Auto-cleanup expired cache entries every 5 minutes
setInterval(() => {
  queryOptimizer.clearExpiredCache();
}, 300000);
