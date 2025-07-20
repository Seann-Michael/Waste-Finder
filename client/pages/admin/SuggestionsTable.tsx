import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CheckCircle,
  AlertTriangle,
  Trash2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Plus,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuggestedEdit {
  id: string;
  type: "edit_location";
  locationName: string;
  locationId: string;
  submitter: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  field: string;
  currentValue: string;
  suggestedValue: string;
  reason: string;
}

interface SuggestedLocation {
  id: string;
  type: "new_location";
  locationName: string;
  submitter: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  details: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string;
    email?: string;
    website?: string;
    facilityType: string;
    paymentTypes: string[];
    debrisTypes: string[];
    operatingHours?: string;
    notes?: string;
  };
}

const mockSuggestedEdits: SuggestedEdit[] = [
  {
    id: "edit_1",
    type: "edit_location",
    locationName: "Green Valley Landfill",
    locationId: "loc_1",
    submitter: "John D.",
    email: "john.d@email.com",
    status: "pending",
    submittedAt: "2024-01-20T14:30:00Z",
    field: "phone",
    currentValue: "(555) 123-4567",
    suggestedValue: "(555) 123-9999",
    reason: "Phone number has changed - I called and confirmed the new number",
  },
  {
    id: "edit_2",
    type: "edit_location",
    locationName: "Metro Transfer Station",
    locationId: "loc_2",
    submitter: "Sarah M.",
    email: "sarah.m@email.com",
    status: "approved",
    submittedAt: "2024-01-19T11:20:00Z",
    moderatedAt: "2024-01-19T15:45:00Z",
    moderatedBy: "Admin",
    field: "operatingHours",
    currentValue: "Mon-Fri 7AM-5PM",
    suggestedValue: "Mon-Fri 7AM-6PM, Sat 8AM-4PM",
    reason: "They extended their hours recently - saw it on their website",
  },
];

const mockSuggestedLocations: SuggestedLocation[] = [
  {
    id: "new_1",
    type: "new_location",
    locationName: "Riverside Recycling Center",
    submitter: "Lisa K.",
    email: "lisa.k@email.com",
    status: "pending",
    submittedAt: "2024-01-20T10:30:00Z",
    details: {
      address: "456 River Road",
      city: "Portland",
      state: "OR",
      zipCode: "97202",
      phone: "(503) 555-0123",
      email: "info@riverside.com",
      website: "https://riverside-recycling.com",
      facilityType: "transfer_station",
      paymentTypes: ["Cash", "Credit Card"],
      debrisTypes: ["General Waste", "Recyclables", "Electronics"],
      operatingHours: "Mon-Fri 7AM-6PM, Sat 8AM-4PM",
      notes: "New eco-friendly facility with advanced recycling capabilities",
    },
  },
  {
    id: "new_2",
    type: "new_location",
    locationName: "Metro Waste Facility",
    submitter: "Tom B.",
    email: "tom.b@email.com",
    status: "rejected",
    submittedAt: "2024-01-18T16:15:00Z",
    moderatedAt: "2024-01-19T09:30:00Z",
    moderatedBy: "Admin",
    details: {
      address: "789 Industrial Ave",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      phone: "(312) 555-9876",
      facilityType: "landfill",
      paymentTypes: ["Cash"],
      debrisTypes: ["General Waste"],
      operatingHours: "Mon-Fri 8AM-5PM",
      notes: "Large capacity facility",
    },
  },
];

type SortDirection = "asc" | "desc";

