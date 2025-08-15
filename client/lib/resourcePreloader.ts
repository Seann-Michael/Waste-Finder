/**
 * Critical resource preloading system
 * Intelligently preloads resources to improve perceived performance
 */

export interface PreloadResource {
  href: string;
  as: 'script' | 'style' | 'image' | 'font' | 'fetch' | 'document';
  type?: string;
  crossorigin?: '' | 'anonymous' | 'use-credentials';
  media?: string;
  priority?: 'high' | 'low' | 'auto';
  fetchpriority?: 'high' | 'low' | 'auto';
}

export interface PreloadStrategy {
  immediate: PreloadResource[];
  onIdle: PreloadResource[];
  onInteraction: PreloadResource[];
  onRouteChange: { [route: string]: PreloadResource[] };
}

class ResourcePreloader {
  private preloaded = new Set<string>();
  private strategy: PreloadStrategy;
  private idleCallbackId: number | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor() {
    this.strategy = this.getDefaultStrategy();
    this.setupEventListeners();
  }

  private getDefaultStrategy(): PreloadStrategy {
    return {
      immediate: [
        // Critical fonts
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
          as: 'style',
          crossorigin: ''
        },
        // Hero images and critical resources
        {
          href: '/placeholder.svg',
          as: 'image',
          priority: 'high'
        }
      ],
      onIdle: [
        // Non-critical CSS
        {
          href: '/assets/animations.css',
          as: 'style',
          media: 'print',
          priority: 'low'
        },
        // API prefetch for common data
        {
          href: '/api/locations?limit=10',
          as: 'fetch',
          priority: 'low'
        }
      ],
      onInteraction: [
        // Scripts that are loaded on first user interaction
        {
          href: '/assets/search-worker.js',
          as: 'script',
          priority: 'low'
        }
      ],
      onRouteChange: {
        '/locations': [
          {
            href: '/api/locations/all',
            as: 'fetch',
            priority: 'high'
          }
        ],
        '/admin': [
          {
            href: '/assets/admin-bundle.js',
            as: 'script',
            priority: 'high'
          }
        ],
        '/suggest': [
          {
            href: 'https://maps.googleapis.com/maps/api/js',
            as: 'script',
            priority: 'high'
          }
        ]
      }
    };
  }

  private setupEventListeners() {
    // Preload on first user interaction
    const interactionEvents = ['mousedown', 'touchstart', 'keydown'];
    const handleFirstInteraction = () => {
      this.preloadOnInteraction();
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction, { passive: true });
      });
    };

    interactionEvents.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { passive: true });
    });

    // Preload on route changes
    this.setupRouteChangeListener();

    // Preload when hovering over links
    this.setupLinkHoverPreloading();
  }

  private setupRouteChangeListener() {
    let currentPath = window.location.pathname;

    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        this.preloadForRoute(newPath);
        currentPath = newPath;
      }
    };

    // Listen for history changes
    window.addEventListener('popstate', handleRouteChange);

    // Override pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };
  }

  private setupLinkHoverPreloading() {
    // Preload on link hover with debouncing
    let hoverTimeout: number;

    const handleLinkHover = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        clearTimeout(hoverTimeout);
        hoverTimeout = window.setTimeout(() => {
          this.preloadLink(target.href);
        }, 100); // 100ms delay to avoid excessive preloading
      }
    };

    document.addEventListener('mouseover', handleLinkHover, { passive: true });
  }

  public preloadImmediate() {
    this.strategy.immediate.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  public preloadOnIdle() {
    if (this.idleCallbackId) return; // Already scheduled

    if ('requestIdleCallback' in window) {
      this.idleCallbackId = requestIdleCallback(() => {
        this.strategy.onIdle.forEach(resource => {
          this.preloadResource(resource);
        });
        this.idleCallbackId = null;
      }, { timeout: 5000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.strategy.onIdle.forEach(resource => {
          this.preloadResource(resource);
        });
      }, 2000);
    }
  }

  private preloadOnInteraction() {
    this.strategy.onInteraction.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  private preloadForRoute(route: string) {
    const resources = this.strategy.onRouteChange[route];
    if (resources) {
      resources.forEach(resource => {
        this.preloadResource(resource);
      });
    }
  }

  private preloadLink(href: string) {
    // Extract pathname from full URL
    const url = new URL(href, window.location.origin);
    const pathname = url.pathname;

    // Check if we have specific resources for this route
    const resources = this.strategy.onRouteChange[pathname];
    if (resources) {
      resources.forEach(resource => {
        this.preloadResource(resource);
      });
    } else {
      // Generic page preload
      this.preloadResource({
        href: href,
        as: 'document',
        priority: 'low'
      });
    }
  }

  private preloadResource(resource: PreloadResource) {
    if (this.preloaded.has(resource.href)) {
      return; // Already preloaded
    }

    this.preloaded.add(resource.href);

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;

    if (resource.type) link.type = resource.type;
    if (resource.crossorigin !== undefined) link.crossOrigin = resource.crossorigin;
    if (resource.media) link.media = resource.media;
    if (resource.fetchpriority) (link as any).fetchPriority = resource.fetchpriority;

    // Handle load success/error
    link.onload = () => {
      console.log(`✅ Preloaded: ${resource.href}`);
    };

    link.onerror = () => {
      console.warn(`❌ Failed to preload: ${resource.href}`);
      this.preloaded.delete(resource.href); // Allow retry
    };

    document.head.appendChild(link);
  }

  public preloadImages(selector: string = 'img[data-preload]') {
    const images = document.querySelectorAll(selector);
    
    images.forEach(img => {
      const element = img as HTMLImageElement;
      const src = element.dataset.src || element.src;
      
      if (src && !this.preloaded.has(src)) {
        this.preloadResource({
          href: src,
          as: 'image',
          priority: element.dataset.priority as any || 'auto'
        });
      }
    });
  }

  public preloadWithIntersectionObserver(selector: string = '[data-preload-on-visible]') {
    if (!this.intersectionObserver) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const href = element.dataset.preloadSrc;
            const as = element.dataset.preloadAs as any || 'image';
            
            if (href) {
              this.preloadResource({ href, as });
              this.intersectionObserver!.unobserve(element);
            }
          }
        });
      }, {
        rootMargin: '100px' // Start preloading 100px before element comes into view
      });
    }

    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      this.intersectionObserver!.observe(element);
    });
  }

  public preloadCriticalData() {
    // Preload critical API data
    const criticalEndpoints = [
      '/api/locations?limit=10&featured=true',
      '/api/news?limit=5',
      '/api/health'
    ];

    criticalEndpoints.forEach(endpoint => {
      this.preloadResource({
        href: endpoint,
        as: 'fetch',
        priority: 'high'
      });
    });
  }

  public preloadForSearch() {
    // Preload resources needed for search functionality
    const searchResources = [
      {
        href: '/api/locations/all',
        as: 'fetch' as const,
        priority: 'high' as const
      },
      {
        href: '/assets/search-worker.js',
        as: 'script' as const,
        priority: 'low' as const
      }
    ];

    searchResources.forEach(resource => {
      this.preloadResource(resource);
    });
  }

  public addCustomStrategy(strategy: Partial<PreloadStrategy>) {
    // Merge custom strategy with default
    this.strategy = {
      immediate: [...this.strategy.immediate, ...(strategy.immediate || [])],
      onIdle: [...this.strategy.onIdle, ...(strategy.onIdle || [])],
      onInteraction: [...this.strategy.onInteraction, ...(strategy.onInteraction || [])],
      onRouteChange: {
        ...this.strategy.onRouteChange,
        ...strategy.onRouteChange
      }
    };
  }

  public getPreloadedResources(): string[] {
    return Array.from(this.preloaded);
  }

  public clearPreloadCache() {
    this.preloaded.clear();
  }

  public cleanup() {
    if (this.idleCallbackId) {
      cancelIdleCallback(this.idleCallbackId);
      this.idleCallbackId = null;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    this.preloaded.clear();
  }
}

