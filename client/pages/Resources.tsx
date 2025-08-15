import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Download,
  Globe,
  Search,
  Target,
  TrendingUp,
  Users,
  FileText,
  Smartphone,
  BarChart3,
  ArrowRight,
} from "lucide-react";

interface FreeResource {
  title: string;
  description: string;
  icon: React.ReactNode;
  downloadUrl: string;
  format: string;
  isInternalLink?: boolean;
}

export default function Resources() {
  const freeResources: FreeResource[] = [
    {
      title: "Free Dumpster Rental Contract Template",
      description:
        "Professional contract template for dumpster rental agreements with all necessary legal provisions.",
      icon: <FileText className="w-8 h-8" />,
      downloadUrl: "#",
      format: "PDF & Word Doc",
    },
    {
      title: "Pricing Calculator Spreadsheet",
      description:
        "Excel template to calculate competitive pricing for different dumpster sizes and rental periods.",
      icon: <BarChart3 className="w-8 h-8" />,
      downloadUrl: "#",
      format: "Excel",
    },
    {
      title: "Customer Intake Form",
      description:
        "Streamlined form template to collect essential customer information for bookings.",
      icon: <Users className="w-8 h-8" />,
      downloadUrl: "#",
      format: "PDF & Word Doc",
    },
    {
      title: "Debris Weight Calculator",
      description:
        "Convert between pounds and cubic yards for different types of debris and waste materials.",
      icon: <BarChart3 className="w-8 h-8" />,
      downloadUrl: "/debris-weight-calculator",
      format: "Online Tool",
      isInternalLink: true,
    },
  ];

  const marketingServices = [
    {
      title: "Website Design & Development",
      description:
        "Custom websites designed specifically for dumpster rental and junk removal companies with booking systems and online quotes.",
      features: [
        "Mobile-responsive design",
        "Online booking system",
        "Quote calculator",
        "SEO-optimized",
      ],
      icon: <Globe className="w-8 h-8" />,
      price: "Starting at $2,497",
    },
    {
      title: "Local SEO Services",
      description:
        "Dominate local search results and get found by customers in your service area when they need dumpster rentals.",
      features: [
        "Google My Business optimization",
        "Local directory listings",
        "Review management",
        "Local keyword targeting",
      ],
      icon: <Search className="w-8 h-8" />,
      price: "Starting at $497/month",
    },
    {
      title: "Google Ads Management",
      description:
        "Targeted advertising campaigns that connect you with customers actively searching for dumpster rentals.",
      features: [
        "Keyword research & bidding",
        "Ad copy optimization",
        "Landing page creation",
        "Conversion tracking",
      ],
      icon: <Target className="w-8 h-8" />,
      price: "Starting at $797/month",
    },
    {
      title: "Social Media Marketing",
      description:
        "Build your brand presence and engage with local customers through strategic social media marketing.",
      features: [
        "Content creation",
        "Facebook & Instagram ads",
        "Community engagement",
        "Brand building",
      ],
      icon: <Smartphone className="w-8 h-8" />,
      price: "Starting at $397/month",
    },
  ];

  const caseStudies = [
    {
      company: "Metro Dumpster Rentals",
      location: "Dallas, TX",
      results: "300% increase in online bookings",
      timeframe: "6 months",
      services: ["Website Design", "Local SEO", "Google Ads"],
    },
    {
      company: "Quick Haul Junk Removal",
      location: "Phoenix, AZ",
      results: "250% ROI on ad spend",
      timeframe: "4 months",
      services: ["Google Ads", "Landing Pages"],
    },
    {
      company: "City Wide Waste Solutions",
      location: "Miami, FL",
      results: "Page 1 Google rankings for 15+ keywords",
      timeframe: "8 months",
      services: ["Local SEO", "Content Marketing"],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Grow Your Dumpster Rental Business
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Free resources and professional marketing services to help you
              dominate your local market
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#free-resources">
                  Download Free Templates
                  <Download className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#marketing-services">View Marketing Services</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Free Resources Section */}
        <section id="free-resources" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Free Business Resources
              </h2>
              <p className="text-xl text-muted-foreground">
                Download professional templates to streamline your operations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {freeResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-primary mb-4">{resource.icon}</div>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{resource.format}</Badge>
                      <Button asChild>
                        {resource.isInternalLink ? (
                          <Link to={resource.downloadUrl}>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Open Tool
                          </Link>
                        ) : (
                          <a href={resource.downloadUrl}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing Services Section */}
        <section id="marketing-services" className="py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Professional Marketing Services
              </h2>
              <p className="text-xl text-muted-foreground">
                Specialized digital marketing for dumpster rental and junk
                removal companies
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {marketingServices.map((service, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-primary">{service.icon}</div>
                      <div>
                        <CardTitle className="text-xl">
                          {service.title}
                        </CardTitle>
                        <p className="text-sm text-primary font-semibold">
                          {service.price}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" asChild>
                      <a
                        href="https://yourmarketingagency.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
              <p className="text-xl text-muted-foreground">
                See how we've helped other businesses grow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{study.company}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {study.location}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {study.results}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        in {study.timeframe}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Services Used:</p>
                      <div className="flex flex-wrap gap-1">
                        {study.services.map((service, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Get a free marketing consultation and see how we can help you get
              more customers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                <a
                  href="https://yourmarketingagency.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Schedule Free Consultation
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Call (555) 123-4567
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
