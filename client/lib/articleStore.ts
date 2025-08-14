/**
 * Article Store - Data management for RSS articles with editable content
 * 
 * PURPOSE: Manage RSS articles that can be individually edited and enhanced
 * with custom content and AI-generated summaries
 */

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
  author?: string;
  tags: string[];
  // Editable content fields
  customContent?: string;
  aiSummary?: string;
  featured: boolean;
  featured_order?: number;
  seo_title?: string;
  seo_description?: string;
  slug: string;
  // Admin metadata
  lastEditedBy?: string;
  lastEditedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIContentSettings {
  enabled: boolean;
  autoGenerateSummary: boolean;
  summaryLength: 'short' | 'medium' | 'long';
  includeKeywords: string[];
  tone: 'professional' | 'casual' | 'technical' | 'friendly';
  focus: 'summary' | 'analysis' | 'commentary' | 'insights';
}

const ARTICLES_STORAGE_KEY = 'managedArticles';
const AI_SETTINGS_STORAGE_KEY = 'aiContentSettings';

// Default AI settings
const DEFAULT_AI_SETTINGS: AIContentSettings = {
  enabled: true,
  autoGenerateSummary: true,
  summaryLength: 'medium',
  includeKeywords: ['waste management', 'recycling', 'sustainability'],
  tone: 'professional',
  focus: 'summary'
};

/**
 * Get all managed articles from storage
 */
export function getManagedArticles(): NewsArticle[] {
  try {
    const stored = localStorage.getItem(ARTICLES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading articles:', error);
    localStorage.removeItem(ARTICLES_STORAGE_KEY);
    return [];
  }
}

/**
 * Save articles to storage
 */
export function saveManagedArticles(articles: NewsArticle[]): void {
  try {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Error saving articles:', error);
  }
}

/**
 * Get article by ID
 */
export function getArticleById(id: string): NewsArticle | null {
  const articles = getManagedArticles();
  return articles.find(article => article.id === id) || null;
}

/**
 * Get article by slug
 */
export function getArticleBySlug(slug: string): NewsArticle | null {
  const articles = getManagedArticles();
  return articles.find(article => article.slug === slug) || null;
}

/**
 * Create or update an article
 */
export function saveArticle(article: NewsArticle): void {
  const articles = getManagedArticles();
  const existingIndex = articles.findIndex(a => a.id === article.id);
  
  const updatedArticle = {
    ...article,
    updatedAt: new Date().toISOString(),
    slug: article.slug || createSlugFromTitle(article.title)
  };

  if (existingIndex >= 0) {
    articles[existingIndex] = updatedArticle;
  } else {
    articles.unshift(updatedArticle);
  }

  saveManagedArticles(articles);
}

/**
 * Delete an article
 */
export function deleteArticle(id: string): void {
  const articles = getManagedArticles();
  const filtered = articles.filter(article => article.id !== id);
  saveManagedArticles(filtered);
}

/**
 * Get featured articles for homepage carousel
 */
export function getFeaturedArticles(): NewsArticle[] {
  const articles = getManagedArticles();
  return articles
    .filter(article => article.featured)
    .sort((a, b) => {
      // Sort by featured_order, then by publishedAt
      if (a.featured_order !== b.featured_order) {
        return (a.featured_order || 999) - (b.featured_order || 999);
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 6); // Limit to 6 featured articles
}

/**
 * Convert RSS article to managed article
 */
export function convertRSSToManagedArticle(rssArticle: any): NewsArticle {
  const now = new Date().toISOString();
  return {
    id: `rss-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: rssArticle.title,
    description: rssArticle.description,
    content: rssArticle.content || rssArticle.description,
    url: rssArticle.url,
    source: rssArticle.source,
    category: rssArticle.category,
    publishedAt: rssArticle.publishedAt,
    imageUrl: rssArticle.imageUrl,
    author: rssArticle.author,
    tags: rssArticle.tags || [],
    featured: false,
    slug: createSlugFromTitle(rssArticle.title),
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Create URL-friendly slug from title
 */
function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60); // Limit length for URLs
}

/**
 * Get AI content settings
 */
export function getAIContentSettings(): AIContentSettings {
  try {
    const stored = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    return stored ? { ...DEFAULT_AI_SETTINGS, ...JSON.parse(stored) } : DEFAULT_AI_SETTINGS;
  } catch (error) {
    console.error('Error loading AI settings:', error);
    localStorage.removeItem(AI_SETTINGS_STORAGE_KEY);
    return DEFAULT_AI_SETTINGS;
  }
}

/**
 * Save AI content settings
 */
export function saveAIContentSettings(settings: AIContentSettings): void {
  try {
    localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving AI settings:', error);
  }
}

/**
 * Generate AI summary based on article content and settings
 */
export function generateAISummary(article: NewsArticle, settings: AIContentSettings): string {
  if (!settings.enabled) return '';

  // This is a mock implementation - in a real app, this would call an AI service
  const summaryTemplates = {
    short: `${article.title.substring(0, 100)}... This ${settings.focus} provides key insights about ${settings.includeKeywords[0] || 'the topic'}.`,
    medium: `${article.description.substring(0, 200)}... Our ${settings.tone} analysis covers important aspects of ${settings.includeKeywords.join(', ')} with detailed examination of the implications.`,
    long: `${article.description} This comprehensive ${settings.focus} examines the broader implications for ${settings.includeKeywords.join(', ')} industry, providing ${settings.tone} insights that help understand the current landscape and future trends.`
  };

  return summaryTemplates[settings.summaryLength] || summaryTemplates.medium;
}

/**
 * Import RSS articles and convert to managed articles
 */
export function importRSSArticles(rssArticles: any[]): number {
  const existingArticles = getManagedArticles();
  const existingUrls = new Set(existingArticles.map(a => a.url));
  
  const newArticles = rssArticles
    .filter(rss => !existingUrls.has(rss.url)) // Avoid duplicates
    .map(convertRSSToManagedArticle);

  if (newArticles.length > 0) {
    const allArticles = [...newArticles, ...existingArticles];
    saveManagedArticles(allArticles);
  }

  return newArticles.length;
}

/**
 * Search articles by query
 */
export function searchArticles(query: string, category?: string): NewsArticle[] {
  const articles = getManagedArticles();
  const searchTerm = query.toLowerCase();
  
  return articles.filter(article => {
    const matchesQuery = !query || 
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      article.customContent?.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    
    const matchesCategory = !category || category === 'all' || article.category === category;
    
    return matchesQuery && matchesCategory;
  });
}
