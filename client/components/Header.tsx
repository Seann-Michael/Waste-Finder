import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if user is admin to show banner edit option
  const isAdmin = localStorage.getItem("adminLoggedIn");

  // Dynamic content from localStorage
  const [contentSettings, setContentSettings] = useState({
    bannerText: "🔥 Get more customers for your dumpster rental business - Click here for proven marketing strategies!",
    bannerUrl: "https://yourmarketingagency.com",
    marketingButtonText: "Marketing for Dumpster Rentals",
    marketingButtonUrl: "https://yourmarketingagency.com",
  });

  useEffect(() => {
    // Load content settings from localStorage
    const savedSettings = localStorage.getItem("contentSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setContentSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error loading content settings:", error);
      }
    }
  }, []);

  const navigation = [
    { name: "Home", href: "/", active: location.pathname === "/" },
    {
      name: "All Locations",
      href: "/all-locations",
      active: location.pathname === "/all-locations",
    },
    {
      name: "Learn",
      href: "/blog",
      active: location.pathname.startsWith("/blog"),
    },
    {
      name: "Suggest Location",
      href: "/suggest-location",
      active: location.pathname === "/suggest-location",
    },
  ];

  return (
    <>
      {/* Admin Editable Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        <a href={contentSettings.bannerUrl} target="_blank" rel="noopener noreferrer">
          {contentSettings.bannerText}
        </a>
        {isAdmin && (
          <Link to="/admin/settings?tab=content" className="ml-2 text-xs underline hover:no-underline">
            [Edit Banner]
          </Link>
        )}
      </div>

      {/* Admin Indicator */}
      {isAdmin && (
        <div className="bg-yellow-500 text-black py-1 px-4 text-center text-xs font-medium">
          <div className="flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            <span>ADMIN MODE - You are logged in as administrator</span>
            <Link to="/admin" className="ml-2 underline hover:no-underline">
              Go to Admin Dashboard
            </Link>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">
                WasteFinder
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        item.active
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {window.location.origin}
                      {item.href}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>

            {/* Business Owner CTA - Fixed visibility */}
            <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
              <Button
                variant="default"
                size="sm"
                asChild
                className="text-xs sm:text-sm bg-green-600 text-white hover:bg-green-700 border-green-600"
              >
                <a
                  href="https://yourmarketingagency.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 sm:px-3"
                >
                  <span className="hidden md:inline">
                    Marketing for Dumpster Rentals
                  </span>
                  <span className="md:hidden">Get Customers</span>
                </a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="sm:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-base font-medium transition-colors py-2 px-1",
                      item.active ? "text-primary" : "text-muted-foreground",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  asChild
                  className="w-full mt-2 bg-green-600 text-white hover:bg-green-700"
                >
                  <a
                    href="https://yourmarketingagency.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Marketing for Dumpster Rentals
                  </a>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
