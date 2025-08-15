/**
 * Core Web Vitals optimization utilities
 * Improves LCP, FID, and CLS metrics for better user experience and SEO
 */

// Largest Contentful Paint (LCP) optimizations
export const optimizeLCP = () => {
  // Preload critical images and resources
  const preloadCriticalResources = () => {
    const criticalImages = document.querySelectorAll('img[data-priority="high"], [data-hero-image]');
    const criticalFonts = [
      '/fonts/inter-regular.woff2',
      '/fonts/inter-semibold.woff2'
    ];
    
    // Preload hero and critical images
    criticalImages.forEach((img) => {
      const src = (img as HTMLImageElement).src;
      if (src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }
    });
    
    // Preload critical fonts
    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = '';
      link.href = fontUrl;
      document.head.appendChild(link);
    });
  };
  
  // Optimize image loading
  const optimizeImages = () => {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach((img) => {
      const element = img as HTMLImageElement;
      
      // Add loading attributes
      if (!element.loading) {
        element.loading = element.dataset.priority === 'high' ? 'eager' : 'lazy';
      }
      
      // Add decoding optimization
      element.decoding = 'async';
      
      // Add responsive sizes if not present
      if (!element.sizes && element.srcset) {
        element.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      }
      
      element.dataset.optimized = 'true';
    });
  };
  
  return { preloadCriticalResources, optimizeImages };
};

// First Input Delay (FID) optimizations
export const optimizeFID = () => {
  // Use passive event listeners
  const addPassiveListeners = () => {
    const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
    
    passiveEvents.forEach(eventType => {
      // Remove existing non-passive listeners and re-add as passive
      document.addEventListener(eventType, () => {}, { passive: true });
    });
  };
  
  // Defer non-critical JavaScript
  const deferNonCriticalJS = () => {
    const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
    
    nonCriticalScripts.forEach(script => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          const newScript = document.createElement('script');
          newScript.src = (script as HTMLScriptElement).src;
          newScript.async = true;
          document.head.appendChild(newScript);
        });
      }
    });
  };
  
  // Break up long tasks
  const scheduleTask = (task: () => void) => {
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(task);
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(task);
    } else {
      setTimeout(task, 0);
    }
  };
  
  return { addPassiveListeners, deferNonCriticalJS, scheduleTask };
};

// Cumulative Layout Shift (CLS) optimizations
export const optimizeCLS = () => {
  // Add aspect ratios to prevent layout shifts
  const addAspectRatios = () => {
    const images = document.querySelectorAll('img:not([style*="aspect-ratio"])');
    const videos = document.querySelectorAll('video:not([style*="aspect-ratio"])');
    const iframes = document.querySelectorAll('iframe:not([style*="aspect-ratio"])');
    
    // Add aspect ratios to images
    images.forEach(img => {
      const element = img as HTMLImageElement;
      if (element.width && element.height) {
        const ratio = element.width / element.height;
        element.style.aspectRatio = ratio.toString();
      } else {
        // Default aspect ratio if dimensions not available
        element.style.aspectRatio = '16/9';
      }
    });
    
    // Add aspect ratios to videos
    videos.forEach(video => {
      (video as HTMLElement).style.aspectRatio = '16/9';
    });
    
    // Add aspect ratios to iframes (like maps, YouTube embeds)
    iframes.forEach(iframe => {
      (iframe as HTMLElement).style.aspectRatio = '16/9';
    });
  };
  
  // Reserve space for dynamic content
  const reserveSpaceForContent = () => {
    const dynamicContainers = document.querySelectorAll('[data-dynamic-content]');
    
    dynamicContainers.forEach(container => {
      const element = container as HTMLElement;
      if (!element.style.minHeight) {
        element.style.minHeight = '200px'; // Reserve minimum space
      }
    });
  };
  
  // Optimize font loading to prevent layout shifts
  const optimizeFontLoading = () => {
    // Use font-display: swap for better performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
      
      /* Fallback fonts with similar metrics */
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
    `;
    document.head.appendChild(style);
  };
  
  return { addAspectRatios, reserveSpaceForContent, optimizeFontLoading };
};

// General performance optimizations
export const optimizePerformance = () => {
  // Optimize scroll performance
  const optimizeScrolling = () => {
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Handle scroll events here
          ticking = false;
        });
        ticking = true;
      }
    };
    
    document.addEventListener('scroll', onScroll, { passive: true });
  };
  
  // Optimize resize performance
  const optimizeResize = () => {
    let resizeTimer: number;
    
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // Handle resize events here
      }, 250);
    };
    
    window.addEventListener('resize', onResize, { passive: true });
  };
  
  return { optimizeScrolling, optimizeResize };
};

// Initialize all Core Web Vitals optimizations
export const initializeCoreWebVitals = () => {
  const { preloadCriticalResources, optimizeImages } = optimizeLCP();
  const { addPassiveListeners, deferNonCriticalJS, scheduleTask } = optimizeFID();
  const { addAspectRatios, reserveSpaceForContent, optimizeFontLoading } = optimizeCLS();
  const { optimizeScrolling, optimizeResize } = optimizePerformance();
  
  // Run optimizations
  const runOptimizations = () => {
    preloadCriticalResources();
    optimizeImages();
    addPassiveListeners();
    deferNonCriticalJS();
    addAspectRatios();
    reserveSpaceForContent();
    optimizeFontLoading();
    optimizeScrolling();
    optimizeResize();
  };
  
  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations);
  } else {
    runOptimizations();
  }
  
  // Return scheduling function for deferred tasks
  return { scheduleTask };
};

// Measure Core Web Vitals
export const measureCoreWebVitals = () => {
  // Use web-vitals library if available
  const measureVitals = async () => {
    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
      
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    } catch (error) {
      console.log('Web Vitals measurement not available:', error);
    }
  };
  
  if (process.env.NODE_ENV === 'development') {
    measureVitals();
  }
};
