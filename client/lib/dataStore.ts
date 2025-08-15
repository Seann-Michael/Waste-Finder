import { queryKeys } from "@/hooks/useApi";
import { Location } from "@shared/api";

/**
 * Centralized data store that abstracts localStorage and provides a consistent API
 * This will be replaced with a proper backend in production
 */

export interface StoredData {
  locations: Location[];
  pendingSuggestions: any[];
  blogPosts: any[];
  blogCategories: any[];
  adminSettings: any;
  contentSettings: any;
  marketingSettings: any;
  seoSettings: any;
  codeSettings: any;
  systemSettings: any;
  blogSettings: any;
  apiSettings: any;
  adConfigs: any;
}

class DataStore {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> =
    new Map();
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  /**
   * Get data with caching and change notifications
   */
  async get<T>(
    key: keyof StoredData,
    ttl: number = 5 * 60 * 1000,
  ): Promise<T[]> {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Fetch from localStorage
    try {
      const stored = localStorage.getItem(key);
      const data = stored ? JSON.parse(stored) : [];

      // Update cache
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
      });

      return data;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      localStorage.removeItem(key);
      return [] as T[];
    }
  }

  /**
   * Set data with change notifications
   */
  async set<T>(key: keyof StoredData, data: T[]): Promise<void> {
    try {
      // Update localStorage
      localStorage.setItem(key, JSON.stringify(data));

      // Update cache
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: 5 * 60 * 1000, // 5 minutes default
      });

      // Notify subscribers
      this.notifySubscribers(key, data);
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      throw new Error(`Failed to save ${key}`);
    }
  }

  /**
   * Add item to array
   */
  async add<T>(key: keyof StoredData, item: T): Promise<void> {
    const data = await this.get<T>(key);
    data.push(item);
    await this.set(key, data);
  }

  /**
   * Update item in array by ID
   */
  async update<T extends { id: string }>(
    key: keyof StoredData,
    id: string,
    updates: Partial<T>,
  ): Promise<void> {
    const data = await this.get<T>(key);
    const index = data.findIndex((item) => item.id === id);

    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      await this.set(key, data);
    } else {
      throw new Error(`Item with id ${id} not found in ${key}`);
    }
  }

  /**
   * Remove item from array by ID
   */
  async remove(key: keyof StoredData, id: string): Promise<void> {
    const data = await this.get(key);
    const filtered = data.filter((item: any) => item.id !== id);
    await this.set(key, filtered);
  }

  /**
   * Find item by ID
   */
  async findById<T extends { id: string }>(
    key: keyof StoredData,
    id: string,
  ): Promise<T | null> {
    const data = await this.get<T>(key);
    return data.find((item) => item.id === id) || null;
  }

  /**
   * Subscribe to data changes
   */
  subscribe(key: keyof StoredData, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }

    this.subscribers.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }

  /**
   * Clear cache for key
   */
  clearCache(key?: keyof StoredData): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const stats = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp,
      size: JSON.stringify(value.data).length,
    }));

    return {
      totalEntries: this.cache.size,
      totalSize: stats.reduce((sum, stat) => sum + stat.size, 0),
      entries: stats,
    };
  }

  /**
   * Initialize default data
   */
  async initializeDefaults(): Promise<void> {
    const defaults = {
      locations: [],
      pendingSuggestions: [],
      blogPosts: this.getDefaultBlogPosts(),
      blogCategories: this.getDefaultBlogCategories(),
      adminSettings: this.getDefaultAdminSettings(),
      contentSettings: {
        homeMarketingButtonText: "Marketing for Dumpster Rentals",
        homeMarketingButtonUrl: "https://yourmarketingagency.com",
      },
      marketingSettings: {},
      seoSettings: {},
      codeSettings: {},
      systemSettings: {},
      blogSettings: {},
      apiSettings: {
        googleMapsApiKey: "",
      },
      adConfigs: {},
    };

    // Only set defaults if they don't exist
    for (const [key, defaultValue] of Object.entries(defaults)) {
      const existing = await this.get(key as keyof StoredData);
      if (existing.length === 0) {
        await this.set(key as keyof StoredData, defaultValue);
      }
    }
  }

  /**
   * Notify subscribers of data changes
   */
  private notifySubscribers(key: keyof StoredData, data: any): void {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in subscriber callback for ${key}:`, error);
        }
      });
    }
  }

  /**
   * Default blog posts
   */
  // REMOVED: Default blog posts moved to Supabase database
  private getDefaultBlogPosts() {
    return [
      // All default blog posts removed - fetch from Supabase instead
      {
        id: "2",
        title: "How to Choose the Right Disposal Facility",
        slug: "choose-right-disposal-facility",
        excerpt:
          "A comprehensive guide to selecting the best waste disposal facility for your needs.",
        content: "Content here...",
        author: "Waste Management Pro",
        status: "published",
        featured: false,
        tags: ["disposal", "facilities", "guide"],
        categories: ["Guides"],
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  }

  /**
   * Default blog categories
   */
  private getDefaultBlogCategories() {
    return [
      {
        id: "1",
        name: "Tips",
        slug: "tips",
        description: "Helpful tips for waste management",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Guides",
        slug: "guides",
        description: "Comprehensive guides and how-tos",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "News",
        slug: "news",
        description: "Latest news in waste management",
        createdAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Default admin settings
   */
  private getDefaultAdminSettings() {
    return {
      firstName: "Sean",
      lastName: "Webb",
      email: "sean@wastefinder.com",
      profileImage: "",
    };
  }
}

// Create singleton instance
export const dataStore = new DataStore();

// Initialize defaults on import
dataStore.initializeDefaults();

// Convenience methods for common operations
export const locations = {
  getAll: () => dataStore.get<Location>("locations"),
  getById: (id: string) => dataStore.findById<Location>("locations", id),
  create: (location: Location) => dataStore.add("locations", location),
  update: (id: string, updates: Partial<Location>) =>
    dataStore.update("locations", id, updates),
  delete: (id: string) => dataStore.remove("locations", id),
  subscribe: (callback: (locations: Location[]) => void) =>
    dataStore.subscribe("locations", callback),
};

export const suggestions = {
  getAll: () => dataStore.get("pendingSuggestions"),
  create: (suggestion: any) => dataStore.add("pendingSuggestions", suggestion),
  update: (id: string, updates: any) =>
    dataStore.update("pendingSuggestions", id, updates),
  delete: (id: string) => dataStore.remove("pendingSuggestions", id),
  subscribe: (callback: (suggestions: any[]) => void) =>
    dataStore.subscribe("pendingSuggestions", callback),
};

export const blog = {
  getPosts: () => dataStore.get("blogPosts"),
  getCategories: () => dataStore.get("blogCategories"),
  createPost: (post: any) => dataStore.add("blogPosts", post),
  updatePost: (id: string, updates: any) =>
    dataStore.update("blogPosts", id, updates),
  deletePost: (id: string) => dataStore.remove("blogPosts", id),
  subscribeToPosts: (callback: (posts: any[]) => void) =>
    dataStore.subscribe("blogPosts", callback),
};

export default dataStore;
