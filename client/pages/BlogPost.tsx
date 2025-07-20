import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FacebookCTA from "@/components/FacebookCTA";
import AdSense from "@/components/AdSense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  ArrowLeft,
  Clock,
  Tag,
  Share2,
  ChevronRight,
  Star,
} from "lucide-react";

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
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = () => {
    setIsLoading(true);
    setTimeout(() => {
      const savedPosts = localStorage.getItem("blogPosts");
      if (savedPosts) {
        const allPosts: BlogPost[] = JSON.parse(savedPosts);
        const foundPost = allPosts.find(
          (p) => p.slug === slug && p.status === "published"
        );
        
        if (foundPost) {
          setPost(foundPost);
          
          // Find related posts with similar tags
          const related = allPosts
            .filter((p) => 
              p.id !== foundPost.id && 
              p.status === "published" &&
              p.tags.some((tag) => foundPost.tags.includes(tag))
            )
            .slice(0, 3);
          setRelatedPosts(related);
        }
      }
      setIsLoading(false);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Convert markdown-like content to HTML (basic conversion)
  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
      .replace(/^<p class="mb-4"><h/gm, '<h')
      .replace(/h1><\/p>$/gm, 'h1>')
      .replace(/h2><\/p>$/gm, 'h2>')
      .replace(/h3><\/p>$/gm, 'h3>');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/blog")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
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
        {/* AdSense Top Banner */}
        <AdSense placement="search-results-top" className="py-4" />

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-primary">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{post.title}</span>
          </nav>

          {/* Article Header */}
          <article>
            <header className="mb-8">
              {post.featured && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Badge className="bg-yellow-500 text-yellow-50">
                    Featured Article
                  </Badge>
                </div>
              )}
              
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt!)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{getReadingTime(post.content)} min read</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="ml-auto"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {post.featuredImage && (
                <div className="aspect-video overflow-hidden rounded-lg mb-8">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: formatContent(post.content),
                }}
                className="text-foreground leading-relaxed"
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Published by</span>
                  <span className="font-medium text-foreground">{post.author}</span>
                </div>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
              </div>
            </footer>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {relatedPost.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg hover:text-primary transition-colors">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(relatedPost.publishedAt!)}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/blog/${relatedPost.slug}`}>
                            Read More
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
          <div className="mt-16">
            <FacebookCTA facebookUrl="https://facebook.com/groups/wastefindergroup" />
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-center">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Articles
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
