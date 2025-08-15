import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Upload,
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

// REMOVED: Admin users moved to Supabase database
// Use Supabase auth and user management instead
const mockAdminUsers: AdminUser[] = [];

// REMOVED: Pending locations moved to Supabase database
// Use Supabase location_suggestions table instead
const mockPendingLocations: PendingLocation[] = [];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedApiSettings = localStorage.getItem("apiSettings");
    if (savedApiSettings) {
      try {
        setApiSettings(JSON.parse(savedApiSettings));
      } catch (error) {
        console.error("Error loading API settings:", error);
      }
    }

    const savedContentSettings = localStorage.getItem("contentSettings");
    if (savedContentSettings) {
      try {
        setContentSettings((prev) => ({
          ...prev,
          ...JSON.parse(savedContentSettings),
        }));
      } catch (error) {
        console.error("Error loading content settings:", error);
      }
    }

    const savedMarketingSettings = localStorage.getItem("marketingSettings");
    if (savedMarketingSettings) {
      try {
        setMarketingSettings(JSON.parse(savedMarketingSettings));
      } catch (error) {
        console.error("Error loading marketing settings:", error);
      }
    }

    const savedSeoSettings = localStorage.getItem("seoSettings");
    if (savedSeoSettings) {
      try {
        setSeoSettings((prev) => ({
          ...prev,
          ...JSON.parse(savedSeoSettings),
        }));
      } catch (error) {
        console.error("Error loading SEO settings:", error);
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
    firstName: "Sean",
    lastName: "Webb",
    email: "sean@wastefinder.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [apiSettings, setApiSettings] = useState({
    // googleMapsApiKey removed - now handled via environment variables only
  });

  const [contentSettings, setContentSettings] = useState({
    bannerText:
      "🔥 Get more customers for your dumpster rental business - Click here for proven marketing strategies!",
    bannerUrl: "https://yourmarketingagency.com",
    marketingButtonText: "Marketing for Dumpster Rentals",
    marketingButtonUrl: "https://yourmarketingagency.com",
    homeMarketingButtonText: "Marketing for Dumpster Rentals",
    homeMarketingButtonUrl: "https://yourmarketingagency.com",
    privacyPolicy: "",
    termsOfService: "",
    footerContent: "",
  });

  const [marketingSettings, setMarketingSettings] = useState({
    facebookGroupUrl: "",
    facebookGroupEnabled: false,
    facebookCtaTitle: "Join Our Community!",
    facebookCtaText: "Connect with waste management professionals.",
    facebookButtonText: "Join Group",
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
    metaTitle: "WasteFinder - Find Waste Disposal Locations Near You",
    metaDescription:
      "Search our comprehensive database of landfills, transfer stations, and construction locations across the United States.",
    metaKeywords:
      "waste disposal, landfill, transfer station, construction debris, recycling",
    ogTitle: "WasteFinder - Find Waste Disposal Locations Near You",
    ogDescription:
      "Search our comprehensive database of landfills, transfer stations, and construction locations across the United States.",
    ogImage: "",
    twitterTitle: "WasteFinder - Find Waste Disposal Locations Near You",
    twitterDescription:
      "Search our comprehensive database of landfills, transfer stations, and construction locations across the United States.",
    twitterImage: "",
  });

  const [seoSettings, setSeoSettings] = useState({
    // Homepage SEO
    homeTitle: "WasteFinder - Find Waste Disposal Locations Near You",
    homeDescription:
      "Search our comprehensive database of landfills, transfer stations, and construction locations across the United States.",
    homeKeywords:
      "waste disposal, landfill, transfer station, construction debris, recycling",
    homeOgImage: "",

    // All Locations Page SEO
    allLocationsTitle: "All Waste Disposal Locations | WasteFinder Directory",
    allLocationsDescription:
      "Browse our complete directory of waste disposal locations including landfills, transfer stations, and construction debris sites.",
    allLocationsKeywords:
      "waste disposal directory, landfill locations, transfer stations, construction landfills",
    allLocationsOgImage: "",

    // Location Detail Page SEO Templates
    locationTitleTemplate: "{location_name} - Waste Disposal | {city}, {state}",
    locationDescriptionTemplate:
      "Find details for {location_name} in {city}, {state}. Get hours, pricing, contact info and accepted waste types.",
    locationKeywordsTemplate:
      "{location_type}, waste disposal {city}, landfill {state}, debris disposal {zipcode}",
    locationOgImageTemplate: "",

    // Search Results SEO Templates
    searchTitleTemplate:
      "Waste Disposal Locations near {search_term} | WasteFinder",
    searchDescriptionTemplate:
      "Find waste disposal locations near {search_term}. Compare prices, hours, and services for landfills and transfer stations.",
    searchKeywordsTemplate:
      "waste disposal {search_term}, landfill near {search_term}, transfer station {search_term}",

    // Blog SEO Templates
    blogTitleTemplate: "{post_title} | WasteFinder Blog",
    blogDescriptionTemplate: "{post_excerpt}",
    blogKeywordsTemplate: "waste management, {post_tags}, environmental blog",

    // Schema Markup Settings
    enableSchemaMarkup: true,
    businessType: "Waste Management Service",
    businessName: "WasteFinder",
    businessDescription: "Comprehensive directory of waste disposal locations",

    // Technical SEO
    robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://wastefinder.com/sitemap.xml`,

    enableSitemap: true,
    sitemapUpdateFrequency: "weekly",
    canonicalUrlsEnabled: true,
    enableBreadcrumbs: true,
  });

  const [blogSettings, setBlogSettings] = useState({
    // Blog SEO Templates
    blogIndexTitle: "Learn - Expert Insights on Waste Management | WasteFinder",
    blogIndexDescription:
      "Discover expert insights, tips, and guides for waste management and environmental sustainability from industry professionals.",
    blogIndexKeywords:
      "waste management blog, environmental insights, sustainability tips, disposal guides",

    // Individual Blog Post SEO Templates
    blogPostTitleTemplate: "{post_title} | WasteFinder Learn",
    blogPostDescriptionTemplate: "{post_excerpt}",
    blogPostKeywordsTemplate:
      "waste management, {post_tags}, environmental blog",

    // Blog Category SEO Templates
    blogCategoryTitleTemplate: "{category_name} Articles | WasteFinder Learn",
    blogCategoryDescriptionTemplate:
      "Read the latest articles about {category_name} on WasteFinder Learn. Expert insights and practical tips.",
    blogCategoryKeywordsTemplate:
      "{category_name}, waste management, environmental articles",

    // Blog Settings
    postsPerPage: 10,
    showAuthorBio: true,
    showRelatedPosts: true,
    enableComments: false,
    enableSocialSharing: true,
    enableNewsletterSignup: false,

    // Reading Time
    enableReadingTime: true,
    wordsPerMinute: 200,

    // RSS Feed
    enableRssFeed: true,
    rssTitle: "WasteFinder Learn - Latest Articles",
    rssDescription:
      "Stay updated with the latest waste management insights and environmental tips.",
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
    { id: "website", label: "Website Settings", icon: Globe },
    { id: "seo", label: "Technical SEO", icon: Tag },
    { id: "blog", label: "Blog Settings", icon: FileText },
    { id: "content", label: "Content Management", icon: FileText },
    { id: "marketing", label: "Marketing", icon: MessageSquare },
    { id: "system", label: "System Settings", icon: Settings },
    { id: "api", label: "API Keys", icon: Key },
    { id: "code", label: "Custom Code", icon: Code },
  ];

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    alert("Profile updated successfully!");
  };

  const handleSaveApiSettings = () => {
    localStorage.setItem("apiSettings", JSON.stringify(apiSettings));
    console.log("Saving API settings:", apiSettings);
    alert("API settings updated successfully!");
  };

  const handleSaveContentSettings = () => {
    localStorage.setItem("contentSettings", JSON.stringify(contentSettings));
    console.log("Saving content settings:", contentSettings);
    alert("Content settings updated successfully!");
  };

  const handleSaveMarketingSettings = () => {
    localStorage.setItem(
      "marketingSettings",
      JSON.stringify(marketingSettings),
    );
    console.log("Saving marketing settings:", marketingSettings);
    alert("Marketing settings updated successfully!");
  };

  const handleSaveSeoSettings = () => {
    localStorage.setItem("seoSettings", JSON.stringify(seoSettings));
    console.log("Saving SEO settings:", seoSettings);
    alert("SEO settings updated successfully!");
  };

  const handleSaveCodeSettings = () => {
    localStorage.setItem("codeSettings", JSON.stringify(codeSettings));
    console.log("Saving code settings:", codeSettings);
    alert("Custom code settings updated successfully!");
  };

  const handleSaveSystemSettings = () => {
    localStorage.setItem("systemSettings", JSON.stringify(systemSettings));
    console.log("Saving system settings:", systemSettings);
    alert("System settings updated successfully!");
  };

  const handleSaveBlogSettings = () => {
    console.log("Saving blog settings:", blogSettings);
    localStorage.setItem("blogSettings", JSON.stringify(blogSettings));
    alert("Blog settings updated successfully!");
  };

  const handleDeletePendingLocation = (locationId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this pending location? This action cannot be undone.",
      )
    ) {
      setPendingLocationsList((prev) =>
        prev.filter((loc) => loc.id !== locationId),
      );
      alert("Pending location deleted successfully.");
    }
  };

  const handleApprovePendingLocation = (locationId: string) => {
    // In real app, this would move the location to active status
    setPendingLocationsList((prev) =>
      prev.filter((loc) => loc.id !== locationId),
    );
    alert("Location approved and added to active listings.");
  };

  const handleRejectPendingLocation = (locationId: string) => {
    if (confirm("Are you sure you want to reject this location suggestion?")) {
      setPendingLocationsList((prev) =>
        prev.filter((loc) => loc.id !== locationId),
      );
      alert("Location suggestion rejected.");
    }
  };

  const handleFileUpload = async (file: File, type: "logo" | "favicon") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUrl = `https://your-cdn.com/${type}/${file.name}`;

      if (type === "logo") {
        setWebsiteSettings({
          ...websiteSettings,
          siteLogo: mockUrl,
        });
      } else {
        setWebsiteSettings({
          ...websiteSettings,
          favicon: mockUrl,
        });
      }

      alert(`${type === "logo" ? "Logo" : "Favicon"} uploaded successfully!`);
    } catch (error) {
      alert(`Failed to upload ${type}. Please try again.`);
    }
  };

  const handleSaveWebsiteSettings = () => {
    console.log("Saving website settings:", websiteSettings);
    alert("Website settings updated successfully!");
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground">
              Configure system settings and preferences
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border">
          <nav className="flex overflow-x-auto space-x-2 sm:space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">
                    {tab.label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* Profile & Password Tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile & Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
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

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
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
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Admin Users Tab */}
          {activeTab === "users" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Admin Users</CardTitle>
                <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
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
                        Create a new administrator account
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
                              setNewUser({ ...newUser, name: e.target.value })
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
                              setNewUser({ ...newUser, email: e.target.value })
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
                      <Button onClick={() => setNewUserDialog(false)}>
                        Create User
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Website Settings Tab */}
          {activeTab === "website" && (
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Website Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Label htmlFor="siteLogo">Site Logo</Label>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            id="siteLogo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, "logo");
                              }
                            }}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              document.getElementById("siteLogo")?.click()
                            }
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Logo File
                          </Button>
                        </div>
                        {websiteSettings.siteLogo && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Current: </span>
                            <a
                              href={websiteSettings.siteLogo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Logo
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="favicon">Favicon</Label>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            id="favicon"
                            type="file"
                            accept="image/*,.ico"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, "favicon");
                              }
                            }}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            onClick={() =>
                              document.getElementById("favicon")?.click()
                            }
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Favicon File
                          </Button>
                        </div>
                        {websiteSettings.favicon && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Current: </span>
                            <a
                              href={websiteSettings.favicon}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View Favicon
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveWebsiteSettings} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Website Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Technical SEO Tab */}
          {activeTab === "seo" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Technical SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Homepage SEO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Homepage SEO
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="homeTitle">Homepage Title</Label>
                      <Input
                        id="homeTitle"
                        value={seoSettings.homeTitle}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            homeTitle: e.target.value,
                          })
                        }
                        placeholder="Page title for homepage"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="homeDescription">
                        Homepage Meta Description
                      </Label>
                      <Textarea
                        id="homeDescription"
                        value={seoSettings.homeDescription}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            homeDescription: e.target.value,
                          })
                        }
                        placeholder="Meta description for homepage (150-160 chars)"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="homeKeywords">Homepage Keywords</Label>
                      <Input
                        id="homeKeywords"
                        value={seoSettings.homeKeywords}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            homeKeywords: e.target.value,
                          })
                        }
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Pages SEO Templates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Location Detail Pages
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      Use template variables: {"{location_name}"}, {"{city}"},{" "}
                      {"{state}"}, {"{location_type}"}, {"{zipcode}"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="locationTitleTemplate">
                        Title Template
                      </Label>
                      <Input
                        id="locationTitleTemplate"
                        value={seoSettings.locationTitleTemplate}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            locationTitleTemplate: e.target.value,
                          })
                        }
                        placeholder="{location_name} - Waste Disposal | {city}, {state}"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locationDescriptionTemplate">
                        Description Template
                      </Label>
                      <Textarea
                        id="locationDescriptionTemplate"
                        value={seoSettings.locationDescriptionTemplate}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            locationDescriptionTemplate: e.target.value,
                          })
                        }
                        placeholder="Find details for {location_name} in {city}, {state}..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Search Results SEO Templates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Search Results Pages
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">
                      Use template variable: {"{search_term}"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="searchTitleTemplate">
                        Search Title Template
                      </Label>
                      <Input
                        id="searchTitleTemplate"
                        value={seoSettings.searchTitleTemplate}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            searchTitleTemplate: e.target.value,
                          })
                        }
                        placeholder="Waste Disposal Locations near {search_term} | WasteFinder"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="searchDescriptionTemplate">
                        Search Description Template
                      </Label>
                      <Textarea
                        id="searchDescriptionTemplate"
                        value={seoSettings.searchDescriptionTemplate}
                        onChange={(e) =>
                          setSeoSettings({
                            ...seoSettings,
                            searchDescriptionTemplate: e.target.value,
                          })
                        }
                        placeholder="Find waste disposal locations near {search_term}..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Technical SEO Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Technical Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableSchemaMarkup"
                          checked={seoSettings.enableSchemaMarkup}
                          onCheckedChange={(checked) =>
                            setSeoSettings({
                              ...seoSettings,
                              enableSchemaMarkup: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="enableSchemaMarkup">
                          Enable Schema Markup
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableSitemap"
                          checked={seoSettings.enableSitemap}
                          onCheckedChange={(checked) =>
                            setSeoSettings({
                              ...seoSettings,
                              enableSitemap: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="enableSitemap">
                          Generate XML Sitemap
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="canonicalUrlsEnabled"
                          checked={seoSettings.canonicalUrlsEnabled}
                          onCheckedChange={(checked) =>
                            setSeoSettings({
                              ...seoSettings,
                              canonicalUrlsEnabled: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="canonicalUrlsEnabled">
                          Canonical URLs
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableBreadcrumbs"
                          checked={seoSettings.enableBreadcrumbs}
                          onCheckedChange={(checked) =>
                            setSeoSettings({
                              ...seoSettings,
                              enableBreadcrumbs: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="enableBreadcrumbs">
                          Enable Breadcrumbs
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sitemapUpdateFrequency">
                          Sitemap Update Frequency
                        </Label>
                        <Select
                          value={seoSettings.sitemapUpdateFrequency}
                          onValueChange={(value) =>
                            setSeoSettings({
                              ...seoSettings,
                              sitemapUpdateFrequency: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Robots.txt */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Robots.txt
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="robotsTxt">Robots.txt Content</Label>
                    <Textarea
                      id="robotsTxt"
                      value={seoSettings.robotsTxt}
                      onChange={(e) =>
                        setSeoSettings({
                          ...seoSettings,
                          robotsTxt: e.target.value,
                        })
                      }
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSeoSettings} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save SEO Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Blog Settings Tab */}
          {activeTab === "blog" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Blog Settings & SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Blog Index SEO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Blog Index Page SEO
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blogIndexTitle">Blog Index Title</Label>
                      <Input
                        id="blogIndexTitle"
                        value={blogSettings.blogIndexTitle}
                        onChange={(e) =>
                          setBlogSettings({
                            ...blogSettings,
                            blogIndexTitle: e.target.value,
                          })
                        }
                        placeholder="Learn - Expert Insights | WasteFinder"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blogIndexDescription">
                        Blog Index Meta Description
                      </Label>
                      <Textarea
                        id="blogIndexDescription"
                        value={blogSettings.blogIndexDescription}
                        onChange={(e) =>
                          setBlogSettings({
                            ...blogSettings,
                            blogIndexDescription: e.target.value,
                          })
                        }
                        placeholder="Discover expert insights and tips..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blogIndexKeywords">
                        Blog Index Keywords
                      </Label>
                      <Input
                        id="blogIndexKeywords"
                        value={blogSettings.blogIndexKeywords}
                        onChange={(e) =>
                          setBlogSettings({
                            ...blogSettings,
                            blogIndexKeywords: e.target.value,
                          })
                        }
                        placeholder="waste management blog, environmental insights, sustainability tips"
                      />
                    </div>
                  </div>
                </div>

                {/* Blog Post SEO Templates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Individual Blog Post SEO Templates
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      Use template variables: {"{post_title}"},{" "}
                      {"{post_excerpt}"}, {"{post_tags}"}, {"{author_name}"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blogPostTitleTemplate">
                        Post Title Template
                      </Label>
                      <Input
                        id="blogPostTitleTemplate"
                        value={blogSettings.blogPostTitleTemplate}
                        onChange={(e) =>
                          setBlogSettings({
                            ...blogSettings,
                            blogPostTitleTemplate: e.target.value,
                          })
                        }
                        placeholder="{post_title} | WasteFinder Learn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blogPostDescriptionTemplate">
                        Post Description Template
                      </Label>
                      <Textarea
                        id="blogPostDescriptionTemplate"
                        value={blogSettings.blogPostDescriptionTemplate}
                        onChange={(e) =>
                          setBlogSettings({
                            ...blogSettings,
                            blogPostDescriptionTemplate: e.target.value,
                          })
                        }
                        placeholder="{post_excerpt}"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blogPostKeywordsTemplate">
                        Post Keywords Template
                      </Label>
                      <Input
                        id="blogPostKeywordsTemplate"
                        value={blogSettings.blogPostKeywordsTemplate}
                        onChange={(e) =>
                          setBlogSettings({
                            ...blogSettings,
                            blogPostKeywordsTemplate: e.target.value,
                          })
                        }
                        placeholder="waste management, {post_tags}, environmental blog"
                      />
                    </div>
                  </div>
                </div>

                {/* Blog Category SEO Templates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Blog Category SEO Templates
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">
                      Use template variable: {"{category_name}"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blogCategoryTitleTemplate">
                        Category Title Template
                      </Label>
                      <Input
                        id="blogCategoryTitleTemplate"
                        value={blogSettings.blogCategoryTitleTemplate}
                        onChange={(e) =>
                          setBlogSettings({
                            ...blogSettings,
                            blogCategoryTitleTemplate: e.target.value,
                          })
                        }
                        placeholder="{category_name} Articles | WasteFinder Learn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blogCategoryDescriptionTemplate">
                        Category Description Template
                      </Label>
                      <Textarea
                        id="blogCategoryDescriptionTemplate"
                        value={blogSettings.blogCategoryDescriptionTemplate}
                        onChange={(e) =>
                          setBlogSettings({
                            ...blogSettings,
                            blogCategoryDescriptionTemplate: e.target.value,
                          })
                        }
                        placeholder="Read the latest articles about {category_name}..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Blog Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Blog Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="postsPerPage">Posts Per Page</Label>
                        <Input
                          id="postsPerPage"
                          type="number"
                          value={blogSettings.postsPerPage}
                          onChange={(e) =>
                            setBlogSettings({
                              ...blogSettings,
                              postsPerPage: parseInt(e.target.value) || 10,
                            })
                          }
                          min="1"
                          max="50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wordsPerMinute">
                          Reading Speed (words per minute)
                        </Label>
                        <Input
                          id="wordsPerMinute"
                          type="number"
                          value={blogSettings.wordsPerMinute}
                          onChange={(e) =>
                            setBlogSettings({
                              ...blogSettings,
                              wordsPerMinute: parseInt(e.target.value) || 200,
                            })
                          }
                          min="100"
                          max="400"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="showAuthorBio"
                          checked={blogSettings.showAuthorBio}
                          onCheckedChange={(checked) =>
                            setBlogSettings({
                              ...blogSettings,
                              showAuthorBio: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="showAuthorBio">Show Author Bio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="showRelatedPosts"
                          checked={blogSettings.showRelatedPosts}
                          onCheckedChange={(checked) =>
                            setBlogSettings({
                              ...blogSettings,
                              showRelatedPosts: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="showRelatedPosts">
                          Show Related Posts
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableReadingTime"
                          checked={blogSettings.enableReadingTime}
                          onCheckedChange={(checked) =>
                            setBlogSettings({
                              ...blogSettings,
                              enableReadingTime: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="enableReadingTime">
                          Show Reading Time
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableSocialSharing"
                          checked={blogSettings.enableSocialSharing}
                          onCheckedChange={(checked) =>
                            setBlogSettings({
                              ...blogSettings,
                              enableSocialSharing: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="enableSocialSharing">
                          Enable Social Sharing
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableNewsletterSignup"
                          checked={blogSettings.enableNewsletterSignup}
                          onCheckedChange={(checked) =>
                            setBlogSettings({
                              ...blogSettings,
                              enableNewsletterSignup: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="enableNewsletterSignup">
                          Enable Newsletter Signup
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enableRssFeed"
                          checked={blogSettings.enableRssFeed}
                          onCheckedChange={(checked) =>
                            setBlogSettings({
                              ...blogSettings,
                              enableRssFeed: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="enableRssFeed">Enable RSS Feed</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveBlogSettings} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Blog Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Content Management Tab */}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bannerUrl">Banner Link URL</Label>
                    <Input
                      id="bannerUrl"
                      value={contentSettings.bannerUrl}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          bannerUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marketingButtonText">
                      Header Marketing Button Text
                    </Label>
                    <Input
                      id="marketingButtonText"
                      value={contentSettings.marketingButtonText}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          marketingButtonText: e.target.value,
                        })
                      }
                      placeholder="Marketing for Dumpster Rentals"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marketingButtonUrl">
                      Header Marketing Button URL
                    </Label>
                    <Input
                      id="marketingButtonUrl"
                      value={contentSettings.marketingButtonUrl}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          marketingButtonUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homeMarketingButtonText">
                      Homepage Marketing Button Text
                    </Label>
                    <Input
                      id="homeMarketingButtonText"
                      value={contentSettings.homeMarketingButtonText}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          homeMarketingButtonText: e.target.value,
                        })
                      }
                      placeholder="Marketing for Dumpster Rentals"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homeMarketingButtonUrl">
                      Homepage Marketing Button URL
                    </Label>
                    <Input
                      id="homeMarketingButtonUrl"
                      value={contentSettings.homeMarketingButtonUrl}
                      onChange={(e) =>
                        setContentSettings({
                          ...contentSettings,
                          homeMarketingButtonUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                    />
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
                      placeholder="Enter your privacy policy content..."
                    />
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
                      placeholder="Enter your terms of service content..."
                    />
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
                      rows={5}
                      placeholder="Enter footer content..."
                    />
                  </div>
                </div>

                <Button onClick={handleSaveContentSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Content Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Marketing Tab */}
          {activeTab === "marketing" && (
            <Card>
              <CardHeader>
                <CardTitle>Marketing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="facebookGroupEnabled"
                      checked={marketingSettings.facebookGroupEnabled}
                      onCheckedChange={(checked) =>
                        setMarketingSettings({
                          ...marketingSettings,
                          facebookGroupEnabled: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="facebookGroupEnabled">
                      Enable Facebook Group CTA
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebookGroupUrl">Facebook Group URL</Label>
                    <Input
                      id="facebookGroupUrl"
                      value={marketingSettings.facebookGroupUrl}
                      onChange={(e) =>
                        setMarketingSettings({
                          ...marketingSettings,
                          facebookGroupUrl: e.target.value,
                        })
                      }
                      placeholder="https://facebook.com/groups/your-group"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebookCtaTitle">Facebook CTA Title</Label>
                    <Input
                      id="facebookCtaTitle"
                      value={marketingSettings.facebookCtaTitle}
                      onChange={(e) =>
                        setMarketingSettings({
                          ...marketingSettings,
                          facebookCtaTitle: e.target.value,
                        })
                      }
                      placeholder="Join Our Community!"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebookCtaText">
                      Facebook CTA Description
                    </Label>
                    <Textarea
                      id="facebookCtaText"
                      value={marketingSettings.facebookCtaText}
                      onChange={(e) =>
                        setMarketingSettings({
                          ...marketingSettings,
                          facebookCtaText: e.target.value,
                        })
                      }
                      placeholder="Connect with waste management professionals."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebookButtonText">
                      Facebook Button Text
                    </Label>
                    <Input
                      id="facebookButtonText"
                      value={marketingSettings.facebookButtonText}
                      onChange={(e) =>
                        setMarketingSettings({
                          ...marketingSettings,
                          facebookButtonText: e.target.value,
                        })
                      }
                      placeholder="Join Group"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveMarketingSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Marketing Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* System Settings Tab */}
          {activeTab === "system" && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSystemSettings({
                          ...systemSettings,
                          maintenanceMode: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="maintenanceMode">
                      Enable Maintenance Mode
                    </Label>
                  </div>
                </div>

                <Button onClick={handleSaveSystemSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save System Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* API Keys Tab */}
          {activeTab === "api" && (
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    API configuration has been moved to environment variables for security.
                    Contact your system administrator for API key management.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Code Tab */}
          {activeTab === "code" && (
            <Card>
              <CardHeader>
                <CardTitle>Custom Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Custom code changes will be
                    applied system-wide. Make sure to test thoroughly and only
                    include trusted code to maintain security.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="headCode">HTML Head Code</Label>
                    <Textarea
                      id="headCode"
                      value={codeSettings.headCode}
                      onChange={(e) =>
                        setCodeSettings({
                          ...codeSettings,
                          headCode: e.target.value,
                        })
                      }
                      rows={8}
                      placeholder="<!-- Code to be inserted in <head> section -->"
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      This code will be inserted in the HTML head section of all
                      pages. Use for analytics, meta tags, or external
                      resources.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyCode">HTML Body Code</Label>
                    <Textarea
                      id="bodyCode"
                      value={codeSettings.bodyCode}
                      onChange={(e) =>
                        setCodeSettings({
                          ...codeSettings,
                          bodyCode: e.target.value,
                        })
                      }
                      rows={8}
                      placeholder="<!-- Code to be inserted before closing </body> tag -->"
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      This code will be inserted before the closing body tag on
                      all pages. Use for tracking scripts or chat widgets.
                    </p>
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
                      rows={12}
                      placeholder="/* Add your custom CSS styles here */
.custom-class {
  color: #333;
  font-size: 16px;
}"
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Add custom CSS styles to override default styling. These
                      styles will be applied site-wide.
                    </p>
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
                      rows={12}
                      placeholder="// Add your custom JavaScript here
// This code will be executed on all pages

document.addEventListener('DOMContentLoaded', function() {
  // Your custom code here
});"
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Add custom JavaScript functionality. Code will be executed
                      on all pages. Ensure proper error handling and testing.
                    </p>
                  </div>
                </div>

                <Button onClick={handleSaveCodeSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Custom Code
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
