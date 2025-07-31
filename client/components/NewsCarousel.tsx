/**
 * News Carousel Component - Homepage Featured Articles
 * 
 * PURPOSE: Display rotating featured news articles on the homepage
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Calendar, 
  Clock, 
  TrendingUp,
  Newspaper
} from 'lucide-react';
import { getFeaturedArticles, type NewsArticle } from '@/lib/articleStore';

export default function NewsCarousel() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedArticles = () => {
      try {
        const featured = getFeaturedArticles();
        setArticles(featured);
      } catch (error) {
        console.error('Error loading featured articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedArticles();
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (articles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [articles.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
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

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading news stories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Top News Stories
            </h2>
            <p className="text-muted-foreground">No featured articles available at the moment.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/news">View All News</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Top News Stories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest developments in waste management and environmental sustainability
          </p>
        </div>

        {/* Main Carousel */}
        <div className="relative">
          <Card className="overflow-hidden bg-white shadow-lg">
            <div className="md:flex">
              {/* Image Section */}
              {currentArticle.imageUrl && (
                <div className="md:w-1/2">
                  <div className="relative h-64 md:h-full overflow-hidden">
                    <img
                      src={currentArticle.imageUrl}
                      alt={currentArticle.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(currentArticle.category)}>
                        {currentArticle.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className={`${currentArticle.imageUrl ? 'md:w-1/2' : 'w-full'} p-8`}>
                <CardContent className="p-0">
                  {/* Article Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Newspaper className="w-4 h-4" />
                      <span>{currentArticle.source}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeAgo(currentArticle.publishedAt)}</span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-2xl font-bold mb-4 leading-tight text-foreground">
                    {currentArticle.title}
                  </h3>

                  {/* Article Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {currentArticle.customContent || currentArticle.description}
                  </p>

                  {/* AI Summary if available */}
                  {currentArticle.aiSummary && (
                    <div className="bg-primary/5 border-l-4 border-primary p-4 mb-6">
                      <h4 className="font-medium text-sm text-primary mb-2">AI Summary</h4>
                      <p className="text-sm text-muted-foreground">{currentArticle.aiSummary}</p>
                    </div>
                  )}

                  {/* Article Actions */}
                  <div className="flex items-center gap-3">
                    <Button asChild>
                      <Link to={`/news/article/${currentArticle.slug}`}>
                        Read Full Article
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a 
                        href={currentArticle.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Original Source
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  </div>

                  {/* Article Date */}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-4">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(currentArticle.publishedAt)}</span>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Navigation Arrows */}
          {articles.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-md"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-md"
                onClick={nextSlide}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Carousel Indicators */}
        {articles.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Additional Featured Articles */}
        {articles.length > 3 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">More Featured Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {articles.slice(1, 4).map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{getTimeAgo(article.publishedAt)}</span>
                    </div>
                    <h4 className="font-medium text-sm mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/news/article/${article.slug}`}>
                          Read More
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* View All News Link */}
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/news" className="flex items-center gap-2">
              View All News Stories
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
