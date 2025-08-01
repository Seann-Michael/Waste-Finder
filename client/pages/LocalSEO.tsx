import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin, Search, Star, Globe, Users, Target, BarChart3 } from "lucide-react";

export default function LocalSEO() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-orange-50 to-red-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Local SEO Services for Dumpster Rental & Junk Removal
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Dominate local search results and get found by customers in your service area. 
              Our specialized local SEO strategies help waste management companies rank #1 on Google.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/local-seo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Rank Higher on Google
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/seo-audit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Free SEO Audit
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Local SEO Benefits */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Local SEO is Critical for Your Business
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
                    Appear in Google's local pack when customers search for services in your area
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
                    Rank higher than competitors for local search terms and service keywords
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
                    Attract more qualified leads actively searching for your services
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
                Complete Local SEO Services
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to dominate local search results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                    Google My Business Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Complete profile setup and optimization</li>
                    <li>• Professional photos and virtual tours</li>
                    <li>• Regular posts and updates</li>
                    <li>• Review management and responses</li>
                    <li>• Q&A optimization</li>
                    <li>• Business hours and contact info</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-green-600" />
                    Local Citations & Directories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 50+ high-quality directory submissions</li>
                    <li>• NAP consistency across the web</li>
                    <li>• Industry-specific directories</li>
                    <li>• Citation cleanup and correction</li>
                    <li>• Local business listings</li>
                    <li>• Chamber of Commerce listings</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-purple-600" />
                    Service Area Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Location-specific landing pages</li>
                    <li>• City and neighborhood targeting</li>
                    <li>• Service area schema markup</li>
                    <li>• Local keyword optimization</li>
                    <li>• Geographic content strategy</li>
                    <li>• Competitor analysis by location</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                    Local SEO Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Local ranking tracking</li>
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

        {/* Process */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Proven Local SEO Process
              </h2>
              <p className="text-lg text-muted-foreground">
                A systematic approach to dominating local search results
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Local SEO Audit</h3>
                  <p className="text-muted-foreground">
                    Complete analysis of your current local presence, rankings, and competitor landscape
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-green-600">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Strategy Development</h3>
                  <p className="text-muted-foreground">
                    Custom local SEO strategy based on your service areas, competition, and business goals
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-purple-600">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Implementation</h3>
                  <p className="text-muted-foreground">
                    Execute optimization across all platforms - website, GMB, directories, and citations
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-orange-600">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Monitor & Optimize</h3>
                  <p className="text-muted-foreground">
                    Continuous monitoring, reporting, and optimization to improve rankings and leads
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Dominate Local Search?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Get a free local SEO audit and see exactly how you can outrank your competition 
              and capture more customers in your service area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/local-seo-audit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get Free Local SEO Audit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-orange-600" asChild>
                <a 
                  href="https://yourmarketingagency.com/local-seo-call" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Call: (555) 123-RANK
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
