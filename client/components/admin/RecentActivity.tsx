import { useState, useEffect } from "react";
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
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  MessageSquare,
  User,
  MapPin,
  RefreshCw,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type:
    | "facility_created"
    | "facility_updated"
    | "review_submitted"
    | "user_registered"
    | "suggestion_submitted";
  description: string;
  user: string;
  entity?: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
  details?: any;
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "facility_created",
    description: "New facility added to database",
    user: "Admin",
    entity: "Green Valley Landfill",
    timestamp: "2024-01-20T14:30:00Z",
    status: "success",
  },
  {
    id: "2",
    type: "review_submitted",
    description: "New review submitted for approval",
    user: "John D.",
    entity: "Metro Transfer Station",
    timestamp: "2024-01-20T13:45:00Z",
    status: "pending",
  },
  {
    id: "3",
    type: "facility_updated",
    description: "Facility information updated",
    user: "Admin",
    entity: "Capitol Construction Landfill",
    timestamp: "2024-01-20T12:15:00Z",
    status: "success",
  },
  {
    id: "4",
    type: "suggestion_submitted",
    description: "New location suggestion received",
    user: "Sarah M.",
    entity: "Riverside Recycling Center",
    timestamp: "2024-01-20T11:30:00Z",
    status: "pending",
  },
  {
    id: "5",
    type: "user_registered",
    description: "New user account created",
    user: "mike@email.com",
    timestamp: "2024-01-20T10:45:00Z",
    status: "success",
  },
  {
    id: "6",
    type: "facility_updated",
    description: "Operating hours updated",
    user: "Admin",
    entity: "Downtown Transfer Station",
    timestamp: "2024-01-20T09:20:00Z",
    status: "success",
  },
  {
    id: "7",
    type: "review_submitted",
    description: "Review submitted for moderation",
    user: "Jennifer R.",
    entity: "Green Valley Landfill",
    timestamp: "2024-01-20T08:15:00Z",
    status: "pending",
  },
  {
    id: "8",
    type: "facility_created",
    description: "Bulk upload completed",
    user: "Admin",
    entity: "15 new facilities",
    timestamp: "2024-01-19T16:30:00Z",
    status: "success",
  },
];

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [filteredActivities, setFilteredActivities] =
    useState<ActivityItem[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "facility_created", label: "Facility Created" },
    { value: "facility_updated", label: "Facility Updated" },
    { value: "review_submitted", label: "Review Submitted" },
    { value: "suggestion_submitted", label: "Suggestion Submitted" },
    { value: "user_registered", label: "User Registered" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "success", label: "Success" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ];

  const filterActivities = () => {
    let filtered = [...activities];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (activity) =>
          activity.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (activity.entity &&
            activity.entity.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((activity) => activity.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (activity) => activity.status === statusFilter,
      );
    }

    setFilteredActivities(filtered);
    setCurrentPage(1);
  };

  // Apply filters when search/filter values change
  useEffect(() => {
    filterActivities();
  }, [searchQuery, typeFilter, statusFilter, activities]);

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "facility_created":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "facility_updated":
        return <Edit className="w-4 h-4 text-blue-600" />;
      case "review_submitted":
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case "suggestion_submitted":
        return <MapPin className="w-4 h-4 text-orange-600" />;
      case "user_registered":
        return <User className="w-4 h-4 text-teal-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: ActivityItem["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Success
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const exportData = () => {
    const csvContent = [
      ["Timestamp", "Type", "Description", "User", "Entity", "Status"].join(
        ",",
      ),
      ...filteredActivities.map((activity) =>
        [
          new Date(activity.timestamp).toISOString(),
          activity.type,
          activity.description,
          activity.user,
          activity.entity || "",
          activity.status,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    // In a real app, this would refetch from the API
    // For now, we'll just shuffle the existing data
    const shuffled = [...mockActivities].sort(() => Math.random() - 0.5);
    setActivities(shuffled);
  };

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredActivities.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
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
          {Math.min(endIndex, filteredActivities.length)} of{" "}
          {filteredActivities.length} activities
        </div>

        {/* Activity Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
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
                    No activities found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-muted/50">
                    <TableCell>{getActivityIcon(activity.type)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{activity.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{activity.user}</div>
                    </TableCell>
                    <TableCell>
                      {activity.entity && (
                        <div className="text-sm text-muted-foreground">
                          {activity.entity}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
  );
}
