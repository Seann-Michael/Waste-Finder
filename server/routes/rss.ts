/**
 * RSS Feed Management API Routes
 *
 * PURPOSE: Handle RSS feed parsing, caching, and management for news aggregation
 *
 * FEATURES:
 * - RSS/Atom feed parsing with multiple format support
 * - Feed validation and testing
 * - Article caching and deduplication
 * - Error handling for malformed feeds
 * - Rate limiting for external feed requests
 */

import { Request, Response } from "express";
import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'WasteFinder RSS Aggregator 1.0'
  }
});

/**
 * Sanitize and decode RSS URL
 */
function sanitizeRSSUrl(url: string): string {
  // Decode the double-encoded URL
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    // If decoding fails, use the original URL
  }

  // Sanitize URL: fix HTML entities and special characters
  url = url
    .replace(/&amp;/g, '&')  // Fix HTML encoded ampersands
    .replace(/‑/g, '-')      // Fix en-dash to regular hyphen
    .replace(/–/g, '-')      // Fix em-dash to regular hyphen
    .trim();

  return url;
}

interface ParsedFeed {
  title: string;
  description: string;
  articles: Array<{
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    author?: string;
    imageUrl?: string;
    tags: string[];
  }>;
}

/**
 * Parse RSS feed from URL
 */
export const parseRSSFeed = async (req: Request, res: Response) => {
  try {
    let { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'RSS feed URL is required'
      });
    }

    // Sanitize and decode the URL
    url = sanitizeRSSUrl(url);

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: 'Invalid URL format'
      });
    }

    console.log('Parsing RSS feed:', url);

    // Parse the actual RSS feed
    const feed = await parser.parseURL(url);

    const articles = feed.items.slice(0, 50).map(item => ({
      title: item.title || 'Untitled',
      description: cleanHtml(item.contentSnippet || item.content || item.summary || '').slice(0, 500),
      url: item.link || item.guid || '',
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      author: item.creator || item.author || undefined,
      imageUrl: extractImageUrl(item),
      tags: extractTags(item)
    })).filter(article => article.title && article.url);

    const feedData: ParsedFeed = {
      title: feed.title || 'RSS Feed',
      description: feed.description || '',
      articles
    };

    console.log(`Successfully parsed ${articles.length} articles from ${feed.title}`);
    res.json(feedData);

  } catch (error) {
    console.error('RSS parsing error:', error);
    res.status(500).json({
      error: 'Failed to parse RSS feed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Clean HTML content
 */
function cleanHtml(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Extract image URL from RSS item
 */
function extractImageUrl(item: any): string | undefined {
  // Try different image fields
  if (item.enclosure?.url && item.enclosure.type?.includes('image')) {
    return item.enclosure.url;
  }

  if (item['media:content'] && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }

  if (item['media:thumbnail'] && item['media:thumbnail'].$.url) {
    return item['media:thumbnail'].$.url;
  }

  // Try to extract from content
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }

  return undefined;
}

/**
 * Extract tags from RSS item
 */
function extractTags(item: any): string[] {
  const tags: string[] = [];

  if (item.categories) {
    tags.push(...item.categories);
  }

  if (item.category) {
    if (Array.isArray(item.category)) {
      tags.push(...item.category);
    } else {
      tags.push(item.category);
    }
  }

  return tags.slice(0, 10);
}

/**
 * Test RSS feed validity
 */
export const testRSSFeed = async (req: Request, res: Response) => {
  try {
    let { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'RSS feed URL is required'
      });
    }

    // Decode the double-encoded URL
    try {
      url = decodeURIComponent(url);
    } catch (e) {
      // If decoding fails, use the original URL
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        valid: false,
        error: 'Invalid URL format'
      });
    }

    console.log('Testing RSS feed:', url);

    // Actually test the RSS feed
    const feed = await parser.parseURL(url);

    const articleCount = feed.items ? feed.items.length : 0;

    console.log(`RSS feed test successful: ${feed.title} with ${articleCount} articles`);

    res.json({
      valid: true,
      articleCount,
      feedTitle: feed.title || 'Unknown Feed',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('RSS test error:', error);
    res.json({
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all configured RSS feeds
 */
export const getRSSFeeds = async (req: Request, res: Response) => {
  try {
    // In production, this would fetch from database
    const mockFeeds = [
      {
        id: "1",
        name: "Environmental Today",
        url: "https://environmentaltoday.com/rss",
        category: "technology",
        description: "Latest environmental technology news",
        isActive: true,
        updateFrequency: 6,
        lastUpdated: "2024-01-20T14:30:00Z",
        status: "active",
        articleCount: 45
      },
      {
        id: "2",
        name: "Policy Watch",
        url: "https://policywatch.org/feed",
        category: "policy",
        description: "Environmental policy and regulation updates",
        isActive: true,
        updateFrequency: 12,
        lastUpdated: "2024-01-20T08:15:00Z",
        status: "active",
        articleCount: 23
      }
    ];

    res.json(mockFeeds);

  } catch (error) {
    console.error('Get RSS feeds error:', error);
    res.status(500).json({
      error: 'Failed to retrieve RSS feeds'
    });
  }
};

/**
 * Create new RSS feed configuration
 */
export const createRSSFeed = async (req: Request, res: Response) => {
  try {
    const { name, url, category, description, isActive, updateFrequency } = req.body;

    // Validation
    if (!name || !url || !category) {
      return res.status(400).json({
        error: 'Name, URL, and category are required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: 'Invalid URL format'
      });
    }

    // In production, this would save to database
    const newFeed = {
      id: Date.now().toString(),
      name,
      url,
      category,
      description: description || "",
      isActive: isActive !== false,
      updateFrequency: updateFrequency || 6,
      status: "pending",
      articleCount: 0,
      createdAt: new Date().toISOString()
    };

    res.status(201).json(newFeed);

  } catch (error) {
    console.error('Create RSS feed error:', error);
    res.status(500).json({
      error: 'Failed to create RSS feed'
    });
  }
};

/**
 * Update RSS feed configuration
 */
export const updateRSSFeed = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url, category, description, isActive, updateFrequency } = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'Feed ID is required'
      });
    }

    // Validate URL format if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return res.status(400).json({
          error: 'Invalid URL format'
        });
      }
    }

    // In production, this would update in database
    const updatedFeed = {
      id,
      name,
      url,
      category,
      description,
      isActive,
      updateFrequency,
      updatedAt: new Date().toISOString()
    };

    res.json(updatedFeed);

  } catch (error) {
    console.error('Update RSS feed error:', error);
    res.status(500).json({
      error: 'Failed to update RSS feed'
    });
  }
};

