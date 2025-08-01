import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Clock, DollarSign, Star, Truck, Home, Building, Trash2 } from "lucide-react";

export default function LocalJunkRemoval() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Local Junk Removal Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find trusted, professional junk removal services in your area. From furniture and appliances 
              to construction debris and estate cleanouts, connect with local experts who get the job done right.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Find Local Junk Removal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-business" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  For Business Owners
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
                How Professional Junk Removal Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Watch this comprehensive guide to understanding the junk removal process, 
                pricing, and what to expect when hiring professional services.
              </p>
            </div>
            
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Professional Junk Removal Services Guide"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Types of Junk Removal Services
              </h2>
              <p className="text-lg text-muted-foreground">
                Professional junk removal companies handle a wide variety of items and situations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Home className="w-8 h-8 text-blue-600" />
                    <CardTitle>Residential Cleanouts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Furniture and appliances</li>
                    <li>• Electronics and TVs</li>
                    <li>• Mattresses and box springs</li>
                    <li>• Household clutter</li>
                    <li>• Garage and basement cleanouts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Building className="w-8 h-8 text-green-600" />
                    <CardTitle>Commercial Services</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Office furniture removal</li>
                    <li>• Retail store cleanouts</li>
                    <li>• Warehouse clearance</li>
                    <li>• Restaurant equipment</li>
                    <li>• Construction debris</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Truck className="w-8 h-8 text-purple-600" />
                    <CardTitle>Specialty Removal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Hot tubs and spas</li>
                    <li>• Piano and organ removal</li>
                    <li>• Estate cleanouts</li>
                    <li>• Hoarding situations</li>
                    <li>• Foreclosure cleanouts</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Professional Services */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Professional Junk Removal?
              </h2>
              <p className="text-lg text-muted-foreground">
                Save time, avoid injury, and ensure proper disposal with professional services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Save Time & Effort</h3>
                    <p className="text-muted-foreground text-sm">
                      Professional crews handle all the heavy lifting, loading, and disposal, 
                      saving you hours of back-breaking work.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Proper Disposal</h3>
                    <p className="text-muted-foreground text-sm">
                      Items are recycled, donated, or disposed of responsibly according to 
                      local regulations and environmental standards.
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
                    <h3 className="font-semibold mb-2">Transparent Pricing</h3>
                    <p className="text-muted-foreground text-sm">
                      Most companies offer upfront pricing based on volume, with no hidden fees 
                      or surprise charges.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Local Expertise</h3>
                    <p className="text-muted-foreground text-sm">
                      Local companies know the area, disposal regulations, and can navigate 
                      tight spaces and challenging removals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Licensed & Insured</h3>
                    <p className="text-muted-foreground text-sm">
                      Professional companies carry proper licensing and insurance, protecting 
                      you from liability during the removal process.
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
                    <h3 className="font-semibold mb-2">Full-Service Solution</h3>
                    <p className="text-muted-foreground text-sm">
                      From pickup scheduling to final disposal, professional services handle 
                      every step of the junk removal process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Clear Out Your Space?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Connect with vetted, professional junk removal companies in your area. 
              Get instant quotes and schedule your removal today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/get-quotes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get Free Quotes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <a 
                  href="https://yourmarketingagency.com/call" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Call Now: (555) 123-JUNK
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
