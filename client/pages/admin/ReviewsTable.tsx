import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Eye,
  CheckCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
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
  {
    id: "5",
    locationName: "Green Valley Landfill",
    locationId: "loc_1",
    author: "Tom B.",
    email: "tom.b@email.com",
    rating: 3,
    title: "Average experience",
    content:
      "Nothing special but gets the job done. Pricing is fair and location is accessible.",
    status: "pending",
    submittedAt: "2024-01-19T14:10:00Z",
  },
];

export default function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const itemsPerPage = 25;

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

    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterReviews();
  }, [searchQuery, statusFilter, ratingFilter, reviews]);

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

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setViewDialogOpen(true);
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
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
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

            {/* Reviews Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No reviews found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((review) => (
                      <TableRow key={review.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">
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
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewReview(review)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {review.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApproveReview(review.id)}
                                >
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRejectReview(review.id)}
                                >
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
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
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
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
            )}
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
                    <h4 className="font-medium">Status</h4>
                    {getStatusBadge(selectedReview.status)}
                  </div>
                  <div>
                    <h4 className="font-medium">Submitted</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedReview.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedReview.moderatedAt && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Moderated By</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedReview.moderatedBy}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Moderated At</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedReview.moderatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
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
