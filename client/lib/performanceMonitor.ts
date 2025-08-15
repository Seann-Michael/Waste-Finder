/**
 * Enhanced performance monitoring for Waste Finder application
 * Tracks Core Web Vitals, custom metrics, and user experience indicators
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;

  // Custom metrics
  routeChangeTime?: number;
  searchTime?: number;
  imageLoadTime?: number;
  apiResponseTime?: number;

  // Resource metrics
  bundleSize?: number;
  resourceCount?: number;
  cacheHitRate?: number;

  // User experience
  pageLoadTime?: number;
  interactionTime?: number;
  errorRate?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private startTimes: Map<string, number> = new Map();

  constructor() {
    this.initializeObservers();
    this.trackPageLoad();
    this.trackRouteChanges();
  }

  private initializeObservers() {
    // Monitor navigation timing
    if ("PerformanceObserver" in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.pageLoadTime =
              navEntry.loadEventEnd - navEntry.fetchStart;
            this.metrics.ttfb = navEntry.responseStart - navEntry.fetchStart;
          }
        }
      });

      try {
        navigationObserver.observe({ type: "navigation", buffered: true });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn("Navigation observer not supported:", error);
      }
    }

    // Monitor resource loading
    if ("PerformanceObserver" in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.metrics.resourceCount =
          (this.metrics.resourceCount || 0) + entries.length;

        // Track image loading times
        const imageEntries = entries.filter(
          (entry) =>
            entry.name.includes(".jpg") ||
            entry.name.includes(".png") ||
            entry.name.includes(".webp") ||
            entry.name.includes(".avif"),
        );

        if (imageEntries.length > 0) {
          const avgImageLoadTime =
            imageEntries.reduce((sum, entry) => sum + entry.duration, 0) /
            imageEntries.length;
          this.metrics.imageLoadTime = avgImageLoadTime;
        }
      });

      try {
        resourceObserver.observe({ type: "resource", buffered: true });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn("Resource observer not supported:", error);
      }
    }
  }

  private trackPageLoad() {
    // Track initial page load performance
    window.addEventListener("load", () => {
      this.startTimer("pageLoad");

      // Measure bundle size
      if ("performance" in window && "getEntriesByType" in performance) {
        const resources = performance.getEntriesByType(
          "resource",
        ) as PerformanceResourceTiming[];
        const jsResources = resources.filter((r) => r.name.includes(".js"));
        this.metrics.bundleSize = jsResources.reduce(
          (sum, resource) => sum + (resource.transferSize || 0),
          0,
        );
      }
    });
  }

  private trackRouteChanges() {
    // Monitor route changes for SPA performance
    let currentPath = window.location.pathname;

    const trackRouteChange = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        this.endTimer("routeChange");
        this.startTimer("routeChange");
        currentPath = newPath;
      }
    };

    // Listen for history changes
    window.addEventListener("popstate", trackRouteChange);

    // Override pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      trackRouteChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      trackRouteChange();
    };
  }

  public startTimer(name: string) {
    this.startTimes.set(name, performance.now());
  }

  public endTimer(name: string): number {
    const startTime = this.startTimes.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.startTimes.delete(name);

      // Store specific metrics
      switch (name) {
        case "routeChange":
          this.metrics.routeChangeTime = duration;
          break;
        case "search":
          this.metrics.searchTime = duration;
          break;
        case "apiCall":
          this.metrics.apiResponseTime = duration;
          break;
      }

      return duration;
    }
    return 0;
  }

  public trackApiCall(url: string) {
    const startTime = performance.now();

    return {
      end: (success: boolean = true) => {
        const duration = performance.now() - startTime;
        this.metrics.apiResponseTime = duration;

        if (!success) {
          this.metrics.errorRate = (this.metrics.errorRate || 0) + 1;
        }

        // Track cache hit rate for API calls
        if (url.includes("/api/")) {
          // This would be enhanced with actual cache detection
          this.metrics.cacheHitRate =
            (this.metrics.cacheHitRate || 0) + (success ? 1 : 0);
        }
      },
    };
  }

  public trackUserInteraction(
    type: "click" | "search" | "form" | "navigation",
  ) {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.metrics.interactionTime = duration;

      // Log slow interactions
      if (duration > 100) {
        console.warn(`Slow ${type} interaction: ${duration.toFixed(2)}ms`);
      }
    };
  }

  public measureCoreWebVitals() {
    // Use web-vitals library for accurate measurements
    if (typeof window !== "undefined") {
      import("web-vitals")
        .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS((metric) => {
            this.metrics.cls = metric.value;
            this.reportMetric("CLS", metric.value);
          });

          getFID((metric) => {
            this.metrics.fid = metric.value;
            this.reportMetric("FID", metric.value);
          });

          getFCP((metric) => {
            this.metrics.fcp = metric.value;
            this.reportMetric("FCP", metric.value);
          });

          getLCP((metric) => {
            this.metrics.lcp = metric.value;
            this.reportMetric("LCP", metric.value);
          });

          getTTFB((metric) => {
            this.metrics.ttfb = metric.value;
            this.reportMetric("TTFB", metric.value);
          });
        })
        .catch((error) => {
          console.warn("Web Vitals library not available:", error);
        });
    }
  }

  private reportMetric(name: string, value: number) {
    if (process.env.NODE_ENV === "development") {
      console.log(`📊 ${name}: ${value.toFixed(2)}ms`);
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to Google Analytics, DataDog, etc.
      this.sendToAnalytics(name, value);
    }
  }

  private sendToAnalytics(metric: string, value: number) {
    // Send performance metrics to your analytics service
    // Example implementation:
    if ("gtag" in window) {
      (window as any).gtag("event", "performance_metric", {
        metric_name: metric,
        metric_value: Math.round(value),
        custom_parameter: "waste_finder_app",
      });
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public generateReport(): string {
    const report = [
      "=== Performance Report ===",
      `Page Load Time: ${this.metrics.pageLoadTime?.toFixed(2) || "N/A"}ms`,
      `Route Change Time: ${this.metrics.routeChangeTime?.toFixed(2) || "N/A"}ms`,
      `API Response Time: ${this.metrics.apiResponseTime?.toFixed(2) || "N/A"}ms`,
      `Image Load Time: ${this.metrics.imageLoadTime?.toFixed(2) || "N/A"}ms`,
      `Bundle Size: ${this.metrics.bundleSize ? (this.metrics.bundleSize / 1024).toFixed(2) + "KB" : "N/A"}`,
      `Resource Count: ${this.metrics.resourceCount || "N/A"}`,
      "",
      "=== Core Web Vitals ===",
      `LCP: ${this.metrics.lcp?.toFixed(2) || "N/A"}ms`,
      `FID: ${this.metrics.fid?.toFixed(2) || "N/A"}ms`,
      `CLS: ${this.metrics.cls?.toFixed(3) || "N/A"}`,
      `FCP: ${this.metrics.fcp?.toFixed(2) || "N/A"}ms`,
      `TTFB: ${this.metrics.ttfb?.toFixed(2) || "N/A"}ms`,
    ];

    return report.join("\n");
  }

  public cleanup() {
    // Clean up observers and event listeners
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.startTimes.clear();
  }
}

// Singleton instance
let performanceMonitorInstance: PerformanceMonitor | null = null;

export const getPerformanceMonitor = (): PerformanceMonitor => {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = new PerformanceMonitor();
    performanceMonitorInstance.measureCoreWebVitals();
  }
  return performanceMonitorInstance;
};

// Convenience functions
export const startTimer = (name: string) => {
  getPerformanceMonitor().startTimer(name);
};

export const endTimer = (name: string) => {
  return getPerformanceMonitor().endTimer(name);
};

export const trackApiCall = (url: string) => {
  return getPerformanceMonitor().trackApiCall(url);
};

export const trackUserInteraction = (
  type: "click" | "search" | "form" | "navigation",
) => {
  return getPerformanceMonitor().trackUserInteraction(type);
};

export const getPerformanceReport = () => {
  return getPerformanceMonitor().generateReport();
};

export const cleanupPerformanceMonitoring = () => {
  if (performanceMonitorInstance) {
    performanceMonitorInstance.cleanup();
    performanceMonitorInstance = null;
  }
};
