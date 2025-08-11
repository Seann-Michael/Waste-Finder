import { supabase } from './supabase';
import type { BlogPost, BlogCategory, BlogSearchParams, BlogSearchResponse } from './blog.types';

// Sample data for initial setup
const sampleBlogPosts: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: 'The Complete Guide to Sustainable Waste Management',
    slug: 'complete-guide-sustainable-waste-management',
    excerpt: 'Learn how to implement sustainable waste management practices in your home and business to reduce environmental impact.',
    content: `# The Complete Guide to Sustainable Waste Management

Sustainable waste management is more than just recycling – it's a comprehensive approach to reducing, reusing, and responsibly disposing of waste materials. In this guide, we'll explore practical strategies you can implement today.

## Understanding the Waste Hierarchy

The waste hierarchy is a fundamental principle that prioritizes waste management strategies:

1. **Reduce** - Minimize waste generation
2. **Reuse** - Find new purposes for items
3. **Recycle** - Process materials into new products
4. **Recover** - Extract energy from waste
5. **Dispose** - Safe disposal as a last resort

## Reducing Waste at the Source

### Home Strategies
- Buy only what you need
- Choose products with minimal packaging
- Opt for digital receipts and bills
- Use reusable bags, bottles, and containers

### Business Strategies
- Implement paperless operations
- Choose suppliers with sustainable packaging
- Conduct waste audits to identify reduction opportunities
- Train employees on waste reduction practices

## Effective Recycling Practices

### Know Your Local Guidelines
Different municipalities have varying recycling rules. Key tips:
- Clean containers before recycling
- Separate materials correctly
- Avoid "wishful recycling" of non-recyclable items
- Check for special recycling programs for electronics and hazardous materials

### Common Recycling Mistakes
- Putting plastic bags in curbside bins
- Recycling pizza boxes with grease stains
- Including non-recyclable materials in mixed bins

## Composting Organic Waste

Organic waste comprises about 30% of household trash. Benefits of composting:
- Reduces landfill methane emissions
- Creates nutrient-rich soil amendment
- Saves money on fertilizers

### Getting Started
1. Choose your composting method (bin, tumbler, or pile)
2. Balance "greens" (nitrogen) and "browns" (carbon)
3. Maintain proper moisture and aeration
4. Be patient – composting takes 3-12 months

## Special Waste Streams

### Electronic Waste
Never throw electronics in regular trash:
- Find certified e-waste recyclers
- Participate in manufacturer take-back programs
- Donate working devices to charities

### Hazardous Materials
Proper disposal prevents environmental contamination:
- Paint and chemicals: Municipal hazardous waste days
- Batteries: Retailer collection programs
- Motor oil: Auto parts stores and service centers

## Construction and Demolition Waste

For contractors and homeowners:
- Plan projects to minimize waste
- Separate materials for recycling
- Donate usable materials to habitat for humanity
- Use deconstruction instead of demolition when possible

## Creating a Waste Management Plan

### For Households
1. Conduct a waste audit
2. Set reduction goals
3. Establish recycling and composting systems
4. Monitor progress monthly

### For Businesses
1. Assess current waste streams
2. Identify reduction opportunities
3. Train staff on new procedures
4. Track metrics and costs
5. Communicate successes to stakeholders

## Economic Benefits

Sustainable waste management saves money:
- Reduced disposal costs
- Lower purchasing expenses
- Potential revenue from recyclables
- Tax incentives for businesses

## Environmental Impact

Your efforts make a difference:
- Reduced greenhouse gas emissions
- Conservation of natural resources
- Less pollution of air, water, and soil
- Preservation of ecosystems

## Getting Your Community Involved

### Education and Outreach
- Share your knowledge with neighbors
- Organize community cleanup events
- Advocate for better municipal programs
- Support businesses with sustainable practices

### Policy Advocacy
- Attend city council meetings
- Support extended producer responsibility laws
- Advocate for waste reduction mandates
- Push for improved recycling infrastructure

## Measuring Success

Track your progress:
- Weight or volume of waste reduced
- Percentage of waste diverted from landfills
- Cost savings achieved
- Environmental metrics (carbon footprint reduction)

## Future Trends

The waste management industry is evolving:
- Artificial intelligence in sorting facilities
- Chemical recycling for hard-to-recycle plastics
- Circular economy business models
- Zero waste certification programs

## Conclusion

Sustainable waste management is a journey, not a destination. Start with small changes and gradually implement more comprehensive strategies. Every action counts toward creating a more sustainable future for our planet.

Remember: the best waste is the waste that's never created. Focus on reduction first, then explore reuse and recycling options for materials you can't avoid.`,
    author_name: 'Green Living Team',
    author_email: 'team@greenliving.com',
    featured_image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop',
    category: 'Sustainability',
    tags: ['sustainability', 'recycling', 'waste reduction', 'environment'],
    status: 'published',
    is_featured: true,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    view_count: 245,
    like_count: 18,
    read_time_minutes: 8
  },
  {
    title: 'Dumpster Rental: Sizing Guide for Home Projects',
    slug: 'dumpster-rental-sizing-guide-home-projects',
    excerpt: 'Choose the right dumpster size for your home renovation or cleanup project with our comprehensive sizing guide.',
    content: `# Dumpster Rental: Sizing Guide for Home Projects

Planning a home renovation, cleanup, or construction project? Choosing the right dumpster size can save you money and ensure your project runs smoothly. Here's everything you need to know.

## Common Dumpster Sizes

### 10-Yard Dumpster
**Dimensions**: 12' L x 8' W x 4' H
**Capacity**: 3-5 pickup truck loads

**Perfect for**:
- Small bathroom renovations
- Garage cleanouts
- Minor landscaping projects
- Deck removal (up to 500 sq ft)

### 20-Yard Dumpster
**Dimensions**: 22' L x 8' W x 4.5' H
**Capacity**: 6-8 pickup truck loads

**Perfect for**:
- Kitchen renovations
- Flooring replacement (up to 2,000 sq ft)
- Roof replacement (up to 1,500 sq ft)
- Large garage cleanouts

### 30-Yard Dumpster
**Dimensions**: 22' L x 8' W x 6' H
**Capacity**: 9-15 pickup truck loads

**Perfect for**:
- Major home renovations
- New construction projects
- Large cleanouts
- Roof replacement (up to 3,000 sq ft)

### 40-Yard Dumpster
**Dimensions**: 22' L x 8' W x 8' H
**Capacity**: 16-20 pickup truck loads

**Perfect for**:
- Complete home demolitions
- Large commercial projects
- Major construction sites
- Whole house cleanouts

## Factors to Consider

### 1. Type of Debris
Different materials have different weights and volumes:
- **Heavy materials** (concrete, dirt): Consider weight limits
- **Bulky materials** (furniture, appliances): Consider volume
- **Mixed debris**: Plan for inefficient packing

### 2. Weight Restrictions
Most dumpsters have weight limits:
- 10-yard: 2-3 tons
- 20-yard: 4-6 tons
- 30-yard: 6-8 tons
- 40-yard: 8-10 tons

### 3. Space Constraints
Ensure you have adequate space:
- **Delivery access**: 60+ feet of straight-line access
- **Placement area**: Level surface, away from obstacles
- **Overhead clearance**: 23+ feet for delivery truck

## Cost Considerations

### Base Rental Fees
- **Duration**: Most rentals include 7-14 days
- **Size**: Larger dumpsters cost more
- **Location**: Urban areas typically cost more

### Additional Fees
- **Overage charges**: $50-100 per ton over limit
- **Extended rental**: $10-20 per day
- **Prohibited items**: Special disposal fees

## What You Can and Cannot Put In

### Allowed Items
- Construction debris
- Household junk
- Furniture and appliances
- Yard waste
- Roofing materials

### Prohibited Items
- Hazardous materials (paint, chemicals)
- Electronics (in most areas)
- Tires
- Batteries
- Propane tanks

## Tips for Efficient Loading

### Maximize Space
1. **Break down large items**: Disassemble furniture and fixtures
2. **Load heavy items first**: Place at the bottom
3. **Fill gaps**: Use smaller items to fill spaces
4. **Distribute weight evenly**: Prevent tipping or damage

### Safety Guidelines
- Never overfill above the rim
- Avoid climbing into the dumpster
- Wear protective gear when loading
- Keep the area around the dumpster clear

## Planning Your Project Timeline

### Before Delivery
1. **Obtain permits** if required by your city
2. **Choose the delivery location** carefully
3. **Coordinate with contractors** if applicable
4. **Prepare the placement area**

### During the Rental Period
1. **Load systematically** as work progresses
2. **Monitor weight and volume** regularly
3. **Keep prohibited items separate**
4. **Schedule pickup** before the deadline

## When to Choose a Larger Size

Consider sizing up if:
- You're unsure about the amount of debris
- The project might expand in scope
- You have heavy materials (concrete, dirt)
- Multiple contractors are working simultaneously

## When to Choose Multiple Smaller Dumpsters

Consider multiple rentals for:
- **Extended projects** (several months)
- **Phased renovations** (different rooms)
- **Mixed waste streams** (construction + household)
- **Weight management** (very heavy materials)

## Special Considerations

### Roofing Projects
- **Shingles are heavy**: 20 squares (2,000 sq ft) = about 6 tons
- **Consider a smaller dumpster**: 20-yard for most residential roofs
- **Plan for multiple loads**: For large or commercial roofs

### Concrete and Heavy Debris
- **Use smallest appropriate size**: Weight adds up quickly
- **Consider a concrete-only dumpster**: Often cheaper per ton
- **Mix with lighter materials**: To maximize space

### Household Cleanouts
- **Start with a smaller size**: You can always get another
- **Sort as you go**: Separate recyclables and donations
- **Consider timing**: Coordinate with donation pickups

## Getting the Best Value

### Shop Around
- **Compare prices**: Get quotes from multiple companies
- **Read reviews**: Check Better Business Bureau ratings
- **Ask about discounts**: Military, senior, or repeat customer discounts

### Timing Matters
- **Avoid peak seasons**: Spring and fall are busiest
- **Book in advance**: Especially during busy periods
- **Flexible scheduling**: May result in lower prices

### Package Deals
Some companies offer:
- **Multiple dumpster discounts**
- **Extended rental periods**
- **Bundled services** (delivery, pickup, disposal)

## Conclusion

Choosing the right dumpster size requires careful consideration of your project scope, debris type, and site constraints. When in doubt, consult with the rental company – experienced providers can help you make the best choice based on your specific needs.

Remember: it's often better to rent a slightly larger dumpster than to deal with overflow and additional fees. Plan ahead, follow loading guidelines, and your project will go much more smoothly.`,
    author_name: 'Home Renovation Expert',
    author_email: 'expert@homerenovation.com',
    featured_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    category: 'Home Improvement',
    tags: ['dumpster rental', 'home renovation', 'sizing guide', 'cleanup'],
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    view_count: 189,
    like_count: 14,
    read_time_minutes: 10
  },
  {
    title: 'Construction Debris Recycling: Best Practices for Contractors',
    slug: 'construction-debris-recycling-best-practices',
    excerpt: 'Learn how contractors can implement effective debris recycling programs to reduce costs and environmental impact.',
    content: `# Construction Debris Recycling: Best Practices for Contractors

Construction and demolition (C&D) debris represents one of the largest waste streams in the United States. For contractors, implementing effective recycling programs isn't just environmentally responsible—it's economically smart.

## The Business Case for C&D Recycling

### Cost Savings
- **Lower disposal fees**: Recycling often costs less than landfilling
- **Material revenue**: Some materials have resale value
- **Tax incentives**: Many jurisdictions offer business tax breaks
- **Regulatory compliance**: Avoid fines and project delays

### Competitive Advantages
- **LEED points**: Green building certifications require waste diversion
- **Client preferences**: Many clients specifically request sustainable practices
- **Public image**: Environmental responsibility enhances reputation
- **Employee morale**: Workers take pride in sustainable practices

## Recyclable C&D Materials

### High-Value Materials

**Metals**
- Steel: Rebar, structural steel, roofing
- Copper: Wiring, plumbing, HVAC
- Aluminum: Siding, windows, fixtures
- *Tip*: Keep metals separate and clean for maximum value

**Concrete and Masonry**
- Concrete: Crushed for aggregate
- Brick: Reused in landscaping
- Block: Ground for road base
- *Tip*: Remove all rebar and contamination

### Medium-Value Materials

**Wood**
- Dimensional lumber: Reuse in construction
- Engineered lumber: Biomass fuel
- Pallets: Repair and reuse
- *Restrictions*: No treated or painted wood in many programs

**Gypsum Drywall**
- New drywall: Up to 25% recycled content
- Agricultural uses: Soil amendment
- Cement production: Raw material
- *Tip*: Keep dry and separate from other materials

### Specialty Materials

**Asphalt Shingles**
- Road paving: Hot mix asphalt
- New shingles: Manufacturing input
- *Note*: Some facilities don't accept due to contamination concerns

**Carpet and Flooring**
- Nylon carpet: Fiber recovery
- Hardwood: Biomass or remanufacturing
- *Challenge*: Limited recycling infrastructure

## Setting Up Your Recycling Program

### Planning Phase

1. **Conduct a Waste Audit**
   - Track waste streams for 2-3 typical projects
   - Identify most common materials
   - Calculate current disposal costs
   - Determine recycling potential

2. **Research Local Markets**
   - Find recycling facilities in your area
   - Compare costs and requirements
   - Understand contamination limits
   - Identify transportation options

3. **Train Your Crew**
   - Explain the importance of recycling
   - Demonstrate proper sorting techniques
   - Provide clear guidelines and signage
   - Incorporate into safety meetings

### Implementation Strategies

**Source Separation**
- **Benefits**: Higher material value, easier processing
- **Requirements**: Multiple containers, worker training
- **Best for**: Large projects with dedicated space

**Mixed C&D Collection**
- **Benefits**: Simpler for workers, fewer containers
- **Drawbacks**: Lower recovery rates, higher processing costs
- **Best for**: Smaller projects or tight sites

**Hybrid Approach**
- Separate high-value materials (metals, clean wood)
- Mixed collection for remaining materials
- Balance efficiency with recovery rates

## On-Site Best Practices

### Container Management
- **Right-size containers**: Match to waste volume
- **Strategic placement**: Convenient but not obstructive
- **Clear labeling**: Pictures work better than words
- **Weather protection**: Cover containers to prevent contamination

### Material Handling
- **Keep materials clean**: Remove nails, screws, attachments
- **Avoid contamination**: No food waste, chemicals, or trash
- **Size appropriately**: Break down large items
- **Load efficiently**: Heavy items on bottom

### Documentation
- **Track weights and volumes**: Required for LEED projects
- **Photograph efforts**: Document for client reports
- **Maintain receipts**: Proof of recycling for certifications
- **Calculate diversion rates**: Measure success

## Working with Recycling Facilities

### Choosing Partners
- **Certification**: Ensure legitimate recycling operations
- **Capacity**: Can they handle your volume?
- **Location**: Transportation costs matter
- **Reliability**: Consistent pickup and processing

### Building Relationships
- **Communication**: Discuss your needs and their requirements
- **Flexibility**: Work together on scheduling and logistics
- **Feedback**: Learn from their suggestions
- **Loyalty**: Consistent business often leads to better rates

## Overcoming Common Challenges

### Contamination Issues
- **Problem**: Mixed materials reduce recycling value
- **Solutions**: Better training, clearer signage, regular monitoring
- **Prevention**: Start clean separation from day one

### Space Constraints
- **Problem**: Limited room for multiple containers
- **Solutions**: Smaller containers, more frequent pickups, off-site sorting
- **Planning**: Include recycling space in site layout

### Worker Resistance
- **Problem**: Crews see recycling as extra work
- **Solutions**: Explain benefits, make it easy, recognize participation
- **Leadership**: Foremen must model proper behavior

### Cost Concerns
- **Problem**: Recycling seems more expensive upfront
- **Solutions**: Calculate total costs including labor and disposal
- **Long-term view**: Consider regulatory trends and client demands

## Regulatory Considerations

### Local Ordinances
- **Diversion requirements**: Some cities mandate C&D recycling
- **Reporting obligations**: Documentation may be required
- **Permitted facilities**: Use only approved recyclers
- **Penalties**: Know the consequences of non-compliance

### Green Building Standards
- **LEED requirements**: 50-75% diversion rates typically required
- **Other certifications**: BREEAM, Living Building Challenge
- **Documentation**: Detailed reporting necessary
- **Third-party verification**: Some projects require independent confirmation

## Financial Analysis

### Cost Tracking
Track these metrics:
- Disposal costs (recycling vs. landfill)
- Labor costs for sorting
- Transportation expenses
- Container rental fees
- Revenue from material sales

### ROI Calculation
**Savings = (Landfill costs - Recycling costs) - Additional labor costs**

**Benefits beyond direct savings**:
- Faster permit approvals
- Preferred contractor status
- Reduced insurance costs
- Employee retention

## Technology and Innovation

### Emerging Trends
- **AI-powered sorting**: Automated material identification
- **Mobile apps**: Real-time tracking and reporting
- **Blockchain**: Supply chain transparency
- **Chemical recycling**: New options for difficult materials

### Equipment Innovations
- **Portable crushers**: On-site concrete processing
- **Screening equipment**: Soil and aggregate separation
- **Balers**: Compact materials for transport
- **Material handlers**: Efficient sorting and loading

## Case Studies

### Small Residential Contractor
- **Challenge**: Limited volume, multiple small projects
- **Solution**: Partnered with other contractors for shared recycling
- **Result**: 40% cost reduction, improved client satisfaction

### Large Commercial Contractor
- **Challenge**: Mixed debris streams, tight schedules
- **Solution**: Dedicated recycling coordinator, comprehensive training
- **Result**: 65% diversion rate, $50,000 annual savings

## Building Client Relationships

### Education and Communication
- **Explain benefits**: Environmental and economic advantages
- **Show results**: Regular reporting on diversion rates
- **Offer options**: Different levels of recycling programs
- **Share costs and savings**: Transparency builds trust

### Value-Added Services
- **Sustainability consulting**: Help clients achieve green goals
- **LEED coordination**: Assist with certification requirements
- **Waste stream analysis**: Identify optimization opportunities
- **Custom reporting**: Detailed environmental impact reports

## Future Outlook

### Industry Trends
- **Increasing regulations**: More jurisdictions requiring C&D recycling
- **Client demand**: Growing expectation for sustainable practices
- **Technology advancement**: Better sorting and processing equipment
- **Circular economy**: Focus on material reuse and regeneration

### Preparing for Change
- **Stay informed**: Follow regulatory developments
- **Invest in training**: Build internal expertise
- **Develop partnerships**: Strong relationships with recyclers
- **Track metrics**: Demonstrate continuous improvement

## Getting Started

### Month 1: Assessment
- Complete waste audit
- Research local recyclers
- Calculate current costs
- Develop initial plan

### Month 2: Setup
- Arrange container service
- Train key personnel
- Create documentation system
- Start with pilot project

### Month 3: Optimization
- Analyze results
- Adjust processes
- Expand to more projects
- Refine training materials

## Conclusion

Construction debris recycling is no longer optional for forward-thinking contractors. The combination of regulatory requirements, client expectations, and economic benefits makes it a business necessity.

Start small, focus on high-value materials, and build your program gradually. With proper planning and execution, you'll reduce costs, satisfy clients, and contribute to a more sustainable construction industry.

The key is to view recycling not as an additional burden, but as an integral part of project planning and execution. Your bottom line—and the environment—will thank you.`,
    author_name: 'Construction Industry Expert',
    author_email: 'expert@construction.com',
    featured_image: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=800&h=400&fit=crop',
    category: 'Construction',
    tags: ['construction', 'recycling', 'sustainability', 'contractors'],
    status: 'published',
    is_featured: false,
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    view_count: 156,
    like_count: 12,
    read_time_minutes: 12
  }
];

