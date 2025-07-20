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
  Edit,
  Search,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  MapPin,
  Plus,
} from "lucide-react";

interface Suggestion {
  id: string;
  type: "new_location" | "edit_location";
  locationName: string;
  submitter: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  details: any;
}

const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    type: "new_location",
    locationName: "Riverside Recycling Center",
    submitter: "Lisa K.",
    email: "lisa.k@email.com",
    status: "pending",
    submittedAt: "2024-01-20T10:30:00Z",
    details: {
      address: "456 River Road, Portland, OR 97202",
      phone: "(503) 555-0123",
      facilityType: "transfer_station",
      paymentTypes: ["Cash", "Credit Card"],
      debrisTypes: ["General Waste", "Recyclables", "Electronics"],
      operatingHours: "Mon-Fri 7AM-6PM, Sat 8AM-4PM",
      notes: "New eco-friendly facility with advanced recycling capabilities",
    },
  },
  {
    id: "2",
    type: "edit_location",
    locationName: "Downtown Transfer Station",
    submitter: "Tom B.",
    email: "tom.b@email.com",
    status: "approved",
    submittedAt: "2024-01-19T14:15:00Z",
    moderatedAt: "2024-01-19T16:20:00Z",
    moderatedBy: "Admin",
    details: {
      originalData: "Phone: (555) 123-4567",
      suggestedChange: "Phone: (555) 987-6543",
      reason:
        "Phone number has changed - I called and confirmed the new number",
    },
  },
  {
    id: "3",
    type: "new_location",
    locationName: "Metro Waste Facility",
    submitter: "John D.",
    email: "john.d@email.com",
    status: "rejected",
    submittedAt: "2024-01-18T11:45:00Z",
    moderatedAt: "2024-01-18T15:30:00Z",
    moderatedBy: "Admin",
    details: {
      address: "789 Industrial Ave, Chicago, IL 60601",
      phone: "(312) 555-9876",
      facilityType: "landfill",
      paymentTypes: ["Cash"],
      debrisTypes: ["General Waste"],
      operatingHours: "Mon-Fri 8AM-5PM",
      notes: "Large capacity facility",
    },
  },
  {
    id: "4",
    type: "edit_location",
    locationName: "Green Valley Landfill",
    submitter: "Sarah M.",
    email: "sarah.m@email.com",
    status: "pending",
    submittedAt: "2024-01-17T09:20:00Z",
    details: {
      originalData: "Operating Hours: Mon-Fri 7AM-5PM",
      suggestedChange: "Operating Hours: Mon-Fri 7AM-6PM, Sat 8AM-4PM",
      reason: "They extended their hours recently - saw it on their website",
    },
  },
];

