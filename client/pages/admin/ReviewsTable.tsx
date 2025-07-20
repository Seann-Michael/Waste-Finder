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
  MessageSquare,
  Search,
  Download,
  CheckCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

interface Review {
  id: string;
  locationName: string;
  locationId: string;
  author: string;
  email: string;
  rating: number;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    locationName: "Green Valley Landfill",
    locationId: "loc_1",
    author: "John D.",
    email: "john.d@email.com",
    rating: 4,
    title: "Good service overall",
    content:
      "Great service and fair pricing. The staff was helpful and the facility was well-organized.",
    status: "pending",
    submittedAt: "2024-01-20T12:30:00Z",
  },
  {
    id: "2",
    locationName: "Metro Transfer Station",
    locationId: "loc_2",
    author: "Sarah M.",
    email: "sarah.m@email.com",
    rating: 5,
    title: "Excellent facility",
    content:
      "Very clean facility with helpful staff. They have clear signage and the pricing is transparent.",
    status: "approved",
    submittedAt: "2024-01-20T10:15:00Z",
    moderatedAt: "2024-01-20T14:20:00Z",
    moderatedBy: "Admin",
  },
  {
    id: "3",
    locationName: "Capitol Construction Landfill",
    locationId: "loc_3",
    author: "Mike R.",
    email: "mike.r@email.com",
    rating: 2,
    title: "Poor experience",
    content:
      "Long wait times and poor signage made this visit frustrating. The staff seemed overwhelmed.",
    status: "rejected",
    submittedAt: "2024-01-20T08:45:00Z",
    moderatedAt: "2024-01-20T13:10:00Z",
    moderatedBy: "Admin",
  },
  {
    id: "4",
    locationName: "Downtown Transfer Station",
    locationId: "loc_4",
    author: "Lisa K.",
    email: "lisa.k@email.com",
    rating: 5,
    title: "Perfect location",
    content:
      "Convenient location with fast service. The electronic waste recycling program is excellent.",
    status: "approved",
    submittedAt: "2024-01-19T16:20:00Z",
    moderatedAt: "2024-01-19T18:30:00Z",
    moderatedBy: "Admin",
  },
];

type SortField = keyof Review;
type SortDirection = "asc" | "desc";