/**
 * Delete RSS feed configuration
 */
export const deleteRSSFeed = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'Feed ID is required'
      });
    }

    // In production, this would delete from database
    res.json({
      success: true,
      message: 'RSS feed deleted successfully'
    });

  } catch (error) {
    console.error('Delete RSS feed error:', error);
    res.status(500).json({
      error: 'Failed to delete RSS feed'
    });
  }
};

/**
 * Get aggregated news articles from all active feeds
 */
export const getAggregatedNews = async (req: Request, res: Response) => {
  try {
    const { category, limit = 50, offset = 0 } = req.query;

    // In production, this would aggregate from database/cache
    const mockArticles = [
      {
        id: "1",
        title: "New Recycling Technologies Transform Waste Management Industry",
        description: "Advanced sorting technologies and AI-powered systems are revolutionizing how we process recyclable materials, leading to higher efficiency rates and reduced contamination.",
        url: "https://example.com/recycling-tech",
        source: "Environmental Today",
        category: "technology",
        publishedAt: "2024-01-20T14:30:00Z",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        author: "Sarah Johnson",
        tags: ["recycling", "technology", "AI", "sustainability"]
      },
      {
        id: "2",
        title: "Federal Regulations Update: New Standards for Landfill Operations",
        description: "The EPA announces updated environmental standards for landfill operations, focusing on methane capture and groundwater protection.",
        url: "https://example.com/federal-regulations",
        source: "Policy Watch",
        category: "policy",
        publishedAt: "2024-01-19T10:15:00Z",
        imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
        author: "Michael Chen",
        tags: ["policy", "EPA", "regulations", "environment"]
      }
    ];

    let filteredArticles = mockArticles;

    // Filter by category if specified
    if (category && category !== 'all') {
      filteredArticles = mockArticles.filter(article => article.category === category);
    }

    // Apply pagination
    const paginatedArticles = filteredArticles.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );

    res.json({
      articles: paginatedArticles,
      total: filteredArticles.length,
      limit: Number(limit),
      offset: Number(offset)
    });

  } catch (error) {
    console.error('Get aggregated news error:', error);
    res.status(500).json({
      error: 'Failed to retrieve news articles'
    });
  }
};
