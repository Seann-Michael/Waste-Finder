import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";
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

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
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

  const [systemSettings, setSystemSettings] = useState({
    ghlApiKey: "",
    webhookUrl: "",
    googleMapsApiKey: "",
    bannerText:
      "🔥 Get more customers for your dumpster rental business - Click here for proven marketing strategies!",
    siteName: "WasteFinder",
    supportEmail: "support@wastefinder.com",
    maintenanceMode: false,
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
    { id: "system", label: "System Settings", icon: Settings },
    { id: "api", label: "API Keys", icon: Key },
    { id: "content", label: "Content Management", icon: Globe },
  ];

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    console.log("Saving profile:", profileData);
    alert("Profile updated successfully!");
  };

  const handleSaveSystemSettings = () => {
    // In a real app, this would make an API call
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

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setAdminUsers(adminUsers.filter((user) => user.id !== userId));
    }
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, users, and system configuration
          </p>
        </div>
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
                        setProfileData({ ...profileData, name: e.target.value })
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
                            <Button variant="ghost" size="sm">
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

                <div className="space-y-2">
                  <Label htmlFor="bannerText">Banner Text</Label>
                  <Textarea
                    id="bannerText"
                    value={systemSettings.bannerText}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        bannerText: e.target.value,
                      })
                    }
                    rows={3}
                  />
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
                <CardTitle>API Keys & Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ghlApiKey">GoHighLevel API Key</Label>
                    <div className="relative">
                      <Input
                        id="ghlApiKey"
                        type={showPasswords ? "text" : "password"}
                        value={systemSettings.ghlApiKey}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      value={systemSettings.webhookUrl}
                      onChange={(e) =>
                        setSystemSettings({
                          ...systemSettings,
                          webhookUrl: e.target.value,
                        })
                      }
                      placeholder="https://hooks.zapier.com/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleMapsApiKey">
                      Google Maps API Key
                    </Label>
                    <div className="relative">
                      <Input
                        id="googleMapsApiKey"
                        type={showPasswords ? "text" : "password"}
                        value={systemSettings.googleMapsApiKey}
                        onChange={(e) =>
                          setSystemSettings({
                            ...systemSettings,
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
                  </div>
                </div>

                <Button onClick={handleSaveSystemSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save API Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "content" && (
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Globe className="w-6 h-6 mb-2" />
                    <span>Edit Resources Page</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Lock className="w-6 h-6 mb-2" />
                    <span>Privacy Policy</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Globe className="w-6 h-6 mb-2" />
                    <span>Terms of Service</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Edit className="w-6 h-6 mb-2" />
                    <span>Footer Content</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
