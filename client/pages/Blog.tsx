import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FacebookCTA from "@/components/FacebookCTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, User, ArrowRight, Search, Star, Clock } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock published blog posts
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Best Practices for Construction Debris Disposal",
    slug: "construction-debris-disposal-best-practices",
    excerpt:
      "Learn the most effective ways to dispose of construction waste while staying compliant with local regulations.",
    content: `Construction debris disposal is a critical aspect of any building project. Proper disposal not only keeps job sites clean and safe but also ensures compliance with environmental regulations...`,
    author: "Sean Webb",
    status: "published",
    featured: true,
    tags: ["construction", "debris", "disposal", "best-practices"],
    featuredImage:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&h=400&fit=crop",
    publishedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Understanding Landfill Costs: A Complete Guide",
    slug: "understanding-landfill-costs-guide",
    excerpt:
      "A comprehensive breakdown of landfill pricing, factors that affect costs, and tips for budget planning.",
    content: `Understanding landfill costs is essential for effective waste management budgeting. This guide covers all the factors that influence pricing...`,
    author: "Sean Webb",
    status: "published",
    featured: false,
    tags: ["landfill", "costs", "pricing", "guide"],
    featuredImage:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop",
    publishedAt: "2024-01-10T08:00:00Z",
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "3",
    title: "Environmental Impact of Proper Waste Management",
    slug: "environmental-impact-waste-management",
    excerpt:
      "Discover how proper waste disposal and management practices can significantly reduce environmental impact.",
    content: `Environmental consciousness in waste management has never been more important...`,
    author: "Sean Webb",
    status: "published",
    featured: false,
    tags: ["environment", "sustainability", "waste-management"],
    featuredImage:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop",
    publishedAt: "2024-01-08T12:00:00Z",
    createdAt: "2024-01-03T16:45:00Z",
    updatedAt: "2024-01-08T12:00:00Z",
  },
  {
    id: "4",
    title: "Recycling vs. Disposal: Making the Right Choice",
    slug: "recycling-vs-disposal-guide",
    excerpt:
      "When should you recycle and when should you dispose? Learn the environmental and economic factors to consider.",
    content: `The choice between recycling and disposal isn't always straightforward...`,
    author: "Sean Webb",
    status: "published",
    featured: false,
    tags: ["recycling", "disposal", "environment", "decision-making"],
    featuredImage:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
    publishedAt: "2024-01-05T14:30:00Z",
    createdAt: "2024-01-01T11:15:00Z",
    updatedAt: "2024-01-05T14:30:00Z",
  },
];

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Get all unique tags
  const allTags = [
    "all",
    ...Array.from(new Set(mockBlogPosts.flatMap((post) => post.tags))),
  ];

  useEffect(() => {
    // Simulate loading published posts
    setTimeout(() => {
      const publishedPosts = mockBlogPosts.filter(
        (post) => post.status === "published",
      );
      setBlogPosts(publishedPosts);
      setFilteredPosts(publishedPosts);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...blogPosts];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Tag filter
    if (selectedTag !== "all") {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedTag, blogPosts]);

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Waste Management Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert insights, tips, and best practices for waste disposal and
              environmental responsibility.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag === "all"
                      ? "All Topics"
                      : tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt!)}
                        <User className="w-4 h-4 ml-2" />
                        {post.author}
                      </div>
                      <CardTitle className="text-xl hover:text-primary transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/blog/${post.slug}`}>
                            Read More <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Facebook CTA */}
          <div className="mb-12">
            <FacebookCTA facebookUrl="https://facebook.com/groups/wastefindergroup" />
          </div>

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="w-4 h-4" />
                        {formatDate(post.publishedAt!)}
                      </div>
                      <CardTitle className="text-lg hover:text-primary transition-colors">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/blog/${post.slug}`}>
                            Read <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse all topics.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTag("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
