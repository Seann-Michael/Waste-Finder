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
  MapPin,
  Search,
  Download,
  Upload,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Location } from "@/shared/api";

// Fetch locations from server API with localStorage fallback
const fetchLocations = async (): Promise<Location[]> => {
  try {
    const response = await fetch("/api/locations/all");
    if (!response.ok) {
      // If API is not available (404), fallback to localStorage
      if (response.status === 404) {
        throw new Error("API_NOT_FOUND");
      }
      throw new Error("Failed to fetch locations");
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching locations from API:", error);

    // Fallback to localStorage if API is not available
    try {
      const savedLocations = localStorage.getItem("locations");
      if (savedLocations) {
        const locations = JSON.parse(savedLocations);
        console.log("Loaded locations from localStorage:", locations.length, "locations");
        return Array.isArray(locations) ? locations : [];
      }
    } catch (localStorageError) {
      console.error("Error loading from localStorage:", localStorageError);
    }

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
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    address: true,
    type: true,
    status: true,
    phone: true,
    lastUpdated: true,
  });

  useEffect(() => {
    const loadLocations = async () => {
      console.log("LocationDataTable: Starting to load locations...");
      setIsLoading(true);
      try {
        const data = await fetchLocations();
        console.log("LocationDataTable: Loaded locations:", data.length, "locations");
        console.log("LocationDataTable: First location:", data[0]);
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

  const refreshLocations = async () => {
    console.log("Manually refreshing locations...");
    setIsLoading(true);
    try {
      const data = await fetchLocations();
      console.log("Manual refresh: Loaded locations:", data.length, "locations");
      setLocations(data);
      setFilteredLocations(data);
    } catch (error) {
      console.error("Failed to refresh locations:", error);
    } finally {
      setIsLoading(false);
    }
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
      filtered = filtered.filter((location) => location.locationType === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((location) => location.isActive);
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((location) => !location.isActive);
      }
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
    navigate(`/location/${location.id}`);
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Active
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Inactive
        </Badge>
      );
    }
  };

  const getTypeBadge = (type: Location["locationType"]) => {
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
          location.locationType,
          location.phone,
          location.isActive ? "active" : "inactive",
          new Date(location.createdAt).toISOString().split("T")[0],
          new Date(location.updatedAt).toISOString().split("T")[0],
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLocations(currentItems.map(location => location.id));
    } else {
      setSelectedLocations([]);
    }
  };

  const handleSelectLocation = (locationId: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations(prev => [...prev, locationId]);
    } else {
      setSelectedLocations(prev => prev.filter(id => id !== locationId));
    }
  };

  const handleBulkDelete = () => {
    const updatedLocations = locations.filter(location => !selectedLocations.includes(location.id));
    setLocations(updatedLocations);
    setSelectedLocations([]);
    // In a real app, you'd make an API call here
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Locations</h1>
            <p className="text-muted-foreground">
              Manage all facility locations and their information
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/admin/add-location">
              <MapPin className="w-4 h-4 mr-2" />
              Add New Location
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                All Locations ({filteredLocations.length})
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
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
                  onClick={refreshLocations}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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

            {/* Results summary and bulk actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredLocations.length)} of{" "}
                {filteredLocations.length} locations
                {selectedLocations.length > 0 && (
                  <span className="ml-2 text-primary">
                    • {selectedLocations.length} selected
                  </span>
                )}
              </div>
              {selectedLocations.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    Delete ({selectedLocations.length})
                  </Button>
                </div>
              )}
            </div>

            {/* Location Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedLocations.length === currentItems.length && currentItems.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    {visibleColumns.name && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center">
                          Name
                          {getSortIcon("name")}
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.address && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("address")}
                      >
                        <div className="flex items-center">
                          Address
                          {getSortIcon("address")}
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.type && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("type")}
                      >
                        <div className="flex items-center">
                          Type
                          {getSortIcon("type")}
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
                    {visibleColumns.phone && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("phone")}
                      >
                        <div className="flex items-center">
                          Phone
                          {getSortIcon("phone")}
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.lastUpdated && (
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("lastUpdated")}
                      >
                        <div className="flex items-center">
                          Last Updated
                          {getSortIcon("lastUpdated")}
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
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No locations found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((location) => (
                      <TableRow
                        key={location.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedLocations.includes(location.id)}
                            onCheckedChange={(checked) => handleSelectLocation(location.id, checked as boolean)}
                          />
                        </TableCell>
                        {visibleColumns.name && (
                          <TableCell
                            className="cursor-pointer"
                            onClick={() => handleRowClick(location)}
                          >
                            <div className="font-medium text-primary">
                              {location.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: {location.id}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.address && (
                          <TableCell>
                            <div className="text-sm">
                              {location.address}
                              <br />
                              {location.city}, {location.state} {location.zipCode}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.type && (
                          <TableCell>{getTypeBadge(location.locationType)}</TableCell>
                        )}
                        {visibleColumns.status && (
                          <TableCell>{getStatusBadge(location.isActive)}</TableCell>
                        )}
                        {visibleColumns.phone && (
                          <TableCell>
                            <div className="text-sm">{location.phone}</div>
                          </TableCell>
                        )}
                        {visibleColumns.lastUpdated && (
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {new Date(
                                location.updatedAt,
                              ).toLocaleDateString()}
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRowClick(location)}
                            >
                              Edit
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
