import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin, Search, Star, Globe, Users, Target, BarChart3 } from "lucide-react";

export default function LocalSEODumpsterRental() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-green-50 to-blue-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Local SEO Services for Dumpster Rental Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Dominate local search results and get found by customers searching for dumpster rentals. 
              Our specialized local SEO strategies help dumpster rental companies rank #1 on Google.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/dumpster-rental-seo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Rank Higher for Dumpster Rental
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/dumpster-rental-seo-audit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Free SEO Audit
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits and Services sections similar to junk removal but with dumpster rental focus */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Local SEO is Critical for Dumpster Rental
              </h2>
              <p className="text-lg text-muted-foreground">
                Most customers search for "dumpster rental near me" - be there when they need you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Local Visibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Appear in Google's local pack when customers search for dumpster rental in your area
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Search className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Higher Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Rank higher than competitors for "dumpster rental near me" and related keywords
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">More Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Attract more qualified leads actively searching for dumpster rental services
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Star className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Build Trust</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Strong online presence and positive reviews build customer confidence
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Dominate Dumpster Rental Search Results?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Get a free local SEO audit and see exactly how you can outrank your competition 
              and capture more dumpster rental customers in your service area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/dumpster-rental-seo-audit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get Free Dumpster Rental SEO Audit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-green-600" asChild>
                <a 
                  href="https://yourmarketingagency.com/dumpster-rental-seo-call" 
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
