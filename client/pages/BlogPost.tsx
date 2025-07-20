import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FacebookCTA from "@/components/FacebookCTA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Clock,
  Tag,
  AlertCircle,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  tags: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock blog posts (same as Blog.tsx)
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Best Practices for Construction Debris Disposal",
    slug: "construction-debris-disposal-best-practices",
    excerpt:
      "Learn the most effective ways to dispose of construction waste while staying compliant with local regulations.",
    content: `# Best Practices for Construction Debris Disposal

Construction debris disposal is a critical aspect of any building project. Proper disposal not only keeps job sites clean and safe but also ensures compliance with environmental regulations and local ordinances.

## Understanding Construction Debris Types

Construction waste can be categorized into several types:

### Inert Materials
- Concrete and masonry
- Asphalt and paving materials
- Soil and excavated materials
- Clean wood (untreated)

### Non-Hazardous Materials
- Drywall and gypsum board
- Metal components (steel, aluminum)
- Roofing materials
- Insulation materials

### Hazardous Materials
- Asbestos-containing materials
- Lead-based paint debris
- Chemical waste and solvents
- Contaminated soil

## Best Practices for Disposal

### 1. Plan Ahead
Before starting any construction project, develop a waste management plan that includes:
- Estimated waste volumes by type
- Designated collection areas on-site
- Scheduled pickup times
- Recycling opportunities

### 2. Separate Materials
Proper separation at the source makes disposal more efficient and cost-effective:
- Use separate containers for different material types
- Label containers clearly
- Train workers on proper sorting procedures

### 3. Maximize Recycling
Many construction materials can be recycled:
- **Concrete**: Can be crushed and reused as aggregate
- **Metal**: Valuable for scrap metal recycling
- **Wood**: Can be chipped for biomass or reused
- **Cardboard**: Standard recycling programs

### 4. Choose the Right Disposal Method
Different materials require different disposal approaches:
- **Landfills**: For general non-hazardous waste
- **Transfer stations**: For sorting and consolidation
- **Specialized facilities**: For hazardous materials
- **Recycling centers**: For recyclable materials

## Compliance and Regulations

### Local Permits
Most jurisdictions require permits for:
- Large waste containers (dumpsters)
- Street placement of containers
- Transportation of certain materials

### Documentation
Maintain records of:
- Waste disposal receipts
- Hazardous material manifests
- Recycling certificates
- Permit documentation

## Cost Management Tips

### Container Size Selection
Choose the right container size to avoid overage fees:
- **10-yard**: Small remodeling projects
- **20-yard**: Whole room renovations
- **30-yard**: Large home projects
- **40-yard**: Major construction projects

### Scheduling Efficiency
- Coordinate pickups with project phases
- Avoid container overflow penalties
- Schedule during off-peak times for better rates

## Environmental Considerations

Construction and demolition waste represents approximately 40% of the solid waste stream in the United States. By following best practices:

- Reduce landfill burden
- Conserve natural resources
- Lower project environmental impact
- Potentially qualify for LEED credits

## Conclusion

Effective construction debris disposal requires planning, proper execution, and ongoing compliance with regulations. By implementing these best practices, contractors can reduce costs, minimize environmental impact, and maintain safe job sites.

For assistance finding the right disposal facilities for your project, use our location finder tool to discover options in your area.`,
    author: "Sean Webb",
    status: "published",
    featured: true,
    tags: ["construction", "debris", "disposal", "best-practices"],
    featuredImage:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=1200&h=600&fit=crop",
    publishedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Understanding Landfill Costs: A Complete Guide",
    slug: "understanding-landfill-costs-guide",
    excerpt:
      "A comprehensive breakdown of landfill pricing, factors that affect costs, and tips for budget planning.",
    content: `# Understanding Landfill Costs: A Complete Guide

Landfill costs can vary significantly based on numerous factors. Understanding these factors will help you budget effectively for your waste disposal needs.

## Pricing Structure

Most landfills use one of these pricing models:

### Weight-Based Pricing
- Charge per ton of waste
- Most accurate for cost calculation
- Requires scale house weighing
- Typical range: $45-$120 per ton

### Volume-Based Pricing
- Charge per cubic yard
- Used when weighing isn't practical
- Less precise than weight-based
- Typical range: $8-$25 per cubic yard

### Load-Based Pricing
- Flat rate per truck load
- Used for standardized loads
- Simple pricing structure
- Varies by truck size and material type

## Factors Affecting Costs

### Geographic Location
- Urban areas typically cost more
- Rural areas may have limited options
- State regulations impact pricing
- Regional competition affects rates

### Material Type
- **General waste**: Standard rates
- **Construction debris**: Often higher rates
- **Hazardous materials**: Significantly higher
- **Recyclables**: May have lower rates or credits

### Quantity and Frequency
- Larger volumes often get discounts
- Regular customers may receive better rates
- Minimum charges may apply
- Contract pricing for large projects

## Additional Fees to Consider

### Entrance Fees
- Some facilities charge per entry
- Typical range: $5-$15 per visit
- May be waived for large loads

### Environmental Fees
- State-mandated fees
- Used for remediation and monitoring
- Usually $1-$5 per ton

### Fuel Surcharges
- Varies with diesel fuel prices
- Typically 3-8% of base rate
- More common with commercial haulers

## Cost Comparison Examples

### Residential Project (2 tons)
- **Municipal landfill**: $130-$240
- **Private landfill**: $150-$280
- **Transfer station**: $120-$200

### Commercial Project (10 tons)
- **Municipal landfill**: $600-$1,200
- **Private landfill**: $700-$1,400
- **Transfer station**: $550-$1,000

### Large Construction (50 tons)
- **Municipal landfill**: $2,750-$6,000
- **Private landfill**: $3,250-$7,000
- **Transfer station**: $2,500-$5,000

## Money-Saving Tips

### Compare Options
- Get quotes from multiple facilities
- Consider transfer stations vs. direct landfill
- Factor in transportation costs
- Ask about volume discounts

### Optimize Load Composition
- Separate recyclables
- Remove prohibited items beforehand
- Compact loads when possible
- Avoid contamination

### Timing Considerations
- Some facilities offer off-peak discounts
- Plan around facility schedules
- Avoid peak disposal times
- Consider seasonal pricing variations

## Budget Planning

### Estimate Waste Volume
- Use waste calculators
- Consult with contractors
- Add 10-20% contingency
- Consider multiple waste streams

### Get Written Quotes
- Request detailed pricing breakdown
- Clarify all fees and surcharges
- Understand payment terms
- Ask about price guarantees

## Regional Variations

### Northeast
- Higher costs due to limited landfill space
- Strong recycling programs
- Strict environmental regulations

### Southeast
- Moderate costs
- Growing recycling initiatives
- Varied state regulations

### Midwest
- Generally lower costs
- Agricultural waste programs
- Traditional landfill operations

### West Coast
- High costs due to regulations
- Emphasis on diversion programs
- Limited landfill capacity

## Conclusion

Understanding landfill costs helps you make informed decisions and budget accurately for waste disposal. Always get multiple quotes and consider the total cost of disposal, including transportation and any additional fees.

Use our facility finder to compare options in your area and get the best value for your waste disposal needs.`,
    author: "Sean Webb",
    status: "published",
    featured: false,
    tags: ["landfill", "costs", "pricing", "guide"],
    featuredImage:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=600&fit=crop",
    publishedAt: "2024-01-10T08:00:00Z",
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
];

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      // Simulate API call to fetch post by slug
      setTimeout(() => {
        const foundPost = mockBlogPosts.find(
          (p) => p.slug === slug && p.status === "published",
        );
        setPost(foundPost || null);

        if (foundPost) {
          // Find related posts (same tags, excluding current post)
          const related = mockBlogPosts
            .filter(
              (p) =>
                p.id !== foundPost.id &&
                p.status === "published" &&
                p.tags.some((tag) => foundPost.tags.includes(tag)),
            )
            .slice(0, 3);
          setRelatedPosts(related);
        }

        setIsLoading(false);
      }, 500);
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimatedReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert("URL copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The article you're looking for doesn't exist or has been
                removed.
              </p>
              <Button asChild>
                <Link to="/blog">View All Articles</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back to Blog */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <article className="space-y-6">
            <header className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

              <p className="text-xl text-muted-foreground">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedAt!)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {estimatedReadTime(post.content)} min read
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {post.featured && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  Featured Article
                </Badge>
              )}
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, "<br>"),
                }}
              />
            </div>

            <Separator />

            {/* Article Footer */}
            <footer className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Last updated: {formatDate(post.updatedAt)}
                </div>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
              </div>

              {/* Facebook CTA */}
              <FacebookCTA facebookUrl="https://facebook.com/groups/wastefindergroup" />
            </footer>
          </article>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {relatedPost.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg hover:text-primary transition-colors">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(relatedPost.publishedAt!)}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/blog/${relatedPost.slug}`}>Read</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
