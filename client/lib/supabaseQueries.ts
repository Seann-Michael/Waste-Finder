import { supabase } from './supabase';
import type { Location, LocationSearchParams, LocationSearchResponse } from './database.types';

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Search locations with full details including operating hours, payment types, etc.
 */
export async function searchLocations(params: LocationSearchParams): Promise<LocationSearchResponse> {
  try {
    const { zipCode, latitude, longitude, radius = 25, locationType, search, page = 1, limit = 50 } = params;

    // Build the query with joins
    let query = supabase
      .from('locations')
      .select(`
        *,
        operating_hours (*),
        location_payment_types!inner (
          payment_type:payment_types (*)
        ),
        location_debris_types!inner (
          debris_type:debris_types (*)
        )
      `)
      .eq('is_active', true);

    // Apply filters
    if (locationType) {
      query = query.eq('location_type', locationType);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%,notes.ilike.%${search}%`);
    }

    // Execute query
    const { data: locations, error } = await query.order('name');

    if (error) {
      console.error('Error searching locations:', error);
      return {
        success: false,
        locations: [],
        totalCount: 0,
        query: params
      };
    }

    let processedLocations = locations || [];

    // If coordinates provided, calculate distances and filter by radius
    if (latitude && longitude) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      const maxDistance = Number(radius);

      processedLocations = processedLocations
        .map(location => ({
          ...location,
          distance: calculateDistance(lat, lng, location.latitude, location.longitude)
        }))
        .filter(loc => loc.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLocations = processedLocations.slice(startIndex, endIndex);

    return {
      success: true,
      locations: paginatedLocations,
      totalCount: processedLocations.length,
      pagination: {
        page,
        limit,
        total: processedLocations.length,
        pages: Math.ceil(processedLocations.length / limit)
      },
      query: params
    };
  } catch (error) {
    console.error('Search locations error:', error);
    return {
      success: false,
      locations: [],
      totalCount: 0,
      query: params
    };
  }
}

/**
 * Get a single location with full details
 */
export async function getLocationDetails(id: string): Promise<Location | null> {
  try {
    const { data: location, error } = await supabase
      .from('locations')
      .select(`
        *,
        operating_hours (*),
        location_payment_types!inner (
          payment_type:payment_types (*)
        ),
        location_debris_types!inner (
          debris_type:debris_types (*)
        ),
        reviews (*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching location details:', error);
      return null;
    }

    return location;
  } catch (error) {
    console.error('Get location details error:', error);
    return null;
  }
}

/**
 * Get all locations for admin management
 */
export async function getAllLocationsAdmin(): Promise<Location[]> {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select(`
        *,
        operating_hours (*),
        location_payment_types!inner (
          payment_type:payment_types (*)
        ),
        location_debris_types!inner (
          debris_type:debris_types (*)
        )
      `)
      .order('name');

    if (error) {
      console.error('Error fetching all locations:', error);
      return [];
    }

    return locations || [];
  } catch (error) {
    console.error('Get all locations error:', error);
    return [];
  }
}

/**
 * Get location statistics for dashboard
 */
export async function getLocationStats() {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select('location_type, state, is_active')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching location stats:', error);
      return {
        totalLocations: 0,
        typeCount: {},
        stateCount: {}
      };
    }

    const totalLocations = locations?.length || 0;
    
    const typeCount = locations?.reduce((acc: any, location) => {
      acc[location.location_type] = (acc[location.location_type] || 0) + 1;
      return acc;
    }, {}) || {};
    
    const stateCount = locations?.reduce((acc: any, location) => {
      acc[location.state] = (acc[location.state] || 0) + 1;
      return acc;
    }, {}) || {};

    return {
      totalLocations,
      typeCount,
      stateCount
    };
  } catch (error) {
    console.error('Get location stats error:', error);
    return {
      totalLocations: 0,
      typeCount: {},
      stateCount: {}
    };
  }
}

/**
 * Add a review for a location
 */
export async function addLocationReview(locationId: string, review: {
  rating: number;
  title: string;
  content: string;
  author_name: string;
  author_email?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        location_id: locationId,
        ...review,
        is_approved: false, // Reviews need approval
        is_moderated: false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding review:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Add review error:', error);
    return { success: false, error: 'Failed to add review' };
  }
}

/**
 * Submit a location suggestion
 */
export async function submitLocationSuggestion(suggestion: {
  location_id?: string;
  suggestion_type: 'new_location' | 'edit_location';
  suggested_data: any;
  submitter_name: string;
  submitter_email: string;
  notes?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('location_suggestions')
      .insert([{
        ...suggestion,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error submitting suggestion:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Submit suggestion error:', error);
    return { success: false, error: 'Failed to submit suggestion' };
  }
}
