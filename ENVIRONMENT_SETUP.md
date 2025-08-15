# Environment Variables Setup

This document outlines the required environment variables for the application.

## Required Environment Variables

### For Local Development

Set these in your local development environment:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server-side Supabase (for API functions)
VITE_SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Google Maps API (optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### For Netlify Deployment

Add these environment variables in your Netlify site settings:

1. Go to Netlify Dashboard → Your Site → Site settings → Environment variables
2. Add the following variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key
- `VITE_SUPABASE_SERVICE_KEY`: Your Supabase service role key (for server functions)
- `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key (optional)

## Security Notes

- **NEVER** commit actual API keys to version control
- The `.env.local` file contains placeholder values only
- All real credentials should be set via environment variables
- Supabase anon keys are safe to expose client-side (they have RLS protection)
- Service role keys should ONLY be used server-side and never exposed to clients

## Getting API Keys

### Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to Settings → API
4. Copy the URL and anon key
5. Copy the service_role key (for server-side operations)

### Google Maps

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Maps Embed API
3. Create an API key
4. Restrict the key to your domain for security

## Troubleshooting

If you get errors about missing environment variables:

1. Verify all required variables are set in your deployment environment
2. For local development, ensure the dev server has access to the environment variables
3. Check that variable names match exactly (case-sensitive)
4. Restart your application after adding new environment variables
