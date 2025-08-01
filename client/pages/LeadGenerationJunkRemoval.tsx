import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Target, Phone, Mail, MessageSquare, Users, BarChart3, DollarSign } from "lucide-react";

export default function LeadGenerationJunkRemoval() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-teal-50 to-cyan-100">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Lead Generation for Junk Removal Companies
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate a steady stream of qualified junk removal leads for your business. 
              Our proven lead generation strategies fill your pipeline with customers ready to book your services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-leads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Get More Junk Removal Leads
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-lead-demo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  See Lead Demo
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Lead Generation Services */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Complete Junk Removal Lead Generation System
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
                    Junk Removal Lead Capture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• "Junk removal near me" landing pages</li>
                    <li>• Service-specific contact forms</li>
                    <li>• Free estimate request forms</li>
                    <li>• Before/after photo galleries</li>
                    <li>• Mobile-responsive junk removal forms</li>
                    <li>• Emergency cleanout lead capture</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-green-600" />
                    Junk Removal Lead Qualification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Service type qualification</li>
                    <li>• Location and accessibility screening</li>
                    <li>• Timeline and urgency assessment</li>
                    <li>• Budget qualification</li>
                    <li>• Property type identification</li>
                    <li>• Special requirements screening</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                    Junk Removal Lead Nurturing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Immediate response automation</li>
                    <li>• Follow-up text messaging</li>
                    <li>• Educational email sequences</li>
                    <li>• Seasonal junk removal campaigns</li>
                    <li>• Abandoned estimate recovery</li>
                    <li>• Customer testimonial sharing</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                    Junk Removal Lead Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Real-time lead notifications</li>
                    <li>• Service type lead tracking</li>
                    <li>• Conversion rate by source</li>
                    <li>• Customer value analysis</li>
                    <li>• Seasonal demand tracking</li>
                    <li>• ROI reporting by campaign</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Proven Junk Removal Lead Generation Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">400+</div>
                <p className="text-sm text-muted-foreground">Qualified junk removal leads monthly</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">45%</div>
                <p className="text-sm text-muted-foreground">Average lead-to-customer conversion</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">$85</div>
                <p className="text-sm text-muted-foreground">Average cost per qualified lead</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Generate More Junk Removal Leads?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Stop waiting for customers to find you. Our junk removal lead generation system actively brings 
              qualified prospects to your business every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-leads-start" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Start Generating Leads
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-teal-600" asChild>
                <a 
                  href="https://yourmarketingagency.com/junk-removal-lead-call" 
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
