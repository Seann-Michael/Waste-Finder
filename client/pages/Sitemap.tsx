import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Home,
  MapPin,
  BookOpen,
  Globe,
  Calculator,
  Scale,
  MessageSquare,
  Edit,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function Sitemap() {
  const siteStructure = [
    {
      category: "Main Pages",
      icon: <Home className="w-5 h-5" />,
      links: [
        {
          name: "Home",
          url: "/",
          description: "Main homepage with location search",
        },
        {
          name: "All Locations",
          url: "/all-locations",
          description: "Browse all waste disposal locations",
        },
        {
          name: "Suggest Location",
          url: "/suggest-location",
          description: "Suggest a new disposal location",
        },
        {
          name: "Resources",
          url: "/resources",
          description: "Helpful waste management resources",
        },
        {
          name: "Contact Us",
          url: "/contact",
          description: "Get in touch with us",
        },
      ],
    },
    {
      category: "News",
      icon: <BookOpen className="w-5 h-5" />,
      links: [
        {
          name: "Industry News",
          url: "/news",
          description: "Current waste management news",
        },
        {
          name: "Guest Post",
          url: "/guest-post",
          description: "Submit a guest post",
        },
      ],
    },
    {
      category: "Tools & Calculators",
      icon: <Calculator className="w-5 h-5" />,
      links: [
        {
          name: "Pricing Calculator",
          url: "/pricing-calculator",
          description: "Calculate waste disposal costs",
        },
        {
          name: "Debris Weight Calculator",
          url: "/debris-weight-calculator",
          description: "Estimate debris weight",
        },
      ],
    },
    {
      category: "Marketing Services - Junk Removal",
      icon: <Users className="w-5 h-5" />,
      links: [
        {
          name: "Digital Marketing for Junk Removal",
          url: "/digital-marketing-junk-removal",
          description: "Grow your junk removal business online",
        },
        {
          name: "Local SEO for Junk Removal",
          url: "/local-seo-junk-removal",
          description: "Rank higher in local search results",
        },
        {
          name: "Local Junk Removal Companies",
          url: "/local-junk-removal",
          description: "Find local junk removal services",
        },
      ],
    },
    {
      category: "Marketing Services - Dumpster Rental",
      icon: <Globe className="w-5 h-5" />,
      links: [
        {
          name: "Digital Marketing for Dumpster Rental",
          url: "/digital-marketing-dumpster-rental",
          description: "Grow your dumpster rental business",
        },
        {
          name: "Local SEO for Dumpster Rental",
          url: "/local-seo-dumpster-rental",
          description: "Dominate local dumpster rental searches",
        },
        {
          name: "Local Dumpster Rental Companies",
          url: "/local-dumpster-rental",
          description: "Find local dumpster rental services",
        },
      ],
    },
    {
      category: "General Marketing Services",
      icon: <Edit className="w-5 h-5" />,
      links: [
        {
          name: "Digital Marketing",
          url: "/digital-marketing",
          description: "Complete digital marketing solutions",
        },
        {
          name: "Local SEO Services",
          url: "/local-seo",
          description: "Local search engine optimization",
        },
        {
          name: "Lead Generation",
          url: "/lead-generation",
          description: "Generate qualified leads for your business",
        },
      ],
    },
    {
      category: "Admin",
      icon: <FileText className="w-5 h-5" />,
      links: [
        {
          name: "Admin Login",
          url: "/admin-login",
          description: "Administrator access",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Site Map</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Navigate through all pages and resources available on WasteFinder
            </p>
          </div>

          {/* Site Structure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {siteStructure.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {section.icon}
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <div
                        key={linkIndex}
                        className="border-b border-border last:border-0 pb-3 last:pb-0"
                      >
                        <Link
                          to={link.url}
                          className="flex items-center justify-between group hover:text-primary transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium group-hover:underline">
                              {link.name}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {link.description}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About This Sitemap</h2>
                <div className="text-muted-foreground space-y-2 max-w-4xl mx-auto">
                  <p>
                    This sitemap provides a comprehensive overview of all pages
                    and resources available on WasteFinder. Our platform helps
                    users find waste disposal locations, access helpful tools,
                    and provides marketing services for waste management
                    businesses.
                  </p>
                  <p className="mt-4">
                    <strong>Last Updated:</strong>{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-2 text-sm">
                    For technical SEO purposes, an XML sitemap is automatically
                    generated and submitted to search engines.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
