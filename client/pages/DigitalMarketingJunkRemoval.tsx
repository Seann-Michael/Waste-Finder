import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Globe, BarChart3, Target, Users, Smartphone, DollarSign } from "lucide-react";

export default function DigitalMarketingJunkRemoval() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Digital Marketing for Junk Removal Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Grow your junk removal business with proven digital marketing strategies. 
              We specialize in helping junk removal companies dominate their local markets and get more customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-marketing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get More Junk Removal Customers
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-audit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Free Marketing Audit
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Complete Digital Marketing Solutions for Junk Removal
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to grow your junk removal business online
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Search className="w-8 h-8 text-blue-600" />
                    <CardTitle>Local SEO for Junk Removal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• "Junk removal near me" optimization</li>
                    <li>• Google My Business for junk removal</li>
                    <li>• Local directory listings</li>
                    <li>• Service area page optimization</li>
                    <li>• Junk removal keyword targeting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-green-600" />
                    <CardTitle>Junk Removal Website Design</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Mobile-responsive junk removal sites</li>
                    <li>• Online booking for junk removal</li>
                    <li>• Before/after photo galleries</li>
                    <li>• Service pricing calculators</li>
                    <li>• Customer testimonial sections</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-purple-600" />
                    <CardTitle>Junk Removal Advertising</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Google Ads for junk removal</li>
                    <li>• Facebook junk removal ads</li>
                    <li>• Neighborhood targeting</li>
                    <li>• Seasonal campaign optimization</li>
                    <li>• Cost-per-lead optimization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-orange-600" />
                    <CardTitle>Social Media for Junk Removal</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Before/after transformation posts</li>
                    <li>• Local community engagement</li>
                    <li>• Neighborhood group marketing</li>
                    <li>• Customer review management</li>
                    <li>• Eco-friendly messaging</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-red-600" />
                    <CardTitle>Junk Removal Analytics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Lead tracking by service type</li>
                    <li>• Seasonal demand analysis</li>
                    <li>• Customer lifetime value</li>
                    <li>• Service area performance</li>
                    <li>• ROI reporting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-8 h-8 text-teal-600" />
                    <CardTitle>Mobile Marketing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Mobile-first junk removal sites</li>
                    <li>• Click-to-call optimization</li>
                    <li>• GPS-based targeting</li>
                    <li>• Emergency cleanout campaigns</li>
                    <li>• Mobile booking optimization</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Proven Results for Junk Removal Companies
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">250%</div>
                <p className="text-sm text-muted-foreground">Average increase in junk removal leads</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">180%</div>
                <p className="text-sm text-muted-foreground">Boost in online bookings</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">320%</div>
                <p className="text-sm text-muted-foreground">Return on marketing investment</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Dominate Junk Removal in Your Area?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Get a free marketing audit and discover how we can help you get more junk removal customers, 
              increase revenue, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-audit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get Free Marketing Audit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-purple-600" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-call" 
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
