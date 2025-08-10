import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  Calendar,
  User,
  Tag,
  ChevronRight,
  BookOpen,
  AlertCircle,
  Calculator,
  Scale,
  ExternalLink,
  Globe,
  Clock,
} from "lucide-react";
import { BlogPostSkeleton, ContentSkeleton } from "../components/LoadingStates";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { getManagedArticles } from "@/lib/articleStore";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  status: "draft" | "published" | "scheduled";
  featured: boolean;
  tags: string[];
  categories: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

interface NewsArticle {
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
}

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  // Load data from localStorage (in production, this would use React Query)
  const { posts, categories, isLoading, error } = useBlogData();

  // Load news articles
  useEffect(() => {
    const loadNews = async () => {
      try {
        const managedArticles = getManagedArticles();
        setNewsArticles(managedArticles.slice(0, 6)); // Show top 6 news articles
      } catch (error) {
        console.error("Error loading news articles:", error);
      }
    };
    loadNews();
  }, []);

  // Memoized filtered posts to prevent unnecessary recalculations
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter((post) => post.status === "published");

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) =>
        post.categories.includes(selectedCategory),
      );
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Waste Management Blog</h1>
              <ContentSkeleton className="h-4 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <BlogPostSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Error Loading Blog</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Waste Management Blog & News</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stay informed with the latest insights, tips, and industry news
                for waste management professionals and consumers.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Blog Posts Section */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-primary" />
                    Latest Blog Posts
                  </h2>

                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery || selectedCategory !== "all"
                          ? "Try adjusting your search criteria."
                          : "Check back later for new content."}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Featured Post */}
                      {filteredPosts.some((post) => post.featured) && (
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold mb-4">Featured Article</h3>
                          <FeaturedBlogCard
                            post={filteredPosts.find((post) => post.featured)!}
                          />
                        </div>
                      )}

                      {/* Blog Posts Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPosts
                          .filter(
                            (post) =>
                              !post.featured ||
                              filteredPosts.filter((p) => p.featured).length > 1,
                          )
                          .slice(0, 6)
                          .map((post) => (
                            <BlogPostCard key={post.id} post={post} />
                          ))}
                      </div>
                    </>
                  )}
                </div>

                {/* News Articles Section */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <Globe className="w-8 h-8 text-primary" />
                    Industry News
                  </h2>

                  {newsArticles.length === 0 ? (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No news articles available</h3>
                      <p className="text-muted-foreground">Check back later for the latest industry news.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {newsArticles.map((article) => (
                        <NewsArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  )}

                  <div className="text-center mt-6">
                    <Button asChild variant="outline">
                      <Link to="/news">
                        View All News
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Resources Section */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <Calculator className="w-8 h-8 text-primary" />
                    Helpful Resources
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Calculator className="w-6 h-6 text-blue-600" />
                          Pricing Calculator
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          Calculate estimated costs for waste disposal services based on your specific needs.
                        </p>
                        <Button asChild className="w-full">
                          <Link to="/pricing-calculator">
                            Use Calculator
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Scale className="w-6 h-6 text-green-600" />
                          Debris Weight Calculator
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          Estimate the weight of your debris to determine disposal costs and requirements.
                        </p>
                        <Button asChild className="w-full">
                          <Link to="/debris-weight-calculator">
                            Calculate Weight
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <SimpleSidebar
                  categories={categories}
                  posts={posts}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

/**
 * News Article Card Component
 */
const NewsArticleCard = React.memo<{ article: NewsArticle }>(({ article }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {article.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={article.imageUrl}
            alt={article.title || "News article image"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {article.source}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {article.category}
          </Badge>
        </div>
        <CardTitle className="overflow-hidden">
          <Link
            to={`/news/article/${article.id}`}
            className="hover:text-primary transition-colors block"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.title || "Untitled"}
          </Link>
        </CardTitle>
        <p
          className="text-muted-foreground text-sm overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.description || "No description available"}
        </p>
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span>{article.source}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link to={`/news/article/${article.id}`}>
              Read More
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

NewsArticleCard.displayName = "NewsArticleCard";

/**
 * Memoized blog post card component
 */
const BlogPostCard = React.memo<{ post: BlogPost }>(({ post }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {post.featuredImage && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={post.featuredImage}
            alt={post.title || "Blog post image"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="flex-grow">
        <div className="flex items-center gap-2 mb-2">
          {post.categories &&
            post.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          {post.featured && (
            <Badge variant="default" className="text-xs">
              Featured
            </Badge>
          )}
        </div>
        <CardTitle className="overflow-hidden">
          <Link
            to={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors block"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.title || "Untitled"}
          </Link>
        </CardTitle>
        <p
          className="text-muted-foreground text-sm overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.excerpt || "No excerpt available"}
        </p>
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author || "Unknown author"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center text-primary hover:underline"
        >
          Read more
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </CardContent>
    </Card>
  );
});

BlogPostCard.displayName = "BlogPostCard";

/**
 * Featured blog post card (larger format)
 */
const FeaturedBlogCard = React.memo<{ post: BlogPost }>(({ post }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="md:flex">
        {post.featuredImage && (
          <div className="md:w-1/2">
            <img
              src={post.featuredImage}
              alt={post.title || "Featured blog post"}
              className="w-full h-64 md:h-full object-cover"
              loading="eager"
            />
          </div>
        )}
        <div
          className={`${post.featuredImage ? "md:w-1/2" : "w-full"} p-6 flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default" className="text-xs">
                Featured
              </Badge>
              {post.categories &&
                post.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
            </div>
            <h3 className="text-2xl font-bold mb-4 leading-tight">
              <Link
                to={`/blog/${post.slug}`}
                className="hover:text-primary transition-colors"
              >
                {post.title || "Untitled"}
              </Link>
            </h3>
            <p className="text-muted-foreground mb-6 line-clamp-3">
              {post.excerpt || "No excerpt available"}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author || "Unknown author"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
            </div>
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center text-primary hover:underline font-medium"
            >
              Read full article
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
});

FeaturedBlogCard.displayName = "FeaturedBlogCard";

/**
 * Simple sidebar component with categories
 */
const SimpleSidebar = React.memo<{
  categories: BlogCategory[];
  posts: BlogPost[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}>(({ categories, posts, selectedCategory, onCategoryChange }) => {
  const publishedPosts = posts.filter((post) => post.status === "published");
  const recentPosts = publishedPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button
            onClick={() => onCategoryChange("all")}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            All Categories ({publishedPosts.length})
          </button>
          {categories.map((category) => {
            const count = publishedPosts.filter((post) =>
              post.categories.includes(category.name),
            ).length;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.name)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <Link
                  to={`/blog/${post.slug}`}
                  className="font-medium hover:text-primary transition-colors block mb-1 line-clamp-2"
                >
                  {post.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
});

SimpleSidebar.displayName = "SimpleSidebar";

/**
 * Custom hook to fetch blog data
 */
function useBlogData() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load from localStorage (in production, this would use an API)
        const savedPosts = localStorage.getItem("blogPosts");
        const savedCategories = localStorage.getItem("blogCategories");

        const postsData = savedPosts ? JSON.parse(savedPosts) : [];
        const categoriesData = savedCategories ? JSON.parse(savedCategories) : [];

        setPosts(Array.isArray(postsData) ? postsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        console.error("Error loading blog data:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { posts, categories, isLoading, error };
}

export default Blog;