export default function SuggestionsTable() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState<Suggestion[]>(mockSuggestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const itemsPerPage = 25;

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "new_location", label: "New Location" },
    { value: "edit_location", label: "Edit Location" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const filterSuggestions = () => {
    let filtered = [...suggestions];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (suggestion) =>
          suggestion.locationName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          suggestion.submitter
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          suggestion.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (suggestion) => suggestion.type === typeFilter,
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (suggestion) => suggestion.status === statusFilter,
      );
    }

    setFilteredSuggestions(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterSuggestions();
  }, [searchQuery, typeFilter, statusFilter, suggestions]);

  const getStatusBadge = (status: Suggestion["status"]) => {
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

  const getTypeBadge = (type: Suggestion["type"]) => {
    switch (type) {
      case "new_location":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Plus className="w-3 h-3" />
            New Location
          </Badge>
        );
      case "edit_location":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Edit className="w-3 h-3" />
            Edit Location
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleViewSuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setViewDialogOpen(true);
  };

  const handleApproveSuggestion = (suggestionId: string) => {
    setSuggestions(
      suggestions.map((suggestion) =>
        suggestion.id === suggestionId
          ? {
              ...suggestion,
              status: "approved" as const,
              moderatedAt: new Date().toISOString(),
              moderatedBy: "Admin",
            }
          : suggestion,
      ),
    );
    setViewDialogOpen(false);
    alert("Suggestion approved successfully!");
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    setSuggestions(
      suggestions.map((suggestion) =>
        suggestion.id === suggestionId
          ? {
              ...suggestion,
              status: "rejected" as const,
              moderatedAt: new Date().toISOString(),
              moderatedBy: "Admin",
            }
          : suggestion,
      ),
    );
    setViewDialogOpen(false);
    alert("Suggestion rejected successfully!");
  };

  const handleDeleteSuggestion = (suggestionId: string) => {
    if (
      confirm("Are you sure you want to permanently delete this suggestion?")
    ) {
      setSuggestions(
        suggestions.filter((suggestion) => suggestion.id !== suggestionId),
      );
      setViewDialogOpen(false);
      alert("Suggestion deleted successfully!");
    }
  };

  const exportData = () => {
    const csvContent = [
      [
        "ID",
        "Type",
        "Location",
        "Submitter",
        "Email",
        "Status",
        "Submitted",
        "Moderated",
      ].join(","),
      ...filteredSuggestions.map((suggestion) =>
        [
          suggestion.id,
          suggestion.type,
          `"${suggestion.locationName}"`,
          `"${suggestion.submitter}"`,
          suggestion.email,
          suggestion.status,
          new Date(suggestion.submittedAt).toISOString().split("T")[0],
          suggestion.moderatedAt
            ? new Date(suggestion.moderatedAt).toISOString().split("T")[0]
            : "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suggestions-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSuggestions.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                All Suggestions ({filteredSuggestions.length})
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
                    placeholder="Search suggestions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            </div>

            {/* Results summary */}
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredSuggestions.length)} of{" "}
              {filteredSuggestions.length} suggestions
            </div>

            {/* Suggestions Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Submitter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No suggestions found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((suggestion) => (
                      <TableRow
                        key={suggestion.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>{getTypeBadge(suggestion.type)}</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {suggestion.locationName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {suggestion.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {suggestion.submitter}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {suggestion.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(suggestion.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(
                              suggestion.submittedAt,
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(
                              suggestion.submittedAt,
                            ).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewSuggestion(suggestion)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {suggestion.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleApproveSuggestion(suggestion.id)
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRejectSuggestion(suggestion.id)
                                  }
                                >
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteSuggestion(suggestion.id)
                              }
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

        {/* View Suggestion Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Suggestion Details</DialogTitle>
              <DialogDescription>
                {selectedSuggestion?.type === "new_location"
                  ? "New location suggestion"
                  : "Location edit suggestion"}{" "}
                for {selectedSuggestion?.locationName} by{" "}
                {selectedSuggestion?.submitter}
              </DialogDescription>
            </DialogHeader>

            {selectedSuggestion && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Submitter</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedSuggestion.submitter}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSuggestion.email}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Type</h4>
                    {getTypeBadge(selectedSuggestion.type)}
                  </div>
                </div>

                {selectedSuggestion.type === "new_location" ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.address}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Contact</h4>
                      <p className="text-sm text-muted-foreground">
                        Phone: {selectedSuggestion.details.phone}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Facility Type</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.facilityType?.replace(
                          "_",
                          " ",
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Operating Hours</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.operatingHours}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Payment Methods</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.paymentTypes?.join(", ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Debris Types</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.debrisTypes?.join(", ")}
                      </p>
                    </div>
                    {selectedSuggestion.details.notes && (
                      <div>
                        <h4 className="font-medium">Notes</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedSuggestion.details.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Current Information</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.originalData}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Suggested Change</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.suggestedChange}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Reason</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.details.reason}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Status</h4>
                    {getStatusBadge(selectedSuggestion.status)}
                  </div>
                  <div>
                    <h4 className="font-medium">Submitted</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        selectedSuggestion.submittedAt,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedSuggestion.moderatedAt && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Moderated By</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedSuggestion.moderatedBy}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Moderated At</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          selectedSuggestion.moderatedAt,
                        ).toLocaleString()}
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
                onClick={() => handleDeleteSuggestion(selectedSuggestion?.id!)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Suggestion
              </Button>
              {selectedSuggestion?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleRejectSuggestion(selectedSuggestion?.id!)
                    }
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() =>
                      handleApproveSuggestion(selectedSuggestion?.id!)
                    }
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
