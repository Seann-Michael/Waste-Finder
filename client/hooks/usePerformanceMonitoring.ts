import { useEffect, useCallback } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
import { trackEvent } from '@/lib/monitoring';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

/**
 * Hook for monitoring Web Vitals and performance metrics
 */
export function usePerformanceMonitoring() {
  const reportMetric = useCallback((metric: PerformanceMetric) => {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('Performance metric:', metric);
    }

    // Track in Sentry
    trackEvent('performance_metric', {
      metric_name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });

    // Send to analytics if needed
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_rating: metric.rating,
      });
    }
  }, []);

  useEffect(() => {
    // Core Web Vitals
    onCLS(reportMetric);
    onFID(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
  }, [reportMetric]);

  return {
    reportMetric,
  };
}

/**
 * Hook for monitoring component render performance
 */
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const renderTime = performance.now() - startTime;

      if (renderTime > 100) { // Only track slow renders
        trackEvent('slow_render', {
          component: componentName,
          render_time: renderTime,
        });
      }
    };
  }, [componentName]);
}

/**
 * Hook for monitoring API response times
 */
export function useAPIPerformance() {
  const trackAPICall = useCallback((url: string, startTime: number, response: Response) => {
    const duration = performance.now() - startTime;

    trackEvent('api_response_time', {
      url,
      duration,
      status: response.status,
      success: response.ok,
    });

    // Log slow API calls
    if (duration > 2000) {
      console.warn(`Slow API call: ${url} took ${duration}ms`);
    }
  }, []);

  return { trackAPICall };
}

/**
 * Monitor bundle size and loading performance
 */
export function useBundlePerformance() {
  useEffect(() => {
    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;

          trackEvent('page_load_timing', {
            dns_lookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
            tcp_connect: navEntry.connectEnd - navEntry.connectStart,
            request_response: navEntry.responseEnd - navEntry.requestStart,
            dom_processing: navEntry.domContentLoadedEventEnd - navEntry.responseEnd,
            total_load_time: navEntry.loadEventEnd - navEntry.navigationStart,
          });
        }

        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;

          // Track large resources
          if (resourceEntry.transferSize > 100000) { // > 100KB
            trackEvent('large_resource', {
              name: resourceEntry.name,
              size: resourceEntry.transferSize,
              duration: resourceEntry.duration,
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'resource'] });

    return () => observer.disconnect();
  }, []);
}

/**
 * Memory usage monitoring
 */
export function useMemoryMonitoring() {
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;

        trackEvent('memory_usage', {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          usage_percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
        });
      }
    };

    // Check memory usage every 30 seconds
    const interval = setInterval(checkMemory, 30000);

    return () => clearInterval(interval);
  }, []);
}
