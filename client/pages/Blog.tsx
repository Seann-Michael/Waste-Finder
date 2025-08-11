import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, User, Clock, BookOpen, Tag, Eye, Heart, TrendingUp, Filter } from 'lucide-react';
import { getBlogPosts, getBlogCategories, getFeaturedPosts, initializeBlogData } from '@/lib/blogService';
import type { BlogPost, BlogCategory, BlogSearchParams } from '@/lib/blog.types';

const PostCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({ post, featured = false }) => {
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className={`h-full hover:shadow-lg transition-all duration-300 group ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
      {post.featured_image && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={post.featured_image}
            alt={post.title}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              featured ? 'h-64 lg:h-80' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge 
              style={{ backgroundColor: getCategoryColor(post.category) }}
              className="text-white"
            >
              {post.category}
            </Badge>
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
        <CardTitle className={`leading-tight hover:text-primary transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
          <Link to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className={featured ? 'p-6 pt-0' : 'p-4 pt-0'}>
        <p className={`text-muted-foreground mb-4 ${featured ? 'text-lg line-clamp-4' : 'line-clamp-3'}`}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{post.author_name}</span>
          </div>
          <div className="flex items-center gap-3">
            {post.like_count > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>{post.like_count}</span>
              </div>
            )}
            <Button asChild variant="outline" size="sm">
              <Link to={`/blog/${post.slug}`}>
                Read More
              </Link>
            </Button>
          </div>
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

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Sustainability': '#10B981',
    'Home Improvement': '#3B82F6',
    'Construction': '#F59E0B',
    'Industry': '#8B5CF6',
    'Guides': '#EF4444'
  };
  return colors[category] || '#6B7280';
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<BlogSearchParams>({
    page: 1,
    limit: 12,
    sortBy: 'published_at',
    sortOrder: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    initializeBlogData();
    loadData();
  }, [searchParams]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [blogResponse, categoriesData, featuredData] = await Promise.all([
        getBlogPosts(searchParams),
        getBlogCategories(),
        getFeaturedPosts()
      ]);

      setPosts(blogResponse.posts);
      setCategories(categoriesData);
      setFeaturedPosts(featuredData);
      setTotalPages(blogResponse.pages);
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
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSearchParams({
      page: 1,
      limit: 12,
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
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Waste Management Blog
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert insights, practical guides, and industry news about waste management, recycling, and sustainable practices for homeowners and professionals.
          </p>
        </div>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && searchParams.page === 1 && !searchParams.search && !searchParams.category && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <PostCard key={post.id} post={post} featured={index === 0} />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8">
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

        {/* Results Info */}
        <div className="mb-6 text-muted-foreground">
          <p>
            {isLoading ? 'Loading...' : `Showing ${posts.length} articles`}
            {searchParams.search && ` matching "${searchParams.search}"`}
            {searchParams.category && ` in "${categories.find(c => c.slug === searchParams.category)?.name}"`}
          </p>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(searchParams.page! - 1)}
                  disabled={searchParams.page === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={searchParams.page === i + 1 ? "default" : "outline"}
                    onClick={() => handlePageChange(i + 1)}
                    className="w-10"
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(searchParams.page! + 1)}
                  disabled={searchParams.page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? "Try adjusting your search criteria or browse all articles."
                : "No blog posts are available at the moment."}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <Button onClick={clearFilters}>
                View All Articles
              </Button>
            )}
          </div>
        )}

        {/* Categories Section */}
        {categories.length > 0 && !searchParams.search && (
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Category</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategory(category.slug);
                    handleSearch();
                  }}
                  className="flex items-center gap-2"
                  style={selectedCategory === category.slug ? { backgroundColor: category.color } : {}}
                >
                  <Tag className="w-4 h-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.post_count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
