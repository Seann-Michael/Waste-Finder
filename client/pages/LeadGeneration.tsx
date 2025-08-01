import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Target, Phone, Mail, MessageSquare, Users, BarChart3, DollarSign, Globe } from "lucide-react";

export default function LeadGeneration() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-teal-50 to-cyan-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Lead Generation for Dumpster Rental & Junk Removal Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate a steady stream of qualified leads for your waste management business. 
              Our proven lead generation strategies fill your pipeline with customers ready to buy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/lead-generation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get More Leads Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/lead-demo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  See Lead Demo
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Lead Types */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Multiple Lead Generation Channels
              </h2>
              <p className="text-lg text-muted-foreground">
                We generate leads from every available source to maximize your customer acquisition
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Globe className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Online Forms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Website contact forms optimized for maximum conversions and lead capture
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Phone className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Phone Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Call tracking and optimization to capture phone leads from all marketing channels
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    24/7 chat support to capture leads when customers need immediate assistance
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Mail className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Email Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Nurture campaigns that convert prospects into paying customers over time
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Lead Generation Services */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Complete Lead Generation System
              </h2>
              <p className="text-lg text-muted-foreground">
                From lead capture to conversion - we handle every step of the process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    Lead Capture Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• High-converting landing pages</li>
                    <li>• Optimized contact forms</li>
                    <li>• Lead magnets and offers</li>
                    <li>• Exit-intent popups</li>
                    <li>• Mobile-responsive forms</li>
                    <li>• A/B testing for conversions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-green-600" />
                    Lead Qualification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Lead scoring and rating</li>
                    <li>• Automated qualification workflows</li>
                    <li>• Service area verification</li>
                    <li>• Budget and timeline assessment</li>
                    <li>• Priority lead identification</li>
                    <li>• Quality lead filtering</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                    Lead Nurturing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Automated email sequences</li>
                    <li>• Follow-up text messaging</li>
                    <li>• Educational content delivery</li>
                    <li>• Seasonal campaign targeting</li>
                    <li>• Retargeting campaigns</li>
                    <li>• Abandoned quote recovery</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                    Lead Tracking & Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Real-time lead notifications</li>
                    <li>• Lead source attribution</li>
                    <li>• Conversion rate tracking</li>
                    <li>• ROI analysis by channel</li>
                    <li>• Performance reporting</li>
                    <li>• Lead quality metrics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Proven Lead Generation Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Qualified leads generated monthly</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">35%</div>
                <p className="text-sm text-muted-foreground">Average lead-to-customer conversion rate</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">$150</div>
                <p className="text-sm text-muted-foreground">Average cost per qualified lead</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Case Study: ABC Dumpster Rentals</h3>
              <p className="text-muted-foreground mb-6">
                Within 6 months, we helped ABC Dumpster Rentals increase their monthly leads from 50 to 400+, 
                resulting in a 300% increase in revenue and expansion into 3 new service areas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <strong>Before:</strong>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>• 50 leads per month</li>
                    <li>• 15% conversion rate</li>
                    <li>• $300 cost per customer</li>
                  </ul>
                </div>
                <div>
                  <strong>After:</strong>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>• 400+ leads per month</li>
                    <li>• 35% conversion rate</li>
                    <li>• $150 cost per customer</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Generate More Leads?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Stop waiting for customers to find you. Our lead generation system actively brings 
              qualified prospects to your business every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/start-generating-leads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Start Generating Leads
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-teal-600" asChild>
                <a 
                  href="https://yourmarketingagency.com/lead-call" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Call: (555) 123-LEAD
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
