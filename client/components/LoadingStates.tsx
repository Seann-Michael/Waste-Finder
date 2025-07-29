import React from 'react';
import { Loader2, MapPin, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';

/**
 * Simple skeleton component if it doesn't exist
 */
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}

/**
 * Generic loading spinner
 */
export function LoadingSpinner({ 
  size = 'default',
  className = '',
}: { 
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
    />
  );
}

/**
 * Full page loading
 */
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" className="text-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

/**
 * Button loading state
 */
export function ButtonLoading({ 
  children, 
  isLoading = false,
  loadingText = 'Loading...',
  ...props 
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  [key: string]: any;
}) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Location card skeleton
 */
export function LocationCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Location list skeleton
 */
export function LocationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LocationCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Blog post card skeleton
 */
export function BlogPostSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className="h-48 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

/**
 * Data table skeleton
 */
export function DataTableSkeleton({ 
  rows = 5, 
  columns = 4 
}: { 
  rows?: number; 
  columns?: number; 
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 p-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={`h-4 flex-1 ${colIndex === 0 ? 'w-2/5' : ''}`} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Form skeleton
 */
export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

/**
 * Search results skeleton
 */
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Skeleton className="h-5 w-48" />
      </div>
      
      <Skeleton className="h-4 w-32" />
      
      <LocationListSkeleton count={4} />
      
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8" />
        ))}
      </div>
    </div>
  );
}

/**
 * Map loading placeholder
 */
export function MapSkeleton() {
  return (
    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <MapPin className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
    </div>
  );
}

/**
 * Admin dashboard skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Generic content skeleton
 */
export function ContentSkeleton({ 
  lines = 3,
  className = '' 
}: { 
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

/**
 * Inline loading indicator
 */
export function InlineLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <LoadingSpinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

/**
 * Section loading placeholder
 */
export function SectionLoading({ 
  title = 'Loading...', 
  description,
  className = '' 
}: { 
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <LoadingSpinner size="lg" className="text-primary mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
