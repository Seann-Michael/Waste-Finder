import { OptimizedImage } from "./OptimizedImage";

/**
 * Replace all regular <img> tags with OptimizedImage component
 * This component can be used to wrap existing images with optimization
 */

// Auto-optimize image replacements for better performance
export const optimizeImageElement = (element: HTMLImageElement) => {
  if (element.dataset.optimized) return; // Already optimized
  
  const src = element.src;
  const alt = element.alt || 'Image';
  const className = element.className;
  
  // Mark as optimized to prevent duplicate processing
  element.dataset.optimized = 'true';
  
  // Add lazy loading attribute for browser optimization
  element.loading = 'lazy';
  element.decoding = 'async';
  
  // Add responsive image attributes
  if (!element.sizes) {
    element.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
};

// Auto-optimize all images on page load
export const optimizeAllImages = () => {
  const images = document.querySelectorAll('img:not([data-optimized])');
  images.forEach((img) => optimizeImageElement(img as HTMLImageElement));
};

// Intersection Observer for progressive image loading
export const createImageObserver = () => {
  if (!('IntersectionObserver' in window)) return null;
  
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        optimizeImageElement(img);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.1
  });
};
