import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Loader2 } from 'lucide-react';
import { generateSitemap, downloadSitemap } from '@/lib/sitemapGenerator';

export default function XMLSitemap() {
  const [sitemapXML, setSitemapXML] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        const xml = await generateSitemap();
        setSitemapXML(xml);
      } catch (err) {
        setError('Failed to generate sitemap');
        console.error('Sitemap generation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSitemap();
  }, []);

  const handleDownload = async () => {
    try {
      await downloadSitemap();
    } catch (err) {
      setError('Failed to download sitemap');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            XML Sitemap
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete XML sitemap for Dump Near Me website including all pages and blog posts.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Sitemap Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleDownload} disabled={isLoading}>
                <Download className="w-4 h-4 mr-2" />
                Download sitemap.xml
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  const blob = new Blob([sitemapXML], { type: 'application/xml' });
                  const url = URL.createObjectURL(blob);
                  window.open(url, '_blank');
                  URL.revokeObjectURL(url);
                }}
                disabled={isLoading || !sitemapXML}
              >
                <FileText className="w-4 h-4 mr-2" />
                View XML
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This sitemap includes all public pages, blog posts, and location pages. 
              It's automatically updated when new content is added.
            </p>
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Sitemap Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Generating sitemap...
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {sitemapXML}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            For SEO purposes, submit this sitemap to{' '}
            <a 
              href="https://search.google.com/search-console" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Search Console
            </a>{' '}
            and{' '}
            <a 
              href="https://www.bing.com/webmasters" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Bing Webmaster Tools
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
