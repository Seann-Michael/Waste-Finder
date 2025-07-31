/**
 * Sample Articles - Initial demonstration data
 * 
 * PURPOSE: Provide sample news articles for initial demonstration
 */

import { type NewsArticle } from './articleStore';

export const sampleArticles: NewsArticle[] = [
  {
    id: 'sample-1',
    title: 'Revolutionary Waste-to-Energy Technology Transforms Municipal Recycling',
    description: 'A breakthrough in waste-to-energy conversion is helping cities reduce landfill waste by 70% while generating clean electricity for thousands of homes.',
    content: 'New waste-to-energy technology is revolutionizing how municipalities handle their recycling programs. The innovative system can process mixed waste streams and convert them into clean electricity, dramatically reducing the amount of waste sent to landfills. Early adopters report up to 70% reduction in landfill dependency while generating enough power for 5,000 homes per facility.',
    url: 'https://example.com/waste-to-energy-breakthrough',
    source: 'Environmental Technology News',
    category: 'technology',
    publishedAt: '2024-01-20T10:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop',
    author: 'Dr. Sarah Chen',
    tags: ['waste-to-energy', 'recycling', 'technology', 'sustainability'],
    featured: true,
    featured_order: 1,
    customContent: 'This breakthrough represents a significant step forward in sustainable waste management. The technology addresses one of the most pressing challenges facing modern cities: what to do with the growing volume of municipal waste. By converting waste directly into electricity, cities can reduce their environmental footprint while creating a new revenue stream.',
    aiSummary: 'New waste-to-energy technology is helping cities reduce landfill waste by 70% while generating clean electricity. This breakthrough could transform municipal waste management by creating sustainable energy from trash.',
    slug: 'waste-to-energy-technology-transforms-recycling',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'sample-2',
    title: 'New Federal Regulations Impact Construction Debris Disposal Requirements',
    description: 'Updated EPA guidelines require construction companies to implement stricter sorting and disposal protocols for building materials and demolition waste.',
    content: 'The Environmental Protection Agency has announced new federal regulations that will significantly impact how construction companies handle debris disposal. The updated guidelines require enhanced sorting protocols, mandatory recycling percentages, and stricter documentation of waste streams. Construction firms have 18 months to comply with the new requirements.',
    url: 'https://example.com/epa-construction-debris-regulations',
    source: 'Construction Industry Report',
    category: 'policy',
    publishedAt: '2024-01-18T14:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=400&fit=crop',
    author: 'Michael Rodriguez',
    tags: ['EPA', 'construction', 'regulations', 'compliance'],
    featured: true,
    featured_order: 2,
    customContent: 'These new regulations reflect the federal government\'s commitment to reducing construction waste in landfills. Industry experts estimate that proper implementation could divert up to 2 million tons of construction debris from landfills annually. Companies should begin preparing compliance strategies immediately to avoid potential fines.',
    slug: 'federal-regulations-construction-debris-disposal',
    createdAt: '2024-01-18T14:15:00Z',
    updatedAt: '2024-01-18T14:15:00Z',
  },
  {
    id: 'sample-3',
    title: 'Community Recycling Initiative Reduces Local Landfill Usage by 45%',
    description: 'A grassroots recycling program in Portland has dramatically reduced waste sent to local landfills while creating jobs and educating residents about sustainable practices.',
    content: 'Portland\'s innovative community recycling initiative has achieved remarkable results in its first year, reducing local landfill usage by 45%. The program combines neighborhood collection points, education workshops, and a job training component that has created 150 new positions in the recycling sector.',
    url: 'https://example.com/portland-recycling-success',
    source: 'Community Environmental News',
    category: 'community',
    publishedAt: '2024-01-15T09:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop',
    author: 'Jennifer Park',
    tags: ['community', 'recycling', 'education', 'jobs'],
    featured: true,
    featured_order: 3,
    aiSummary: 'Portland\'s community recycling program has reduced landfill usage by 45% while creating 150 jobs. The initiative combines collection points, education, and job training for comprehensive waste reduction.',
    slug: 'community-recycling-initiative-reduces-landfill-usage',
    createdAt: '2024-01-15T09:45:00Z',
    updatedAt: '2024-01-15T09:45:00Z',
  },
  {
    id: 'sample-4',
    title: 'Plastic Waste Recycling Breakthrough Could Transform Ocean Cleanup Efforts',
    description: 'Scientists have developed a new process that can break down ocean plastic waste into valuable chemicals, potentially revolutionizing marine conservation efforts.',
    content: 'Researchers at the Ocean Institute have announced a breakthrough in plastic waste recycling that could transform ocean cleanup efforts. The new chemical process can break down plastic waste collected from marine environments into valuable industrial chemicals, making cleanup operations economically viable while addressing the global plastic pollution crisis.',
    url: 'https://example.com/ocean-plastic-recycling-breakthrough',
    source: 'Marine Science Today',
    category: 'climate',
    publishedAt: '2024-01-12T16:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1569163139759-de59322fd5d9?w=800&h=400&fit=crop',
    author: 'Dr. Amanda Foster',
    tags: ['ocean cleanup', 'plastic recycling', 'marine conservation', 'innovation'],
    featured: false,
    slug: 'plastic-waste-recycling-ocean-cleanup-breakthrough',
    createdAt: '2024-01-12T16:20:00Z',
    updatedAt: '2024-01-12T16:20:00Z',
  },
  {
    id: 'sample-5',
    title: 'Smart Waste Management Systems Reduce Collection Costs by 30%',
    description: 'IoT-enabled waste bins and AI-powered route optimization are helping cities reduce collection costs while improving service efficiency.',
    content: 'Cities implementing smart waste management systems are seeing significant cost reductions and efficiency improvements. IoT sensors in waste bins provide real-time fill level data, while AI algorithms optimize collection routes. Early adopters report 30% reduction in collection costs and 25% improvement in service efficiency.',
    url: 'https://example.com/smart-waste-management-systems',
    source: 'Smart City Technology',
    category: 'technology',
    publishedAt: '2024-01-10T11:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    author: 'Robert Kim',
    tags: ['smart cities', 'IoT', 'efficiency', 'cost reduction'],
    featured: false,
    slug: 'smart-waste-management-systems-reduce-costs',
    createdAt: '2024-01-10T11:30:00Z',
    updatedAt: '2024-01-10T11:30:00Z',
  },
];

/**
 * Initialize sample articles if none exist
 */
export function initializeSampleArticles(): void {
  try {
    const existingArticles = localStorage.getItem('managedArticles');
    if (!existingArticles || JSON.parse(existingArticles).length === 0) {
      localStorage.setItem('managedArticles', JSON.stringify(sampleArticles));
      console.log('Initialized sample articles');
    }
  } catch (error) {
    console.error('Error initializing sample articles:', error);
  }
}
