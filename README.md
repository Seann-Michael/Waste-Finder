# WasteFinder - Waste Disposal Facility Locator

## System Overview

WasteFinder is a comprehensive web application that serves as a searchable public database for waste disposal facilities. Business owners and individuals can find local waste management locations, leave reviews, and suggest new facilities or improvements.

## 🎯 Core Features

### For Public Users (No Login Required)
- **🔍 Facility Search**: Find waste disposal facilities within 50 miles of any ZIP code
- **🗺️ Interactive Maps**: Google Maps integration with facility locations and directions
- **⭐ Reviews & Ratings**: Leave reviews and ratings for facilities
- **📝 Suggest Facilities**: Recommend new locations or corrections to existing ones
- **📚 Educational Blog**: Read waste management tips and industry news

### For Administrators (Login Required)
- **👥 User Management**: Admin and Super Admin role-based access control
- **📋 Content Moderation**: Approve/reject user reviews and facility suggestions
- **🏢 Facility Management**: Full CRUD operations on facility database
- **📊 Bulk Operations**: CSV upload for multiple facility additions
- **✍️ Blog Management**: Create and manage educational content
- **💰 Revenue Management**: Google AdSense integration and reporting

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query + React Context
- **Authentication**: JWT with HTTP-only cookies
- **Maps**: Google Maps API + Google Places API
- **Monitoring**: Sentry + Web Vitals tracking
- **Security**: reCAPTCHA v3 + CSRF protection

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Maps API key
- Google Places API key
- Google reCAPTCHA site key
- Sentry DSN (optional, for monitoring)

### Environment Setup
1. Clone the repository
2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file:
```env
# Required - Google APIs
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key_here
VITE_GOOGLE_PLACES_API_KEY=your_places_api_key_here
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# Optional - Monitoring & Analytics
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_ADSENSE_CLIENT_ID=your_adsense_client_id_here

# Optional - Session Recording
VITE_SESSION_RECORDING_PROVIDER=hotjar
VITE_SESSION_RECORDING_SITE_ID=your_site_id_here
```

### Installation & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Setup
The application will need a backend database. See `API_DOCUMENTATION.md` for database schema and setup instructions.

## 📁 Project Structure

```
client/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── admin/           # Admin-specific components
│   ├── SearchForm.tsx   # Main facility search interface
│   ├── GoogleMapsEmbed.tsx # Google Maps integration
│   ├── AdSense.tsx      # Revenue generation ads
│   └── ...
├── pages/               # Page components (routes)
│   ├── admin/           # Admin panel pages
│   ├── Index.tsx        # Homepage with search
│   ├── AllLocations.tsx # Search results with maps
│   ├── LocationDetail.tsx # Individual facility pages
│   ├── SuggestLocation.tsx # New facility suggestions
│   ├── Blog.tsx         # Blog listing page
│   └── ...
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries & API client
├── contexts/            # React Context providers
└── global.css           # Global styles
```

## 🗺️ Google API Setup

### 1. Google Cloud Console Setup
1. Create a new project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### 2. API Key Configuration
1. Create API keys with appropriate restrictions
2. Add your domain to the API key restrictions
3. Set up billing (required for Google Maps APIs)

### 3. reCAPTCHA Setup
1. Visit [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Register your site for reCAPTCHA v3
3. Add your domain to the list of allowed domains

## 🔧 Configuration

### Admin User Setup
Super Admin users can:
- Add, edit, delete facilities
- Bulk upload facilities via CSV
- Manage blog posts and content
- Configure system settings
- View analytics and reports

### AdSense Integration
1. Apply for Google AdSense approval
2. Configure ad placements in the admin panel
3. Monitor revenue through the admin dashboard

### Performance Monitoring
- Sentry integration for error tracking
- Web Vitals monitoring for performance
- Optional session recording with Hotjar/FullStory

## 📋 Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Comprehensive error boundaries
- Performance optimization with React.memo and useCallback
- Lazy loading for route-based code splitting

### Adding New Features
1. **API First**: Define API contracts before UI implementation
2. **Type Safety**: Create TypeScript interfaces for all data
3. **Error Handling**: Implement proper error states and user feedback
4. **Performance**: Consider lazy loading and code splitting
5. **Monitoring**: Add tracking for new user interactions

### Testing
```bash
# Run unit tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🛡️ Security Features

- **Authentication**: JWT tokens in HTTP-only cookies
- **CSRF Protection**: Custom CSRF tokens for admin actions
- **Input Validation**: Comprehensive validation on all forms
- **Rate Limiting**: Request throttling to prevent abuse
- **reCAPTCHA**: Spam protection on all public forms
- **Content Moderation**: Manual approval for user-generated content

## 📊 Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals tracking (LCP, FID, CLS)
- API response time monitoring
- Component render performance
- Bundle size optimization

### Error Tracking
- Sentry integration for real-time error reporting
- User context for admin user identification
- Custom event tracking for business metrics

### Business Intelligence
- Search query analytics
- Facility usage statistics
- Review and suggestion trends
- Revenue reporting from ads

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
```env
VITE_ENVIRONMENT=production
VITE_API_URL=https://your-api-domain.com/api
VITE_GOOGLE_MAPS_API_KEY=production_maps_key
VITE_SENTRY_DSN=production_sentry_dsn
```

### Hosting Recommendations
- **Frontend**: Netlify, Vercel, or AWS CloudFront
- **Backend**: Node.js on AWS EC2, Google Cloud Run, or similar
- **Database**: PostgreSQL on AWS RDS or Google Cloud SQL
- **CDN**: CloudFlare for static asset delivery

## 📚 Documentation

- [`TECHNICAL_DOCUMENTATION.md`](./TECHNICAL_DOCUMENTATION.md) - Comprehensive system architecture
- [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md) - Developer onboarding and code organization
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) - Complete API reference

## 🤝 Contributing

1. Review the developer guide and technical documentation
2. Follow the established code standards and patterns
3. Add comprehensive comments for new features
4. Include error handling and user feedback
5. Test thoroughly across different devices and browsers

## 📄 License

This project is proprietary software. See LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Review the documentation files
- Check the inline code comments
- Contact the development team

---

**WasteFinder** - Making waste disposal location discovery simple and efficient for businesses and communities.
