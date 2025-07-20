import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  PenTool,
  Search,
  Download,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  Settings,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

type SortField = keyof BlogPost;
type SortDirection = "asc" | "desc";

interface VisibleColumns {
  title: boolean;
  author: boolean;
  status: boolean;
  featured: boolean;
  tags: boolean;
  publishedAt: boolean;
  createdAt: boolean;
  updatedAt: boolean;
}

export default function BlogDataTable() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastNotifications();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);

  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    title: true,
    author: true,
    status: true,
    featured: true,
    tags: false,
    publishedAt: true,
    createdAt: false,
    updatedAt: true,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setIsLoading(true);
    try {
      const savedPosts = localStorage.getItem("blogPosts");
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
        setFilteredPosts(parsedPosts);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
      showError("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "scheduled", label: "Scheduled" },
  ];

  const featuredOptions = [
    { value: "all", label: "All Posts" },
    { value: "featured", label: "Featured Only" },
    { value: "not-featured", label: "Not Featured" },
  ];

  const pageSizeOptions = [
    { value: 10, label: "10 per page" },
    { value: 25, label: "25 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-2 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-2" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-2" />
    );
  };

  const sortPosts = (posts: BlogPost[]) => {
    return [...posts].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    // Featured filter
    if (featuredFilter !== "all") {
      if (featuredFilter === "featured") {
        filtered = filtered.filter((post) => post.featured);
      } else if (featuredFilter === "not-featured") {
        filtered = filtered.filter((post) => !post.featured);
      }
    }

    // Sort the filtered results
    filtered = sortPosts(filtered);

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterPosts();
  }, [
    searchQuery,
    statusFilter,
    featuredFilter,
    posts,
    sortField,
    sortDirection,
  ]);

  const handleRowClick = (post: BlogPost) => {
    navigate(`/admin/blog`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(currentItems.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, postId]);
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    }
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

  const handleBulkDelete = () => {
    const updatedPosts = posts.filter(post => !selectedPosts.includes(post.id));
    setPosts(updatedPosts);
    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
    setSelectedPosts([]);
    showSuccess(`${selectedPosts.length} posts deleted successfully!`);
  };

  const exportData = () => {
    const csvContent = [
      [
        "ID",
        "Title",
        "Author",
        "Status",
        "Featured",
        "Tags",
        "Published",
        "Created",
        "Updated",
      ].join(","),
      ...filteredPosts.map((post) =>
        [
          post.id,
          `"${post.title}"`,
          post.author,
          post.status,
          post.featured ? "Yes" : "No",
          `"${post.tags.join(", ")}"`,
          post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : "",
          new Date(post.createdAt).toISOString().split("T")[0],
          new Date(post.updatedAt).toISOString().split("T")[0],
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-posts-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredPosts.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog Data Table</h1>
            <p className="text-muted-foreground">
              Manage and view all blog posts with sorting and filtering
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link to="/admin/blog">
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                All Blog Posts ({filteredPosts.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(visibleColumns).map(([key, value]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setVisibleColumns(prev => ({ ...prev, [key]: checked }))
                        }
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadPosts}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {featuredOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                {selectedPosts.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    Delete ({selectedPosts.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Results summary */}
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredPosts.length)} of{" "}
              {filteredPosts.length} posts
            </div>

            {/* Posts Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedPosts.length === currentItems.length && currentItems.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    {visibleColumns.title && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center">
                          Title
                          {getSortIcon("title")}
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.author && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("author")}
                      >
                        <div className="flex items-center">
                          Author
                          {getSortIcon("author")}
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.status && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          Status
                          {getSortIcon("status")}
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.featured && (
                      <TableHead>Featured</TableHead>
                    )}
                    {visibleColumns.tags && (
                      <TableHead>Tags</TableHead>
                    )}
                    {visibleColumns.publishedAt && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("publishedAt")}
                      >
                        <div className="flex items-center">
                          Published
                          {getSortIcon("publishedAt")}
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.createdAt && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center">
                          Created
                          {getSortIcon("createdAt")}
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.updatedAt && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("updatedAt")}
                      >
                        <div className="flex items-center">
                          Updated
                          {getSortIcon("updatedAt")}
                        </div>
                      </TableHead>
                    )}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No posts found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((post) => (
                      <TableRow
                        key={post.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedPosts.includes(post.id)}
                            onCheckedChange={(checked) => handleSelectPost(post.id, checked as boolean)}
                          />
                        </TableCell>
                        {visibleColumns.title && (
                          <TableCell>
                            <div className="font-medium text-primary cursor-pointer" onClick={() => handleRowClick(post)}>
                              {post.title}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {post.excerpt}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.author && (
                          <TableCell>{post.author}</TableCell>
                        )}
                        {visibleColumns.status && (
                          <TableCell>{getStatusBadge(post.status)}</TableCell>
                        )}
                        {visibleColumns.featured && (
                          <TableCell>
                            {post.featured ? (
                              <Badge variant="outline">Featured</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        )}
                        {visibleColumns.tags && (
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {post.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{post.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.publishedAt && (
                          <TableCell>
                            <div className="text-sm">
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString()
                                : "-"}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.createdAt && (
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.updatedAt && (
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {new Date(post.updatedAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/blog/${post.slug}`)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/admin/blog`)}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageSizeOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (postToDelete) {
                    const updatedPosts = posts.filter(post => post.id !== postToDelete.id);
                    setPosts(updatedPosts);
                    localStorage.setItem("blogPosts", JSON.stringify(updatedPosts));
                    setDeleteDialogOpen(false);
                    setPostToDelete(null);
                    showSuccess("Post deleted successfully!");
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
