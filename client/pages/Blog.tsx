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
} from "lucide-react";
import { BlogPostSkeleton, ContentSkeleton } from "../components/LoadingStates";
import { ErrorBoundary } from "../components/ErrorBoundary";

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

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Load data from localStorage (in production, this would use React Query)
  const { posts, categories, isLoading, error } = useBlogData();

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
              <ContentSkeleton lines={2} className="max-w-2xl mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
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
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Failed to Load Blog Posts
              </h2>
              <p className="text-muted-foreground mb-4">
                We're having trouble loading the blog posts. Please try again
                later.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
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
              <h1 className="text-4xl font-bold mb-4">Waste Management Blog</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Stay informed with the latest news, tips, and insights in waste
                management and environmental sustainability.
              </p>
            </div>

            {/* Main Content Layout with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search blog posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="md:w-48">
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

                {/* Results */}
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No posts found
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery || selectedCategory !== "all"
                        ? "Try adjusting your search criteria."
                        : "Check back later for new content."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-muted-foreground">
                        Showing {filteredPosts.length} of {posts.length} posts
                      </p>
                    </div>

                    {/* Featured Post */}
                    {filteredPosts.some((post) => post.featured) && (
                      <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">
                          Featured Article
                        </h2>
                        <FeaturedBlogCard
                          post={filteredPosts.find((post) => post.featured)!}
                        />
                      </div>
                    )}

                    {/* Blog Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                      {filteredPosts
                        .filter(
                          (post) =>
                            !post.featured ||
                            filteredPosts.filter((p) => p.featured).length > 1,
                        )
                        .map((post) => (
                          <BlogPostCard key={post.id} post={post} />
                        ))}
                    </div>
                  </>
                )}
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

            <h2 className="text-2xl font-bold mb-3 leading-tight">
              <Link
                to={`/blog/${post.slug}`}
                className="hover:text-primary transition-colors"
              >
                {post.title || "Untitled"}
              </Link>
            </h2>

            <p className="text-muted-foreground mb-4">
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
 * Blog sidebar with categories, recent posts, and tags
 */
const BlogSidebar = React.memo<{
  categories: BlogCategory[];
  posts: BlogPost[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}>(({ categories = [], posts = [], selectedCategory, onCategoryChange }) => {
  const recentPosts = posts
    .filter((post) => post && post.status === "published")
    .sort((a, b) => {
      const dateA = new Date(b.createdAt || 0).getTime();
      const dateB = new Date(a.createdAt || 0).getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  const allTags = [
    ...new Set(posts.flatMap((post) => (post && post.tags ? post.tags : []))),
  ].slice(0, 15);

  return (
    <div className="space-y-8">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => onCategoryChange("all")}
          >
            All Posts
          </Button>
          {categories && categories.length > 0 ? (
            categories.map((category) => {
              if (!category || !category.id) return null;

              const postCount = posts.filter(
                (post) =>
                  post &&
                  post.categories?.includes(category.slug) &&
                  post.status === "published",
              ).length;

              return (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.slug ? "default" : "ghost"
                  }
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => onCategoryChange(category.slug)}
                >
                  <span>{category.name || "Unnamed Category"}</span>
                  <Badge variant="secondary" className="text-xs">
                    {postCount}
                  </Badge>
                </Button>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No categories available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentPosts && recentPosts.length > 0 ? (
            recentPosts.map((post) => {
              if (!post || !post.id) return null;

              return (
                <div
                  key={post.id}
                  className="border-b border-border pb-3 last:border-b-0 last:pb-0"
                >
                  <Link
                    to={`/blog/${post.slug || "#"}`}
                    className="block hover:text-primary transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-1 leading-tight">
                      {post.title || "Untitled Post"}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : "No date"}
                    </p>
                  </Link>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No recent posts available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allTags && allTags.length > 0 ? (
              allTags.map((tag) => {
                if (!tag) return null;

                return (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {tag}
                  </Badge>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No tags available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stay Updated</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Get the latest waste management tips and industry news delivered to
            your inbox.
          </p>
          <div className="space-y-2">
            <Input
              placeholder="Your email address"
              type="email"
              className="text-sm"
            />
            <Button size="sm" className="w-full">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            No spam, unsubscribe anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
});

BlogSidebar.displayName = "BlogSidebar";

/**
 * Simple sidebar component (safe version)
 */
const SimpleSidebar = React.memo<{
  categories: BlogCategory[];
  posts: BlogPost[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}>(({ categories = [], posts = [], selectedCategory, onCategoryChange }) => {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start"
            onClick={() => onCategoryChange("all")}
          >
            All Posts
          </Button>
          {Array.isArray(categories) &&
            categories.map((category) => (
              <Button
                key={category?.id || Math.random()}
                variant={
                  selectedCategory === category?.slug ? "default" : "ghost"
                }
                size="sm"
                className="w-full justify-start"
                onClick={() => onCategoryChange(category?.slug || "all")}
              >
                {category?.name || "Unknown"}
              </Button>
            ))}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.isArray(posts) &&
            posts.slice(0, 5).map((post) => (
              <div key={post?.id || Math.random()} className="text-sm">
                <Link
                  to={`/blog/${post?.slug || "#"}`}
                  className="hover:text-primary transition-colors"
                >
                  {post?.title || "Untitled"}
                </Link>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
});

SimpleSidebar.displayName = "SimpleSidebar";

/**
 * Custom hook for blog data (temporary localStorage implementation)
 * In production, this would be replaced with React Query
 */
function useBlogData() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Simulate loading delay
      setTimeout(() => {
        const savedPosts = localStorage.getItem("blogPosts");
        const savedCategories = localStorage.getItem("blogCategories");

        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts);
          setPosts(
            parsedPosts.filter((post: BlogPost) => post.status === "published"),
          );
        }

        if (savedCategories) {
          const parsedCategories = JSON.parse(savedCategories);
          setCategories(parsedCategories);
        }

        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to load blog data");
      setIsLoading(false);
    }
  }, []);

  return { posts, categories, isLoading, error };
}