// Singleton instance
let resourcePreloader: ResourcePreloader | null = null;

export const getResourcePreloader = (): ResourcePreloader => {
  if (!resourcePreloader) {
    resourcePreloader = new ResourcePreloader();
  }
  return resourcePreloader;
};

// Convenience functions
export const initializeResourcePreloading = (customStrategy?: Partial<PreloadStrategy>) => {
  const preloader = getResourcePreloader();
  
  if (customStrategy) {
    preloader.addCustomStrategy(customStrategy);
  }

  // Start immediate preloading
  preloader.preloadImmediate();
  
  // Schedule idle preloading
  preloader.preloadOnIdle();
  
  // Preload critical data
  preloader.preloadCriticalData();
  
  return preloader;
};

export const preloadImages = (selector?: string) => {
  getResourcePreloader().preloadImages(selector);
};

export const preloadOnVisible = (selector?: string) => {
  getResourcePreloader().preloadWithIntersectionObserver(selector);
};

export const preloadForSearch = () => {
  getResourcePreloader().preloadForSearch();
};

export const preloadResource = (resource: PreloadResource) => {
  getResourcePreloader().preloadResource(resource);
};

export const addPreloadStrategy = (strategy: Partial<PreloadStrategy>) => {
  getResourcePreloader().addCustomStrategy(strategy);
};

export const getPreloadStats = () => {
  return {
    preloadedResources: getResourcePreloader().getPreloadedResources(),
    count: getResourcePreloader().getPreloadedResources().length
  };
};

export const cleanupResourcePreloader = () => {
  if (resourcePreloader) {
    resourcePreloader.cleanup();
    resourcePreloader = null;
  }
};
