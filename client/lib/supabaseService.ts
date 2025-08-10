import { supabase } from './supabase';

// Location interface matching your existing data structure
export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  website?: string;
  hours?: string;
  type: 'transfer_station' | 'landfill' | 'recycling_center' | 'dumpster_rental';
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  services?: string[];
  accepts?: string[];
  pricing?: any;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Get all active locations
export async function getLocations(): Promise<Location[]> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Supabase connection error:', error);
    return [];
  }
}

// Get locations by state
export async function getLocationsByState(state: string): Promise<Location[]> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('state', state)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching locations by state:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Supabase connection error:', error);
    return [];
  }
}

// Get locations by city
export async function getLocationsByCity(city: string, state?: string): Promise<Location[]> {
  try {
    let query = supabase
      .from('locations')
      .select('*')
      .eq('city', city)
      .eq('is_active', true);

    if (state) {
      query = query.eq('state', state);
    }

    const { data, error } = await query.order('name');

    if (error) {
      console.error('Error fetching locations by city:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Supabase connection error:', error);
    return [];
  }
}

// Get single location by ID
export async function getLocationById(id: string): Promise<Location | null> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching location by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return null;
  }
}

// Search locations by name or address
export async function searchLocations(query: string): Promise<Location[]> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .or(`name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`)
      .eq('is_active', true)
      .order('name')
      .limit(50);

    if (error) {
      console.error('Error searching locations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Supabase connection error:', error);
    return [];
  }
}

// Add a new location (admin only)
export async function addLocation(location: Omit<Location, 'id' | 'created_at' | 'updated_at'>): Promise<Location | null> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .insert([{
        ...location,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding location:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return null;
  }
}

// Update location (admin only)
export async function updateLocation(id: string, updates: Partial<Location>): Promise<Location | null> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating location:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return null;
  }
}

// Delete location (admin only - soft delete)
export async function deleteLocation(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('locations')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting location:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

// Get location statistics
export async function getLocationStats() {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('state, type')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching location stats:', error);
      return { totalLocations: 0, stateCount: {}, typeCount: {} };
    }

    const totalLocations = data?.length || 0;
    const stateCount = data?.reduce((acc: any, location) => {
      acc[location.state] = (acc[location.state] || 0) + 1;
      return acc;
    }, {}) || {};
    
    const typeCount = data?.reduce((acc: any, location) => {
      acc[location.type] = (acc[location.type] || 0) + 1;
      return acc;
    }, {}) || {};

    return { totalLocations, stateCount, typeCount };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { totalLocations: 0, stateCount: {}, typeCount: {} };
  }
}
