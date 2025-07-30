/**
 * RSS Manager Component - Admin RSS Feed Configuration
 *
 * PURPOSE: Manage RSS feeds for news aggregation
 *
 * FEATURES:
 * - Add/edit/delete RSS feed sources
 * - Test RSS feed validity
 * - Configure feed categories and update frequency
 * - Monitor feed status and last update times
 * - Bulk import/export RSS configurations
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle2, Edit, Plus, Trash2, TestTube, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  description?: string;
  isActive: boolean;
  updateFrequency: number; // hours
  lastUpdated?: string;
  status: "active" | "error" | "pending";
  articleCount: number;
  errorMessage?: string;
}

export default function RSSManager() {
  const { toast } = useToast();
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<RSSFeed | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: "",
    description: "",
    isActive: true,
    updateFrequency: 6
  });

  // Mock data for development
  useEffect(() => {
    const mockFeeds: RSSFeed[] = [
      {
        id: "1",
        name: "Environmental Today",
        url: "https://environmentaltoday.com/rss",
        category: "technology",
        description: "Latest environmental technology news",
        isActive: true,
        updateFrequency: 6,
        lastUpdated: "2024-01-20T14:30:00Z",
        status: "active",
        articleCount: 45
      },
      {
        id: "2",
        name: "Policy Watch",
        url: "https://policywatch.org/feed",
        category: "policy",
        description: "Environmental policy and regulation updates",
        isActive: true,
        updateFrequency: 12,
        lastUpdated: "2024-01-20T08:15:00Z",
        status: "active",
        articleCount: 23
      },
      {
        id: "3",
        name: "Climate Science Daily",
        url: "https://climatesciencedaily.com/rss",
        category: "climate",
        description: "Climate change research and news",
        isActive: false,
        updateFrequency: 24,
        lastUpdated: "2024-01-18T16:45:00Z",
        status: "error",
        articleCount: 12,
        errorMessage: "Feed temporarily unavailable"
      }
    ];
    setFeeds(mockFeeds);
  }, []);

  const categories = [
    { value: "technology", label: "Technology" },
    { value: "policy", label: "Policy & Regulations" },
    { value: "business", label: "Business" },
    { value: "community", label: "Community" },
    { value: "climate", label: "Climate & Environment" },
    { value: "recycling", label: "Recycling" },
    { value: "energy", label: "Energy" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Test RSS feed before saving (for new feeds)
      if (!editingFeed) {
        // Double encode the URL to handle complex Google News URLs
        const encodedUrl = encodeURIComponent(encodeURIComponent(formData.url));
        const testResponse = await fetch(`/api/rss/test?url=${encodedUrl}`);
        const testResult = await testResponse.json();

        if (!testResult.valid) {
          toast({
            variant: "destructive",
            title: "Invalid RSS Feed",
            description: testResult.error || "The RSS feed URL is not valid or accessible.",
          });
          setIsLoading(false);
          return;
        }
      }

      const feedData: RSSFeed = {
        id: editingFeed?.id || Date.now().toString(),
        name: formData.name,
        url: formData.url,
        category: formData.category,
        description: formData.description,
        isActive: formData.isActive,
        updateFrequency: formData.updateFrequency,
        lastUpdated: editingFeed?.lastUpdated,
        status: "active",
        articleCount: editingFeed?.articleCount || 0
      };

      if (editingFeed) {
        setFeeds(prev => prev.map(feed =>
          feed.id === editingFeed.id ? feedData : feed
        ));
        toast({
          title: "RSS Feed Updated",
          description: "The RSS feed has been successfully updated.",
        });
      } else {
        setFeeds(prev => [...prev, feedData]);
        toast({
          title: "RSS Feed Added",
          description: "The RSS feed has been successfully added and validated.",
        });
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save RSS feed. Please check the URL and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (feed: RSSFeed) => {
    setEditingFeed(feed);
    setFormData({
      name: feed.name,
      url: feed.url,
      category: feed.category,
      description: feed.description || "",
      isActive: feed.isActive,
      updateFrequency: feed.updateFrequency
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (feedId: string) => {
    try {
      setFeeds(prev => prev.filter(feed => feed.id !== feedId));
      toast({
        title: "RSS Feed Deleted",
        description: "The RSS feed has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete RSS feed. Please try again.",
      });
    }
  };

  const handleTest = async (feedId: string) => {
    setIsTesting(feedId);

    const feed = feeds.find(f => f.id === feedId);
    if (!feed) return;

    try {
      const encodedUrl = encodeURIComponent(encodeURIComponent(feed.url));
      const response = await fetch(`/api/rss/test?url=${encodedUrl}`);
      const result = await response.json();

      if (result.valid) {
        setFeeds(prev => prev.map(f =>
          f.id === feedId
            ? { ...f, status: "active", errorMessage: undefined, articleCount: result.articleCount }
            : f
        ));
        toast({
          title: "RSS Feed Test Successful",
          description: `Found ${result.articleCount} articles from "${result.feedTitle}"`,
        });
      } else {
        setFeeds(prev => prev.map(f =>
          f.id === feedId
            ? { ...f, status: "error", errorMessage: result.error }
            : f
        ));
        toast({
          variant: "destructive",
          title: "RSS Feed Test Failed",
          description: result.error,
        });
      }
    } catch (error) {
      setFeeds(prev => prev.map(f =>
        f.id === feedId
          ? { ...f, status: "error", errorMessage: "Network error" }
          : f
      ));
      toast({
        variant: "destructive",
        title: "RSS Feed Test Failed",
        description: "Failed to connect to RSS feed",
      });
    } finally {
      setIsTesting(null);
    }
  };

  const handleRefresh = async (feedId: string) => {
    const feed = feeds.find(f => f.id === feedId);
    if (!feed) return;

    try {
      const response = await fetch(`/api/rss/parse?url=${encodeURIComponent(feed.url)}`);
      const result = await response.json();

      if (result.articles) {
        setFeeds(prev => prev.map(f =>
          f.id === feedId
            ? {
                ...f,
                lastUpdated: new Date().toISOString(),
                articleCount: result.articles.length,
                status: "active",
                errorMessage: undefined
              }
            : f
        ));
        toast({
          title: "RSS Feed Refreshed",
          description: `Successfully loaded ${result.articles.length} articles from "${result.title}"`,
        });
      } else {
        throw new Error(result.error || 'Failed to parse RSS feed');
      }
    } catch (error) {
      setFeeds(prev => prev.map(f =>
        f.id === feedId
          ? { ...f, status: "error", errorMessage: error instanceof Error ? error.message : "Unknown error" }
          : f
      ));
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh RSS feed. Please check the URL.",
      });
    }
  };

  const toggleFeedStatus = async (feedId: string, isActive: boolean) => {
    try {
      setFeeds(prev => prev.map(feed =>
        feed.id === feedId ? { ...feed, isActive } : feed
      ));
      toast({
        title: `RSS Feed ${isActive ? 'Enabled' : 'Disabled'}`,
        description: `The RSS feed has been ${isActive ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update RSS feed status. Please try again.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      category: "",
      description: "",
      isActive: true,
      updateFrequency: 6
    });
    setEditingFeed(null);
  };

  const getStatusBadge = (status: RSSFeed["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">RSS Feed Management</h1>
          <p className="text-muted-foreground">
            Manage RSS feeds for news aggregation on the public news page
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add RSS Feed
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Feeds</p>
                <p className="text-2xl font-bold">{feeds.length}</p>
              </div>
              <div className="text-primary">
                <Plus className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Feeds</p>
                <p className="text-2xl font-bold">{feeds.filter(f => f.isActive).length}</p>
              </div>
              <div className="text-green-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold">{feeds.reduce((sum, f) => sum + f.articleCount, 0)}</p>
              </div>
              <div className="text-blue-600">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold">{feeds.filter(f => f.status === "error").length}</p>
              </div>
              <div className="text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RSS Feeds Table */}
      <Card>
        <CardHeader>
          <CardTitle>RSS Feeds</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeds.map((feed) => (
                <TableRow key={feed.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{feed.name}</div>
                      {feed.description && (
                        <div className="text-sm text-muted-foreground">
                          {feed.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categories.find(c => c.value === feed.category)?.label || feed.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      {feed.url.length > 40 ? feed.url.substring(0, 40) + "..." : feed.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(feed.status)}
                      {feed.errorMessage && (
                        <div className="text-xs text-red-600">{feed.errorMessage}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{feed.articleCount}</TableCell>
                  <TableCell className="text-sm">
                    {formatLastUpdated(feed.lastUpdated)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={feed.isActive}
                      onCheckedChange={(checked) => toggleFeedStatus(feed.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTest(feed.id)}
                        disabled={isTesting === feed.id}
                      >
                        {isTesting === feed.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <TestTube className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefresh(feed.id)}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(feed)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(feed.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {feeds.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No RSS feeds configured yet.</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="mt-4"
              >
                Add Your First RSS Feed
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFeed ? "Edit RSS Feed" : "Add RSS Feed"}
            </DialogTitle>
            <DialogDescription>
              {editingFeed
                ? "Update the RSS feed configuration below."
                : "Add a new RSS feed source for news aggregation."
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Feed Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Environmental News Today"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
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
            </div>

            <div>
              <Label htmlFor="url">RSS Feed URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com/rss"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this RSS feed..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="updateFrequency">Update Frequency (hours)</Label>
              <Select
                value={formData.updateFrequency.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, updateFrequency: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select update frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every hour</SelectItem>
                  <SelectItem value="3">Every 3 hours</SelectItem>
                  <SelectItem value="6">Every 6 hours</SelectItem>
                  <SelectItem value="12">Every 12 hours</SelectItem>
                  <SelectItem value="24">Daily</SelectItem>
                  <SelectItem value="168">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active (enable feed processing)</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingFeed ? "Update Feed" : "Add Feed"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
