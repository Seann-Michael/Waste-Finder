import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Globe, BarChart3, Target, Users, Smartphone, DollarSign } from "lucide-react";

export default function DigitalMarketing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Digital Marketing for Dumpster Rental & Junk Removal Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Grow your waste management business with proven digital marketing strategies. 
              We specialize in helping dumpster rental and junk removal companies dominate their local markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a 
                  href="/contact" // TODO: Replace with configurable marketing URL from Supabase 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get More Customers
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <a 
                  href="/contact" // TODO: Replace with configurable audit URL from Supabase 
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
                Complete Digital Marketing Solutions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to grow your dumpster rental or junk removal business online
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Search className="w-8 h-8 text-blue-600" />
                    <CardTitle>Search Engine Optimization</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Local SEO optimization</li>
                    <li>• Google My Business management</li>
                    <li>• Keyword research & strategy</li>
                    <li>• Technical SEO audits</li>
                    <li>• Content optimization</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-green-600" />
                    <CardTitle>Website Development</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Mobile-responsive design</li>
                    <li>• Fast loading & optimized</li>
                    <li>• Lead capture forms</li>
                    <li>• Online booking systems</li>
                    <li>• Service area pages</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-purple-600" />
                    <CardTitle>Pay-Per-Click Advertising</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Google Ads management</li>
                    <li>• Facebook advertising</li>
                    <li>• Local market targeting</li>
                    <li>• Campaign optimization</li>
                    <li>• ROI tracking & reporting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-orange-600" />
                    <CardTitle>Social Media Marketing</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Profile setup & optimization</li>
                    <li>• Content creation & posting</li>
                    <li>• Community engagement</li>
                    <li>• Review management</li>
                    <li>• Social advertising</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-red-600" />
                    <CardTitle>Analytics & Reporting</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Performance tracking</li>
                    <li>• Monthly reports</li>
                    <li>• ROI analysis</li>
                    <li>• Conversion optimization</li>
                    <li>• Data-driven insights</li>
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
                    <li>• Mobile-first strategy</li>
                    <li>• App store optimization</li>
                    <li>• SMS marketing campaigns</li>
                    <li>• Location-based targeting</li>
                    <li>• Mobile ad optimization</li>
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
              Proven Results for Waste Management Companies
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">300%</div>
                <p className="text-sm text-muted-foreground">Average increase in website traffic</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">150%</div>
                <p className="text-sm text-muted-foreground">Boost in qualified leads</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">200%</div>
                <p className="text-sm text-muted-foreground">Return on marketing investment</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Dominate Your Local Market?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Get a free marketing audit and discover how we can help you get more customers, 
              increase revenue, and grow your waste management business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <a 
                  href="/contact" // TODO: Replace with configurable get-started URL from Supabase 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get Free Marketing Audit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-purple-600" asChild>
                <a 
                  href="tel:+15551234567" // TODO: Replace with configurable phone URL from Supabase 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Call: (555) 123-4567 {/* TODO: Replace with configurable phone from Supabase */}
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
