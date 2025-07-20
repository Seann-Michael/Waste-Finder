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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Filter,
  Download,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: "landfill" | "transfer_station" | "construction_landfill";
  phone: string;
  operatingHours: string;
  paymentMethods: string[];
  debrisTypes: string[];
  status: "active" | "inactive" | "pending";
  createdAt: string;
  lastUpdated: string;
}

const mockLocations: Location[] = [
  {
    id: "1",
    name: "Green Valley Landfill",
    address: "123 Waste Management Dr",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    type: "landfill",
    phone: "(555) 123-4567",
    operatingHours: "Mon-Fri 7AM-6PM, Sat 8AM-4PM",
    paymentMethods: ["Cash", "Credit Card", "Check"],
    debrisTypes: ["General Waste", "Construction", "Yard Waste"],
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-01-20T14:20:00Z",
  },
  {
    id: "2",
    name: "Metro Transfer Station",
    address: "456 Industrial Blvd",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    type: "transfer_station",
    phone: "(555) 987-6543",
    operatingHours: "Mon-Sat 6AM-7PM",
    paymentMethods: ["Cash", "Credit Card"],
    debrisTypes: ["General Waste", "Recyclables"],
    status: "active",
    createdAt: "2024-01-10T09:15:00Z",
    lastUpdated: "2024-01-18T11:45:00Z",
  },
  {
    id: "3",
    name: "Capitol Construction Landfill",
    address: "789 Construction Way",
    city: "Peoria",
    state: "IL",
    zipCode: "61602",
    type: "construction_landfill",
    phone: "(555) 456-7890",
    operatingHours: "Mon-Fri 6AM-6PM",
    paymentMethods: ["Cash", "Credit Card", "Account"],
    debrisTypes: ["Construction", "Demolition", "Concrete"],
    status: "active",
    createdAt: "2024-01-12T14:00:00Z",
    lastUpdated: "2024-01-19T16:30:00Z",
  },
];

export default function LocationDataTable() {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [filteredLocations, setFilteredLocations] =
    useState<Location[]>(mockLocations);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const itemsPerPage = 25;

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

  const usStates = [
    { value: "all", label: "All States" },
    { value: "AL", label: "AL" },
    { value: "AK", label: "AK" },
    { value: "AZ", label: "AZ" },
    { value: "AR", label: "AR" },
    { value: "CA", label: "CA" },
    { value: "CO", label: "CO" },
    { value: "CT", label: "CT" },
    { value: "DE", label: "DE" },
    { value: "FL", label: "FL" },
    { value: "GA", label: "GA" },
    { value: "HI", label: "HI" },
    { value: "ID", label: "ID" },
    { value: "IL", label: "IL" },
    { value: "IN", label: "IN" },
    { value: "IA", label: "IA" },
    { value: "KS", label: "KS" },
    { value: "KY", label: "KY" },
    { value: "LA", label: "LA" },
    { value: "ME", label: "ME" },
    { value: "MD", label: "MD" },
    { value: "MA", label: "MA" },
    { value: "MI", label: "MI" },
    { value: "MN", label: "MN" },
    { value: "MS", label: "MS" },
    { value: "MO", label: "MO" },
    { value: "MT", label: "MT" },
    { value: "NE", label: "NE" },
    { value: "NV", label: "NV" },
    { value: "NH", label: "NH" },
    { value: "NJ", label: "NJ" },
    { value: "NM", label: "NM" },
    { value: "NY", label: "NY" },
    { value: "NC", label: "NC" },
    { value: "ND", label: "ND" },
    { value: "OH", label: "OH" },
    { value: "OK", label: "OK" },
    { value: "OR", label: "OR" },
    { value: "PA", label: "PA" },
    { value: "RI", label: "RI" },
    { value: "SC", label: "SC" },
    { value: "SD", label: "SD" },
    { value: "TN", label: "TN" },
    { value: "TX", label: "TX" },
    { value: "UT", label: "UT" },
    { value: "VT", label: "VT" },
    { value: "VA", label: "VA" },
    { value: "WA", label: "WA" },
    { value: "WV", label: "WV" },
    { value: "WI", label: "WI" },
    { value: "WY", label: "WY" },
  ];

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

    setFilteredLocations(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterLocations();
  }, [searchQuery, typeFilter, statusFilter, stateFilter, locations]);

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
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredLocations.slice(startIndex, endIndex);

  return (
    <AdminLayout>
      <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              All Locations ({filteredLocations.length})
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
              <Button size="sm" asChild>
                <Link to="/admin/add-location">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Link>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No locations found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((location) => (
                    <TableRow key={location.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{location.name}</div>
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
                          {new Date(location.lastUpdated).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/location/${location.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/edit-location/${location.id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(location)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
  );
}