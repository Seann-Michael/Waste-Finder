import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Tag,
  BookOpen,
  Eye,
  Heart,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { getBlogPost, getRelatedPosts } from '@/lib/blogService';
import type { BlogPost } from '@/lib/blog.types';

const ShareButton: React.FC<{ post: BlogPost }> = ({ post }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (error) {
        // Fallback to copying URL
        copyToClipboard(url);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="w-4 h-4 mr-2" />
      {copied ? 'Copied!' : 'Share'}
    </Button>
  );
};

const RelatedPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      {post.featured_image && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-32 object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <Badge className="mb-2" style={{ backgroundColor: getCategoryColor(post.category) }}>
          {post.category}
        </Badge>
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
          <Link 
            to={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          <span>{post.read_time_minutes} min read</span>
        </div>
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

const formatContent = (content: string): string => {
  return content
    .replace(/\n/g, '<br>')
    .replace(/#{1}\s+([^\n]*)/g, '<h1 class="text-3xl font-bold mt-8 mb-4 text-foreground">$1</h1>')
    .replace(/#{2}\s+([^\n]*)/g, '<h2 class="text-2xl font-semibold mt-6 mb-3 text-foreground">$1</h2>')
    .replace(/#{3}\s+([^\n]*)/g, '<h3 class="text-xl font-medium mt-4 mb-2 text-foreground">$1</h3>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
    .replace(/^- (.+)/gm, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^\d+\.\s+(.+)/gm, '<li class="ml-4 mb-1 list-decimal">$1</li>');
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!slug) return;
    
    const loadPost = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const postData = await getBlogPost(slug);
        
        if (!postData) {
          setError('Post not found');
          return;
        }
        
        setPost(postData);
        
        // Load related posts
        const related = await getRelatedPosts(postData.id);
        setRelatedPosts(related);
      } catch (err) {
        console.error('Error loading blog post:', err);
        setError('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 rounded w-1/4 mb-6"></div>
            <div className="bg-gray-200 h-64 rounded mb-6"></div>
            <div className="bg-gray-200 h-12 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-4 rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {error === 'Post not found' ? 'Article Not Found' : 'Error Loading Article'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error === 'Post not found' 
                ? "The article you're looking for doesn't exist or has been removed."
                : "There was an error loading this article. Please try again later."}
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/blog?category=${post.category.toLowerCase()}`} className="hover:text-foreground">
            {post.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{post.title}</span>
        </nav>

        {/* Article Header */}
        <article className="mb-12">
          {/* Category and Featured Image */}
          {post.featured_image && (
            <div className="relative overflow-hidden rounded-lg mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge 
                  className="text-white"
                  style={{ backgroundColor: getCategoryColor(post.category) }}
                >
                  {post.category}
                </Badge>
              </div>
            </div>
          )}

          {/* Title and Excerpt */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg text-muted-foreground italic mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.read_time_minutes} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.view_count} views</span>
            </div>
            {post.like_count > 0 && (
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{post.like_count} likes</span>
              </div>
            )}
          </div>

          {/* Tags and Share */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            <ShareButton post={post} />
          </div>

          <Separator className="mb-8" />
        </article>

        {/* Article Content */}
        <div className="prose prose-gray max-w-none mb-12">
          <div 
            className="text-foreground leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ 
              __html: formatContent(post.content)
            }} 
          />
        </div>

        <Separator className="mb-8" />

        {/* Article Footer */}
        <div className="mb-12 p-6 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Enjoyed this article?</h3>
              <p className="text-sm text-muted-foreground">Share it with others who might find it helpful.</p>
            </div>
            <div className="flex items-center gap-4">
              <ShareButton post={post} />
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Like ({post.like_count})
              </Button>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