const sampleCategories: Omit<BlogCategory, 'id' | 'created_at'>[] = [
  {
    name: 'Sustainability',
    slug: 'sustainability',
    description: 'Environmental tips and sustainable waste management practices',
    color: '#10B981',
    post_count: 1
  },
  {
    name: 'Home Improvement',
    slug: 'home-improvement',
    description: 'Guides for home renovation and cleanup projects',
    color: '#3B82F6',
    post_count: 1
  },
  {
    name: 'Construction',
    slug: 'construction',
    description: 'Industry insights for construction professionals',
    color: '#F59E0B',
    post_count: 1
  }
];

// Initialize sample data in localStorage (temporary until Supabase integration)
export const initializeBlogData = () => {
  const existingPosts = localStorage.getItem('blog_posts');
  const existingCategories = localStorage.getItem('blog_categories');
  
  if (!existingPosts) {
    const postsWithIds = sampleBlogPosts.map(post => ({
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    localStorage.setItem('blog_posts', JSON.stringify(postsWithIds));
  }
  
  if (!existingCategories) {
    const categoriesWithIds = sampleCategories.map(category => ({
      ...category,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    }));
    localStorage.setItem('blog_categories', JSON.stringify(categoriesWithIds));
  }
};

// Get all published blog posts
export const getBlogPosts = async (params: BlogSearchParams = {}): Promise<BlogSearchResponse> => {
  try {
    // For now, use localStorage data (later replace with Supabase)
    const posts: BlogPost[] = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    const categories: BlogCategory[] = JSON.parse(localStorage.getItem('blog_categories') || '[]');
    
    let filteredPosts = posts.filter(post => post.status === 'published');
    
    // Apply filters
    if (params.search) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(params.search!.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(params.search!.toLowerCase()) ||
        post.content.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    if (params.category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase() === params.category!.toLowerCase()
      );
    }
    
    if (params.tag) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.some(tag => tag.toLowerCase().includes(params.tag!.toLowerCase()))
      );
    }
    
    // Sort posts
    const sortBy = params.sortBy || 'published_at';
    const sortOrder = params.sortOrder || 'desc';
    
    filteredPosts.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'published_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    
    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      categories,
      total: filteredPosts.length,
      page,
      limit,
      pages: Math.ceil(filteredPosts.length / limit)
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      posts: [],
      categories: [],
      total: 0,
      page: 1,
      limit: 10,
      pages: 0
    };
  }
};

