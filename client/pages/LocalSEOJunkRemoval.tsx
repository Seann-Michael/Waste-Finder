import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin, Search, Star, Globe, Users, Target, BarChart3 } from "lucide-react";

export default function LocalSEOJunkRemoval() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-orange-50 to-red-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Local SEO Services for Junk Removal Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Dominate local search results and get found by customers searching for junk removal services. 
              Our specialized local SEO strategies help junk removal companies rank #1 on Google.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-seo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Rank Higher for Junk Removal
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-seo-audit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Free SEO Audit
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Local SEO is Critical for Junk Removal
              </h2>
              <p className="text-lg text-muted-foreground">
                Most customers search for "junk removal near me" - be there when they need you
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
                    Appear in Google's local pack when customers search for junk removal in your area
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
                    Rank higher than competitors for "junk removal near me" and related keywords
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
                    Attract more qualified leads actively searching for junk removal services
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

        {/* Services */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Complete Local SEO Services for Junk Removal
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to dominate local junk removal searches
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                    Google My Business for Junk Removal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Complete junk removal business profile</li>
                    <li>• Before/after junk removal photos</li>
                    <li>• Service area optimization</li>
                    <li>• Junk removal review management</li>
                    <li>• Q&A optimization</li>
                    <li>• Business hours and contact info</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-green-600" />
                    Junk Removal Citations & Directories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 50+ high-quality directory submissions</li>
                    <li>• Junk removal specific directories</li>
                    <li>• Home services platforms</li>
                    <li>• Local business listings</li>
                    <li>• Citation cleanup and correction</li>
                    <li>• Chamber of Commerce listings</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-purple-600" />
                    Junk Removal Service Area Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• City-specific junk removal pages</li>
                    <li>• Neighborhood targeting</li>
                    <li>• Service type landing pages</li>
                    <li>• Local junk removal keywords</li>
                    <li>• Geographic content strategy</li>
                    <li>• Competitor analysis by location</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                    Junk Removal SEO Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• "Junk removal near me" ranking</li>
                    <li>• Google My Business insights</li>
                    <li>• Website traffic analysis</li>
                    <li>• Lead source tracking</li>
                    <li>• Competitor monitoring</li>
                    <li>• Monthly performance reports</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Dominate Junk Removal Search Results?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Get a free local SEO audit and see exactly how you can outrank your competition 
              and capture more junk removal customers in your service area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-seo-audit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get Free Junk Removal SEO Audit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-orange-600" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-seo-call" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Call: (555) 123-JUNK
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
