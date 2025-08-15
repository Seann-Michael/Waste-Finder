/**
 * Blog Service - MOVED TO SUPABASE
 *
 * All blog posts and categories have been moved to Supabase database.
 * This file is kept for reference but all mock data has been removed.
 * Use Supabase client to manage blog content instead.
 */

import type {
  BlogPost,
  BlogCategory,
  BlogSearchParams,
  BlogSearchResponse,
} from "./blog.types";

// REMOVED: All sample blog posts moved to Supabase database
// Use Supabase queries instead of hardcoded data
const sampleBlogPosts: Omit<BlogPost, "id" | "created_at" | "updated_at">[] =
  [];

// REMOVED: All sample categories moved to Supabase database
const sampleCategories: Omit<
  BlogCategory,
  "id" | "created_at" | "updated_at"
>[] = [];

/**
 * Initialize blog data - DEPRECATED
 * All blog management should be done through Supabase
 */
export function initializeBlogData(): void {
  console.warn(
    "initializeBlogData is deprecated - use Supabase for blog management",
  );
}

/**
 * Get published blog posts - DEPRECATED
 * Use Supabase client to fetch posts instead
 */
export async function getBlogPosts(
  params: BlogSearchParams = {},
): Promise<BlogSearchResponse> {
  console.warn(
    "getBlogPosts is deprecated - use Supabase client to fetch blog posts",
  );
  return {
    posts: [],
    categories: [],
    total: 0,
    page: params.page || 1,
    limit: params.limit || 10,
    pages: 0,
    totalPages: 0,
  };
}

/**
 * Get a single blog post by slug - DEPRECATED
 * Use Supabase client to fetch post instead
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  console.warn(
    "getBlogPost is deprecated - use Supabase client to fetch blog post",
  );
  return null;
}

/**
 * Get all blog categories - DEPRECATED
 * Use Supabase client to fetch categories instead
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  console.warn(
    "getBlogCategories is deprecated - use Supabase client to fetch categories",
  );
  return [];
}

/**
 * Get featured blog posts - DEPRECATED
 * Use Supabase client to fetch featured posts instead
 */
export async function getFeaturedPosts(limit: number = 5): Promise<BlogPost[]> {
  console.warn(
    "getFeaturedPosts is deprecated - use Supabase client to fetch featured posts",
  );
  return [];
}

/**
 * Get recent blog posts - DEPRECATED
 * Use Supabase client to fetch recent posts instead
 */
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  console.warn(
    "getRecentPosts is deprecated - use Supabase client to fetch recent posts",
  );
  return [];
}

/**
 * Get related blog posts - DEPRECATED
 * Use Supabase client to fetch related posts instead
 */
export async function getRelatedPosts(
  currentPostId: string,
  limit: number = 3,
): Promise<BlogPost[]> {
  console.warn(
    "getRelatedPosts is deprecated - use Supabase client to fetch related posts",
  );
  return [];
}
