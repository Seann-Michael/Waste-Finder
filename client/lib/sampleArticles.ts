/**
 * Sample Articles - REMOVED - Data moved to Supabase
 * 
 * PURPOSE: All articles are now stored in Supabase database
 * This file is kept for reference but all mock data removed
 */

import { type NewsArticle } from './articleStore';

// REMOVED: All sample articles moved to Supabase database
// Use Supabase queries to fetch articles instead of hardcoded data
export const sampleArticles: NewsArticle[] = [];

/**
 * Initialize sample articles - DEPRECATED
 * Articles should be managed through Supabase instead of localStorage
 */
export function initializeSampleArticles(): void {
  // DEPRECATED: No longer initializing sample articles
  // All article management should be done through Supabase
  console.warn('initializeSampleArticles is deprecated - use Supabase for article management');
}
