import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Shield, Users, Target } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Our Mission",
      description:
        "To make waste disposal information accessible to everyone across the United States, helping communities find the right facilities for their needs.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Reliability",
      description:
        "We maintain accurate, up-to-date information about facilities, hours, and services through continuous verification and community feedback.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description:
        "Our platform thrives on user contributions, reviews, and suggestions to keep improving the database for everyone.",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Comprehensive Coverage",
      description:
        "We cover all 50 states with detailed information about landfills, transfer stations, and construction disposal facilities.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            About WasteFinder
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The most comprehensive database of waste disposal facilities in the
            United States, helping individuals and businesses find the right
            disposal solutions.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <div className="prose max-w-none text-muted-foreground">
            <p className="text-lg mb-4">
              WasteFinder was created to solve a common problem: finding
              reliable information about waste disposal facilities. Whether
              you're a homeowner cleaning out your garage, a contractor with
              construction debris, or a business looking for regular waste
              services, finding the right facility shouldn't be a challenge.
            </p>
            <p className="text-lg mb-4">
              Our comprehensive database includes detailed information about
              landfills, municipal transfer stations, and construction landfills
              across all 50 states. We provide real-time information about
              operating hours, accepted materials, pricing, and contact details.
            </p>
            <p className="text-lg">
              With user reviews and community-driven updates, WasteFinder
              ensures you have the most accurate and helpful information to make
              informed decisions about waste disposal.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-primary mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-muted/30 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            By the Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2,600+</div>
              <div className="text-muted-foreground">Verified Facilities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50</div>
              <div className="text-muted-foreground">States Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                15,000+
              </div>
              <div className="text-muted-foreground">User Reviews</div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Questions or Suggestions?</h2>
          <p className="text-muted-foreground mb-6">
            We're always looking to improve our service and welcome feedback
            from our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Search Facilities
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
