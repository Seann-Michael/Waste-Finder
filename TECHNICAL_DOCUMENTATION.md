# WasteFinder Technical Documentation

## System Overview

WasteFinder is a comprehensive web application that serves as a searchable public database for waste disposal locations. The system enables business owners and individuals to find local waste management locations, leave reviews, and suggest new locations or improvements.

## Core Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript, Vite build system
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, React Context for authentication
- **Maps Integration**: Google Maps API, Google Places API, Address Autocomplete
- **Authentication**: JWT-based admin authentication with HTTP-only cookies
- **Monitoring**: Sentry for error tracking, Web Vitals for performance monitoring
- **Ads**: Google AdSense integration for revenue generation
- **Forms**: React Hook Form with Google reCAPTCHA protection

### System Purpose & User Types

#### Public Users (No Login Required)

- **Primary Function**: Search for waste disposal locations by ZIP code
- **Secondary Functions**:
  - View location details with Google Maps integration
  - Leave reviews and ratings for locations
  - Suggest new locations or corrections to existing ones
  - Read educational blog content
- **Search Radius**: 50-mile radius from entered ZIP code
- **Protected Actions**: All form submissions use Google reCAPTCHA

#### Admin Users (Login Required)

- **Access Level**: Full system control (single admin role)
- **Functions**:
  - Complete CRUD operations on facilities
  - Bulk upload facilities via CSV/Excel
  - Approve/deny user suggestions
  - Moderate user reviews
  - Blog management (create, edit, delete posts)
  - System configuration and settings
  - Marketing and AdSense management
  - User management and permissions

## Key Features & Implementation

### 1. Location Search System

**File**: `client/components/SearchForm.tsx`

```typescript
// ZIP code validation and radius search
// Integrates with Google Places API for address validation
// Returns facilities within 50-mile radius
```

### 2. Google Maps Integration

**Files**:

- `client/components/GoogleMapsEmbed.tsx` - Map display component
- `client/components/LocationDetail.tsx` - Individual facility maps

**Implementation**:

- Interactive maps with custom pins for each facility type
- Address autocomplete for user input
- Directions integration
- Street view integration for facility verification

### 3. Review System

**Files**:

- `client/pages/LocationDetail.tsx` - Review display and submission
- `client/pages/admin/ReviewsTable.tsx` - Admin review moderation

**Features**:

- Star rating system (1-5 stars)
- Text reviews with moderation
- Review flagging and reporting
- Admin approval workflow

### 4. Suggestion System

**Files**:

- `client/pages/SuggestLocation.tsx` - Public suggestion form
- `client/pages/admin/SuggestionsTable.tsx` - Admin approval interface

**Workflow**:

1. Public users submit facility suggestions
2. Google reCAPTCHA validation
3. Admin review and approval
4. Automatic addition to database upon approval

### 5. Blog System

**Files**:

- `client/pages/Blog.tsx` - Public blog listing
- `client/pages/BlogPost.tsx` - Individual blog posts
- `client/pages/admin/BlogAdmin.tsx` - Blog management interface

**Features**:

- Rich text editor for content creation
- SEO optimization with meta tags
- Category and tag system
- Featured posts and related content

### 6. AdSense Integration

**File**: `client/components/AdSense.tsx`

**Ad Placements**:

- Homepage banner (728x90 or responsive)
- Sidebar ads on search results (300x250)
- In-content ads on blog posts
- Footer banner ads

**Configuration**:

- Admin-configurable ad units
- A/B testing support
- Revenue tracking and reporting

## Database Schema

### Core Entities

#### Locations

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
  operatingHours: OperatingHours[];
  contactInfo: ContactInfo;
  acceptedWasteTypes: string[];
  restrictions: string[];
  pricing: PricingInfo;
  isActive: boolean;
  verificationStatus: "verified" | "pending" | "unverified";
  createdAt: Date;
  updatedAt: Date;
}
```

#### Reviews

```typescript
interface Review {
  id: string;
  locationId: string;
  rating: number; // 1-5 stars
  comment: string;
  reviewerName?: string;
  reviewerEmail: string;
  isApproved: boolean;
  isFlagged: boolean;
  createdAt: Date;
  moderatedAt?: Date;
  moderatedBy?: string;
}
```

#### Suggestions

```typescript
interface Suggestion {
  id: string;
  suggestedName: string;
  suggestedAddress: string;
  facilityType: string;
  submitterEmail: string;
  submitterName?: string;
  additionalInfo: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}
