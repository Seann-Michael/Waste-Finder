import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Settings,
  User,
  Lock,
  Key,
  Globe,
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Code,
  MapPin,
  MessageSquare,
  ArrowLeft,
  Image,
  FileText,
  Tag,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "editor";
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

interface PendingLocation {
  id: string;
  name: string;
  submitter: string;
  address: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

const mockAdminUsers: AdminUser[] = [
  {
    id: "1",
    name: "Sean Webb",
    email: "sean@wastefinder.com",
    role: "super_admin",
    status: "active",
    lastLogin: "2024-01-20T15:30:00Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

const mockPendingLocations: PendingLocation[] = [
  {
    id: "1",
    name: "Riverside Recycling Center",
    submitter: "Lisa K.",
    address: "456 River Road, Portland, OR 97202",
    status: "pending",
    submittedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    name: "Metro Waste Facility",
    submitter: "John D.",
    address: "789 Industrial Ave, Chicago, IL 60601",
    status: "pending",
    submittedAt: "2024-01-19T14:15:00Z",
  },
];

const webhookEvents = [
  { value: "resource_downloaded", label: "Resource Downloaded" },
  { value: "location_viewed", label: "Location Viewed" },
  { value: "review_submitted", label: "Review Submitted" },
  { value: "suggestion_submitted", label: "Suggestion Submitted" },
  { value: "user_search", label: "User Search" },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Load advertisement settings from localStorage on component mount
    const savedAdSettings = localStorage.getItem("adSettings");
    if (savedAdSettings) {
      try {
        const settings = JSON.parse(savedAdSettings);
        // Ensure customAds is always an array
        if (settings && typeof settings === "object") {
          setAdSettings({
            ...settings,
            customAds: Array.isArray(settings.customAds)
              ? settings.customAds
              : [],
          });
        }
      } catch (error) {
        console.error("Error loading ad settings:", error);
      }
    }
  }, []);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [pendingLocationsList, setPendingLocationsList] =
    useState<PendingLocation[]>(mockPendingLocations);
  const [showPasswords, setShowPasswords] = useState(false);
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [profileData, setProfileData] = useState({
    name: "Sean Webb",
    email: "sean@wastefinder.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [apiSettings, setApiSettings] = useState({
    ghlApiKey: "",
    webhookUrl: "",
    webhookEvents: ["resource_downloaded"],
    googleMapsApiKey: "",
  });

  const [contentSettings, setContentSettings] = useState({
    bannerText:
      "🔥 Get more customers for your dumpster rental business - Click here for proven marketing strategies!",
    privacyPolicy: "",
    termsOfService: "",
    footerContent: "",
    resourcesContent: "",
  });

  const [codeSettings, setCodeSettings] = useState({
    headCode: "",
    bodyCode: "",
    customCSS: "",
    customJS: "",
  });

  const [systemSettings, setSystemSettings] = useState({
    siteName: "WasteFinder",
    supportEmail: "support@wastefinder.com",
    maintenanceMode: false,
  });

  const [websiteSettings, setWebsiteSettings] = useState({
    siteUrl: "https://wastefinder.com",
    siteLogo: "",
    favicon: "",
    metaTitle: "WasteFinder - Find Waste Disposal Facilities Near You",
    metaDescription:
      "Search our comprehensive database of landfills, transfer stations, and construction facilities across the United States.",
    metaKeywords:
      "waste disposal, landfill, transfer station, construction debris, recycling",
    ogTitle: "WasteFinder - Find Waste Disposal Facilities Near You",
    ogDescription:
      "Search our comprehensive database of landfills, transfer stations, and construction facilities across the United States.",
    ogImage: "",
    twitterTitle: "WasteFinder - Find Waste Disposal Facilities Near You",
    twitterDescription:
      "Search our comprehensive database of landfills, transfer stations, and construction facilities across the United States.",
    twitterImage: "",
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "admin",
    password: "",
    confirmPassword: "",
  });

  const tabs = [
    { id: "profile", label: "Profile & Password", icon: User },
    { id: "users", label: "Admin Users", icon: Users },
    { id: "locations", label: "Pending Locations", icon: MapPin },
    { id: "website", label: "Website Settings", icon: Globe },
    { id: "system", label: "System Settings", icon: Settings },
    { id: "api", label: "API & Webhooks", icon: Key },
    { id: "content", label: "Content Management", icon: FileText },
    { id: "code", label: "Custom Code", icon: Code },
  ];

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    alert("Profile updated successfully!");
  };

