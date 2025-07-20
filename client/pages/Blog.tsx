import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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
import { Search, Calendar, User, Tag, ChevronRight, BookOpen } from "lucide-react";

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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadBlogData();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, selectedCategory]);

  const loadBlogData = () => {
    // Load blog posts from localStorage
    const savedPosts = localStorage.getItem("blogPosts");
    const savedCategories = localStorage.getItem("blogCategories");

    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      // Only show published posts
      const publishedPosts = parsedPosts.filter((post: BlogPost) => post.status === "published");
      setPosts(publishedPosts);
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Default categories
      const defaultCategories: BlogCategory[] = [
        {
          id: "1",
          name: "Waste Management",
          slug: "waste-management",
          description: "Tips and guides for proper waste management",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "Environmental Impact",
          slug: "environmental-impact",
          description: "Articles about environmental effects and sustainability",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "3",
          name: "Industry News",
          slug: "industry-news",
          description: "Latest news and updates in the waste disposal industry",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "4",
          name: "How-to Guides",
          slug: "how-to-guides",
          description: "Step-by-step guides for waste disposal procedures",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ];
      setCategories(defaultCategories);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query)) ||
          post.author.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => 
        post.categories.includes(selectedCategory)
      );
    }

    setFilteredPosts(filtered);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const featuredPosts = filteredPosts.filter(post => post.featured).slice(0, 2);
  const regularPosts = filteredPosts.filter(post => !post.featured);
  const recentPosts = posts.slice(0, 5);
  const popularTags = [...new Set(posts.flatMap(post => post.tags))].slice(0, 10);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Learn</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover expert insights, tips, and guides for waste management and environmental sustainability
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Search and Filters */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search & Filter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Categories List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const postCount = posts.filter(post => 
                        post.categories.includes(category.id)
                      ).length;
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                            selectedCategory === category.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-xs">{postCount}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setSearchQuery(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
                  <div className="space-y-6">
                    {featuredPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="md:flex">
                          {post.featuredImage && (
                            <div className="md:w-1/3">
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-48 md:h-full object-cover"
                              />
                            </div>
                          )}
                          <div className={`p-6 ${post.featuredImage ? "md:w-2/3" : "w-full"}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="default">Featured</Badge>
                              {post.categories.map((categoryId) => (
                                <Badge key={categoryId} variant="outline">
                                  {getCategoryName(categoryId)}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                              <Link
                                to={`/blog/${post.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/blog/${post.slug}`}>
                                  Read more <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Posts */}
              <div>
                {featuredPosts.length > 0 && (
                  <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
                )}
                
                {filteredPosts.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No articles found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or browse different categories.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {regularPosts.map((post) => (
                      <Card key={post.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            {post.categories.map((categoryId) => (
                              <Badge key={categoryId} variant="outline">
                                {getCategoryName(categoryId)}
                              </Badge>
                            ))}
                          </div>
                          <h3 className="text-xl font-bold mb-3">
                            <Link
                              to={`/blog/${post.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/blog/${post.slug}`}>
                                Read more <ChevronRight className="w-4 h-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="pb-4 border-b border-border last:border-0">
                        <h4 className="font-medium mb-2">
                          <Link
                            to={`/blog/${post.slug}`}
                            className="hover:text-primary transition-colors line-clamp-2"
                          >
                            {post.title}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest waste management tips and industry insights delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Enter your email" type="email" />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link
                      to="/all-locations"
                      className="block text-sm hover:text-primary transition-colors py-1"
                    >
                      Find Disposal Facilities
                    </Link>
                    <Link
                      to="/suggest-location"
                      className="block text-sm hover:text-primary transition-colors py-1"
                    >
                      Suggest a Location
                    </Link>
                    <Link
                      to="/about"
                      className="block text-sm hover:text-primary transition-colors py-1"
                    >
                      About WasteFinder
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
