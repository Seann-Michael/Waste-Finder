/**
 * News Article Component - Individual Article Display
 *
 * PURPOSE: Display full RSS article content with proper layout and formatting
 *
 * FEATURES:
 * - Article content rendering with rich text support
 * - Social sharing capabilities
 * - Related articles suggestions
 * - SEO optimization for article pages
 * - Mobile-responsive article layout
 * - Reading time estimation
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  ExternalLink,
  Share2,
  ArrowLeft,
  User,
  Tag,
  Eye,
  Facebook,
  Twitter,
  Linkedin,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
  imageUrl?: string;
  author?: string;
  tags: string[];
  readingTime?: number;
  views?: number;
}

interface RelatedArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("Article ID not provided");
        setIsLoading(false);
        return;
      }

      try {
        // Mock data for demonstration
        const mockArticle: NewsArticle = {
          id: id,
          title: "Revolutionary AI-Powered Waste Sorting System Achieves 95% Accuracy Rate",
          description: "A groundbreaking new artificial intelligence system developed by researchers at MIT has achieved unprecedented accuracy in automated waste sorting, potentially transforming recycling operations worldwide.",
          content: `
            <div class="article-content">
              <p class="lead">A groundbreaking new artificial intelligence system developed by researchers at MIT has achieved unprecedented accuracy in automated waste sorting, potentially transforming recycling operations worldwide and significantly reducing contamination rates in recycling streams.</p>
              
              <h2>The Technology Behind the Breakthrough</h2>
              <p>The new system, called "WasteSense AI," combines computer vision, machine learning, and advanced robotics to identify and sort different types of waste materials with 95% accuracy. This represents a significant improvement over traditional automated sorting systems, which typically achieve 70-80% accuracy rates.</p>
              
              <blockquote class="border-l-4 border-primary pl-4 italic my-6">
                "This technology could revolutionize how we approach waste management and recycling. The accuracy rate we've achieved means we can significantly reduce contamination and increase the quality of recycled materials." - Dr. Sarah Chen, Lead Researcher
              </blockquote>
              
              <h2>Real-World Applications</h2>
              <p>The system has been tested in three major recycling facilities across the United States, with impressive results:</p>
              
              <ul class="list-disc pl-6 my-4">
                <li><strong>Boston Recycling Center:</strong> 23% increase in successfully recycled materials</li>
                <li><strong>Phoenix Waste Management:</strong> 31% reduction in contamination rates</li>
                <li><strong>Seattle Green Solutions:</strong> 18% improvement in processing speed</li>
              </ul>
              
              <h2>Environmental Impact</h2>
              <p>The environmental implications of this technology are substantial. By improving sorting accuracy, the system helps ensure that more materials are successfully recycled rather than sent to landfills. This contributes to reduced greenhouse gas emissions and conservation of natural resources.</p>
              
              <p>According to the Environmental Protection Agency, contamination is one of the biggest challenges facing recycling programs today. When non-recyclable materials contaminate recycling streams, entire batches of materials may need to be discarded.</p>
              
              <h2>Industry Response</h2>
              <p>The waste management industry has responded enthusiastically to the technology. Several major waste management companies have already expressed interest in implementing the system at their facilities.</p>
              
              <p>"This represents exactly the kind of innovation our industry needs," said Michael Rodriguez, CEO of National Waste Solutions. "We're always looking for ways to improve efficiency and environmental outcomes, and this technology delivers on both fronts."</p>
              
              <h2>Future Developments</h2>
              <p>The research team is already working on next-generation improvements to the system, including:</p>
              
              <ul class="list-disc pl-6 my-4">
                <li>Integration with Internet of Things (IoT) sensors for real-time monitoring</li>
                <li>Expanded material recognition capabilities for specialized waste streams</li>
                <li>Reduced hardware costs to make the technology accessible to smaller facilities</li>
                <li>Machine learning algorithms that continuously improve accuracy over time</li>
              </ul>
              
              <p>The team expects to begin commercial deployment of the system within the next 18 months, with initial installations planned at facilities in major metropolitan areas.</p>
              
              <h2>Looking Ahead</h2>
              <p>This breakthrough represents just one example of how artificial intelligence and automation are transforming the waste management industry. As environmental concerns continue to grow and regulations become more stringent, technologies like WasteSense AI will play an increasingly important role in creating sustainable waste management solutions.</p>
              
              <p>The success of this project also highlights the importance of continued research and development in environmental technologies. With proper investment and support, innovations like this can help address some of our most pressing environmental challenges.</p>
            </div>
          `,
          url: "https://example.com/ai-waste-sorting-breakthrough",
          source: "Environmental Technology Review",
          category: "technology",
          publishedAt: "2024-01-20T14:30:00Z",
          imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
          author: "Dr. Jennifer Martinez",
          tags: ["AI", "artificial intelligence", "recycling", "waste management", "technology", "automation"],
          readingTime: 8,
          views: 1247
        };

        const mockRelatedArticles: RelatedArticle[] = [
          {
            id: "2",
            title: "Smart Bins: IoT Technology Revolutionizes Urban Waste Collection",
            source: "Smart City News",
            publishedAt: "2024-01-19T09:15:00Z",
            imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300"
          },
          {
            id: "3",
            title: "Circular Economy: How Tech Companies Are Eliminating Waste",
            source: "Business Environmental Report",
            publishedAt: "2024-01-18T16:20:00Z",
            imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300"
          },
          {
            id: "4",
            title: "The Future of Recycling: Blockchain Technology Tracks Materials",
            source: "Innovation Today",
            publishedAt: "2024-01-17T11:45:00Z",
            imageUrl: "https://images.unsplash.com/photo-1569163139394-de44cb62e4b8?w=300"
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        setArticle(mockArticle);
        setRelatedArticles(mockRelatedArticles);
      } catch (err) {
        setError("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

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
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const handleShare = (platform: string) => {
    if (!article) return;

    const url = window.location.href;
    const text = `${article.title} - ${article.description.substring(0, 100)}...`;

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Article link copied to clipboard",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/news">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className={getCategoryColor(article.category)}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{getTimeAgo(article.publishedAt)}</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            {article.description}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author || "Unknown Author"}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.readingTime} min read
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {article.views?.toLocaleString()} views
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                {article.source}
              </a>
            </div>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-sm font-medium mr-2">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("copy")}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Article Tags */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4" />
            <span className="text-sm font-medium">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Original Article Link */}
        <div className="text-center mb-8">
          <Button asChild>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Read Full Article on {article.source}
            </a>
          </Button>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Card key={relatedArticle.id} className="hover:shadow-lg transition-shadow">
                {relatedArticle.imageUrl && (
                  <div className="h-32 overflow-hidden rounded-t-lg">
                    <img
                      src={relatedArticle.imageUrl}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    <Link
                      to={`/news/article/${relatedArticle.id}`}
                      className="hover:text-primary"
                    >
                      {relatedArticle.title}
                    </Link>
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <span>{relatedArticle.source}</span>
                    <span> • </span>
                    <span>{getTimeAgo(relatedArticle.publishedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
