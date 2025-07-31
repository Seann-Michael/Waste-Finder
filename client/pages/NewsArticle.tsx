/**
 * News Article Page - Individual Article View
 * 
 * PURPOSE: Display individual news articles with custom content and AI summaries
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Clock,
  ExternalLink,
  User,
  Tag,
  ArrowLeft,
  Share2,
  Bookmark,
  TrendingUp,
  Eye,
  Bot
} from 'lucide-react';
import { getArticleBySlug, getManagedArticles, type NewsArticle } from '@/lib/articleStore';

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = () => {
      try {
        if (!id) {
          setError('Article ID is required');
          setIsLoading(false);
          return;
        }

        // Try to find article by slug (id parameter contains the slug)
        const foundArticle = getArticleBySlug(id);
        
        if (!foundArticle) {
          setError('Article not found');
          setIsLoading(false);
          return;
        }

        setArticle(foundArticle);

        // Load related articles (same category, excluding current article)
        const allArticles = getManagedArticles();
        const related = allArticles
          .filter(a => a.id !== foundArticle.id && a.category === foundArticle.category)
          .slice(0, 3);
        setRelatedArticles(related);

      } catch (err) {
        console.error('Error loading article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      technology: 'bg-blue-100 text-blue-800',
      policy: 'bg-purple-100 text-purple-800',
      business: 'bg-green-100 text-green-800',
      community: 'bg-orange-100 text-orange-800',
      climate: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const shareArticle = async () => {
    const shareData = {
      title: article?.title,
      text: article?.description,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
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
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Alert>
            <AlertDescription>
              {error || 'Article not found'}
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={() => navigate('/news')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Article Header */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/news" className="hover:text-primary">News</Link>
            <span>/</span>
            <span>{article.title.substring(0, 50)}...</span>
          </div>

          {/* Article Meta */}
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={() => navigate('/news')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
            <Badge className={getCategoryColor(article.category)}>
              {article.category}
            </Badge>
            {article.featured && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                Featured
              </Badge>
            )}
          </div>

          {/* Article Title */}
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{getTimeAgo(article.publishedAt)}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.source}</span>
            </div>
          </div>

          {/* Article Actions */}
          <div className="flex items-center gap-3 mb-8">
            <Button onClick={shareArticle} variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button asChild variant="outline" size="sm">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Original Source
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            {/* Featured Image */}
            {article.imageUrl && (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            {/* AI Summary */}
            {article.aiSummary && (
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {article.aiSummary}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Custom Content */}
            {article.customContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Editorial Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    {article.customContent.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Original Article Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Article Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  {article.content ? (
                    article.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="leading-relaxed">{article.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Article Tags */}
            {article.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="hover:shadow-lg transition-shadow">
                  {relatedArticle.imageUrl && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={relatedArticle.imageUrl}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{relatedArticle.source}</span>
                      <span>•</span>
                      <span>{getTimeAgo(relatedArticle.publishedAt)}</span>
                    </div>
                    <h3 className="font-medium mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {relatedArticle.description}
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/news/article/${relatedArticle.slug}`}>
                        Read Article
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
