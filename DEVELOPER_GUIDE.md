# WasteFinder Developer Guide

## Quick Start for New Developers

### Understanding the System

WasteFinder is a **public waste location database** with **admin-only authentication**. Public users search for locations without logging in, while admins manage content through a secure admin panel.

### Key Concepts to Understand

#### 1. User Types and Access Levels

```typescript
// PUBLIC USERS (No Authentication)
// - Search locations by ZIP code
// - View location details and maps
// - Leave reviews (with reCAPTCHA protection)
// - Suggest new locations or corrections

// ADMIN USERS (Authentication Required)
// - Full CRUD operations on locations
// - Bulk upload locations via CSV
// - Moderate user reviews and suggestions
// - Blog content management
// - System configuration and settings
// - Marketing and AdSense management
// - View analytics and reports
```

#### 2. Core Workflows

##### Facility Search Workflow

```
User enters ZIP → Google Places API validates →
Database search within 50 miles → Google Maps displays results
```

##### Review Submission Workflow

```
User writes review → reCAPTCHA validation →
Database storage → Admin moderation → Public display
```

##### Suggestion Approval Workflow

```
User suggests facility → reCAPTCHA validation →
Admin review → Approval/Rejection → Database update
```

### File Organization Guide

#### `/client/components/` - Reusable UI Components

```typescript
// UI Components (from shadcn/ui)
ui / button.tsx; // Base button component
ui / card.tsx; // Card container component
ui / input.tsx; // Form input component

// Application Components
SearchForm.tsx; // Main ZIP code search interface
GoogleMapsEmbed.tsx; // Google Maps integration
AdSense.tsx; // Google AdSense ad placements
Header.tsx; // Site navigation header
Footer.tsx; // Site footer with marketing links

// Admin Components
admin / AdminRoute.tsx; // Protected route wrapper for admin pages
admin / AdminSidebar.tsx; // Admin navigation sidebar
```

#### `/client/pages/` - Page Components (Routes)

```typescript
// Public Pages (No Authentication)
Index.tsx; // Homepage with search form
AllLocations.tsx; // Search results with Google Maps
LocationDetail.tsx; // Individual facility details
Blog.tsx; // Blog post listing
BlogPost.tsx; // Individual blog post display
SuggestLocation.tsx; // New facility suggestion form

// Admin Pages (Authentication Required)
AdminLogin.tsx; // Admin login form
admin / AdminSettings.tsx; // System configuration
admin / LocationDataTable.tsx; // Facility management
admin / ReviewsTable.tsx; // Review moderation
admin / SuggestionsTable.tsx; // Suggestion approval
admin / BlogAdmin.tsx; // Blog post management
admin / BulkUploadFacilities.tsx; // CSV location import
```

#### `/client/hooks/` - Custom React Hooks

```typescript
useApi.ts; // React Query hooks for API calls
usePerformanceMonitoring.ts; // Web Vitals and performance tracking
use - toast.ts; // Toast notification system
```

#### `/client/lib/` - Utility Libraries

```typescript
api.ts; // HTTP client with retry logic and monitoring
monitoring.ts; // Sentry error tracking and analytics
security.ts; // CSRF protection and input sanitization
utils.ts; // Common utility functions
```

#### `/client/contexts/` - React Context Providers

```typescript
AuthContext.tsx; // Admin authentication state management
```

### Google API Integration Points

#### 1. Google Maps JavaScript API

```typescript
// Used in: GoogleMapsEmbed.tsx, AllLocations.tsx
// Purpose: Interactive maps with facility pins
// Configuration: VITE_GOOGLE_MAPS_API_KEY

// Example usage:
const map = new google.maps.Map(mapRef.current, {
  center: { lat: facility.latitude, lng: facility.longitude },
  zoom: 15,
  mapTypeId: "roadmap",
});
```

#### 2. Google Places API

```typescript
// Used in: SearchForm.tsx, SuggestLocation.tsx
// Purpose: Address validation and autocomplete
// Configuration: VITE_GOOGLE_PLACES_API_KEY

// Example usage:
const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
  types: ["geocode"],
  componentRestrictions: { country: "us" },
});
```

#### 3. Google reCAPTCHA

```typescript
// Used in: All public forms (reviews, suggestions)
// Purpose: Spam protection and bot prevention
// Configuration: VITE_RECAPTCHA_SITE_KEY

// Example usage:
const token = await grecaptcha.execute(siteKey, { action: "submit_review" });
```

### Database Schema Understanding

#### Core Entity Relationships

```
Locations (1) → (Many) Reviews
Locations (1) → (Many) Suggestions (corrections)
Users (Admin) (1) → (Many) BlogPosts
Users (Admin) (1) → (Many) ModeratedContent
```

