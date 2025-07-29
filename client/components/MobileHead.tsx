/**
 * MobileHead Component
 *
 * Provides essential mobile viewport and PWA meta tags for optimal mobile experience
 * Should be included in the document head for all pages
 */

export function MobileHead() {
  return (
    <>
      {/* Mobile viewport optimization */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
      />

      {/* Mobile browser theme colors */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-navbutton-color" content="#3b82f6" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Mobile web app capabilities */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="WasteFinder" />

      {/* Touch icons for mobile home screen */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      {/* Prevent text scaling on orientation change */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          html {
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            text-size-adjust: 100%;
          }
          
          /* Improve tap highlighting */
          * {
            -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
          }
          
          /* Better scrolling on iOS */
          body {
            -webkit-overflow-scrolling: touch;
          }
        `,
        }}
      />
    </>
  );
}
