import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  MapPin,
  MessageSquare,
  Edit,
  Upload,
  Download,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function Admin() {
  const stats = [
    {
      label: "Total Facilities",
      value: "2,647",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      label: "Pending Reviews",
      value: "23",
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: "Pending Suggestions",
      value: "8",
      icon: <Edit className="w-5 h-5" />,
    },
    {
      label: "Active Users",
      value: "1,892",
      icon: <Users className="w-5 h-5" />,
    },
  ];

  const pendingReviews = [
    {
      id: "1",
      location: "Green Valley Landfill",
      author: "John D.",
      rating: 4,
      preview: "Great service and fair pricing...",
      date: "2 hours ago",
    },
    {
      id: "2",
      location: "Metro Transfer Station",
      author: "Sarah M.",
      rating: 5,
      preview: "Very clean facility with helpful staff...",
      date: "4 hours ago",
    },
    {
      id: "3",
      location: "Capitol Construction Landfill",
      author: "Mike R.",
      rating: 2,
      preview: "Long wait times and poor signage...",
      date: "6 hours ago",
    },
  ];

  const pendingSuggestions = [
    {
      id: "1",
      type: "New Location",
      name: "Riverside Recycling Center",
      submitter: "Lisa K.",
      date: "1 day ago",
    },
    {
      id: "2",
      type: "Edit Location",
      name: "Downtown Transfer Station",
      submitter: "Tom B.",
      date: "2 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage facilities, reviews, and user suggestions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="text-primary">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Upload Facilities
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Database
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Add New Facility
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Facility
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pending Reviews */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Pending Reviews
                </CardTitle>
                <Badge variant="secondary">{pendingReviews.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{review.location}</h4>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {review.author}
                      </span>
                      <div className="flex">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-yellow-400 rounded-full"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {review.preview}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Pending Suggestions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Pending Suggestions
                </CardTitle>
                <Badge variant="secondary">{pendingSuggestions.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {suggestion.date}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm">{suggestion.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Submitted by {suggestion.submitter}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Suggestions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full-width placeholder sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Activity feed will be implemented here</p>
                <p className="text-sm">
                  Track facility updates, user actions, and system events
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Analytics dashboard will be implemented here</p>
                <p className="text-sm">
                  User engagement, search patterns, and facility usage
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
