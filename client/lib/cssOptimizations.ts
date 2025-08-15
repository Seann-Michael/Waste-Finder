/**
 * CSS optimization utilities to reduce render-blocking and improve page load speed
 */

// Critical CSS extraction and inlining
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    html, body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #ffffff;
    }
    
    /* Header critical styles */
    .header-critical {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 0;
    }
    
    /* Navigation critical styles */
    .nav-critical {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    /* Button critical styles */
    .btn-critical {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.375rem;
      font-weight: 500;
      transition: all 0.15s ease;
      cursor: pointer;
      border: none;
    }
    
    .btn-primary {
      background-color: #059669;
      color: white;
      padding: 0.5rem 1rem;
    }
    
    .btn-primary:hover {
      background-color: #047857;
    }
    
    /* Loading states */
    .loading-spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid #f3f4f6;
      border-radius: 50%;
      border-top-color: #059669;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Form critical styles */
    .form-critical {
      margin-bottom: 1rem;
    }
    
    .input-critical {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }
    
    .input-critical:focus {
      outline: none;
      border-color: #059669;
      box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.1);
    }
    
    /* Layout critical styles */
    .container-critical {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .main-content {
      min-height: calc(100vh - 200px);
      padding: 2rem 0;
    }
    
    /* Responsive utilities */
    @media (max-width: 768px) {
      .nav-critical {
        padding: 0 0.5rem;
      }
      
      .container-critical {
        padding: 0 0.5rem;
      }
      
      .main-content {
        padding: 1rem 0;
      }
    }
    
    /* Prevent layout shift */
    .image-placeholder {
      background-color: #f3f4f6;
      aspect-ratio: 16 / 9;
      border-radius: 0.375rem;
    }
    
    /* Text styles */
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .font-normal { font-weight: 400; }
    
    /* Spacing utilities */
    .m-0 { margin: 0; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    
    .p-0 { padding: 0; }
    .p-2 { padding: 0.5rem; }
    .p-4 { padding: 1rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    
    /* Flexbox utilities */
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .flex-col { flex-direction: column; }
    .flex-wrap { flex-wrap: wrap; }
    
    /* Grid utilities */
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .gap-2 { gap: 0.5rem; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    
    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    
    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
  `;
  
  const style = document.createElement('style');
  style.id = 'critical-css';
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
};

// Load non-critical CSS asynchronously
export const loadNonCriticalCSS = () => {
  const nonCriticalStylesheets = [
    // These would be extracted during build
    '/assets/components.css',
    '/assets/animations.css',
    '/assets/print.css'
  ];
  
  nonCriticalStylesheets.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
};

// Optimize font loading
export const optimizeFontLoading = () => {
  // Preload critical fonts
  const criticalFonts = [
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
      crossorigin: ''
    }
  ];
  
  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = font.href;
    if (font.crossorigin) link.crossOrigin = font.crossorigin;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
  
  // Add font-display: swap for better performance
  const fontDisplayStyle = document.createElement('style');
  fontDisplayStyle.textContent = `
    /* Optimize font loading */
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
    
    /* Fallback font stack with similar metrics */
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
  `;
  document.head.appendChild(fontDisplayStyle);
};

// Remove unused CSS (runtime cleanup)
export const removeUnusedCSS = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 CSS Cleanup: Remove unused styles in production build');
    
    // Log potentially unused CSS classes
    const unusedClasses = [
      // Classes that might not be used
      'animate-bounce',
      'animate-pulse',
      'animate-ping',
      'animate-spin',
      'backdrop-blur-xl',
      'backdrop-brightness-',
      'backdrop-contrast-',
      'backdrop-hue-rotate-',
      'backdrop-invert',
      'backdrop-opacity-',
      'backdrop-saturate-',
      'backdrop-sepia'
    ];
    
    console.log('Consider removing these unused animation/backdrop classes:', unusedClasses);
  }
};

// Optimize CSS delivery
export const optimizeCSSDelivery = () => {
  // Defer non-critical CSS loading
  const deferCSS = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    
    link.onload = () => {
      link.rel = 'stylesheet';
      link.media = 'all';
    };
    
    document.head.appendChild(link);
    
    // Fallback for browsers that don't support preload
    const noscript = document.createElement('noscript');
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'stylesheet';
    fallbackLink.href = href;
    noscript.appendChild(fallbackLink);
    document.head.appendChild(noscript);
  };
  
  // Load print styles only when needed
  deferCSS('/assets/print.css');
  
  // Load animation styles after initial render
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      deferCSS('/assets/animations.css');
    });
  } else {
    setTimeout(() => {
      deferCSS('/assets/animations.css');
    }, 1000);
  }
};

// Minify inline styles
export const minifyInlineStyles = () => {
  const styleElements = document.querySelectorAll('style:not(#critical-css)');
  
  styleElements.forEach(style => {
    if (style.textContent) {
      // Basic CSS minification
      style.textContent = style.textContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/;\s*}/g, '}') // Remove last semicolon before }
        .replace(/\s*{\s*/g, '{') // Remove spaces around {
        .replace(/\s*}\s*/g, '}') // Remove spaces around }
        .replace(/\s*:\s*/g, ':') // Remove spaces around :
        .replace(/\s*;\s*/g, ';') // Remove spaces around ;
        .trim();
    }
  });
};

// CSS containment for better rendering performance
export const applyCSSContainment = () => {
  const containmentStyle = document.createElement('style');
  containmentStyle.textContent = `
    /* CSS Containment for better rendering performance */
    .location-card {
      contain: layout style;
    }
    
    .search-results {
      contain: layout;
    }
    
    .news-carousel {
      contain: layout style;
    }
    
    .admin-table {
      contain: layout;
    }
    
    /* Prevent layout thrashing */
    .will-change-transform {
      will-change: transform;
    }
    
    .will-change-scroll {
      will-change: scroll-position;
    }
    
    /* GPU acceleration for animations */
    .gpu-accelerated {
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
  `;
  document.head.appendChild(containmentStyle);
};

// Initialize all CSS optimizations
export const initializeCSSOptimizations = () => {
  // Inline critical CSS immediately
  inlineCriticalCSS();
  
  // Optimize font loading
  optimizeFontLoading();
  
  // Apply CSS containment
  applyCSSContainment();
  
  // Defer non-critical CSS
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadNonCriticalCSS();
      optimizeCSSDelivery();
      minifyInlineStyles();
    });
  } else {
    loadNonCriticalCSS();
    optimizeCSSDelivery();
    minifyInlineStyles();
  }
  
  // Remove unused CSS in development
  removeUnusedCSS();
};

// Runtime CSS optimization utilities
export const optimizeRuntimeCSS = () => {
  // Remove unused CSS classes from DOM
  const removeUnusedClasses = () => {
    const allElements = document.querySelectorAll('*[class]');
    const usedClasses = new Set<string>();
    
    allElements.forEach(element => {
      element.className.split(' ').forEach(className => {
        if (className.trim()) {
          usedClasses.add(className.trim());
        }
      });
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 CSS Stats: ${usedClasses.size} unique classes in use`);
    }
  };
  
  // Optimize CSS animations
  const optimizeAnimations = () => {
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    
    animatedElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      // Pause animations when not visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            htmlElement.style.animationPlayState = 'running';
          } else {
            htmlElement.style.animationPlayState = 'paused';
          }
        });
      });
      
      observer.observe(htmlElement);
    });
  };
  
  return { removeUnusedClasses, optimizeAnimations };
};
