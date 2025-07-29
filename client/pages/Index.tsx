import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FacebookCTA from "@/components/FacebookCTA";
import AdSense from "@/components/AdSense";
import SearchForm, { SearchParams } from "@/components/SearchForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Shield,
  Users,
  Recycle,
  Trash2,
  Building2,
  HardHat,
  Star,
  ArrowRight,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [locationCounts, setLocationCounts] = useState({
    total: 0,
    landfills: 0,
    transferStations: 0,
    constructionLandfills: 0,
  });
  const [contentSettings, setContentSettings] = useState({
    homeMarketingButtonText: "Marketing for Dumpster Rentals",
    homeMarketingButtonUrl: "https://yourmarketingagency.com",
  });

  useEffect(() => {
    // Load real location counts from localStorage
    const savedLocations = localStorage.getItem("locations");
    if (savedLocations) {
      try {
        const locations = JSON.parse(savedLocations);
        const total = locations.length;
        const landfills = locations.filter(
          (loc: any) => loc.facilityType === "landfill",
        ).length;
        const transferStations = locations.filter(
          (loc: any) => loc.facilityType === "transfer_station",
        ).length;
        const constructionLandfills = locations.filter(
          (loc: any) => loc.facilityType === "construction_landfill",
        ).length;

        setLocationCounts({
          total,
          landfills,
          transferStations,
          constructionLandfills,
        });
      } catch (error) {
        console.error("Error loading location counts:", error);
      }
    }

    // Load content settings
    const savedContentSettings = localStorage.getItem("contentSettings");
    if (savedContentSettings) {
      try {
        const parsed = JSON.parse(savedContentSettings);
        setContentSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error loading content settings:", error);
      }
    }
  }, []);

  const handleSearch = async (searchParams: SearchParams) => {
    setIsSearching(true);

    // Build URL parameters
    const params = new URLSearchParams();
    params.set("zipCode", searchParams.zipCode);
    params.set("radius", searchParams.radius.toString());
    if (searchParams.facilityTypes.length > 0) {
      params.set("facilityTypes", searchParams.facilityTypes.join(","));
    }
    if (searchParams.debrisTypes.length > 0) {
      params.set("debrisTypes", searchParams.debrisTypes.join(","));
    }

    // Simulate brief loading time for better UX
    setTimeout(() => {
      navigate(`/all-locations?${params.toString()}`);
      setIsSearching(false);
    }, 500);
  };

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Find Nearby Locations",
      description:
        "Locate landfills, transfer stations, and construction locations near you",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-Time Information",
      description: "Get up-to-date hours, contact details, and location status",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Verified Listings",
      description:
        "All locations are verified and regularly updated by our team",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Reviews",
      description:
        "Read and leave reviews to help others find the best locations",
    },
  ];

  const facilityTypes = [
    {
      icon: <Trash2 className="w-8 h-8" />,
      title: "Municipal Landfills",
      description:
        "General waste disposal locations for household and commercial waste",
      count: locationCounts.landfills.toLocaleString(),
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Transfer Stations",
      description: "Intermediate locations for waste sorting and transfer",
      count: locationCounts.transferStations.toLocaleString(),
    },
    {
      icon: <HardHat className="w-8 h-8" />,
      title: "Construction Landfills",
      description:
        "Specialized locations for construction and demolition debris",
      count: locationCounts.constructionLandfills.toLocaleString(),
    },
  ];

  const recentReviews = [
    {
      location: "Green Valley Landfill",
      rating: 5,
      author: "Mike T.",
      comment: "Fast service and fair pricing. Staff was very helpful.",
    },
    {
      location: "Metro Transfer Station",
      rating: 4,
      author: "Sarah L.",
      comment: "Clean location with good hours. Easy to find and navigate.",
    },
    {
      location: "Capitol Construction Landfill",
      rating: 5,
      author: "John D.",
      comment:
        "Accepts all types of construction debris. Professional operation.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Find Waste Disposal Locations
              <span className="text-primary block">Near You</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Search our comprehensive database of landfills, transfer stations,
              and construction locations across the United States
            </p>
          </div>

          {/* Marketing CTA Button */}
          <div className="max-w-xl mx-auto mb-8">
            <Button
              asChild
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-3 text-lg shadow-lg"
            >
              <a
                href={contentSettings.homeMarketingButtonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Click: {contentSettings.homeMarketingButtonText}
              </a>
            </Button>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchForm
              onSearch={handleSearch}
              isLoading={isSearching}
              showAdvanced={false}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {locationCounts.total.toLocaleString()}
              </div>
              <div className="text-muted-foreground">Verified Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50</div>
              <div className="text-muted-foreground">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <AdSense placement="homepage" className="py-6 px-4" />

      {/* Location Types Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Types of Locations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We maintain a comprehensive database of all waste disposal
              location types
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilityTypes.map((type, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {type.description}
                  </p>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {type.count} locations
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose WasteFinder?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The most comprehensive and reliable waste facility database
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facebook CTA Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <FacebookCTA
            facebookUrl="https://facebook.com/groups/wastefindergroup"
            className="mb-0"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Find Your Nearest Location?
          </h2>
          <div className="flex justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Search Locations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