// Get single blog post by slug
export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
    const posts: BlogPost[] = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    const post = posts.find(p => p.slug === slug && p.status === 'published');
    
    if (post) {
      // Increment view count
      post.view_count += 1;
      localStorage.setItem('blog_posts', JSON.stringify(posts));
    }
    
    return post || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

// Get blog categories
export const getBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const categories: BlogCategory[] = JSON.parse(localStorage.getItem('blog_categories') || '[]');
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get featured posts
export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  try {
    const posts: BlogPost[] = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    return posts
      .filter(post => post.status === 'published' && post.is_featured)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
};

// Get recent posts
export const getRecentPosts = async (limit = 5): Promise<BlogPost[]> => {
  try {
    const posts: BlogPost[] = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    return posts
      .filter(post => post.status === 'published')
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
};

// Get related posts
export const getRelatedPosts = async (currentPostId: string, limit = 3): Promise<BlogPost[]> => {
  try {
    const posts: BlogPost[] = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    const currentPost = posts.find(p => p.id === currentPostId);
    
    if (!currentPost) return [];
    
    // Find posts with similar tags or same category
    const related = posts
      .filter(post => 
        post.id !== currentPostId && 
        post.status === 'published' && 
        (post.category === currentPost.category || 
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, limit);
    
    return related;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
};
