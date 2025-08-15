import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, APIError, NetworkError, TimeoutError } from "@/lib/api";
import { useToastNotifications } from "./use-toast-notifications";
import { Location, LocationSearchRequest } from "@shared/api";

/**
 * Query keys for consistent caching
 */
export const queryKeys = {
  locations: {
    all: ["locations"] as const,
    lists: () => [...queryKeys.locations.all, "list"] as const,
    list: (filters: any) => [...queryKeys.locations.lists(), filters] as const,
    details: () => [...queryKeys.locations.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.locations.details(), id] as const,
    search: (params: LocationSearchRequest) =>
      [...queryKeys.locations.all, "search", params] as const,
  },
  blog: {
    all: ["blog"] as const,
    posts: () => [...queryKeys.blog.all, "posts"] as const,
    post: (slug: string) => [...queryKeys.blog.all, "post", slug] as const,
  },
  auth: {
    user: ["auth", "user"] as const,
  },
} as const;

/**
 * Default query options
 */
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: (failureCount: number, error: any) => {
    // Don't retry on client errors (4xx) or auth errors
    if (error instanceof APIError && error.status < 500) {
      return false;
    }

    // Retry network/timeout errors up to 3 times
    if (error instanceof NetworkError || error instanceof TimeoutError) {
      return failureCount < 3;
    }

    return failureCount < 2;
  },
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
};

/**
 * Hook for fetching all locations
 */
export function useLocations(filters?: any) {
  return useQuery({
    queryKey: queryKeys.locations.list(filters || {}),
    queryFn: () => api.locations.getAll(filters),
    ...defaultQueryOptions,
  });
}

/**
 * Hook for fetching a single location
 */
export function useLocation(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.locations.detail(id),
    queryFn: () => api.locations.getById(id),
    enabled: enabled && !!id,
    ...defaultQueryOptions,
  });
}

/**
 * Hook for searching locations
 */
export function useLocationSearch(
  params: LocationSearchRequest,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.locations.search(params),
    queryFn: () => api.locations.search(params),
    enabled: enabled && !!(params.zipCode || params.zip_code),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating a location
 */
export function useCreateLocation() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastNotifications();

  return useMutation({
    mutationFn: (data: any) => api.locations.create(data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch locations
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });

      showSuccess("Location created successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to create location:", error);

      if (error instanceof APIError) {
        showError(`Failed to create location: ${error.message}`);
      } else if (error instanceof NetworkError) {
        showError("Network error. Please check your connection and try again.");
      } else {
        showError("An unexpected error occurred. Please try again.");
      }
    },
  });
}

/**
 * Hook for updating a location
 */
export function useUpdateLocation() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastNotifications();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.locations.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific location in cache
      queryClient.setQueryData(queryKeys.locations.detail(variables.id), data);

      // Invalidate locations list to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });

      showSuccess("Location updated successfully!");
    },
    onError: (error: any, variables) => {
      console.error("Failed to update location:", error);

      if (error instanceof APIError) {
        showError(`Failed to update location: ${error.message}`);
      } else if (error instanceof NetworkError) {
        showError("Network error. Please check your connection and try again.");
      } else {
        showError("An unexpected error occurred. Please try again.");
      }
    },
  });
}

/**
 * Hook for deleting a location
 */
export function useDeleteLocation() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastNotifications();

  return useMutation({
    mutationFn: (id: string) => api.locations.delete(id),
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.locations.detail(id) });

      // Invalidate locations list
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.lists() });

      showSuccess("Location deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Failed to delete location:", error);

      if (error instanceof APIError) {
        showError(`Failed to delete location: ${error.message}`);
      } else if (error instanceof NetworkError) {
        showError("Network error. Please check your connection and try again.");
      } else {
        showError("An unexpected error occurred. Please try again.");
      }
    },
  });
}

/**
 * Hook for fetching blog posts
 */
export function useBlogPosts() {
  return useQuery({
    queryKey: queryKeys.blog.posts(),
    queryFn: () => api.blog.getPosts(),
    ...defaultQueryOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching a single blog post
 */
export function useBlogPost(slug: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.blog.post(slug),
    queryFn: () => api.blog.getPost(slug),
    enabled: enabled && !!slug,
    ...defaultQueryOptions,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for prefetching data
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  const prefetchLocations = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.locations.lists(),
      queryFn: () => api.locations.getAll(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchLocation = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.locations.detail(id),
      queryFn: () => api.locations.getById(id),
      staleTime: 10 * 60 * 1000,
    });
  };

  const prefetchBlogPosts = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.blog.posts(),
      queryFn: () => api.blog.getPosts(),
      staleTime: 10 * 60 * 1000,
    });
  };

  return {
    prefetchLocations,
    prefetchLocation,
    prefetchBlogPosts,
  };
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticUpdates() {
  const queryClient = useQueryClient();

  const updateLocationOptimistically = (
    id: string,
    newData: Partial<Location>,
  ) => {
    queryClient.setQueryData(
      queryKeys.locations.detail(id),
      (oldData: Location | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...newData };
      },
    );
  };

  const revertOptimisticUpdate = (id: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.locations.detail(id),
    });
  };

  return {
    updateLocationOptimistically,
    revertOptimisticUpdate,
  };
}

/**
 * Hook for managing loading states
 */
export function useGlobalLoading() {
  const queryClient = useQueryClient();

  // Check if any queries are loading
  const isLoading = queryClient.isFetching() > 0;
  const isMutating = queryClient.isMutating() > 0;

  return {
    isLoading,
    isMutating,
    isAnyLoading: isLoading || isMutating,
  };
}
