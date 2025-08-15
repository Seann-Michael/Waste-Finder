/**
 * Optimized API Layer with Advanced Caching and Performance Features
 * 
 * This module provides enterprise-grade API optimizations including:
 * - Query deduplication and request batching
 * - Intelligent background sync
 * - Optimistic updates with rollback
 * - Advanced caching strategies
 * - Request coalescing and debouncing
 */

import { supabase } from './supabase';
import { QueryClient, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

// ===============================================
// CONFIGURATION & CONSTANTS
// ===============================================

const CACHE_CONFIG = {
  // Location data (relatively stable)
  locations: {
    staleTime: 5 * 60 * 1000,      // 5 minutes
    gcTime: 30 * 60 * 1000,       // 30 minutes
  },
  // Search results (user-specific, shorter cache)
  search: {
    staleTime: 2 * 60 * 1000,      // 2 minutes
    gcTime: 10 * 60 * 1000,       // 10 minutes
  },
  // Static reference data (very stable)
  reference: {
    staleTime: 60 * 60 * 1000,     // 1 hour
    gcTime: 24 * 60 * 60 * 1000,  // 24 hours
  },
  // Real-time data (always fresh)
  realtime: {
    staleTime: 0,                  // Always stale
    gcTime: 5 * 60 * 1000,        // 5 minutes
  }
};

// ===============================================
// QUERY KEYS FACTORY
// ===============================================

export const queryKeys = {
  locations: {
    all: ['locations'] as const,
    lists: () => [...queryKeys.locations.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.locations.lists(), filters] as const,
    details: () => [...queryKeys.locations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.locations.details(), id] as const,
    search: (params: any) => ['locations', 'search', params] as const,
  },
  reference: {
    all: ['reference'] as const,
    debrisTypes: () => [...queryKeys.reference.all, 'debris-types'] as const,
    paymentTypes: () => [...queryKeys.reference.all, 'payment-types'] as const,
    locationTypes: () => [...queryKeys.reference.all, 'location-types'] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    stats: () => [...queryKeys.analytics.all, 'stats'] as const,
    views: (locationId: string) => [...queryKeys.analytics.all, 'views', locationId] as const,
  }
};

// ===============================================
// REQUEST DEDUPLICATION & BATCHING
// ===============================================

class RequestBatcher {
  private batches = new Map<string, {
    requests: Array<{ resolve: (value: any) => void; reject: (error: any) => void }>;
    timeout: NodeJS.Timeout;
  }>();

  async batchRequest<T>(key: string, request: () => Promise<T>, delay = 50): Promise<T> {
    return new Promise((resolve, reject) => {
      const existing = this.batches.get(key);
      
      if (existing) {
        // Add to existing batch
        existing.requests.push({ resolve, reject });
      } else {
        // Create new batch
        const timeout = setTimeout(async () => {
          const batch = this.batches.get(key);
          if (!batch) return;
          
          this.batches.delete(key);
          
          try {
            const result = await request();
            batch.requests.forEach(req => req.resolve(result));
          } catch (error) {
            batch.requests.forEach(req => req.reject(error));
          }
        }, delay);
        
        this.batches.set(key, {
          requests: [{ resolve, reject }],
          timeout
        });
      }
    });
  }
}

const requestBatcher = new RequestBatcher();

// ===============================================
// OPTIMIZED SUPABASE QUERIES
// ===============================================

export const optimizedQueries = {
  
  // Locations with intelligent field selection
  async getLocations(options: {
    fields?: 'minimal' | 'standard' | 'full';
    filters?: any;
    limit?: number;
    offset?: number;
  } = {}) {
    const { fields = 'standard', filters = {}, limit = 50, offset = 0 } = options;
    
    // Field selection based on use case
    const fieldMaps = {
      minimal: 'id, name, city, state, location_type, latitude, longitude',
      standard: 'id, name, address, city, state, zip_code, location_type, latitude, longitude, rating, review_count, is_active',
      full: `
        *,
        debrisTypes:location_debris_types(
          debris_type:debris_types(id, name, category, price_per_ton)
        ),
        paymentTypes:location_payment_types(
          payment_type:payment_types(id, name)
        ),
        operatingHours:operating_hours(*)
      `
    };
    
    const batchKey = `locations-${fields}-${JSON.stringify(filters)}-${limit}-${offset}`;
    
    return requestBatcher.batchRequest(batchKey, async () => {
      let query = supabase
        .from('locations')
        .select(fieldMaps[fields])
        .eq('is_active', true)
        .range(offset, offset + limit - 1);
      
      // Apply filters efficiently
      if (filters.state) query = query.eq('state', filters.state);
      if (filters.location_type) query = query.eq('location_type', filters.location_type);
      if (filters.city) query = query.ilike('city', `%${filters.city}%`);
      
      // Optimize search with FTS if available, fallback to ilike
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%, address.ilike.%${filters.search}%`);
      }
      
      const { data, error, count } = await query;
      if (error) throw error;
      
      return { data, count };
    });
  },
  
  // Single location with smart caching
  async getLocation(id: string, includeRelated = true) {
    const batchKey = `location-${id}-${includeRelated}`;
    
    return requestBatcher.batchRequest(batchKey, async () => {
      const selectFields = includeRelated ? `
        *,
        debrisTypes:location_debris_types(
          debris_type:debris_types(*)
        ),
        paymentTypes:location_payment_types(
          payment_type:payment_types(*)
        ),
        operatingHours:operating_hours(*),
        reviews!reviews_location_id_fkey(
          id, rating, title, content, author_name, created_at, is_approved
        )
      ` : '*';
      
      const { data, error } = await supabase
        .from('locations')
        .select(selectFields)
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    });
  },
  
  // Reference data with long-term caching
  async getReferenceData() {
    return requestBatcher.batchRequest('reference-data', async () => {
      const [debrisTypes, paymentTypes] = await Promise.all([
        supabase
          .from('debris_types')
          .select('id, name, category, price_per_ton, description')
          .order('name'),
        supabase
          .from('payment_types')
          .select('id, name, description')
          .order('name')
      ]);
      
      if (debrisTypes.error) throw debrisTypes.error;
      if (paymentTypes.error) throw paymentTypes.error;
      
      return {
        debrisTypes: debrisTypes.data,
        paymentTypes: paymentTypes.data
      };
    });
  }
};

// ===============================================
// OPTIMIZED REACT QUERY HOOKS
// ===============================================

export const useOptimizedLocations = (options: {
  fields?: 'minimal' | 'standard' | 'full';
  filters?: any;
  limit?: number;
  enabled?: boolean;
} = {}) => {
  const { fields = 'standard', filters = {}, limit = 50, enabled = true } = options;
  
  return useQuery({
    queryKey: queryKeys.locations.list({ fields, filters, limit }),
    queryFn: () => optimizedQueries.getLocations({ fields, filters, limit }),
    staleTime: CACHE_CONFIG.locations.staleTime,
    gcTime: CACHE_CONFIG.locations.gcTime,
    enabled,
    // Prefetch next page
    onSuccess: (data) => {
      if (data.data.length === limit) {
        // Prefetch next page
        setTimeout(() => {
          optimizedQueries.getLocations({ 
            fields, 
            filters, 
            limit, 
            offset: limit 
          });
        }, 1000);
      }
    }
  });
};

export const useOptimizedLocation = (id: string, includeRelated = true) => {
  return useQuery({
    queryKey: queryKeys.locations.detail(id),
    queryFn: () => optimizedQueries.getLocation(id, includeRelated),
    staleTime: CACHE_CONFIG.locations.staleTime,
    gcTime: CACHE_CONFIG.locations.gcTime,
    enabled: !!id
  });
};

export const useReferenceData = () => {
  return useQuery({
    queryKey: queryKeys.reference.all,
    queryFn: optimizedQueries.getReferenceData,
    staleTime: CACHE_CONFIG.reference.staleTime,
    gcTime: CACHE_CONFIG.reference.gcTime
  });
};

// ===============================================
// BACKGROUND SYNC & CACHE WARMING
// ===============================================

export class CacheWarmer {
  private queryClient: QueryClient;
  
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }
  
  // Warm cache with popular locations
  async warmLocationCache() {
    const popularStates = ['CA', 'TX', 'FL', 'NY', 'IL'];
    
    // Prefetch popular state locations
    const prefetchPromises = popularStates.map(state =>
      this.queryClient.prefetchQuery({
        queryKey: queryKeys.locations.list({ filters: { state }, fields: 'minimal' }),
        queryFn: () => optimizedQueries.getLocations({ 
          fields: 'minimal', 
          filters: { state },
          limit: 20 
        }),
        staleTime: CACHE_CONFIG.locations.staleTime
      })
    );
    
    // Prefetch reference data
    prefetchPromises.push(
      this.queryClient.prefetchQuery({
        queryKey: queryKeys.reference.all,
        queryFn: optimizedQueries.getReferenceData,
        staleTime: CACHE_CONFIG.reference.staleTime
      })
    );
    
    await Promise.allSettled(prefetchPromises);
  }
  
  // Background refresh for stale data
  backgroundRefresh() {
    setInterval(() => {
      // Refresh stale queries in background
      this.queryClient.invalidateQueries({
        predicate: (query) => {
          const lastFetch = query.state.dataUpdatedAt;
          const isStale = Date.now() - lastFetch > CACHE_CONFIG.locations.staleTime;
          return isStale && query.state.data !== undefined;
        }
      });
    }, 60000); // Check every minute
  }
}

// ===============================================
// OPTIMISTIC UPDATES
// ===============================================

export const useOptimisticLocationUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing queries for this location
      await queryClient.cancelQueries({ queryKey: queryKeys.locations.detail(id) });
      
      // Get current data
      const previousData = queryClient.getQueryData(queryKeys.locations.detail(id));
      
      // Optimistically update cache
      if (previousData) {
        queryClient.setQueryData(
          queryKeys.locations.detail(id),
          { ...previousData, ...updates }
        );
      }
      
      return { previousData };
    },
    
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.locations.detail(id), context.previousData);
      }
    },
    
    onSettled: (data, error, { id }) => {
      // Refetch to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });
    }
  });
};

// ===============================================
// SEARCH OPTIMIZATION
// ===============================================

let searchTimeout: NodeJS.Timeout;

export const useDebouncedLocationSearch = (searchTerm: string, filters: any = {}) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  
  useEffect(() => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300); // 300ms debounce
    
    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);
  
  return useQuery({
    queryKey: queryKeys.locations.search({ search: debouncedTerm, ...filters }),
    queryFn: () => optimizedQueries.getLocations({
      fields: 'standard',
      filters: { search: debouncedTerm, ...filters },
      limit: 20
    }),
    enabled: debouncedTerm.length >= 2, // Only search with 2+ characters
    staleTime: CACHE_CONFIG.search.staleTime,
    gcTime: CACHE_CONFIG.search.gcTime
  });
};

// ===============================================
// EXPORT UTILITIES
// ===============================================

export const initializeOptimizedApi = (queryClient: QueryClient) => {
  const cacheWarmer = new CacheWarmer(queryClient);
  
  // Warm cache on app start
  cacheWarmer.warmLocationCache();
  
  // Start background refresh
  cacheWarmer.backgroundRefresh();
  
  return cacheWarmer;
};
