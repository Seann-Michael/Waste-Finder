# WasteFinder API Documentation

## API Overview

The WasteFinder API provides endpoints for facility search, user suggestions, reviews, and admin management. The API is designed with RESTful principles and includes comprehensive error handling, caching, and performance monitoring.

## Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:8080/api
```

## Authentication

### Public Endpoints (No Authentication Required)

- Facility search and details
- Review submission
- Facility suggestions
- Blog content access

### Protected Endpoints (Admin Authentication Required)

- Facility management (CRUD operations)
- Review moderation
- Suggestion approval
- Blog management
- System administration

### Authentication Method

```http
Authorization: Bearer <jwt_token>
Cookie: auth_token=<httponly_jwt>
X-CSRF-Token: <csrf_token>
```

## Endpoints

### Facility Search

#### GET /api/locations/search

Search for waste disposal locations by location and filters.

**Parameters:**

```typescript
{
  zipCode: string;        // 5-digit US ZIP code
  radius?: number;        // Search radius in miles (default: 50, max: 100)
  facilityTypes?: string[]; // ['landfill', 'transfer_station', 'construction_landfill']
  wasteTypes?: string[];   // ['general', 'construction', 'hazardous', etc.]
  page?: number;          // Pagination (default: 1)
  limit?: number;         // Results per page (default: 20, max: 100)
}
```

**Response:**

```typescript
{
  success: true,
  data: {
    locations: Location[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    },
    searchCenter: {
      latitude: number,
      longitude: number,
      address: string
    }
  }
}
```

#### GET /api/locations/:id

Get detailed information for a specific facility.

**Response:**

```typescript
{
  success: true,
  data: {
    location: Location,
    reviews: Review[],
    averageRating: number,
    totalReviews: number
  }
}
```

### Reviews

#### POST /api/reviews

Submit a review for a facility (public endpoint with reCAPTCHA protection).

**Request Body:**

```typescript
{
  locationId: string,
  rating: number,        // 1-5 stars
  comment: string,
  reviewerName?: string,
  reviewerEmail: string,
  recaptchaToken: string // Google reCAPTCHA token
}
```

#### GET /api/admin/reviews

Get reviews for moderation (admin only).

**Parameters:**

```typescript
{
  status?: 'pending' | 'approved' | 'rejected',
  page?: number,
  limit?: number
}
```

#### PUT /api/admin/reviews/:id

Moderate a review (admin only).

**Request Body:**

```typescript
{
  status: 'approved' | 'rejected',
  moderationNote?: string
}
```

### Suggestions

#### POST /api/suggestions

Submit a new facility suggestion (public endpoint with reCAPTCHA protection).

**Request Body:**

```typescript
{
  facilityName: string,
  address: string,
  facilityType: string,
  contactInfo?: ContactInfo,
  operatingHours?: OperatingHours[],
  wasteTypes?: string[],
  additionalInfo?: string,
  submitterName?: string,
  submitterEmail: string,
  recaptchaToken: string
}
```

#### GET /api/admin/suggestions

Get facility suggestions for review (admin only).

#### PUT /api/admin/suggestions/:id

Approve or reject a facility suggestion (admin only).

**Request Body:**

```typescript
{
  status: 'approved' | 'rejected',
  rejectionReason?: string,
  facilityData?: Partial<Location> // For approved suggestions
}
```

### Facility Management (Admin Only)

#### POST /api/admin/locations

Create a new facility.

#### PUT /api/admin/locations/:id

Update facility information.

#### DELETE /api/admin/locations/:id

Delete a facility (soft delete - marks as inactive).

#### POST /api/admin/locations/bulk-upload

Bulk upload locations via CSV.

**Request:** Multipart form data with CSV file

**CSV Format:**

```csv
name,address,city,state,zipCode,facilityType,contactPhone,contactEmail,wasteTypes
"City Landfill","123 Main St","Springfield","IL","62701","landfill","555-0123","info@citylandfill.com","general,construction"
```

### Blog Management (Admin Only)

#### GET /api/blog/posts

Get blog posts (public endpoint).

#### POST /api/admin/blog/posts

Create a new blog post.

#### PUT /api/admin/blog/posts/:id

Update a blog post.

#### DELETE /api/admin/blog/posts/:id

Delete a blog post.

### Authentication

#### POST /api/auth/login

Admin login with username and password.

**Request Body:**

```typescript
{
  username: string,
  password: string
}
```

**Response:**

```typescript
{
  success: true,
  data: {
    user: {
      id: string,
      username: string,
      role: 'admin',
      permissions: string[]
    }
  }
}
```

#### POST /api/auth/logout

Logout and invalidate session.

#### GET /api/auth/me

Get current user information (if authenticated).

### System Administration (Admin Only)

#### GET /api/admin/analytics

Get system analytics and usage statistics.

#### GET /api/admin/settings

Get system configuration.

#### PUT /api/admin/settings

Update system configuration.

## Data Models

### Location

```typescript
interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  facilityType: "landfill" | "transfer_station" | "construction_landfill";
  acceptedWasteTypes: string[];
  restrictions: string[];
  operatingHours: OperatingHours[];
  contactInfo: ContactInfo;
  pricing: PricingInfo;
  isActive: boolean;
  verificationStatus: "verified" | "pending" | "unverified";
  createdAt: string;
  updatedAt: string;
}
```

### Review

```typescript
interface Review {
  id: string;
  locationId: string;
  rating: number; // 1-5
  comment: string;
  reviewerName?: string;
  reviewerEmail: string;
  isApproved: boolean;
  isFlagged: boolean;
  moderationNote?: string;
  createdAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
}
```

### Suggestion

```typescript
interface Suggestion {
  id: string;
  facilityName: string;
  address: string;
  facilityType: string;
  contactInfo?: ContactInfo;
  operatingHours?: OperatingHours[];
  wasteTypes: string[];
  additionalInfo?: string;
  submitterName?: string;
  submitterEmail: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
```

### Supporting Types

```typescript
interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

interface OperatingHours {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  openTime: string; // "08:00"
  closeTime: string; // "17:00"
  isClosed: boolean;
}

interface PricingInfo {
  priceType: "per_ton" | "per_load" | "flat_rate" | "variable";
  amount?: number;
  currency: "USD";
  notes?: string;
}
```

## Error Handling

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any,
    timestamp: string
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `RECAPTCHA_FAILED`: reCAPTCHA validation failed
- `INTERNAL_ERROR`: Server error

## Rate Limiting

- Public endpoints: 100 requests per minute per IP
- Admin endpoints: 1000 requests per minute per user
- reCAPTCHA protected endpoints: 10 requests per minute per IP

## Caching

- Location search results: 5 minutes
- Individual facility details: 10 minutes
- Blog posts: 1 hour
- Static data (waste types, etc.): 24 hours

## Google API Integration

### Required API Keys

```env
GOOGLE_MAPS_API_KEY=your_maps_api_key
GOOGLE_PLACES_API_KEY=your_places_api_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
```

### API Usage

- Google Geocoding: ZIP code to coordinates conversion
- Google Places: Address validation and autocomplete
- reCAPTCHA: Spam protection for public forms

## Performance & Monitoring

### Response Times

- Location search: < 500ms (95th percentile)
- Facility details: < 200ms (95th percentile)
- Review/suggestion submission: < 1s (95th percentile)

### Monitoring Integration

- Sentry: Error tracking and performance monitoring
- Custom metrics: API response times, success rates
- Database monitoring: Query performance and connection health

This API documentation provides a comprehensive guide for frontend developers and potential API consumers to understand and integrate with the WasteFinder system.