  const handleSaveApiSettings = () => {
    console.log("Saving API settings:", apiSettings);
    alert("API settings updated successfully!");
  };

  const handleSaveContentSettings = () => {
    console.log("Saving content settings:", contentSettings);
    alert("Content settings updated successfully!");
  };

  const handleSaveCodeSettings = () => {
    console.log("Saving code settings:", codeSettings);
    alert("Code settings updated successfully!");
  };

  const handleSaveWebsiteSettings = () => {
    console.log("Saving website settings:", websiteSettings);
    alert("Website settings updated successfully!");
  };

  const handleSaveSystemSettings = () => {
    console.log("Saving system settings:", systemSettings);
    alert("System settings updated successfully!");
  };

  const handleAddUser = () => {
    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const user: AdminUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as "super_admin" | "admin" | "editor",
      status: "active",
      lastLogin: "Never",
      createdAt: new Date().toISOString(),
    };

    setAdminUsers([...adminUsers, user]);
    setNewUser({
      name: "",
      email: "",
      role: "admin",
      password: "",
      confirmPassword: "",
    });
    setNewUserDialog(false);
    alert("User added successfully!");
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditUserDialog(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setAdminUsers(adminUsers.filter((user) => user.id !== userId));
    }
  };

  const handleWebhookEventToggle = (event: string, checked: boolean) => {
    setApiSettings((prev) => ({
      ...prev,
      webhookEvents: checked
        ? [...prev.webhookEvents, event]
        : prev.webhookEvents.filter((e) => e !== event),
    }));
  };

  const getRoleBadge = (role: AdminUser["role"]) => {
    switch (role) {
      case "super_admin":
        return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>;
      case "admin":
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case "editor":
        return <Badge className="bg-green-100 text-green-800">Editor</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: AdminUser["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Admin Settings</h1>
              <p className="text-muted-foreground">
                Manage your profile, users, and system configuration
              </p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile & Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <hr />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={profileData.currentPassword}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              currentPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              newPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Admin Users</CardTitle>
                    <Dialog
                      open={newUserDialog}
                      onOpenChange={setNewUserDialog}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Admin User</DialogTitle>
                          <DialogDescription>
                            Create a new admin user account
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="newUserName">Full Name</Label>
                              <Input
                                id="newUserName"
                                value={newUser.name}
                                onChange={(e) =>
                                  setNewUser({
                                    ...newUser,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newUserEmail">Email</Label>
                              <Input
                                id="newUserEmail"
                                type="email"
                                value={newUser.email}
                                onChange={(e) =>
                                  setNewUser({
                                    ...newUser,
                                    email: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newUserRole">Role</Label>
                            <Select
                              value={newUser.role}
                              onValueChange={(value) =>
                                setNewUser({ ...newUser, role: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="super_admin">
                                  Super Admin
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="newUserPassword">Password</Label>
                              <Input
                                id="newUserPassword"
                                type="password"
                                value={newUser.password}
                                onChange={(e) =>
                                  setNewUser({
                                    ...newUser,
                                    password: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newUserConfirmPassword">
                                Confirm Password
                              </Label>
                              <Input
                                id="newUserConfirmPassword"
                                type="password"
                                value={newUser.confirmPassword}
                                onChange={(e) =>
                                  setNewUser({
                                    ...newUser,
                                    confirmPassword: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setNewUserDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleAddUser}>Add User</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            {user.lastLogin === "Never"
                              ? "Never"
                              : new Date(user.lastLogin).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {user.role !== "super_admin" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {activeTab === "locations" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Pending Locations ({pendingLocationsList.length})
                    </CardTitle>
                    <Button variant="outline" asChild>
                      <Link to="/admin/suggestions">View All Suggestions</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingLocationsList.map((location) => (
                      <div
                        key={location.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{location.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(
                              location.submittedAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Submitted by {location.submitter}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {location.address}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm">Approve</Button>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "website" && (
              <Card>
                <CardHeader>
                  <CardTitle>Website Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Website Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Basic Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteUrl">Site URL</Label>
                        <Input
                          id="siteUrl"
                          value={websiteSettings.siteUrl}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              siteUrl: e.target.value,
                            })
                          }
                          placeholder="https://yoursite.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="siteLogo">Site Logo URL</Label>
                        <Input
                          id="siteLogo"
                          value={websiteSettings.siteLogo}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              siteLogo: e.target.value,
                            })
                          }
                          placeholder="https://yoursite.com/logo.png"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="favicon">Favicon URL</Label>
                      <Input
                        id="favicon"
                        value={websiteSettings.favicon}
                        onChange={(e) =>
                          setWebsiteSettings({
                            ...websiteSettings,
                            favicon: e.target.value,
                          })
                        }
                        placeholder="https://yoursite.com/favicon.ico"
                      />
                    </div>
                  </div>

                  {/* SEO Meta Tags */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      SEO Meta Tags
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                          id="metaTitle"
                          value={websiteSettings.metaTitle}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              metaTitle: e.target.value,
                            })
                          }
                          placeholder="Page title for search engines"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="metaDescription">
                          Meta Description
                        </Label>
                        <Textarea
                          id="metaDescription"
                          value={websiteSettings.metaDescription}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              metaDescription: e.target.value,
                            })
                          }
                          placeholder="Brief description for search engines (150-160 characters)"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="metaKeywords">Meta Keywords</Label>
                        <Input
                          id="metaKeywords"
                          value={websiteSettings.metaKeywords}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              metaKeywords: e.target.value,
                            })
                          }
                          placeholder="keyword1, keyword2, keyword3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Open Graph Tags */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Open Graph Tags (Facebook)
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ogTitle">OG Title</Label>
                        <Input
                          id="ogTitle"
                          value={websiteSettings.ogTitle}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              ogTitle: e.target.value,
                            })
                          }
                          placeholder="Title when shared on social media"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ogDescription">OG Description</Label>
                        <Textarea
                          id="ogDescription"
                          value={websiteSettings.ogDescription}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              ogDescription: e.target.value,
                            })
                          }
                          placeholder="Description when shared on social media"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ogImage">OG Image URL</Label>
                        <Input
                          id="ogImage"
                          value={websiteSettings.ogImage}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              ogImage: e.target.value,
                            })
                          }
                          placeholder="https://yoursite.com/social-image.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Twitter Tags */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Twitter Card Tags</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="twitterTitle">Twitter Title</Label>
                        <Input
                          id="twitterTitle"
                          value={websiteSettings.twitterTitle}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              twitterTitle: e.target.value,
                            })
                          }
                          placeholder="Title when shared on Twitter"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitterDescription">
                          Twitter Description
                        </Label>
                        <Textarea
                          id="twitterDescription"
                          value={websiteSettings.twitterDescription}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              twitterDescription: e.target.value,
                            })
                          }
                          placeholder="Description when shared on Twitter"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitterImage">Twitter Image URL</Label>
                        <Input
                          id="twitterImage"
                          value={websiteSettings.twitterImage}
                          onChange={(e) =>
                            setWebsiteSettings({
                              ...websiteSettings,
                              twitterImage: e.target.value,
                            })
                          }
                          placeholder="https://yoursite.com/twitter-image.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveWebsiteSettings}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Website Settings
                  </Button>
                </CardContent>
              </Card>
            )}


              <Card>
                <CardHeader>
                  <CardTitle>Advertisement & Marketing Settings</CardTitle>
                  <CardDescription>
                    Configure AdSense, custom advertisements, and social media
                    promotions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Google AdSense */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Google AdSense</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="adsenseEnabled"
                          checked={adSettings.adsenseEnabled}
                          onCheckedChange={(checked) =>
                            setAdSettings({
                              ...adSettings,
                              adsenseEnabled: checked,
                            })
                          }
                        />
                        <Label htmlFor="adsenseEnabled">
                          Enable Google AdSense
                        </Label>
                      </div>
                      {adSettings.adsenseEnabled && (
                        <div className="space-y-2">
                          <Label htmlFor="adsenseCode">
                            AdSense Publisher ID
                          </Label>
                          <Input
                            id="adsenseCode"
                            value={adSettings.adsenseCode}
                            onChange={(e) =>
                              setAdSettings({
                                ...adSettings,
                                adsenseCode: e.target.value,
                              })
                            }
                            placeholder="ca-pub-1234567890123456"
                          />
                          <p className="text-sm text-muted-foreground">
                            Enter your Google AdSense publisher ID
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Facebook Group */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Facebook Community</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="facebookGroupEnabled"
                          checked={adSettings.facebookGroupEnabled}
                          onCheckedChange={(checked) =>
                            setAdSettings({
                              ...adSettings,
                              facebookGroupEnabled: checked,
                            })
                          }
                        />
                        <Label htmlFor="facebookGroupEnabled">
                          Show Facebook Group CTA
                        </Label>
                      </div>
                      {adSettings.facebookGroupEnabled && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="facebookGroupUrl">
                              Facebook Group URL
                            </Label>
                            <Input
                              id="facebookGroupUrl"
                              value={adSettings.facebookGroupUrl}
                              onChange={(e) =>
                                setAdSettings({
                                  ...adSettings,
                                  facebookGroupUrl: e.target.value,
                                })
                              }
                              placeholder="https://facebook.com/groups/yourgroup"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="facebookGroupCta">
                              Call to Action Text
                            </Label>
                            <Textarea
                              id="facebookGroupCta"
                              value={adSettings.facebookGroupCta}
                              onChange={(e) =>
                                setAdSettings({
                                  ...adSettings,
                                  facebookGroupCta: e.target.value,
                                })
                              }
                              placeholder="Join our Facebook community..."
                              rows={3}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Custom Ads */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Custom Advertisements
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="customAdsEnabled"
                          checked={adSettings.customAdsEnabled}
                          onCheckedChange={(checked) =>
                            setAdSettings({
                              ...adSettings,
                              customAdsEnabled: checked,
                            })
                          }
                        />
                        <Label htmlFor="customAdsEnabled">
                          Enable Custom Ads
                        </Label>
                      </div>

                      {adSettings.customAdsEnabled && (
                        <div className="space-y-4">
                          {/* Add New Custom Ad */}
                          <div className="border rounded-lg p-4 space-y-4">
                            <h4 className="font-medium">Add New Custom Ad</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="newAdTitle">Title</Label>
                                <Input
                                  id="newAdTitle"
                                  value={newCustomAd.title}
                                  onChange={(e) =>
                                    setNewCustomAd({
                                      ...newCustomAd,
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="Advertisement title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newAdPlacement">
                                  Placement
                                </Label>
                                <select
                                  id="newAdPlacement"
                                  value={newCustomAd.placement}
                                  onChange={(e) =>
                                    setNewCustomAd({
                                      ...newCustomAd,
                                      placement: e.target.value as
                                        | "home"
                                        | "search"
                                        | "location"
                                        | "all",
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-border rounded-md"
                                >
                                  <option value="all">All Pages</option>
                                  <option value="home">Home Page Only</option>
                                  <option value="search">
                                    Search Results Only
                                  </option>
                                  <option value="location">
                                    Location Pages Only
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newAdContent">Content</Label>
                              <Textarea
                                id="newAdContent"
                                value={newCustomAd.content}
                                onChange={(e) =>
                                  setNewCustomAd({
                                    ...newCustomAd,
                                    content: e.target.value,
                                  })
                                }
                                placeholder="Advertisement content"
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="newAdImage">
                                  Image URL (optional)
                                </Label>
                                <Input
                                  id="newAdImage"
                                  value={newCustomAd.imageUrl}
                                  onChange={(e) =>
                                    setNewCustomAd({
                                      ...newCustomAd,
                                      imageUrl: e.target.value,
                                    })
                                  }
                                  placeholder="https://..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newAdLink">
                                  Link URL (optional)
                                </Label>
                                <Input
                                  id="newAdLink"
                                  value={newCustomAd.linkUrl}
                                  onChange={(e) =>
                                    setNewCustomAd({
                                      ...newCustomAd,
                                      linkUrl: e.target.value,
                                    })
                                  }
                                  placeholder="https://..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="newAdPriority">Priority</Label>
                                <Input
                                  id="newAdPriority"
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={newCustomAd.priority}
                                  onChange={(e) =>
                                    setNewCustomAd({
                                      ...newCustomAd,
                                      priority: parseInt(e.target.value) || 1,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <Button
                              onClick={handleAddCustomAd}
                              className="w-full"
                            >
                              Add Custom Ad
                            </Button>
                          </div>

                          {/* Existing Custom Ads */}
                          {Array.isArray(adSettings.customAds) &&
                            adSettings.customAds.length > 0 && (
                              <div className="space-y-4">
                                <h4 className="font-medium">
                                  Existing Custom Ads
                                </h4>
                                {Array.isArray(adSettings.customAds) &&
                                  adSettings.customAds.map((ad) => (
                                    <div
                                      key={ad.id}
                                      className="border rounded-lg p-4 space-y-2"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <h5 className="font-medium">
                                            {ad.title}
                                          </h5>
                                          <Badge
                                            variant={
                                              ad.isActive
                                                ? "default"
                                                : "secondary"
                                            }
                                          >
                                            {ad.isActive
                                              ? "Active"
                                              : "Inactive"}
                                          </Badge>
                                          <Badge variant="outline">
                                            {ad.placement}
                                          </Badge>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              handleToggleCustomAd(ad.id)
                                            }
                                          >
                                            {ad.isActive
                                              ? "Deactivate"
                                              : "Activate"}
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                              handleRemoveCustomAd(ad.id)
                                            }
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {ad.content}
                                      </p>
                                      {ad.linkUrl && (
                                        <p className="text-xs text-blue-600">
                                          {ad.linkUrl}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button onClick={handleSaveAdSettings} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Advertisement Settings
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "system" && (
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={systemSettings.siteName}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            siteName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={systemSettings.supportEmail}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
                            supportEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveSystemSettings}>
                    <Save className="w-4 h-4 mr-2" />
                    Save System Settings
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "api" && (
              <Card>
                <CardHeader>
                  <CardTitle>API Keys & Webhooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ghlApiKey">GoHighLevel API Key</Label>
                      <div className="relative">
                        <Input
                          id="ghlApiKey"
                          type={showPasswords ? "text" : "password"}
                          value={apiSettings.ghlApiKey}
                          onChange={(e) =>
                            setApiSettings({
                              ...apiSettings,
                              ghlApiKey: e.target.value,
                            })
                          }
                          placeholder="Enter your GHL API key"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <Button size="sm" className="mt-2">
                        Save API Key
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        value={apiSettings.webhookUrl}
                        onChange={(e) =>
                          setApiSettings({
                            ...apiSettings,
                            webhookUrl: e.target.value,
                          })
                        }
                        placeholder="https://hooks.zapier.com/..."
                      />
                      <Button size="sm" className="mt-2">
                        Save Webhook URL
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Label>Webhook Events</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {webhookEvents.map((event) => (
                          <div
                            key={event.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={event.value}
                              checked={apiSettings.webhookEvents.includes(
                                event.value,
                              )}
                              onCheckedChange={(checked) =>
                                handleWebhookEventToggle(
                                  event.value,
                                  checked as boolean,
                                )
                              }
                            />
                            <Label htmlFor={event.value} className="text-sm">
                              {event.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <Button size="sm" className="mt-2">
                        Save Webhook Events
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="googleMapsApiKey">
                        Google Maps API Key
                      </Label>
                      <div className="relative">
                        <Input
                          id="googleMapsApiKey"
                          type={showPasswords ? "text" : "password"}
                          value={apiSettings.googleMapsApiKey}
                          onChange={(e) =>
                            setApiSettings({
                              ...apiSettings,
                              googleMapsApiKey: e.target.value,
                            })
                          }
                          placeholder="Enter your Google Maps API key"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <Button size="sm" className="mt-2">
                        Save Google Maps API
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "content" && (
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bannerText">Header Banner Text</Label>
                      <Textarea
                        id="bannerText"
                        value={contentSettings.bannerText}
                        onChange={(e) =>
                          setContentSettings({
                            ...contentSettings,
                            bannerText: e.target.value,
                          })
                        }
                        rows={3}
                      />
                      <Button size="sm" className="mt-2">
                        Save Banner Text
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resourcesContent">
                        Resources Page Content
                      </Label>
                      <Textarea
                        id="resourcesContent"
                        value={contentSettings.resourcesContent}
                        onChange={(e) =>
                          setContentSettings({
                            ...contentSettings,
                            resourcesContent: e.target.value,
                          })
                        }
                        rows={5}
                        placeholder="Enter HTML content for the resources page..."
                      />
                      <Button size="sm" className="mt-2">
                        Save Resources Content
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                      <Textarea
                        id="privacyPolicy"
                        value={contentSettings.privacyPolicy}
                        onChange={(e) =>
                          setContentSettings({
                            ...contentSettings,
                            privacyPolicy: e.target.value,
                          })
                        }
                        rows={8}
                        placeholder="Enter privacy policy content..."
                      />
                      <Button size="sm" className="mt-2">
                        Save Privacy Policy
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="termsOfService">Terms of Service</Label>
                      <Textarea
                        id="termsOfService"
                        value={contentSettings.termsOfService}
                        onChange={(e) =>
                          setContentSettings({
                            ...contentSettings,
                            termsOfService: e.target.value,
                          })
                        }
                        rows={8}
                        placeholder="Enter terms of service content..."
                      />
                      <Button size="sm" className="mt-2">
                        Save Terms of Service
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="footerContent">Footer Content</Label>
                      <Textarea
                        id="footerContent"
                        value={contentSettings.footerContent}
                        onChange={(e) =>
                          setContentSettings({
                            ...contentSettings,
                            footerContent: e.target.value,
                          })
                        }
                        rows={4}
                        placeholder="Enter footer content..."
                      />
                      <Button size="sm" className="mt-2">
                        Save Footer Content
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "code" && (
              <Card>
                <CardHeader>
                  <CardTitle>Custom Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="headCode">
                        Head Code (Analytics, Meta tags, etc.)
                      </Label>
                      <Textarea
                        id="headCode"
                        value={codeSettings.headCode}
                        onChange={(e) =>
                          setCodeSettings({
                            ...codeSettings,
                            headCode: e.target.value,
                          })
                        }
                        rows={6}
                        placeholder="<script>...</script> or <meta>..."
                        className="font-mono text-sm"
                      />
                      <Button size="sm" className="mt-2">
                        Save Head Code
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bodyCode">
                        Body Code (Tracking scripts, etc.)
                      </Label>
                      <Textarea
                        id="bodyCode"
                        value={codeSettings.bodyCode}
                        onChange={(e) =>
                          setCodeSettings({
                            ...codeSettings,
                            bodyCode: e.target.value,
                          })
                        }
                        rows={6}
                        placeholder="<script>...</script>"
                        className="font-mono text-sm"
                      />
                      <Button size="sm" className="mt-2">
                        Save Body Code
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customCSS">Custom CSS</Label>
                      <Textarea
                        id="customCSS"
                        value={codeSettings.customCSS}
                        onChange={(e) =>
                          setCodeSettings({
                            ...codeSettings,
                            customCSS: e.target.value,
                          })
                        }
                        rows={8}
                        placeholder=".custom-class { color: red; }"
                        className="font-mono text-sm"
                      />
                      <Button size="sm" className="mt-2">
                        Save Custom CSS
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customJS">Custom JavaScript</Label>
                      <Textarea
                        id="customJS"
                        value={codeSettings.customJS}
                        onChange={(e) =>
                          setCodeSettings({
                            ...codeSettings,
                            customJS: e.target.value,
                          })
                        }
                        rows={8}
                        placeholder="console.log('Custom JS');"
                        className="font-mono text-sm"
                      />
                      <Button size="sm" className="mt-2">
                        Save Custom JavaScript
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Edit User Dialog */}
        <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={selectedUser.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={selectedUser.email} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditUserDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setEditUserDialog(false)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}