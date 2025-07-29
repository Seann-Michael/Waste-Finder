/**
 * RSS Parser Utilities
 *
 * PURPOSE: Parse and process RSS feeds for news aggregation
 *
 * FEATURES:
 * - RSS/Atom feed parsing
 * - Content sanitization and extraction
 * - Image URL extraction from content
 * - Category and tag normalization
 * - Error handling for malformed feeds
 */

export interface ParsedArticle {
  title: string;
  description: string;
  content?: string;
  url: string;
  publishedAt: string;
  author?: string;
  imageUrl?: string;
  tags: string[];
  category?: string;
}

export interface RSSFeedData {
  title: string;
  description: string;
  url: string;
  articles: ParsedArticle[];
  lastUpdated: string;
  totalArticles: number;
}

/**
 * Parse RSS feed from URL
 */
export async function parseRSSFeed(feedUrl: string): Promise<RSSFeedData> {
  try {
    // In a real implementation, this would fetch and parse the RSS feed
    // For now, we'll return mock data to demonstrate the structure
    
    const response = await fetch(`/api/rss/parse?url=${encodeURIComponent(feedUrl)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    
    const feedData = await response.json();
    return processFeedData(feedData);
    
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw new Error(`Failed to parse RSS feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process raw feed data into standardized format
 */
function processFeedData(rawData: any): RSSFeedData {
  const articles: ParsedArticle[] = (rawData.items || rawData.entries || [])
    .slice(0, 50) // Limit to 50 most recent articles
    .map((item: any) => ({
      title: cleanText(item.title || item.title?._ || ''),
      description: cleanText(item.description || item.summary || item.content || ''),
      content: item.content || item['content:encoded'] || item.description,
      url: item.link || item.url || item.guid || '',
      publishedAt: parseDate(item.pubDate || item.published || item.datePublished || item.isoDate),
      author: item.author || item.creator || item['dc:creator'],
      imageUrl: extractImageUrl(item),
      tags: extractTags(item),
      category: item.category || undefined
    }))
    .filter((article: ParsedArticle) => article.title && article.url);

  return {
    title: rawData.title || 'RSS Feed',
    description: rawData.description || '',
    url: rawData.link || rawData.url || '',
    articles,
    lastUpdated: new Date().toISOString(),
    totalArticles: articles.length
  };
}

/**
 * Clean and sanitize text content
 */
function cleanText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 500); // Limit length
}

/**
 * Parse various date formats into ISO string
 */
function parseDate(dateString: string): string {
  if (!dateString) return new Date().toISOString();
  
  try {
    const date = new Date(dateString);
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Extract image URL from RSS item
 */
function extractImageUrl(item: any): string | undefined {
  // Try various common image fields
  const imageFields = [
    'image',
    'media:content',
    'media:thumbnail',
    'enclosure',
    'itunes:image',
    'content:encoded'
  ];
  
  for (const field of imageFields) {
    const value = item[field];
    if (value) {
      if (typeof value === 'string') {
        const imageUrl = extractUrlFromString(value);
        if (imageUrl) return imageUrl;
      } else if (value.url) {
        return value.url;
      } else if (value.href) {
        return value.href;
      } else if (Array.isArray(value) && value[0]?.url) {
        return value[0].url;
      }
    }
  }
  
  // Try to extract image from content
  if (item.content || item.description) {
    const content = item.content || item.description;
    const imageUrl = extractUrlFromString(content);
    if (imageUrl) return imageUrl;
  }
  
  return undefined;
}

/**
 * Extract image URL from HTML content
 */
function extractUrlFromString(content: string): string | undefined {
  if (!content) return undefined;
  
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = content.match(imgRegex);
  
  if (match && match[1]) {
    const url = match[1];
    // Validate it's a proper image URL
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.includes('images.unsplash.com')) {
      return url;
    }
  }
  
  return undefined;
}

/**
 * Extract tags from RSS item
 */
function extractTags(item: any): string[] {
  const tags: string[] = [];
  
  // Try various tag fields
  if (item.category) {
    if (Array.isArray(item.category)) {
      tags.push(...item.category.map((cat: any) => typeof cat === 'string' ? cat : cat._ || cat.term || ''));
    } else {
      tags.push(typeof item.category === 'string' ? item.category : item.category._ || item.category.term || '');
    }
  }
  
  if (item.keywords) {
    const keywords = typeof item.keywords === 'string' ? item.keywords.split(',') : item.keywords;
    tags.push(...keywords);
  }
  
  if (item['media:keywords']) {
    tags.push(...item['media:keywords'].split(','));
  }
  
  return tags
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0)
    .slice(0, 10); // Limit to 10 tags
}

/**
 * Validate RSS feed URL
 */
export function validateRSSUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Test RSS feed connectivity and validity
 */
export async function testRSSFeed(feedUrl: string): Promise<{ valid: boolean; error?: string; articleCount?: number }> {
  try {
    if (!validateRSSUrl(feedUrl)) {
      return { valid: false, error: 'Invalid URL format' };
    }
    
    const feedData = await parseRSSFeed(feedUrl);
    
    return {
      valid: true,
      articleCount: feedData.totalArticles
    };
    
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Categorize article based on content
 */
export function categorizeArticle(article: ParsedArticle): string {
  const content = `${article.title} ${article.description}`.toLowerCase();
  
  const categories = {
    technology: ['ai', 'artificial intelligence', 'technology', 'tech', 'automation', 'digital', 'software'],
    policy: ['policy', 'regulation', 'law', 'government', 'epa', 'federal', 'legislation'],
    business: ['business', 'company', 'market', 'economic', 'financial', 'industry', 'commercial'],
    climate: ['climate', 'carbon', 'greenhouse gas', 'emission', 'global warming', 'climate change'],
    recycling: ['recycling', 'recycle', 'reuse', 'circular economy', 'sustainability'],
    energy: ['energy', 'renewable', 'solar', 'wind', 'power', 'electricity']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category;
    }
  }
  
  return 'general';
}