export default function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("submittedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pageSize, setPageSize] = useState(25);

  // Bulk selection state
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<
    "approve" | "reject" | "delete" | null
  >(null);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
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

  const sortReviews = (reviews: Review[]) => {
    return [...reviews].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (review) =>
          review.locationName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.content.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((review) => review.status === statusFilter);
    }

    // Rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.rating.toString() === ratingFilter,
      );
    }

    // Sort the filtered results
    filtered = sortReviews(filtered);

    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterReviews();
  }, [
    searchQuery,
    statusFilter,
    ratingFilter,
    reviews,
    sortField,
    sortDirection,
  ]);

  const handleRowClick = (review: Review) => {
    setSelectedReview(review);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: Review["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApproveReview = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              status: "approved" as const,
              moderatedAt: new Date().toISOString(),
              moderatedBy: "Admin",
            }
          : review,
      ),
    );
    setViewDialogOpen(false);
    alert("Review approved successfully!");
  };

  const handleRejectReview = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              status: "rejected" as const,
              moderatedAt: new Date().toISOString(),
              moderatedBy: "Admin",
            }
          : review,
      ),
    );
    setViewDialogOpen(false);
    alert("Review rejected successfully!");
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Are you sure you want to permanently delete this review?")) {
      setReviews(reviews.filter((review) => review.id !== reviewId));
      setViewDialogOpen(false);
      alert("Review deleted successfully!");
    }
  };

  // Bulk action handlers
  const handleSelectAllReviews = (checked: boolean) => {
    if (checked) {
      setSelectedReviews(paginatedReviews.map((review) => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (reviewId: string, checked: boolean) => {
    if (checked) {
      setSelectedReviews([...selectedReviews, reviewId]);
    } else {
      setSelectedReviews(selectedReviews.filter((id) => id !== reviewId));
    }
  };

  const handleBulkAction = (action: "approve" | "reject" | "delete") => {
    setBulkAction(action);
    setBulkActionDialogOpen(true);
  };

  const executeBulkAction = () => {
    if (!bulkAction || selectedReviews.length === 0) return;

    switch (bulkAction) {
      case "approve":
        setReviews(
          reviews.map((review) =>
            selectedReviews.includes(review.id)
              ? {
                  ...review,
                  status: "approved" as const,
                  moderatedAt: new Date().toISOString(),
                  moderatedBy: "Admin",
                }
              : review,
          ),
        );
        alert(`${selectedReviews.length} reviews approved successfully!`);
        break;
      case "reject":
        setReviews(
          reviews.map((review) =>
            selectedReviews.includes(review.id)
              ? {
                  ...review,
                  status: "rejected" as const,
                  moderatedAt: new Date().toISOString(),
                  moderatedBy: "Admin",
                }
              : review,
          ),
        );
        alert(`${selectedReviews.length} reviews rejected successfully!`);
        break;
      case "delete":
        setReviews(
          reviews.filter((review) => !selectedReviews.includes(review.id)),
        );
        alert(`${selectedReviews.length} reviews deleted successfully!`);
        break;
    }

    setSelectedReviews([]);
    setBulkActionDialogOpen(false);
    setBulkAction(null);
  };

  const exportData = () => {
    const csvContent = [
      [
        "ID",
        "Location",
        "Author",
        "Email",
        "Rating",
        "Title",
        "Content",
        "Status",
        "Submitted",
        "Moderated",
      ].join(","),
      ...filteredReviews.map((review) =>
        [
          review.id,
          `"${review.locationName}"`,
          `"${review.author}"`,
          review.email,
          review.rating,
          `"${review.title}"`,
          `"${review.content.replace(/"/g, '""')}"`,
          review.status,
          new Date(review.submittedAt).toISOString().split("T")[0],
          review.moderatedAt
            ? new Date(review.moderatedAt).toISOString().split("T")[0]
            : "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviews-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredReviews.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                All Reviews ({filteredReviews.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
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
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((rating) => (
                    <SelectItem key={rating.value} value={rating.value}>
                      {rating.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results summary */}
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredReviews.length)} of{" "}
              {filteredReviews.length} reviews
            </div>

            {/* Bulk Actions */}
            {selectedReviews.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedReviews.length} selected
                </span>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("approve")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction("reject")}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("delete")}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedReviews([])}
                >
                  Clear Selection
                </Button>
              </div>
            )}

            {/* Reviews Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedReviews.length === paginatedReviews.length &&
                          paginatedReviews.length > 0
                        }
                        onCheckedChange={(checked) =>
                          handleSelectAllReviews(checked as boolean)
                        }
                      />
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("locationName")}
                    >
                      <div className="flex items-center">
                        Location
                        {getSortIcon("locationName")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("author")}
                    >
                      <div className="flex items-center">
                        Author
                        {getSortIcon("author")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("rating")}
                    >
                      <div className="flex items-center">
                        Rating
                        {getSortIcon("rating")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Title
                        {getSortIcon("title")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon("status")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("submittedAt")}
                    >
                      <div className="flex items-center">
                        Submitted
                        {getSortIcon("submittedAt")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No reviews found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((review) => (
                      <TableRow
                        key={review.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleRowClick(review)}
                      >
                        <TableCell>
                          <div className="font-medium text-primary">
                            {review.locationName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {review.locationId}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{review.author}</div>
                          <div className="text-xs text-muted-foreground">
                            {review.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }, (_, i) => (
                              <div
                                key={i}
                                className="w-3 h-3 bg-yellow-400 rounded-full"
                              ></div>
                            ))}
                            <span className="text-sm ml-1">
                              {review.rating}/5
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">
                            {review.title}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {review.content}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(review.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(review.submittedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.submittedAt).toLocaleTimeString()}
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

        {/* View Review Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
              <DialogDescription>
                Review for {selectedReview?.locationName} by{" "}
                {selectedReview?.author}
              </DialogDescription>
            </DialogHeader>

            {selectedReview && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Author</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedReview.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedReview.email}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Rating</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from(
                          { length: selectedReview.rating },
                          (_, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 bg-yellow-400 rounded-full mr-1"
                            ></div>
                          ),
                        )}
                      </div>
                      <span className="text-sm">
                        {selectedReview.rating}/5 stars
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Review Title</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.title}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Review Content</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedReview.content}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedReview.locationName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Status</h4>
                    {getStatusBadge(selectedReview.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Submitted</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedReview.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedReview.moderatedAt && (
                    <div>
                      <h4 className="font-medium">Moderated</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedReview.moderatedAt).toLocaleString()}{" "}
                        by {selectedReview.moderatedBy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteReview(selectedReview?.id!)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Review
              </Button>
              {selectedReview?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleRejectReview(selectedReview?.id!)}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApproveReview(selectedReview?.id!)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
