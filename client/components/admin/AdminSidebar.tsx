import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Shield,
  BarChart3,
  MapPin,
  Upload,
  Settings,
  MessageSquare,
  Edit,
  Users,
  FileText,
  Home,
  Database,
  DollarSign,
  PenTool,
  Menu,
  X,
} from "lucide-react";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Locations",
    href: "/admin/locations",
    icon: Database,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    title: "Suggestions",
    href: "/admin/suggestions",
    icon: Edit,
  },
  {
    title: "Marketing",
    href: "/admin/marketing",
    icon: DollarSign,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: PenTool,
  },
  {
    title: "RSS Manager",
    href: "/admin/rss-manager",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggle(!isOpen)}
          className="bg-white shadow-md"
        >
          {isOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-64 bg-white border-l border-border shadow-sm z-30 overflow-y-auto transition-transform duration-300",
        "lg:right-auto lg:left-0 lg:border-r lg:border-l-0 lg:translate-x-0", // Always visible on large screens, positioned left
        isOpen ? "translate-x-0" : "translate-x-full" // Hidden on mobile unless open, slides from right
      )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-2">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => onToggle(false)} // Close mobile sidebar on navigation
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            );
          })}
        </div>

        <hr className="my-4" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
            Quick Actions
          </h3>
          <Link
            to="/"
            onClick={() => onToggle(false)} // Close mobile sidebar on navigation
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            View Site
          </Link>
          <Link
            to="/all-locations"
            onClick={() => onToggle(false)} // Close mobile sidebar on navigation
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Browse Locations
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>WasteFinder Admin</span>
          <span>v1.0</span>
        </div>
      </div>
    </div>
    </>
  );
}
