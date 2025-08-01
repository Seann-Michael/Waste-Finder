import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Clock, DollarSign, Star, Truck, Home, Building, Package, Calendar } from "lucide-react";

export default function LocalDumpsterRental() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Local Dumpster Rental Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find reliable dumpster rental services for your project. From home renovations 
              and construction sites to large cleanouts, get the right size container delivered when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/dumpster-rental" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Find Local Dumpster Rentals
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/dumpster-business" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  For Rental Companies
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* YouTube Video Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Dumpster Rental Guide: What You Need to Know
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn about dumpster sizes, rental periods, pricing, and what materials 
                are accepted in this comprehensive guide to dumpster rentals.
              </p>
            </div>
            
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Complete Dumpster Rental Guide"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Dumpster Sizes */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Dumpster Sizes for Every Project
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose the right size container for your specific needs and budget
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-3">Most Popular</Badge>
                    <CardTitle className="text-2xl font-bold text-blue-600">10 Yard</CardTitle>
                    <p className="text-sm text-muted-foreground">12' L × 8' W × 4' H</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold">$299-399</p>
                    <p className="text-sm text-muted-foreground">avg. rental price</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>• Small bathroom renovation</li>
                    <li>• Garage cleanout</li>
                    <li>• Small deck removal</li>
                    <li>• 1-2 room cleanouts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-center">
                    <CardTitle className="text-2xl font-bold text-green-600">20 Yard</CardTitle>
                    <p className="text-sm text-muted-foreground">22' L × 8' W × 4.5' H</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold">$349-449</p>
                    <p className="text-sm text-muted-foreground">avg. rental price</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>• Kitchen renovation</li>
                    <li>• Large room addition</li>
                    <li>• Roof shingles (20 sq)</li>
                    <li>• Multi-room cleanouts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-center">
                    <CardTitle className="text-2xl font-bold text-purple-600">30 Yard</CardTitle>
                    <p className="text-sm text-muted-foreground">22' L × 8' W × 6' H</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold">$399-549</p>
                    <p className="text-sm text-muted-foreground">avg. rental price</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>• Whole home renovation</li>
                    <li>• Large addition</li>
                    <li>• Estate cleanouts</li>
                    <li>• Commercial projects</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-center">
                    <CardTitle className="text-2xl font-bold text-orange-600">40 Yard</CardTitle>
                    <p className="text-sm text-muted-foreground">22' L × 8' W × 8' H</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold">$449-649</p>
                    <p className="text-sm text-muted-foreground">avg. rental price</p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li>• Large construction</li>
                    <li>• Commercial demo</li>
                    <li>• Major cleanouts</li>
                    <li>• Industrial projects</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Project Types */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Perfect for Any Project Type
              </h2>
              <p className="text-lg text-muted-foreground">
                Professional dumpster rentals serve residential, commercial, and industrial needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Home className="w-8 h-8 text-blue-600" />
                    <CardTitle>Residential Projects</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Home renovations & remodeling</li>
                    <li>• Spring cleaning & decluttering</li>
                    <li>• Landscaping & yard waste</li>
                    <li>• Roofing projects</li>
                    <li>• Moving cleanouts</li>
                    <li>• Estate & foreclosure cleanouts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building className="w-8 h-8 text-green-600" />
                    <CardTitle>Commercial Use</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Office building cleanouts</li>
                    <li>• Retail store renovations</li>
                    <li>• Restaurant construction</li>
                    <li>• Warehouse cleanups</li>
                    <li>• Shopping center maintenance</li>
                    <li>• Property management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-purple-600" />
                    <CardTitle>Construction & Demo</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• New construction sites</li>
                    <li>• Demolition projects</li>
                    <li>• Concrete & masonry waste</li>
                    <li>• Drywall & lumber disposal</li>
                    <li>• Industrial cleanups</li>
                    <li>• Contractor services</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Local Rental Companies */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Local Dumpster Rentals?
              </h2>
              <p className="text-lg text-muted-foreground">
                Local companies offer better service, competitive pricing, and community expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Local Knowledge</h3>
                    <p className="text-muted-foreground text-sm">
                      Local companies understand permit requirements, placement restrictions, 
                      and neighborhood regulations in your area.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Faster Delivery</h3>
                    <p className="text-muted-foreground text-sm">
                      Shorter travel distances mean quicker delivery and pickup times, 
                      often same-day or next-day service.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Competitive Pricing</h3>
                    <p className="text-muted-foreground text-sm">
                      Lower transportation costs and local competition often result in 
                      better pricing than national chains.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Personal Service</h3>
                    <p className="text-muted-foreground text-sm">
                      Deal directly with owners and local staff who care about their 
                      reputation and community relationships.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
                    <p className="text-muted-foreground text-sm">
                      Local companies can often accommodate last-minute changes and 
                      work around your project timeline.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Proper Disposal</h3>
                    <p className="text-muted-foreground text-sm">
                      Local companies follow area disposal regulations and work with 
                      nearby landfills and recycling facilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Rent a Dumpster?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Get instant quotes from local dumpster rental companies. Compare prices, 
              sizes, and availability to find the perfect solution for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/dumpster-quotes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get Free Quotes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-green-600" asChild>
                <a 
                  href="https://yourmarketingagency.com/dumpster-call" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Call: (555) 123-DUMP
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
