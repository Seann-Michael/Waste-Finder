import { getBlogPosts } from './blogService';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = window.location.origin;
  const now = new Date().toISOString();
  
  // Static pages
  const staticPages: SitemapUrl[] = [
    {
      loc: `${baseUrl}/#/`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/#/all-locations`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/#/suggest-location`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/#/pricing-calculator`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/#/debris-weight-calculator`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/#/blog`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/#/news`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/#/contact`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/#/sitemap`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: `${baseUrl}/#/resources`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/#/guest-post`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: `${baseUrl}/#/local-junk-removal`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/#/digital-marketing`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/#/local-seo`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/#/lead-generation`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/#/digital-marketing-junk-removal`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/#/digital-marketing-dumpster-rental`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/#/local-seo-junk-removal`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/#/local-seo-dumpster-rental`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/#/lead-generation-junk-removal`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    }
  ];

  try {
    // Get dynamic blog posts
    const blogResponse = await getBlogPosts({ limit: 100 });
    const blogUrls: SitemapUrl[] = blogResponse.posts.map(post => ({
      loc: `${baseUrl}/#/blog/${post.slug}`,
      lastmod: post.updated_at,
      changefreq: 'monthly',
      priority: 0.7
    }));

    const allUrls = [...staticPages, ...blogUrls];

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static pages only
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return xml;
  }
};

export const downloadSitemap = async () => {
  try {
    const xml = await generateSitemap();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading sitemap:', error);
  }
};
