/**
 * News Page Component - Public News Aggregation
 *
 * PURPOSE: Display aggregated news articles from multiple RSS sources
 *
 * FEATURES:
 * - RSS feed aggregation from configured sources
 * - Search and filter functionality
 * - Category-based organization
 * - Mobile-responsive news layout
 * - Social sharing capabilities
 * - SEO optimization for news content
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  ExternalLink,
  Search,
  Filter,
  TrendingUp,
  Globe,
  Rss,
} from "lucide-react";

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

interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
  isActive: boolean;
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch real articles from RSS feeds
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);

        // Fetch articles
        const newsResponse = await fetch('/api/news?limit=20');
        const newsData = await newsResponse.json();

        // Fetch RSS feeds for sources
        const feedsResponse = await fetch('/api/rss/feeds');
        const feedsData = await feedsResponse.json();

        if (newsData.articles) {
          setArticles(newsData.articles);
        }

        if (Array.isArray(feedsData)) {
          setSources(feedsData.map((feed: any) => ({
            id: feed.id,
            name: feed.name,
            url: feed.url,
            category: feed.category,
            isActive: feed.isActive
          })));
        }

      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback to empty state
        setArticles([]);
        setSources([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "policy", label: "Policy & Regulations" },
    { value: "business", label: "Business" },
    { value: "community", label: "Community" },
    { value: "climate", label: "Climate & Environment" }
  ];

  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
      const matchesSource = selectedSource === "all" || article.source === selectedSource;

      return matchesSearch && matchesCategory && matchesSource;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case "oldest":
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      technology: "bg-blue-100 text-blue-800",
      policy: "bg-purple-100 text-purple-800",
      business: "bg-green-100 text-green-800",
      community: "bg-orange-100 text-orange-800",
      climate: "bg-red-100 text-red-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Rss className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Industry News
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest news and insights from the waste management and environmental industry
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-4 text-center">
                <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{sources.length}</div>
                <div className="text-sm text-muted-foreground">News Sources</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{articles.length}</div>
                <div className="text-sm text-muted-foreground">Latest Articles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">Daily</div>
                <div className="text-sm text-muted-foreground">Updates</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Source</label>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {sources.map((source) => (
                        <SelectItem key={source.id} value={source.name}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading latest news...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedSource("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredArticles.length} of {articles.length} articles
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    {article.imageUrl && (
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className={getCategoryColor(article.category)}>
                            {categories.find(c => c.value === article.category)?.label || article.category}
                          </Badge>
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span>{getTimeAgo(article.publishedAt)}</span>
                      </div>
                      <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                        <Link to={`/news/article/${article.id}`}>
                          {article.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {article.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.publishedAt)}
                        </div>

                        <Button asChild variant="ghost" size="sm">
                          <Link
                            to={`/news/article/${article.id}`}
                            className="flex items-center gap-1"
                          >
                            Read More
                          </Link>
                        </Button>
                      </div>

                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{article.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