#### Location Data Structure

```typescript
interface Location {
  // Basic Information
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // Geographic Data
  latitude: number;
  longitude: number;

  // Facility Classification
  facilityType: "landfill" | "transfer_station" | "construction_landfill";
  acceptedWasteTypes: string[];
  restrictions: string[];

  // Operational Information
  operatingHours: OperatingHours[];
  contactInfo: ContactInfo;
  pricing: PricingInfo;

  // Administrative Fields
  isActive: boolean;
  verificationStatus: "verified" | "pending" | "unverified";
  createdAt: Date;
  updatedAt: Date;
}
```

### Security Implementation

#### Authentication & Authorization

```typescript
// JWT tokens stored in HTTP-only cookies (prevents XSS)
// CSRF protection for all admin actions
// Rate limiting to prevent brute force attacks

// Example: Protected admin route
<AdminRoute>
  <LocationDataTable />
</AdminRoute>
```

#### Input Validation & Sanitization

```typescript
// All user inputs sanitized before database storage
// reCAPTCHA validation on all public forms
// SQL injection prevention through parameterized queries

// Example: Form validation
const sanitizedInput = sanitizeInput(userInput);
const isValid = validateZipCode(zipCode);
```

### Performance Optimization

#### Code Splitting Strategy

```typescript
// Route-based lazy loading
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Component-based lazy loading for large features
const GoogleMapsEmbed = lazy(() => import("./components/GoogleMapsEmbed"));
```

#### Caching Strategy

```typescript
// React Query for API response caching
const { data: locations } = useQuery({
  queryKey: ["locations", zipCode],
  queryFn: () => api.getLocationsByZip(zipCode),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Development Workflow

#### 1. Adding New Public Features

```typescript
// 1. Create page component in /pages/
// 2. Add route to App.tsx
// 3. Implement API endpoints if needed
// 4. Add monitoring/tracking
// 5. Test without authentication

// Example: New public page
const NewPublicPage = () => {
  // No authentication required
  // Add reCAPTCHA if forms are involved
  // Include monitoring for user interactions
};
```

#### 2. Adding Admin Features

```typescript
// 1. Create component in /pages/admin/
// 2. Wrap with AdminRoute for authentication
// 3. Add to admin sidebar navigation
// 4. Implement role-based access control
// 5. Add audit logging

// Example: New admin feature
<AdminRoute>
  <NewAdminFeature />
</AdminRoute>
```

#### 3. Database Changes

```typescript
// 1. Update TypeScript interfaces
// 2. Create migration scripts
// 3. Update API endpoints
// 4. Update frontend components
// 5. Test data integrity

// Example: New field addition
interface Location {
  // ... existing fields
  newField: string; // Add this
}
```

### Testing Guidelines

#### Unit Testing

```typescript
// Test utility functions
// Test API client error handling
// Test form validation logic

describe("validateZipCode", () => {
  it("should accept valid 5-digit ZIP codes", () => {
    expect(validateZipCode("12345")).toBe(true);
  });
});
```

#### Integration Testing

```typescript
// Test complete user workflows
// Test admin approval processes
// Test Google API integrations

describe("Facility Search Workflow", () => {
  it("should return facilities within 50 miles", async () => {
    // Test complete search process
  });
});
```

### Common Development Tasks

#### Adding a New Facility Type

1. Update `facilityType` enum in type definitions
2. Add new facility type to admin forms
3. Update facility icons and map markers
4. Add to search filters
5. Update documentation

#### Implementing New Google API Feature

1. Add API key to environment variables
2. Load Google API scripts in index.html
3. Create TypeScript definitions if needed
4. Implement feature in relevant component
5. Add error handling and fallbacks

#### Adding New Admin Permissions

1. Update User interface permissions array
2. Modify hasPermission function in AuthContext
3. Add permission checks in relevant components
4. Update admin sidebar navigation based on permissions

### Troubleshooting Common Issues

#### Google Maps Not Loading

```typescript
// Check API key configuration
// Verify billing account is active
// Check browser console for API errors
// Ensure domains are whitelisted in Google Cloud Console
```

#### Authentication Issues

```typescript
// Check JWT token expiration
// Verify CSRF token generation
// Check HTTP-only cookie settings
// Review CORS configuration
```

#### Performance Issues

```typescript
// Check bundle size with `npm run build --report`
// Monitor React Query cache usage
// Review lazy loading implementation
// Check image optimization settings
```

This guide provides a foundation for understanding the WasteFinder codebase. For specific implementation details, refer to the comprehensive comments within each component file.
