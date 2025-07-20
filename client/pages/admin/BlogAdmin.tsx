import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/ui/rich-text-editor";
import ImageUpload from "@/components/ui/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PenTool,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Save,
  X,
  CheckCircle,
  Clock,
  Globe,
} from "lucide-react";
import { useToastNotifications } from "@/hooks/use-toast-notifications";

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

export default function BlogAdmin() {
  const { showSuccess, showError } = useToastNotifications();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Sean Webb",
    status: "draft" as "draft" | "published" | "scheduled",
    featured: false,
    tags: "",
    featuredImage: "",
    publishDate: "",
    publishTime: "",
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    // Load from localStorage (in production, this would be from API)
    const savedPosts = localStorage.getItem("blogPosts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with sample posts
      const samplePosts: BlogPost[] = [
        {
          id: "1",
          title: "Understanding Landfill Costs: A Complete Guide",
          slug: "understanding-landfill-costs-complete-guide",
          excerpt: "A comprehensive breakdown of landfill pricing, factors that affect costs, and tips for budget planning.",
          content: "# Understanding Landfill Costs: A Complete Guide\n\nWhen it comes to waste disposal, understanding the costs involved is crucial for both businesses and individuals...",
          author: "Sean Webb",
          status: "published",
          featured: true,
          tags: ["landfill", "costs", "pricing", "guide"],
          featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
          publishedAt: "2024-01-15T10:00:00Z",
          createdAt: "2024-01-15T08:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          title: "Environmental Benefits of Proper Waste Sorting",
          slug: "environmental-benefits-proper-waste-sorting",
          excerpt: "Learn how proper waste sorting at disposal facilities contributes to environmental protection and sustainability.",
          content: "# Environmental Benefits of Proper Waste Sorting\n\nProper waste sorting is one of the most effective ways to reduce environmental impact...",
          author: "Sean Webb",
          status: "draft",
          featured: false,
          tags: ["environment", "recycling", "sustainability"],
          createdAt: "2024-01-14T14:30:00Z",
          updatedAt: "2024-01-14T14:30:00Z",
        },
      ];
      setPosts(samplePosts);
      localStorage.setItem("blogPosts", JSON.stringify(samplePosts));
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      showError("Title is required");
      return false;
    }
    if (!formData.excerpt.trim()) {
      showError("Excerpt is required");
      return false;
    }
    if (!formData.content.trim()) {
      showError("Content is required");
      return false;
    }
    if (formData.status === "scheduled") {
      if (!formData.publishDate || !formData.publishTime) {
        showError("Schedule date and time are required for scheduled posts");
        return false;
      }
      const scheduledDate = new Date(`${formData.publishDate}T${formData.publishTime}`);
      if (scheduledDate <= new Date()) {
        showError("Scheduled date must be in the future");
        return false;
      }
    }
    return true;
  };

  const handleSavePost = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const slug = generateSlug(formData.title);
      const now = new Date().toISOString();

      // Combine date and time for publishedAt
      let publishedAt: string | undefined;
      if (formData.status === "published") {
        if (formData.publishDate && formData.publishTime) {
          publishedAt = new Date(`${formData.publishDate}T${formData.publishTime}`).toISOString();
        } else {
          publishedAt = now;
        }
      } else if (formData.status === "scheduled" && formData.publishDate && formData.publishTime) {
        publishedAt = new Date(`${formData.publishDate}T${formData.publishTime}`).toISOString();
      }

      const postData: BlogPost = {
        id: editingPost?.id || Date.now().toString(),
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        status: formData.status,
        featured: formData.featured,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        featuredImage: formData.featuredImage || undefined,
        publishedAt,
        createdAt: editingPost?.createdAt || now,
        updatedAt: now,
      };

      const updatedPosts = editingPost
        ? posts.map(post => post.id === editingPost.id ? postData : post)
        : [...posts, postData];

      setPosts(updatedPosts);
      localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

      showSuccess(editingPost ? "Post updated successfully!" : "Post created successfully!");
      setShowEditor(false);
      resetForm();
    } catch (error) {
      showError("Failed to save post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);

    // Parse publish date and time
    let publishDate = "";
    let publishTime = "";
    if (post.publishedAt) {
      const date = new Date(post.publishedAt);
      publishDate = date.toISOString().split('T')[0];
      publishTime = date.toTimeString().slice(0, 5);
    }

    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      status: post.status,
      featured: post.featured,
      tags: post.tags.join(", "),
      featuredImage: post.featuredImage || "",
      publishDate,
      publishTime,
    });
    setShowEditor(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    const updatedPosts = posts.filter(post => post.id !== postToDelete.id);
    setPosts(updatedPosts);
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));

    showSuccess("Post deleted successfully!");
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "Sean Webb",
      status: "draft",
      featured: false,
      tags: "",
      featuredImage: "",
      publishDate: "",
      publishTime: "",
    });
    setEditingPost(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Blog Management</h1>
              <p className="text-muted-foreground">
                Create and manage blog posts for your website
              </p>
            </div>
          </div>
          <Button onClick={() => setShowEditor(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold">
                    {posts.filter(post => post.status === "published").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold">
                    {posts.filter(post => post.status === "draft").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Featured</p>
                  <p className="text-2xl font-bold">
                    {posts.filter(post => post.featured).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {post.excerpt.substring(0, 60)}...
                        </div>
                        {post.featured && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPostToDelete(post);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Blog Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
            <DialogDescription>
              Write engaging content for your audience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Photo Upload at Top */}
            <div>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                className="mb-6"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description of the post"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Write your blog post content here. Use the toolbar for formatting options or switch to HTML mode for advanced editing."
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Publish Now</SelectItem>
                    <SelectItem value="scheduled">Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.status === "published" || formData.status === "scheduled") && (
                <>
                  <div>
                    <Label htmlFor="publish-date">
                      {formData.status === "scheduled" ? "Schedule Date *" : "Publish Date"}
                    </Label>
                    <Input
                      id="publish-date"
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="publish-time">
                      {formData.status === "scheduled" ? "Schedule Time *" : "Publish Time"}
                    </Label>
                    <Input
                      id="publish-time"
                      type="time"
                      value={formData.publishTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishTime: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
            </div>

            {formData.status === "scheduled" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Scheduled Publication</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  This post will be automatically published on{" "}
                  {formData.publishDate && formData.publishTime ? (
                    <span className="font-medium">
                      {new Date(`${formData.publishDate}T${formData.publishTime}`).toLocaleString()}
                    </span>
                  ) : (
                    "the selected date and time"
                  )}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSavePost}
              disabled={isLoading || !formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : editingPost ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