export default function SuggestionsTable() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("edits");

  // Suggested Edits State
  const [suggestedEdits, setSuggestedEdits] =
    useState<SuggestedEdit[]>(mockSuggestedEdits);
  const [filteredEdits, setFilteredEdits] =
    useState<SuggestedEdit[]>(mockSuggestedEdits);
  const [editsSearchQuery, setEditsSearchQuery] = useState("");
  const [editsStatusFilter, setEditsStatusFilter] = useState("all");
  const [editsCurrentPage, setEditsCurrentPage] = useState(1);
  const [editsSortField, setEditsSortField] =
    useState<keyof SuggestedEdit>("submittedAt");
  const [editsSortDirection, setEditsSortDirection] =
    useState<SortDirection>("desc");
  const [editsPageSize, setEditsPageSize] = useState(25);

  // Suggested Locations State
  const [suggestedLocations, setSuggestedLocations] = useState<
    SuggestedLocation[]
  >(mockSuggestedLocations);
  const [filteredLocations, setFilteredLocations] = useState<
    SuggestedLocation[]
  >(mockSuggestedLocations);
  const [locationsSearchQuery, setLocationsSearchQuery] = useState("");
  const [locationsStatusFilter, setLocationsStatusFilter] = useState("all");
  const [locationsCurrentPage, setLocationsCurrentPage] = useState(1);
  const [locationsSortField, setLocationsSortField] =
    useState<keyof SuggestedLocation>("submittedAt");
  const [locationsSortDirection, setLocationsSortDirection] =
    useState<SortDirection>("desc");
  const [locationsPageSize, setLocationsPageSize] = useState(25);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const pageSizeOptions = [
    { value: 10, label: "10 per page" },
    { value: 25, label: "25 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];

  // Sort and filter functions for edits
  const handleEditsSort = (field: keyof SuggestedEdit) => {
    if (editsSortField === field) {
      setEditsSortDirection(editsSortDirection === "asc" ? "desc" : "asc");
    } else {
      setEditsSortField(field);
      setEditsSortDirection("asc");
    }
  };

  const getSortIcon = (
    field: string,
    currentField: string,
    direction: SortDirection,
  ) => {
    if (currentField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-2 text-gray-400" />;
    }
    return direction === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-2" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-2" />
    );
  };

  const filterEdits = () => {
    let filtered = [...suggestedEdits];

    if (editsSearchQuery.trim()) {
      filtered = filtered.filter(
        (edit) =>
          edit.locationName
            .toLowerCase()
            .includes(editsSearchQuery.toLowerCase()) ||
          edit.submitter
            .toLowerCase()
            .includes(editsSearchQuery.toLowerCase()) ||
          edit.field.toLowerCase().includes(editsSearchQuery.toLowerCase()) ||
          edit.reason.toLowerCase().includes(editsSearchQuery.toLowerCase()),
      );
    }

    if (editsStatusFilter !== "all") {
      filtered = filtered.filter((edit) => edit.status === editsStatusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[editsSortField];
      const bValue = b[editsSortField];
      let comparison = 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return editsSortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredEdits(filtered);
    setEditsCurrentPage(1);
  };

  // Sort and filter functions for locations
  const handleLocationsSort = (field: keyof SuggestedLocation) => {
    if (locationsSortField === field) {
      setLocationsSortDirection(
        locationsSortDirection === "asc" ? "desc" : "asc",
      );
    } else {
      setLocationsSortField(field);
      setLocationsSortDirection("asc");
    }
  };

  const filterLocations = () => {
    let filtered = [...suggestedLocations];

    if (locationsSearchQuery.trim()) {
      filtered = filtered.filter(
        (location) =>
          location.locationName
            .toLowerCase()
            .includes(locationsSearchQuery.toLowerCase()) ||
          location.submitter
            .toLowerCase()
            .includes(locationsSearchQuery.toLowerCase()) ||
          location.details.address
            .toLowerCase()
            .includes(locationsSearchQuery.toLowerCase()),
      );
    }

    if (locationsStatusFilter !== "all") {
      filtered = filtered.filter(
        (location) => location.status === locationsStatusFilter,
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[locationsSortField];
      const bValue = b[locationsSortField];
      let comparison = 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }

      return locationsSortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredLocations(filtered);
    setLocationsCurrentPage(1);
  };

  useEffect(() => {
    filterEdits();
  }, [
    editsSearchQuery,
    editsStatusFilter,
    suggestedEdits,
    editsSortField,
    editsSortDirection,
  ]);

  useEffect(() => {
    filterLocations();
  }, [
    locationsSearchQuery,
    locationsStatusFilter,
    suggestedLocations,
    locationsSortField,
    locationsSortDirection,
  ]);

  const handleEditRowClick = (edit: SuggestedEdit) => {
    // Navigate to location edit page with suggested changes
    navigate(`/admin/edit-location/${edit.locationId}?suggestion=${edit.id}`);
  };

  const handleLocationRowClick = (location: SuggestedLocation) => {
    // Navigate to draft location page
    navigate(`/admin/preview-location/${location.id}`);
  };

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
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

  const exportEdits = () => {
    const csvContent = [
      [
        "ID",
        "Location",
        "Field",
        "Current Value",
        "Suggested Value",
        "Submitter",
        "Status",
        "Submitted",
      ].join(","),
      ...filteredEdits.map((edit) =>
        [
          edit.id,
          `"${edit.locationName}"`,
          edit.field,
          `"${edit.currentValue}"`,
          `"${edit.suggestedValue}"`,
          `"${edit.submitter}"`,
          edit.status,
          new Date(edit.submittedAt).toISOString().split("T")[0],
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suggested-edits-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportLocations = () => {
    const csvContent = [
      [
        "ID",
        "Name",
        "Address",
        "City",
        "State",
        "ZIP",
        "Submitter",
        "Status",
        "Submitted",
      ].join(","),
      ...filteredLocations.map((location) =>
        [
          location.id,
          `"${location.locationName}"`,
          `"${location.details.address}"`,
          location.details.city,
          location.details.state,
          location.details.zipCode,
          `"${location.submitter}"`,
          location.status,
          new Date(location.submittedAt).toISOString().split("T")[0],
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suggested-locations-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Pagination calculations for edits
  const editsTotalPages = Math.ceil(filteredEdits.length / editsPageSize);
  const editsStartIndex = (editsCurrentPage - 1) * editsPageSize;
  const editsEndIndex = editsStartIndex + editsPageSize;
  const editsCurrentItems = filteredEdits.slice(editsStartIndex, editsEndIndex);

  // Pagination calculations for locations
  const locationsTotalPages = Math.ceil(
    filteredLocations.length / locationsPageSize,
  );
  const locationsStartIndex = (locationsCurrentPage - 1) * locationsPageSize;
  const locationsEndIndex = locationsStartIndex + locationsPageSize;
  const locationsCurrentItems = filteredLocations.slice(
    locationsStartIndex,
    locationsEndIndex,
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Suggestions</h1>
              <p className="text-muted-foreground">
                Manage suggested edits and new location submissions
              </p>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edits" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Suggested Edits ({filteredEdits.length})
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Suggested Locations ({filteredLocations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edits" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Suggested Edits</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportEdits}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters for Edits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search suggested edits..."
                        value={editsSearchQuery}
                        onChange={(e) => setEditsSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={editsStatusFilter}
                    onValueChange={setEditsStatusFilter}
                  >
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
                  Showing {editsStartIndex + 1}-
                  {Math.min(editsEndIndex, filteredEdits.length)} of{" "}
                  {filteredEdits.length} suggested edits
                </div>

                {/* Edits Table */}
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleEditsSort("locationName")}
                        >
                          <div className="flex items-center">
                            Location
                            {getSortIcon(
                              "locationName",
                              editsSortField,
                              editsSortDirection,
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleEditsSort("field")}
                        >
                          <div className="flex items-center">
                            Field
                            {getSortIcon(
                              "field",
                              editsSortField,
                              editsSortDirection,
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Current → Suggested</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleEditsSort("submitter")}
                        >
                          <div className="flex items-center">
                            Submitter
                            {getSortIcon(
                              "submitter",
                              editsSortField,
                              editsSortDirection,
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleEditsSort("status")}
                        >
                          <div className="flex items-center">
                            Status
                            {getSortIcon(
                              "status",
                              editsSortField,
                              editsSortDirection,
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleEditsSort("submittedAt")}
                        >
                          <div className="flex items-center">
                            Submitted
                            {getSortIcon(
                              "submittedAt",
                              editsSortField,
                              editsSortDirection,
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editsCurrentItems.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No suggested edits found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        editsCurrentItems.map((edit) => (
                          <TableRow
                            key={edit.id}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleEditRowClick(edit)}
                          >
                            <TableCell>
                              <div className="font-medium text-primary">
                                {edit.locationName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {edit.locationId}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{edit.field}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm line-through text-muted-foreground">
                                  {edit.currentValue}
                                </div>
                                <div className="text-sm font-medium text-green-600">
                                  {edit.suggestedValue}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {edit.submitter}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {edit.email}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(edit.status)}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(
                                  edit.submittedAt,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(
                                  edit.submittedAt,
                                ).toLocaleTimeString()}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination for Edits */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {editsCurrentPage} of {editsTotalPages}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Select
                        value={editsPageSize.toString()}
                        onValueChange={(value) => {
                          setEditsPageSize(Number(value));
                          setEditsCurrentPage(1);
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
                          setEditsCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={editsCurrentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditsCurrentPage((prev) =>
                            Math.min(editsTotalPages, prev + 1),
                          )
                        }
                        disabled={editsCurrentPage === editsTotalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Suggested Locations</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportLocations}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters for Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search suggested locations..."
                        value={locationsSearchQuery}
                        onChange={(e) =>
                          setLocationsSearchQuery(e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select
                    value={locationsStatusFilter}
                    onValueChange={setLocationsStatusFilter}
                  >
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
                  Showing {locationsStartIndex + 1}-
                  {Math.min(locationsEndIndex, filteredLocations.length)} of{" "}
                  {filteredLocations.length} suggested locations
                </div>

                {/* Locations Table */}
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleLocationsSort("locationName")}
                        >
                          <div className="flex items-center">
                            Location Name
                            {getSortIcon(
                              "locationName",
                              locationsSortField,
                              locationsSortDirection,
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleLocationsSort("submitter")}
                        >
                          <div className="flex items-center">
                            Submitter
                            {getSortIcon(
                              "submitter",
                              locationsSortField,
                              locationsSortDirection,
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleLocationsSort("status")}
                        >
                          <div className="flex items-center">
                            Status
                            {getSortIcon(
                              "status",
                              locationsSortField,
                              locationsSortDirection,
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleLocationsSort("submittedAt")}
                        >
                          <div className="flex items-center">
                            Submitted
                            {getSortIcon(
                              "submittedAt",
                              locationsSortField,
                              locationsSortDirection,
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locationsCurrentItems.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No suggested locations found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        locationsCurrentItems.map((location) => (
                          <TableRow
                            key={location.id}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleLocationRowClick(location)}
                          >
                            <TableCell>
                              <div className="font-medium text-primary">
                                {location.locationName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {location.id}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {location.details.address}
                                <br />
                                {location.details.city},{" "}
                                {location.details.state}{" "}
                                {location.details.zipCode}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {location.details.facilityType.replace(
                                  "_",
                                  " ",
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {location.submitter}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {location.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(location.status)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(
                                  location.submittedAt,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(
                                  location.submittedAt,
                                ).toLocaleTimeString()}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination for Locations */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {locationsCurrentPage} of {locationsTotalPages}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Select
                        value={locationsPageSize.toString()}
                        onValueChange={(value) => {
                          setLocationsPageSize(Number(value));
                          setLocationsCurrentPage(1);
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
                          setLocationsCurrentPage((prev) =>
                            Math.max(1, prev - 1),
                          )
                        }
                        disabled={locationsCurrentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setLocationsCurrentPage((prev) =>
                            Math.min(locationsTotalPages, prev + 1),
                          )
                        }
                        disabled={locationsCurrentPage === locationsTotalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
