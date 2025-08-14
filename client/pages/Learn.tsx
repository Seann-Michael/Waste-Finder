import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Calendar,
  User,
  Clock,
  BookOpen,
  Tag,
  Eye,
  TrendingUp,
  Filter,
  Download,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  GraduationCap
} from 'lucide-react';
import { getBlogPosts, getBlogCategories, getFeaturedPosts, initializeBlogData } from '@/lib/blogService';
import { getManagedArticles } from '@/lib/articleStore';
import type { BlogPost, BlogCategory, BlogSearchParams } from '@/lib/blog.types';

// Analytics tracking function
const trackPageView = (page: string, section?: string) => {
  // In a real implementation, this would send to analytics service
  console.log(`Analytics: Page view - ${page}${section ? ` - ${section}` : ''}`);

  // Example: Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_title: page,
      page_location: window.location.href
    });
  }
};

// Resources interface matching database schema
interface Resource {
  id: string;
  title: string;
  description: string;
  file_type: string;
  file_size: string;
  download_url: string;
  category: string;
  featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Function to fetch resources from database
const fetchResources = async (): Promise<Resource[]> => {
  try {
    const response = await fetch('/api/resources');
    if (response.ok) {
      const data = await response.json();
      return data.resources || [];
    }
  } catch (error) {
    console.error('Error fetching resources:', error);
  }

  // Fallback to sample data if API fails
  return [
    {
      id: '1',
      title: 'Dumpster Rental Contract Template',
      description: 'Professional contract template for dumpster rental agreements with legal protections.',
      file_type: 'PDF',
      file_size: '2.1 MB',
      download_url: '#',
      category: 'Contracts',
      featured: true,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Waste Management Cost Calculator',
      description: 'Excel spreadsheet to calculate and compare waste management costs across different vendors.',
      file_type: 'XLSX',
      file_size: '1.5 MB',
      download_url: '#',
      category: 'Tools',
      featured: false,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      title: 'Debris Classification Guide',
      description: 'Comprehensive guide to properly classify different types of construction and household debris.',
      file_type: 'PDF',
      file_size: '5.2 MB',
      download_url: '#',
      category: 'Guides',
      featured: true,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];
};

const NewsCarousel: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Load RSS news articles
    try {
      const articles = getManagedArticles().slice(0, 10); // Get latest 10 articles
      setNewsArticles(articles);
    } catch (error) {
      console.error('Error loading news articles:', error);
    }
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, newsArticles.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, newsArticles.length - 2)) % Math.max(1, newsArticles.length - 2));
  };

  if (newsArticles.length === 0) {
    return (
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" />
          Latest Industry News
        </h2>
        <div className="text-center py-8 text-muted-foreground">
          <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No news articles available at the moment.</p>
        </div>
      </div>
    );
  }

  const visibleArticles = newsArticles.slice(currentIndex, currentIndex + 3);

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" />
          Latest Industry News
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={prevSlide} disabled={newsArticles.length <= 3}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextSlide} disabled={newsArticles.length <= 3}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleArticles.map((article, index) => (
          <Card key={article.id || index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedAt || article.pubDate).toLocaleDateString()}</span>
                <Badge variant="outline" className="ml-auto">News</Badge>
              </div>
              <CardTitle className="text-lg leading-tight line-clamp-2">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {article.description || article.contentSnippet || 'No description available.'}
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={article.link} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleDownload = () => {
    trackPageView('Resource Download', resource.title);
    // In real implementation, this would track the download
    console.log(`Analytics: Resource downloaded - ${resource.title}`);
    // Open the download URL
    window.open(resource.download_url, '_blank');
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${resource.featured ? 'ring-2 ring-primary' : ''}`}>
      {resource.featured && (
        <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-t-lg">
          Featured Resource
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getFileIcon(resource.file_type)}
            <div>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{resource.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {resource.file_type} • {resource.file_size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{resource.description}</p>
        <Button className="w-full" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download Free
        </Button>
      </CardContent>
    </Card>
  );
};

const PostCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({ post, featured = false }) => {
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePostClick = () => {
    trackPageView('Blog Post View', post.title);
  };

  return (
    <Card className={`h-full hover:shadow-lg transition-all duration-300 group ${featured ? 'lg:col-span-2' : ''}`}>
      {post.featured_image && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={post.featured_image}
            alt={post.title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              featured ? 'h-48 lg:h-64' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-blue-600 text-white">{post.category}</Badge>
            {post.is_featured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </div>
      )}
      <CardHeader className={featured ? 'p-6' : 'p-4'}>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.read_time_minutes} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.view_count}</span>
          </div>
        </div>
        <CardTitle className={`leading-tight hover:text-primary transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
          <Link to={`/blog/${post.slug}`} onClick={handlePostClick}>
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className={featured ? 'p-6 pt-0' : 'p-4 pt-0'}>
        <p className={`text-muted-foreground mb-4 ${featured ? 'text-base line-clamp-3' : 'line-clamp-2'}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{post.author_name}</span>
          </div>
          <Button asChild variant="outline" size="sm" onClick={handlePostClick}>
            <Link to={`/blog/${post.slug}`}>
              Read More
            </Link>
          </Button>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Learn() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<BlogSearchParams>({
    page: 1,
    limit: 6,
    sortBy: 'published_at',
    sortOrder: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Track page view
    trackPageView('Learn Page');

    initializeBlogData();
    loadData();
  }, [searchParams]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [blogResponse, categoriesData, featuredData, resourcesData] = await Promise.all([
        getBlogPosts(searchParams),
        getBlogCategories(),
        getFeaturedPosts(),
        fetchResources()
      ]);

      setPosts(blogResponse.posts);
      setCategories(categoriesData);
      setFeaturedPosts(featuredData);
      setResources(resourcesData);
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchParams(prev => ({
      ...prev,
      search: searchQuery || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      page: 1
    }));
    trackPageView('Learn Search', searchQuery || selectedCategory);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSearchParams({
      page: 1,
      limit: 6,
      sortBy: 'published_at',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Learn & Resources
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert insights, practical guides, industry news, and free resources to help you make informed waste management decisions.
          </p>
        </div>

        {/* News Carousel */}
        <NewsCarousel />

        {/* Free Resources Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <Download className="w-6 h-6 text-primary" />
            Free Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && searchParams.page === 1 && !searchParams.search && !searchParams.category && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <PostCard key={post.id} post={post} featured={index === 0} />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Expert Articles & Guides
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <div className="md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="md:w-auto">
              Search
            </Button>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary">
                  Category: {categories.find(c => c.slug === selectedCategory)?.name}
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-80">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="p-4 space-y-4">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-3 rounded"></div>
                    <div className="bg-gray-200 h-3 rounded w-5/6"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? "Try adjusting your search criteria or browse all articles."
                : "No articles are available at the moment."}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <Button onClick={clearFilters}>
                View All Articles
              </Button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
