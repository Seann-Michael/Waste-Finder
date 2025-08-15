import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, Search, MapPin, BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [suggestedRoute, setSuggestedRoute] = useState<string | null>(null);

  // Common route mappings for typos and variations
  const routeMap: Record<string, string> = {
    "/SuggestLocation": "/suggest-location",
    "/suggestlocation": "/suggest-location",
    "/AllLocations": "/all-locations",
    "/alllocations": "/all-locations",
    "/Blog": "/blog",
    "/BlogPost": "/blog",
    "/blogpost": "/blog",
    "/News": "/news",
    "/Resources": "/resources",
    "/Locations": "/all-locations",
    "/locations": "/all-locations",
  };

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );

    // Check if we have a suggested route for this typo
    const suggested = routeMap[location.pathname];
    if (suggested) {
      setSuggestedRoute(suggested);
    }
  }, [location.pathname]);

  const popularPages = [
    {
      name: "Find Locations",
      path: "/all-locations",
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      name: "Blog & News",
      path: "/blog",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      name: "Suggest Location",
      path: "/suggest-location",
      icon: <MapPin className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <AlertCircle className="w-24 h-24 text-orange-500 mx-auto mb-6" />
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>

            {/* Show suggested route if available */}
            {suggestedRoute && (
              <Card className="mb-8 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-blue-800 mb-4">
                    Did you mean to visit this page instead?
                  </p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link to={suggestedRoute}>Go to {suggestedRoute}</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Button asChild variant="default" size="lg" className="h-12">
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12">
              <Link to="/all-locations">
                <Search className="w-5 h-5 mr-2" />
                Find Locations
              </Link>
            </Button>
          </div>

          {/* Popular pages */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {popularPages.map((page) => (
                  <Button
                    key={page.path}
                    asChild
                    variant="ghost"
                    className="justify-start h-10"
                  >
                    <Link to={page.path}>
                      {page.icon}
                      <span className="ml-2">{page.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Debug info */}
          <div className="mt-8 text-xs text-gray-500">
            Requested URL: {location.pathname}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
