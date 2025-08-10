export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: "draft" | "published";
  readTime: number;
}

// Sample blog posts
const samplePosts: BlogPost[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Dumpster Rental for Home Projects",
    slug: "ultimate-guide-dumpster-rental-home-projects",
    excerpt:
      "Planning a home renovation or cleanup? Learn everything you need to know about choosing the right dumpster size and rental service for your project.",
    content: `# The Ultimate Guide to Dumpster Rental for Home Projects

When tackling a major home project, whether it's a renovation, spring cleaning, or landscaping overhaul, one of the biggest challenges is dealing with the waste. A dumpster rental can be a game-changer, providing a convenient and efficient way to manage debris and keep your project on track.

## Choosing the Right Dumpster Size

The key to a successful dumpster rental is selecting the right size for your project:

### 10-Yard Dumpster
Perfect for small projects like:
- Bathroom renovations
- Small deck removals
- Garage cleanouts
- Yard debris from small properties

### 20-Yard Dumpster
Ideal for medium projects:
- Kitchen renovations
- Flooring projects
- Large cleanouts
- Roof replacements for smaller homes

### 30-Yard Dumpster
Great for larger projects:
- Major home renovations
- New construction debris
- Large landscaping projects
- Commercial cleanouts

### 40-Yard Dumpster
Best for the biggest jobs:
- Complete home demolitions
- Large commercial projects
- Major construction sites

## What You Can and Cannot Put in a Dumpster

### Allowed Items:
- Construction debris
- Household junk
- Furniture
- Appliances (restrictions may apply)
- Yard waste
- Roofing materials

### Prohibited Items:
- Hazardous materials
- Paint and chemicals
- Batteries
- Tires
- Refrigerants
- Medical waste

## Tips for Maximizing Your Rental

1. **Plan ahead**: Book your dumpster 2-3 days before you need it
2. **Load efficiently**: Place heavy items on the bottom
3. **Break down large items**: This saves space and money
4. **Know your local regulations**: Some areas require permits
5. **Choose the right location**: Ensure easy access for delivery and pickup

## Conclusion

A well-planned dumpster rental can save you time, money, and hassle on your next project. Take time to assess your needs, choose the right size, and follow best practices for loading to get the most value from your rental.`,
    author: "DumpNearMe Team",
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    category: "Guides",
    tags: ["dumpster rental", "home improvement", "waste management"],
    featuredImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    status: "published",
    readTime: 5,
  },
  {
    id: "2",
    title: "Sustainable Waste Management: Reducing Your Environmental Impact",
    slug: "sustainable-waste-management-environmental-impact",
    excerpt:
      "Discover practical strategies to minimize waste, increase recycling, and make environmentally conscious choices in your waste disposal practices.",
    content: `# Sustainable Waste Management: Reducing Your Environmental Impact

In today's world, sustainable waste management isn't just an environmental necessity—it's a responsibility we all share. Whether you're managing household waste or overseeing a construction project, the choices you make can significantly impact the environment.

## The Importance of Sustainable Waste Management

Every year, millions of tons of waste end up in landfills, contributing to environmental degradation and climate change. By adopting sustainable practices, we can:

- Reduce greenhouse gas emissions
- Conserve natural resources
- Minimize pollution
- Create economic opportunities through recycling

## Practical Strategies for Homeowners

### 1. The 3 R's: Reduce, Reuse, Recycle

**Reduce**: The most effective strategy is to generate less waste in the first place.
- Buy only what you need
- Choose products with minimal packaging
- Opt for digital receipts and bills

**Reuse**: Give items a second life before disposing of them.
- Repurpose containers for storage
- Donate items in good condition
- Use both sides of paper

**Recycle**: Properly sort materials to ensure they can be processed.
- Learn your local recycling guidelines
- Clean containers before recycling
- Separate materials correctly

### 2. Composting Organic Waste

Organic waste makes up about 30% of household trash. Composting:
- Reduces methane emissions from landfills
- Creates nutrient-rich soil amendment
- Reduces the need for chemical fertilizers

## Sustainable Practices for Construction Projects

### Material Selection
- Choose recycled or recyclable materials
- Source materials locally when possible
- Consider the entire lifecycle of materials

### Waste Reduction Strategies
- Plan projects carefully to minimize waste
- Donate or sell usable materials
- Partner with recycling facilities

### Deconstruction vs. Demolition
- Carefully dismantle buildings to salvage materials
- Separate materials for proper recycling
- Work with specialized deconstruction companies

## The Role of Technology

Modern technology is revolutionizing waste management:
- Smart bins that optimize collection routes
- Apps that help identify recyclable materials
- Advanced sorting facilities that increase recycling rates

## Making a Difference

Every small action contributes to a larger impact. By making conscious choices about waste management, we can preserve our environment for future generations while often saving money in the process.

Start with small changes and gradually adopt more sustainable practices. Remember, the goal isn't perfection—it's progress toward a more sustainable future.`,
    author: "Environmental Team",
    publishedAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    category: "Sustainability",
    tags: ["sustainability", "environment", "recycling", "green living"],
    featuredImage:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop",
    status: "published",
    readTime: 7,
  },
  {
    id: "3",
    title: "Construction Debris Recycling: What Contractors Need to Know",
    slug: "construction-debris-recycling-contractors-guide",
    excerpt:
      "Learn about the latest regulations, best practices, and cost-saving opportunities in construction debris recycling for contractors and builders.",
    content: `# Construction Debris Recycling: What Contractors Need to Know

The construction industry generates millions of tons of waste annually, but much of this material can be recycled or reused. For contractors, understanding debris recycling isn't just about environmental responsibility—it's about regulatory compliance and cost savings.

## Types of Construction Debris That Can Be Recycled

### Concrete and Masonry
- Can be crushed and used as aggregate
- High recycling rate of 70-80%
- Often accepted at specialized facilities

### Wood Materials
- Clean wood can be chipped for mulch or biomass
- Engineered lumber may have restrictions
- Painted or treated wood requires special handling

### Metals
- Steel, aluminum, and copper have high value
- Easy to separate and recycle
- Often generates revenue for contractors

### Drywall
- Can be recycled into new drywall products
- Requires separation from other materials
- Growing number of accepting facilities

## Regulatory Requirements

### Local Ordinances
Many jurisdictions now require:
- Minimum recycling percentages for projects
- Waste management plans for permits
- Documentation of recycling efforts

### LEED Certification
For green building projects:
- Divert 50-75% of waste from landfills
- Document recycling and reuse efforts
- Track waste by weight or volume

## Best Practices for Contractors

### Planning Phase
1. **Conduct a waste audit** of similar projects
2. **Identify recycling facilities** in your area
3. **Include recycling costs** in project bids
4. **Train crews** on separation procedures

### On-Site Management
1. **Use separate containers** for different materials
2. **Keep materials clean** and sorted
3. **Protect materials** from weather when possible
4. **Monitor contamination** levels

### Documentation
1. **Track weights and volumes** of recycled materials
2. **Maintain receipts** from recycling facilities
3. **Take photos** of recycling efforts
4. **Create reports** for clients and regulators

## Cost Considerations

### Potential Savings
- Reduced landfill tipping fees
- Revenue from valuable materials
- Lower transportation costs (recycling facilities may be closer)
- Avoided permit delays

### Investment Areas
- Additional containers and equipment
- Training for workers
- Time for sorting and separation
- Documentation and reporting

## Finding Recycling Facilities

### Research Options
- Contact local waste management companies
- Check with building material suppliers
- Use online facility locators
- Network with other contractors

### Questions to Ask Facilities
- What materials do they accept?
- What are their contamination limits?
- Do they provide containers?
- What documentation do they provide?

## Future Trends

The construction recycling industry continues to evolve:
- New technologies for material separation
- Increased demand for recycled content
- Stricter regulations and requirements
- Growing economic incentives

## Conclusion

Construction debris recycling is becoming increasingly important for contractors. By developing effective recycling programs, contractors can reduce costs, comply with regulations, and demonstrate environmental leadership to clients.

Start by identifying local recycling options and gradually implement recycling practices on your projects. The investment in sustainable practices often pays for itself through cost savings and competitive advantages.`,
    author: "Construction Industry Expert",
    publishedAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
    category: "Industry",
    tags: ["construction", "recycling", "contractors", "regulations"],
    featuredImage:
      "https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=800&h=400&fit=crop",
    status: "published",
    readTime: 8,
  },
];

export const getBlogPosts = (): BlogPost[] => {
  const stored = localStorage.getItem("blogPosts");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing stored blog posts:", error);
    }
  }

  // Initialize with sample posts
  localStorage.setItem("blogPosts", JSON.stringify(samplePosts));
  return samplePosts;
};

export const getBlogPost = (slug: string): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find(
    (post) => post.slug === slug && post.status === "published",
  );
};

export const getPublishedPosts = (): BlogPost[] => {
  return getBlogPosts().filter((post) => post.status === "published");
};

export const getBlogCategories = (): string[] => {
  const posts = getPublishedPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
};

export const saveBlogPost = (post: BlogPost): void => {
  const posts = getBlogPosts();
  const existingIndex = posts.findIndex((p) => p.id === post.id);

  if (existingIndex >= 0) {
    posts[existingIndex] = { ...post, updatedAt: new Date().toISOString() };
  } else {
    posts.push(post);
  }

  localStorage.setItem("blogPosts", JSON.stringify(posts));
};

export const deleteBlogPost = (id: string): void => {
  const posts = getBlogPosts();
  const filtered = posts.filter((post) => post.id !== id);
  localStorage.setItem("blogPosts", JSON.stringify(filtered));
};
