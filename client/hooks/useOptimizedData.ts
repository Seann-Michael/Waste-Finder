/**
 * Optimized Data Fetching Hooks
 * 
 * High-performance React Query hooks with advanced optimization:
 * - Intelligent caching strategies
 * - Background refetching
 * - Optimistic updates
 * - Request deduplication
 * - Prefetching strategies
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { locationQueries, referenceQueries, analyticsQueries, batchOperations } from '../lib/optimizedSupabaseQueries';
import { useCallback, useEffect } from 'react';

// ===============================================
// QUERY KEY FACTORIES
// ===============================================

export const queryKeys = {
  locations: {
    all: ['locations'] as const,
    lists: () => [...queryKeys.locations.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.locations.lists(), filters] as const,
    details: () => [...queryKeys.locations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.locations.details(), id] as const,
    search: (term: string) => [...queryKeys.locations.all, 'search', term] as const,
    batch: (ids: string[]) => [...queryKeys.locations.all, 'batch', ids.sort()] as const,
  },
  reference: {
    all: ['reference'] as const,
    geography: () => [...queryKeys.reference.all, 'geography'] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    stats: () => [...queryKeys.analytics.all, 'stats'] as const,
  }
};

// ===============================================
// OPTIMIZED LOCATION HOOKS
// ===============================================

export const useLocations = (options: {
  fields?: 'minimal' | 'standard' | 'full' | 'admin';
  filters?: any;
  pagination?: { page?: number; pageSize?: number };
  orderBy?: { column: string; ascending?: boolean };
  enabled?: boolean;
} = {}) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: queryKeys.locations.list(options),
    queryFn: () => locationQueries.getLocations(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: options.enabled !== false,
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
  
  // Prefetch next page when approaching end of current page
  useEffect(() => {
    if (query.data?.pagination && options.pagination?.page) {
      const { page, totalPages } = query.data.pagination;
      const currentPage = options.pagination.page;
      
      if (currentPage < totalPages && currentPage >= totalPages - 2) {
        // Prefetch next page
        queryClient.prefetchQuery({
          queryKey: queryKeys.locations.list({
            ...options,
            pagination: { ...options.pagination, page: currentPage + 1 }
          }),
          queryFn: () => locationQueries.getLocations({
            ...options,
            pagination: { ...options.pagination, page: currentPage + 1 }
          }),
          staleTime: 5 * 60 * 1000
        });
      }
    }
  }, [query.data, options, queryClient]);
  
  return query;
};

export const useLocation = (id: string, fields: 'minimal' | 'standard' | 'full' | 'admin' = 'full') => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: queryKeys.locations.detail(id),
    queryFn: () => locationQueries.getLocation(id, fields),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes for single locations
    gcTime: 60 * 60 * 1000, // 1 hour
  });
  
  // Track location view for analytics
  useEffect(() => {
    if (query.data && id) {
      // Track view asynchronously
      analyticsQueries.trackLocationView(
        id,
        navigator.userAgent,
        document.referrer
      ).catch(console.warn);
    }
  }, [query.data, id]);
  
  return query;
};

export const useLocationsBatch = (ids: string[], fields: 'minimal' | 'standard' | 'full' = 'standard') => {
  return useQuery({
    queryKey: queryKeys.locations.batch(ids),
    queryFn: () => locationQueries.getLocationsBatch(ids, fields),
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// ===============================================
// INFINITE SCROLL LOCATIONS
// ===============================================

export const useInfiniteLocations = (options: {
  fields?: 'minimal' | 'standard' | 'full';
  filters?: any;
  pageSize?: number;
} = {}) => {
  const { pageSize = 20, ...otherOptions } = options;
  
  return useInfiniteQuery({
    queryKey: [...queryKeys.locations.lists(), 'infinite', options],
    queryFn: ({ pageParam = 1 }) => 
      locationQueries.getLocations({
        ...otherOptions,
        pagination: { page: pageParam, pageSize }
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// ===============================================
// SEARCH HOOKS WITH DEBOUNCING
// ===============================================

export const useLocationSearch = (searchTerm: string, options: {
  limit?: number;
  fields?: 'minimal' | 'standard' | 'full';
  debounceMs?: number;
} = {}) => {
  const { debounceMs = 300, ...searchOptions } = options;
  
  return useQuery({
    queryKey: queryKeys.locations.search(searchTerm),
    queryFn: () => locationQueries.searchLocations(searchTerm, searchOptions),
    enabled: searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 10 * 60 * 1000,
  });
};

// ===============================================
// REFERENCE DATA HOOKS
// ===============================================

export const useReferenceData = () => {
  return useQuery({
    queryKey: queryKeys.reference.all,
    queryFn: referenceQueries.getAllReferenceData,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const useLocationGeography = () => {
  return useQuery({
    queryKey: queryKeys.reference.geography(),
    queryFn: referenceQueries.getLocationGeography,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

// ===============================================
// ANALYTICS HOOKS
// ===============================================

export const useLocationStats = () => {
  return useQuery({
    queryKey: queryKeys.analytics.stats(),
    queryFn: analyticsQueries.getLocationStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// ===============================================
// MUTATION HOOKS WITH OPTIMISTIC UPDATES
// ===============================================

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newLocation: any) => 
      batchOperations.createLocationsBatch([newLocation]).then(data => data[0]),
    
    onSuccess: (data) => {
      // Invalidate and refetch location lists
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });
      
      // Add the new location to cache
      if (data?.id) {
        queryClient.setQueryData(queryKeys.locations.detail(data.id), data);
      }
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      batchOperations.updateLocationsBatch([{ id, updates }]).then(results => results[0]),
    
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.locations.detail(id) });
      
      // Snapshot previous value
      const previousLocation = queryClient.getQueryData(queryKeys.locations.detail(id));
      
      // Optimistically update cache
      if (previousLocation) {
        queryClient.setQueryData(
          queryKeys.locations.detail(id),
          { ...previousLocation, ...updates }
        );
      }
      
      return { previousLocation };
    },
    
    onError: (error, { id }, context) => {
      // Rollback optimistic update
      if (context?.previousLocation) {
        queryClient.setQueryData(queryKeys.locations.detail(id), context.previousLocation);
      }
    },
    
    onSettled: (data, error, { id }) => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });
    },
  });
};

export const useBatchUpdateLocations = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: batchOperations.updateLocationsBatch,
    
    onSuccess: (results) => {
      // Invalidate all location queries
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
      
      // Update individual location caches for successful updates
      results.forEach(result => {
        if (result.success && result.data) {
          queryClient.setQueryData(
            queryKeys.locations.detail(result.id),
            result.data
          );
        }
      });
    },
  });
};

// ===============================================
// PREFETCHING UTILITIES
// ===============================================

export const usePrefetchLocation = () => {
  const queryClient = useQueryClient();
  
  return useCallback((id: string, fields: 'minimal' | 'standard' | 'full' = 'full') => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.locations.detail(id),
      queryFn: () => locationQueries.getLocation(id, fields),
      staleTime: 10 * 60 * 1000,
    });
  }, [queryClient]);
};

export const usePrefetchLocationSearch = () => {
  const queryClient = useQueryClient();
  
  return useCallback((searchTerm: string, options: any = {}) => {
    if (searchTerm.length >= 2) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.locations.search(searchTerm),
        queryFn: () => locationQueries.searchLocations(searchTerm, options),
        staleTime: 2 * 60 * 1000,
      });
    }
  }, [queryClient]);
};

// ===============================================
// CACHE MANAGEMENT UTILITIES
// ===============================================

export const useCacheManager = () => {
  const queryClient = useQueryClient();
  
  return {
    // Clear all location caches
    clearLocationCache: useCallback(() => {
      queryClient.removeQueries({ queryKey: queryKeys.locations.all });
    }, [queryClient]),
    
    // Warm cache with popular data
    warmCache: useCallback(async () => {
      const promises = [
        queryClient.prefetchQuery({
          queryKey: queryKeys.reference.all,
          queryFn: referenceQueries.getAllReferenceData,
          staleTime: 60 * 60 * 1000,
        }),
        queryClient.prefetchQuery({
          queryKey: queryKeys.analytics.stats(),
          queryFn: analyticsQueries.getLocationStats,
          staleTime: 10 * 60 * 1000,
        }),
      ];
      
      await Promise.allSettled(promises);
    }, [queryClient]),
    
    // Get cache statistics
    getCacheStats: useCallback(() => {
      const cache = queryClient.getQueryCache();
      return {
        queryCount: cache.getAll().length,
        queries: cache.getAll().map(query => ({
          queryKey: query.queryKey,
          state: query.state.status,
          dataUpdatedAt: query.state.dataUpdatedAt,
        }))
      };
    }, [queryClient])
  };
};

// ===============================================
// BACKGROUND SYNC HOOK
// ===============================================

export const useBackgroundSync = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Set up background refetching for stale queries
    const interval = setInterval(() => {
      queryClient.refetchQueries({
        predicate: (query) => {
          const state = query.state;
          const isStale = Date.now() - state.dataUpdatedAt > (state.staleTime || 0);
          return isStale && state.status === 'success';
        }
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [queryClient]);
  
  useEffect(() => {
    // Refetch on window focus
    const handleFocus = () => {
      queryClient.refetchQueries({
        predicate: (query) => query.state.status === 'success' && query.state.isStale()
      });
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [queryClient]);
};
