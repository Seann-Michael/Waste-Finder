/**
 * Bundle optimization utilities
 * Helps reduce bundle size and improve loading performance
 */

// Dynamic imports for heavy libraries
export const dynamicImports = {
  // Lazy load heavy date libraries
  dateFns: () => import('date-fns'),
  
  // Lazy load chart libraries if needed
  recharts: () => import('recharts'),
  
  // Lazy load React Query dev tools only in development (if available)
  reactQueryDevtools: () => {
    if (process.env.NODE_ENV === 'development') {
      // Try to import devtools, but gracefully handle if not installed
      try {
        return import('@tanstack/react-query-devtools').catch(() =>
          Promise.resolve({ ReactQueryDevtools: null })
        );
      } catch {
        return Promise.resolve({ ReactQueryDevtools: null });
      }
    }
    return Promise.resolve({ ReactQueryDevtools: null });
  },
  
  // Lazy load admin-specific heavy components
  richTextEditor: () => import('@/components/ui/rich-text-editor'),
  dataTable: () => import('@/components/ui/data-table'),
};

// Code splitting hints for Vite
export const optimizeChunks = () => {
  return {
    // Vendor chunk for stable dependencies
    vendor: ['react', 'react-dom', 'react-router-dom'],
    
    // UI components chunk
    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
    
    // Query and state management
    query: ['@tanstack/react-query', '@supabase/supabase-js'],
    
    // Admin-specific chunk
    admin: ['@/pages/Admin', '@/pages/admin/'],
    
    // Marketing pages chunk  
    marketing: [
      '@/pages/DigitalMarketing',
      '@/pages/LocalSEO', 
      '@/pages/LeadGeneration'
    ]
  };
};

// Tree shaking configuration
export const treeShakingConfig = {
  // Mark side-effect free packages
  sideEffects: false,
  
  // Packages that can be tree-shaken
  treeShakablePackages: [
    'lodash-es',
    'date-fns',
    'lucide-react',
    '@radix-ui/*'
  ],
  
  // Unused CSS elimination
  purgeCSS: {
    content: ['./client/**/*.{js,jsx,ts,tsx}'],
    defaultExtractor: (content: string) => content.match(/[\w-/:]+(?<!:)/g) || [],
    safelist: [
      // Always keep these classes
      'html', 'body', 
      /^bg-/, /^text-/, /^border-/, 
      /^hover:/, /^focus:/, /^active:/,
      // Animation classes
      /^animate-/, /^transition-/, /^duration-/
    ]
  }
};

// Remove unused dependencies
export const analyzeUnusedDependencies = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📦 Bundle Analysis:');
    console.log('Consider removing these potentially unused dependencies:');
    
    const potentiallyUnused = [
      // Check if these are actually used
      'three', // 3D graphics library
      'vaul', // Drawer component
      'input-otp', // OTP input
      'next-themes', // Theme switching
      'embla-carousel-react', // Carousel
      'react-resizable-panels', // Resizable panels
    ];
    
    potentiallyUnused.forEach(dep => {
      console.log(`- ${dep}: Check if actually used in codebase`);
    });
  }
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  if (process.env.NODE_ENV === 'production') {
    // Log bundle metrics
    const bundleMetrics = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown'
    };
    
    console.log('📊 Bundle loaded:', bundleMetrics);
  }
};

// Memory optimization
export const optimizeMemory = () => {
  // Clean up intervals and timeouts
  const intervals: number[] = [];
  const timeouts: number[] = [];
  
  const addInterval = (callback: () => void, delay: number) => {
    const id = window.setInterval(callback, delay);
    intervals.push(id);
    return id;
  };
  
  const addTimeout = (callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timeouts.push(id);
    return id;
  };
  
  const cleanup = () => {
    intervals.forEach(id => clearInterval(id));
    timeouts.forEach(id => clearTimeout(id));
    intervals.length = 0;
    timeouts.length = 0;
  };
  
  return { addInterval, addTimeout, cleanup };
};

// Initialize bundle optimizations
export const initializeBundleOptimizations = () => {
  analyzeUnusedDependencies();
  monitorBundleSize();
  
  // Return cleanup function
  return optimizeMemory();
};
