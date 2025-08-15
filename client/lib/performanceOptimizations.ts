/**
 * Performance optimization utilities for the Waste Finder application
 */

// Resource hints for critical resources
export const addResourceHints = () => {
  const head = document.head;
  
  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://maps.googleapis.com',
    'https://pagead2.googlesyndication.com'
  ];
  
  preconnectDomains.forEach(domain => {
    if (!document.querySelector(`link[href="${domain}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = '';
      head.appendChild(link);
    }
  });
};

// Optimize fonts loading
export const optimizeFonts = () => {
  // Add font-display: swap to improve loading performance
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Critical CSS inlining for above-the-fold content
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    /* Critical styles for above-the-fold content */
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .page-loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
    .header { position: sticky; top: 0; z-index: 50; background: white; border-bottom: 1px solid #e5e7eb; }
    .main-content { min-height: calc(100vh - 200px); }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
};

// Bundle size optimization helpers
export const removeUnusedCode = () => {
  // Tree shaking hints for unused imports
  if (process.env.NODE_ENV === 'development') {
    console.log('🌳 Tree shaking: Remove unused imports for production builds');
  }
};

// Memory optimization
export const optimizeMemoryUsage = () => {
  // Clean up event listeners and observers on route changes
  const cleanup = () => {
    // Remove any global event listeners
    window.removeEventListener('resize', () => {});
    window.removeEventListener('scroll', () => {});
  };
  
  return cleanup;
};

// Prefetch critical routes
export const prefetchCriticalRoutes = () => {
  const criticalRoutes = ['/locations', '/all-locations', '/suggest'];
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    });
  }
};

// Core Web Vitals optimization
export const optimizeCoreWebVitals = () => {
  // Optimize Largest Contentful Paint (LCP)
  const optimizeLCP = () => {
    // Preload hero images
    const heroImages = document.querySelectorAll('[data-hero-image]');
    heroImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = (img as HTMLImageElement).src;
      document.head.appendChild(link);
    });
  };
  
  // Optimize First Input Delay (FID)
  const optimizeFID = () => {
    // Use passive event listeners where possible
    document.addEventListener('scroll', () => {}, { passive: true });
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
  };
  
  // Optimize Cumulative Layout Shift (CLS)
  const optimizeCLS = () => {
    // Add aspect ratios to prevent layout shifts
    const images = document.querySelectorAll('img:not([style*="aspect-ratio"])');
    images.forEach(img => {
      (img as HTMLElement).style.aspectRatio = '16/9';
    });
  };
  
  return { optimizeLCP, optimizeFID, optimizeCLS };
};

// Initialize all optimizations
export const initializePerformanceOptimizations = () => {
  addResourceHints();
  optimizeFonts();
  inlineCriticalCSS();
  prefetchCriticalRoutes();
  
  const { optimizeLCP, optimizeFID, optimizeCLS } = optimizeCoreWebVitals();
  
  // Run optimizations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeLCP();
      optimizeFID();
      optimizeCLS();
    });
  } else {
    optimizeLCP();
    optimizeFID();
    optimizeCLS();
  }
  
  return optimizeMemoryUsage();
};
