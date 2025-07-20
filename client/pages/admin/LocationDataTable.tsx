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
  MapPin,
  Search,
  Download,
  Upload,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Location } from "@/shared/api";

// Fetch locations from server API
const fetchLocations = async (): Promise<Location[]> => {
  try {
    const response = await fetch("/api/locations/all");
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

// Mock data removed - now fetching from API

type SortField = keyof Location;
type SortDirection = "asc" | "desc";

export default function LocationDataTable() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [pageSize, setPageSize] = useState(25);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLocations();
        setLocations(data);
        setFilteredLocations(data);
      } catch (error) {
        console.error("Failed to load locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "landfill", label: "Landfill" },
    { value: "transfer_station", label: "Transfer Station" },
    { value: "construction_landfill", label: "Construction Landfill" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
  ];

  const pageSizeOptions = [
    { value: 10, label: "10 per page" },
    { value: 25, label: "25 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];

  const usStates = [
    { value: "all", label: "All States" },
    { value: "AL", label: "AL" },
    { value: "AK", label: "AK" },
    { value: "AZ", label: "AZ" },
    // ... (abbreviated for brevity, would include all states)
    { value: "IL", label: "IL" },
    { value: "TX", label: "TX" },
    { value: "CA", label: "CA" },
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

  const sortLocations = (locations: Location[]) => {
    return [...locations].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  const filterLocations = () => {
    let filtered = [...locations];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.zipCode.includes(searchQuery) ||
          location.phone.includes(searchQuery),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((location) => location.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (location) => location.status === statusFilter,
      );
    }

    // State filter
    if (stateFilter !== "all") {
      filtered = filtered.filter((location) => location.state === stateFilter);
    }

    // Sort the filtered results
    filtered = sortLocations(filtered);

    setFilteredLocations(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterLocations();
  }, [
    searchQuery,
    typeFilter,
    statusFilter,
    stateFilter,
    locations,
    sortField,
    sortDirection,
  ]);

  const handleRowClick = (location: Location) => {
    navigate(`/admin/edit-location/${location.id}`);
  };

  const getStatusBadge = (status: Location["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: Location["type"]) => {
    switch (type) {
      case "landfill":
        return <Badge variant="outline">Landfill</Badge>;
      case "transfer_station":
        return <Badge variant="outline">Transfer Station</Badge>;
      case "construction_landfill":
        return <Badge variant="outline">Construction Landfill</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const exportData = () => {
    const csvContent = [
      [
        "ID",
        "Name",
        "Address",
        "City",
        "State",
        "ZIP",
        "Type",
        "Phone",
        "Status",
        "Created",
        "Last Updated",
      ].join(","),
      ...filteredLocations.map((location) =>
        [
          location.id,
          `"${location.name}"`,
          `"${location.address}"`,
          location.city,
          location.state,
          location.zipCode,
          location.type,
          location.phone,
          location.status,
          new Date(location.createdAt).toISOString().split("T")[0],
          new Date(location.lastUpdated).toISOString().split("T")[0],
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `locations-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    navigate("/admin/bulk-upload");
  };

  const handleDelete = (location: Location) => {
    setSelectedLocation(location);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedLocation) {
      setLocations(locations.filter((loc) => loc.id !== selectedLocation.id));
      setDeleteDialogOpen(false);
      setSelectedLocation(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredLocations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredLocations.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Location Data Table</h1>
            <p className="text-muted-foreground">
              Manage all facility locations and their information
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/add-location">
              <MapPin className="w-4 h-4 mr-2" />
              Add New Location
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                All Locations ({filteredLocations.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleImport}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm" onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
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
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {usStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results summary */}
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredLocations.length)} of{" "}
              {filteredLocations.length} locations
            </div>

            {/* Location Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {getSortIcon("name")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("address")}
                    >
                      <div className="flex items-center">
                        Address
                        {getSortIcon("address")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center">
                        Type
                        {getSortIcon("type")}
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
                      onClick={() => handleSort("phone")}
                    >
                      <div className="flex items-center">
                        Phone
                        {getSortIcon("phone")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("lastUpdated")}
                    >
                      <div className="flex items-center">
                        Last Updated
                        {getSortIcon("lastUpdated")}
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
                        No locations found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((location) => (
                      <TableRow
                        key={location.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleRowClick(location)}
                      >
                        <TableCell>
                          <div className="font-medium text-primary">
                            {location.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {location.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {location.address}
                            <br />
                            {location.city}, {location.state} {location.zipCode}
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(location.type)}</TableCell>
                        <TableCell>{getStatusBadge(location.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">{location.phone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date(
                              location.lastUpdated,
                            ).toLocaleDateString()}
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
              <DialogTitle>Delete Location</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedLocation?.name}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
