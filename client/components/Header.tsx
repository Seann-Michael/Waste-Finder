import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if user is admin to show banner edit option
  const isAdmin = localStorage.getItem("adminLoggedIn");

  const navigation = [
    { name: "Home", href: "/", active: location.pathname === "/" },
    {
      name: "All Locations",
      href: "/all-locations",
      active: location.pathname === "/all-locations",
    },
    {
      name: "Suggest Location",
      href: "/suggest-location",
      active: location.pathname === "/suggest-location",
    },
  ];

  return (
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
              <Link
                key={item.name}
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
            ))}
          </nav>

          {/* Business Owner CTA */}
          <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs sm:text-sm"
            >
              <a
                href="https://yourmarketingagency.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-2 sm:px-3"
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
                className="w-full mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
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
  );
}