```

#### Blog Posts

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  authorId: string;
  categories: string[];
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Integration Points

### Google APIs

1. **Google Maps JavaScript API**

   - Purpose: Interactive maps display
   - Usage: Facility location visualization, directions

2. **Google Places API**

   - Purpose: Address validation and autocomplete
   - Usage: Search form, suggestion form validation

3. **Google Geocoding API**

   - Purpose: Convert addresses to coordinates
   - Usage: Bulk facility uploads, location verification

4. **Google AdSense API**
   - Purpose: Ad serving and revenue tracking
   - Usage: Dynamic ad placement and reporting

### External Services

1. **reCAPTCHA v3**

   - Purpose: Bot protection and spam prevention
   - Usage: All public form submissions

2. **Sentry**
   - Purpose: Error tracking and performance monitoring
   - Usage: Real-time error reporting and user experience tracking

## File Structure & Component Organization

```
client/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── admin/           # Admin-specific components
│   ├── AdSense.tsx      # Google AdSense integration
│   ├── SearchForm.tsx   # Main search functionality
│   ├── GoogleMapsEmbed.tsx # Maps integration
│   └── ...
├── pages/               # Page components (routes)
│   ├── admin/           # Admin panel pages
│   ├── Index.tsx        # Homepage with search
│   ├── AllLocations.tsx # Location listing page
│   ├── LocationDetail.tsx # Individual facility pages
│   ├── Blog.tsx         # Blog listing
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useApi.ts        # API interaction hooks
│   ├── usePerformanceMonitoring.ts # Performance tracking
│   └── ...
├── lib/                 # Utility libraries
│   ├── api.ts           # API client with retry logic
│   ├── monitoring.ts    # Sentry and analytics setup
│   ├── security.ts      # Security utilities
│   └── ...
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication state management
└── global.css           # Global styles and Tailwind imports
```

## Security Implementation

### Authentication & Authorization

- **JWT Tokens**: Stored in HTTP-only cookies for security
- **CSRF Protection**: Custom CSRF tokens for all admin actions
- **Rate Limiting**: Client and server-side request throttling
- **Input Validation**: Comprehensive validation on all forms
- **SQL Injection Prevention**: Parameterized queries and ORM usage

### Data Protection

- **reCAPTCHA**: Protects all public form submissions
- **Email Validation**: Required for reviews and suggestions
- **Content Moderation**: Manual approval for user-generated content
- **Data Sanitization**: XSS prevention on all user inputs

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**: Route-based lazy loading
2. **Bundle Optimization**: Manual chunk splitting for optimal loading
3. **Image Optimization**: Progressive enhancement (AVIF → WebP → JPEG)
4. **Caching Strategy**: React Query for API response caching
5. **Performance Monitoring**: Web Vitals tracking and Sentry integration

### Loading Strategy

- **Critical Path**: Homepage search form loads first
- **Progressive Enhancement**: Maps and advanced features load after core content
- **Lazy Loading**: Images and non-critical components load on demand

## Deployment & Environment Configuration

### Environment Variables

```bash
# Required for production
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
VITE_GOOGLE_PLACES_API_KEY=your_places_api_key
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ADSENSE_CLIENT_ID=your_adsense_client_id

# Optional monitoring
VITE_SESSION_RECORDING_PROVIDER=hotjar|fullstory|logrocket
VITE_SESSION_RECORDING_SITE_ID=your_session_recording_id
```

### Build Configuration

- **Vite**: Modern build tool with hot module replacement
- **TypeScript**: Full type safety across the application
- **ESLint**: Code quality and consistency
- **Prettier**: Automated code formatting

## Monitoring & Analytics

### Error Tracking (Sentry)

- **Client-side Errors**: JavaScript exceptions and React errors
- **Performance Monitoring**: Component render times and API response times
- **User Context**: Admin user identification for targeted debugging
- **Custom Events**: Business logic tracking (searches, suggestions, reviews)

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS tracking
- **Custom Metrics**: Search response times, map loading performance
- **User Session Recording**: Optional integration with Hotjar/FullStory
- **API Performance**: Request/response time tracking

## Maintenance & Updates

### Content Management

1. **Blog Posts**: Super admin can create/edit via rich text editor
2. **Facility Data**: Bulk upload via CSV with validation
3. **User Reviews**: Moderation queue for approval/rejection
4. **System Settings**: Configurable via admin panel

### Data Integrity

1. **Facility Verification**: Regular validation of addresses and contact info
2. **Review Moderation**: Human review of user-submitted content
3. **Suggestion Processing**: Structured workflow for new facility additions
4. **Backup Strategy**: Automated database backups and recovery procedures

## Development Guidelines

### Code Standards

- **TypeScript**: Strict mode enabled, comprehensive typing
- **Component Structure**: Functional components with hooks
- **State Management**: React Query for server state, Context for client state
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Testing**: Unit tests for utilities, integration tests for workflows

### Adding New Features

1. **API First**: Define API contracts before UI implementation
2. **Type Safety**: Create TypeScript interfaces for all data structures
3. **Error Handling**: Implement proper error states and user feedback
4. **Performance**: Consider lazy loading and code splitting for new routes
5. **Monitoring**: Add relevant tracking for new user interactions

This documentation serves as a comprehensive guide for developers working on the WasteFinder system, ensuring consistent implementation and maintainable code architecture.
