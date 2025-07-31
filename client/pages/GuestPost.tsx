/**
 * Guest Post Purchase Page - Buy Guest Post Opportunities
 * 
 * PURPOSE: Allow users to purchase guest post opportunities on the website
 */

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PenTool,
  DollarSign,
  Star,
  CheckCircle,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Clock,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

interface GuestPostPackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  wordCount: string;
  deliveryTime: string;
  revisions: string;
  popular?: boolean;
}

export default function GuestPost() {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    targetKeywords: '',
    contentTopic: '',
    targetAudience: '',
    additionalRequirements: '',
    preferredPublishDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packages: GuestPostPackage[] = [
    {
      id: 'basic',
      name: 'Basic Guest Post',
      price: 299,
      wordCount: '800-1000 words',
      deliveryTime: '5-7 business days',
      revisions: '2 revisions included',
      features: [
        'High-quality original content',
        'SEO-optimized article',
        'One dofollow backlink',
        'Industry-relevant topic',
        'Professional editing',
        'Content ownership transfer'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Guest Post',
      price: 499,
      wordCount: '1200-1500 words',
      deliveryTime: '3-5 business days',
      revisions: '3 revisions included',
      popular: true,
      features: [
        'Everything in Basic package',
        'In-depth research and analysis',
        'Custom graphics/images included',
        'Social media promotion',
        'Two dofollow backlinks',
        'Priority customer support',
        'Content strategy consultation'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Package',
      price: 799,
      wordCount: '1500+ words',
      deliveryTime: '2-3 business days',
      revisions: 'Unlimited revisions',
      features: [
        'Everything in Premium package',
        'Expert industry writer',
        'Comprehensive keyword research',
        'Competitor analysis',
        'Three dofollow backlinks',
        'Newsletter feature inclusion',
        'Performance tracking report',
        'Dedicated account manager'
      ]
    }
  ];

  const industries = [
    'Waste Management',
    'Construction',
    'Environmental Services',
    'Recycling',
    'Sustainability',
    'Municipal Services',
    'Industrial Services',
    'Consulting',
    'Technology',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, this would process the payment and create the order
      alert('Thank you for your interest! We will contact you within 24 hours to finalize your guest post order.');
      
      // Reset form
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        industry: '',
        targetKeywords: '',
        contentTopic: '',
        targetAudience: '',
        additionalRequirements: '',
        preferredPublishDate: ''
      });
      setSelectedPackage('');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPackageData = packages.find(pkg => pkg.id === selectedPackage);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <PenTool className="w-10 h-10 text-primary" />
            Guest Post Opportunities
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Reach our engaged audience of waste management professionals and decision-makers with high-quality guest content
          </p>
        </div>
      </section>

      {/* Website Stats */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-4">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Monthly Visitors</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-muted-foreground">Industry Professionals</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">DA 45</div>
                <div className="text-sm text-muted-foreground">Domain Authority</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Package</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the guest post package that best fits your marketing goals and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative cursor-pointer transition-all ${
                  selectedPackage === pkg.id 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                } ${pkg.popular ? 'border-primary' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    ${pkg.price}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{pkg.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PenTool className="w-4 h-4 text-muted-foreground" />
                      <span>{pkg.wordCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span>{pkg.revisions}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Order Your Guest Post
              </CardTitle>
              {selectedPackageData && (
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    Selected: <strong>{selectedPackageData.name}</strong> - ${selectedPackageData.price}
                  </AlertDescription>
                </Alert>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Your company name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@company.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website URL *</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourcompany.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select 
                      value={formData.industry} 
                      onValueChange={(value) => handleInputChange('industry', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry.toLowerCase()}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="contentTopic">Proposed Content Topic *</Label>
                  <Input
                    id="contentTopic"
                    value={formData.contentTopic}
                    onChange={(e) => handleInputChange('contentTopic', e.target.value)}
                    placeholder="Brief description of your proposed article topic"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="targetKeywords">Target Keywords</Label>
                  <Input
                    id="targetKeywords"
                    value={formData.targetKeywords}
                    onChange={(e) => handleInputChange('targetKeywords', e.target.value)}
                    placeholder="waste management, recycling, sustainability (comma separated)"
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="Describe your target audience and what value the content will provide..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                  <Textarea
                    id="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                    placeholder="Any specific requirements, guidelines, or preferences for the content..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="preferredPublishDate">Preferred Publish Date</Label>
                  <Input
                    id="preferredPublishDate"
                    type="date"
                    value={formData.preferredPublishDate}
                    onChange={(e) => handleInputChange('preferredPublishDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${selectedPackageData?.price || 0}
                    </span>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!selectedPackage || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Submit Order Request
                      </>
                    )}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    We'll review your submission and contact you within 24 hours to finalize payment and project details.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
