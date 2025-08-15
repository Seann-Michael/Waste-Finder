/**
 * Example Component: Optimized Location List
 * 
 * Demonstrates the use of optimized API hooks for maximum performance:
 * - Smart field selection based on view type
 * - Intelligent pagination with prefetching
 * - Debounced search with caching
 * - Optimistic updates for better UX
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  useOptimizedLocations, 
  useLocationSearch,
  usePrefetchLocation,
  useUpdateLocation,
  useReferenceData 
} from '@/hooks/useOptimizedData';
import { MapPin, Star, Clock, Phone } from 'lucide-react';

interface OptimizedLocationListProps {
  viewType?: 'minimal' | 'standard' | 'full';
  enableSearch?: boolean;
  pageSize?: number;
}

export const OptimizedLocationList: React.FC<OptimizedLocationListProps> = ({
  viewType = 'standard',
  enableSearch = true,
  pageSize = 20
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<any>({});
  
  // Optimized hooks with smart caching
  const { data: referenceData } = useReferenceData();
  const prefetchLocation = usePrefetchLocation();
  const updateLocation = useUpdateLocation();
  
  // Main locations query with optimized field selection
  const { 
    data: locationsData, 
    isLoading, 
    error,
    isFetching 
  } = useOptimizedLocations({
    fields: viewType, // Only fetch needed fields
    filters,
    pagination: { page: currentPage, pageSize },
    enabled: !searchTerm // Disable when searching
  });
  
  // Debounced search with separate caching
  const { 
    data: searchResults,
    isLoading: isSearching 
  } = useLocationSearch(searchTerm, {
    fields: 'minimal', // Minimal fields for search results
    limit: 10
  });
  
  // Determine which data to display
  const displayData = useMemo(() => {
    if (searchTerm) {
      return {
        data: searchResults || [],
        pagination: null
      };
    }
    return locationsData || { data: [], pagination: null };
  }, [searchTerm, searchResults, locationsData]);
  
  // Handle location hover for prefetching
  const handleLocationHover = (locationId: string) => {
    if (viewType === 'minimal') {
      // Prefetch full data when user hovers over minimal card
      prefetchLocation(locationId, 'full');
    }
  };
  
  // Handle location rating update with optimistic UI
  const handleRatingUpdate = async (locationId: string, newRating: number) => {
    try {
      await updateLocation.mutateAsync({
        id: locationId,
        updates: { rating: newRating }
      });
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };
  
  // Render loading state
  if (isLoading && !searchTerm) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: pageSize }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-600">Failed to load locations: {error.message}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {enableSearch && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            {isSearching && (
              <p className="text-sm text-muted-foreground mt-1">Searching...</p>
            )}
          </div>
          
          {/* State Filter */}
          {referenceData && (
            <select
              value={filters.state || ''}
              onChange={(e) => setFilters({ ...filters, state: e.target.value || undefined })}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All States</option>
              {/* This would be populated from geography data */}
            </select>
          )}
        </div>
      )}
      
      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {searchTerm ? (
            `Found ${displayData.data.length} results for "${searchTerm}"`
          ) : (
            `Showing ${displayData.data.length} locations`
          )}
          {displayData.pagination && (
            ` (Page ${displayData.pagination.page} of ${displayData.pagination.totalPages})`
          )}
        </p>
        
        {isFetching && !isLoading && (
          <Badge variant="secondary">Updating...</Badge>
        )}
      </div>
      
      {/* Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayData.data.map((location: any) => (
          <Card 
            key={location.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onMouseEnter={() => handleLocationHover(location.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start justify-between">
                <span className="text-lg font-semibold">{location.name}</span>
                {location.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{location.rating}</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p>{location.address}</p>
                  <p className="text-muted-foreground">
                    {location.city}, {location.state} {location.zip_code}
                  </p>
                </div>
              </div>
              
              {/* Location Type */}
              <Badge variant="outline">
                {location.location_type?.replace('_', ' ')}
              </Badge>
              
              {/* Contact Info (if available) */}
              {viewType !== 'minimal' && location.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{location.phone}</span>
                </div>
              )}
              
              {/* Operating Hours (if available) */}
              {viewType === 'full' && location.operatingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Hours available
                  </span>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                {viewType === 'admin' && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleRatingUpdate(location.id, 4.5)}
                    disabled={updateLocation.isPending}
                  >
                    {updateLocation.isPending ? 'Updating...' : 'Edit'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Pagination */}
      {!searchTerm && displayData.pagination && displayData.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-4">
            Page {currentPage} of {displayData.pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === displayData.pagination.totalPages || isFetching}
          >
            Next
          </Button>
        </div>
      )}
      
      {/* No Results */}
      {displayData.data.length === 0 && !isLoading && !isSearching && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No locations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? `No results for "${searchTerm}". Try a different search term.`
                : 'No locations match your current filters.'
              }
            </p>
            {(searchTerm || Object.keys(filters).length > 0) && (
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({});
                }}
              >
                Clear Search & Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizedLocationList;
