/**
 * Article Management - Admin Interface for Managing News Articles
 * 
 * PURPOSE: Admin interface for editing individual articles and managing content
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  ExternalLink,
  Star,
  FileText,
  Save,
  Bot,
  Download,
  RefreshCw,
  Search
} from 'lucide-react';
import {
  getManagedArticles,
  saveArticle,
  deleteArticle,
  importRSSArticles,
  generateAISummary,
  getAIContentSettings,
  type NewsArticle
} from '@/lib/articleStore';

export default function ArticleManagement() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [isImporting, setIsImporting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customContent: '',
    aiSummary: '',
    featured: false,
    featured_order: 0,
    category: '',
    tags: '',
    seo_title: '',
    seo_description: ''
  });

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, categoryFilter, featuredFilter]);

  const loadArticles = () => {
    const loadedArticles = getManagedArticles();
    setArticles(loadedArticles);
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(search) ||
        article.description.toLowerCase().includes(search) ||
        article.source.toLowerCase().includes(search) ||
        article.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    // Filter by featured status
    if (featuredFilter === 'featured') {
      filtered = filtered.filter(article => article.featured);
    } else if (featuredFilter === 'not-featured') {
      filtered = filtered.filter(article => !article.featured);
    }

    setFilteredArticles(filtered);
  };

  const handleEditArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      description: article.description,
      customContent: article.customContent || '',
      aiSummary: article.aiSummary || '',
      featured: article.featured,
      featured_order: article.featured_order || 0,
      category: article.category,
      tags: article.tags.join(', '),
      seo_title: article.seo_title || '',
      seo_description: article.seo_description || ''
    });
    setShowEditDialog(true);
  };

  const handleSaveArticle = () => {
    if (!selectedArticle) return;

    const updatedArticle: NewsArticle = {
      ...selectedArticle,
      title: formData.title,
      description: formData.description,
      customContent: formData.customContent || undefined,
      aiSummary: formData.aiSummary || undefined,
      featured: formData.featured,
      featured_order: formData.featured_order || undefined,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      seo_title: formData.seo_title || undefined,
      seo_description: formData.seo_description || undefined,
      lastEditedBy: 'Admin',
      lastEditedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveArticle(updatedArticle);
    loadArticles();
    setShowEditDialog(false);
    setSelectedArticle(null);
    resetForm();
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      deleteArticle(articleId);
      loadArticles();
    }
  };

  const handleGenerateAISummary = () => {
    if (!selectedArticle) return;

    const aiSettings = getAIContentSettings();
    const summary = generateAISummary(selectedArticle, aiSettings);
    setFormData(prev => ({ ...prev, aiSummary: summary }));
  };

  const handleImportRSS = async () => {
    setIsImporting(true);
    try {
      // Fetch latest RSS articles
      const response = await fetch('/api/news?limit=50');
      const data = await response.json();
      
      if (data.articles) {
        const imported = importRSSArticles(data.articles);
        loadArticles();
        alert(`Successfully imported ${imported} new articles from RSS feeds.`);
      }
    } catch (error) {
      console.error('Error importing RSS articles:', error);
      alert('Failed to import RSS articles. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      customContent: '',
      aiSummary: '',
      featured: false,
      featured_order: 0,
      category: '',
      tags: '',
      seo_title: '',
      seo_description: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'policy', label: 'Policy & Regulations' },
    { value: 'business', label: 'Business' },
    { value: 'community', label: 'Community' },
    { value: 'climate', label: 'Climate & Environment' },
  ];

  const getFeaturedBadge = (article: NewsArticle) => {
    if (article.featured) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          Featured {article.featured_order && `#${article.featured_order}`}
        </Badge>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Article Management</h1>
            <p className="text-muted-foreground">
              Manage news articles with custom content and AI summaries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleImportRSS} 
              variant="outline"
              disabled={isImporting}
            >
              {isImporting ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Import RSS
            </Button>
            <Button asChild>
              <Link to="/admin/ai-content-settings">
                <Bot className="w-4 h-4 mr-2" />
                AI Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Featured Status</Label>
                <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Articles</SelectItem>
                    <SelectItem value="featured">Featured Only</SelectItem>
                    <SelectItem value="not-featured">Not Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setFeaturedFilter('all');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Articles ({filteredArticles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {article.description}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getFeaturedBadge(article)}
                          {article.customContent && (
                            <Badge variant="outline" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              Custom Content
                            </Badge>
                          )}
                          {article.aiSummary && (
                            <Badge variant="outline" className="text-xs">
                              <Bot className="w-3 h-3 mr-1" />
                              AI Summary
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{article.source}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {article.featured && <Star className="w-4 h-4 text-yellow-500" />}
                        <span className="text-sm">
                          {article.featured ? 'Featured' : 'Standard'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(article.publishedAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/news/article/${article.slug}`, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditArticle(article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(article.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Article Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
              <DialogDescription>
                Customize content and settings for this article
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="customContent">Custom Content</Label>
                <Textarea
                  id="customContent"
                  value={formData.customContent}
                  onChange={(e) => setFormData({ ...formData, customContent: e.target.value })}
                  placeholder="Add your own analysis, commentary, or additional information..."
                  rows={6}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="aiSummary">AI Summary</Label>
                  <Button 
                    onClick={handleGenerateAISummary}
                    variant="outline" 
                    size="sm"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Generate AI Summary
                  </Button>
                </div>
                <Textarea
                  id="aiSummary"
                  value={formData.aiSummary}
                  onChange={(e) => setFormData({ ...formData, aiSummary: e.target.value })}
                  placeholder="AI-generated summary will appear here..."
                  rows={4}
                />
              </div>

              {/* Featured Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Article</Label>
                </div>
                {formData.featured && (
                  <div>
                    <Label htmlFor="featuredOrder">Featured Order</Label>
                    <Input
                      id="featuredOrder"
                      type="number"
                      min="0"
                      value={formData.featured_order}
                      onChange={(e) => setFormData({ ...formData, featured_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="waste management, recycling, sustainability"
                />
              </div>

              {/* SEO Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SEO Settings</h3>
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    placeholder="Custom title for search engines"
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    placeholder="Custom description for search engines"
                    rows={2}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveArticle}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
