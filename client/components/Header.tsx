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
    bannerText:
      "🔥 Get more customers for your dumpster rental business - Click here for proven marketing strategies!",
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
        setContentSettings((prev) => ({ ...prev, ...parsed }));
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
      name: "Pricing Calculator",
      href: "/pricing-calculator",
      active: location.pathname === "/pricing-calculator",
    },
    {
      name: "Debris Calculator",
      href: "/debris-weight-calculator",
      active: location.pathname === "/debris-weight-calculator",
    },
    {
      name: "Learn",
      href: "/blog",
      active: location.pathname.startsWith("/blog"),
    },
    {
      name: "News",
      href: "/news",
      active: location.pathname === "/news",
    },
    {
      name: "Suggest Location",
      href: "/suggest-location",
      active: location.pathname === "/suggest-location",
    },
    {
      name: "Contact",
      href: "/contact",
      active: location.pathname === "/contact",
    },
  ];

  return (
    <>
      {/* Sticky Header Container with iOS Safari fixes */}
      <div className="mobile-header-fix">
        {/* Marketing Banner - Only show if not admin or prioritize admin banner */}
        {!isAdmin && (
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 text-center text-sm">
            <a
              href={contentSettings.bannerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {contentSettings.bannerText}
            </a>
          </div>
        )}

        {/* Admin Indicator - Replaces marketing banner when admin logged in */}
        {isAdmin && (
          <div className="bg-orange-500 text-white py-2 px-4 text-xs font-medium text-center">
            <Link
              to="/admin"
              className="flex items-center justify-center gap-2 hover:underline"
            >
              <Shield className="w-3 h-3" />
              <span>ADMIN MODE ACTIVE</span>
            </Link>
          </div>
        )}

        <header className="bg-white border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  DumpNearMe
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
                  className="text-xs sm:text-sm bg-green-600 text-white hover:bg-green-700 border-green-600 px-2"
                >
                  <a
                    href={contentSettings.marketingButtonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="hidden md:inline">
                      Click: {contentSettings.marketingButtonText}
                    </span>
                    <span className="md:hidden">Get Marketing</span>
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
              <div className="sm:hidden py-4 border-t border-border max-h-96 overflow-y-auto">
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
                      href="/local-dumpster-rental"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Marketing for Dumpster Rentals
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <a
                      href="/local-junk-removal"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Marketing for Junk Removal
                    </a>
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </header>
      </div>
    </>
  );
}
