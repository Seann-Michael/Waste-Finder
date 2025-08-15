/**
 * Service Worker registration and management
 * Provides caching, offline functionality, and performance improvements
 */

export interface ServiceWorkerConfig {
  enabled: boolean;
  scope: string;
  updateInterval: number;
  cacheStrategies: {
    [key: string]: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  };
}

const defaultConfig: ServiceWorkerConfig = {
  enabled: process.env.NODE_ENV === 'production',
  scope: '/',
  updateInterval: 24 * 60 * 60 * 1000, // 24 hours
  cacheStrategies: {
    '/api/': 'network-first',
    '/assets/': 'cache-first',
    '/images/': 'cache-first',
    '/': 'stale-while-revalidate'
  }
};

class ServiceWorkerManager {
  private config: ServiceWorkerConfig;
  private registration: ServiceWorkerRegistration | null = null;
  private updateCheckInterval: number | null = null;

  constructor(config: Partial<ServiceWorkerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  public async register(): Promise<boolean> {
    if (!this.config.enabled || !('serviceWorker' in navigator)) {
      console.log('Service Worker not available or disabled');
      return false;
    }

    try {
      console.log('Registering Service Worker...');
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: this.config.scope,
        updateViaCache: 'none' // Always check for updates
      });

      console.log('Service Worker registered successfully:', this.registration.scope);

      // Set up event listeners
      this.setupEventListeners();
      
      // Check for updates periodically
      this.scheduleUpdateChecks();
      
      // Send configuration to service worker
      this.sendConfigToSW();

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  private setupEventListeners() {
    if (!this.registration) return;

    // Handle service worker updates
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;
      if (newWorker) {
        console.log('New Service Worker found, installing...');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            this.showUpdateNotification();
          }
        });
      }
    });

    // Handle service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event);
    });

    // Handle service worker state changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
      // Optionally reload the page
      if (this.shouldReloadOnUpdate()) {
        window.location.reload();
      }
    });
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    const { type, payload } = event.data || {};

    switch (type) {
      case 'CACHE_UPDATED':
        console.log('Cache updated for:', payload.url);
        break;
      
      case 'OFFLINE_READY':
        console.log('App is ready to work offline');
        this.showOfflineReadyNotification();
        break;
      
      case 'UPDATE_AVAILABLE':
        this.showUpdateNotification();
        break;
      
      case 'SKIP_WAITING':
        this.activateUpdate();
        break;
      
      default:
        console.log('Unknown service worker message:', type, payload);
    }
  }

  private sendConfigToSW() {
    if (this.registration?.active) {
      this.registration.active.postMessage({
        type: 'CONFIG_UPDATE',
        payload: this.config
      });
    }
  }

  private scheduleUpdateChecks() {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }

    this.updateCheckInterval = window.setInterval(() => {
      this.checkForUpdates();
    }, this.config.updateInterval);
  }

  public async checkForUpdates(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      console.log('Checking for Service Worker updates...');
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return false;
    }
  }

  public activateUpdate() {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  private showUpdateNotification() {
    // Show user-friendly update notification
    const updateNotification = document.createElement('div');
    updateNotification.id = 'sw-update-notification';
    updateNotification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #059669;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        max-width: 320px;
        font-family: system-ui, sans-serif;
        font-size: 14px;
      ">
        <div style="font-weight: 600; margin-bottom: 0.5rem;">
          App Update Available
        </div>
        <div style="margin-bottom: 1rem; opacity: 0.9;">
          A new version of Waste Finder is available. Reload to get the latest features.
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button onclick="window.serviceWorkerManager.activateUpdate()" style="
            background: white;
            color: #059669;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            font-weight: 500;
            cursor: pointer;
            font-size: 12px;
          ">
            Reload Now
          </button>
          <button onclick="document.getElementById('sw-update-notification').remove()" style="
            background: transparent;
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 12px;
          ">
            Later
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(updateNotification);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      updateNotification.remove();
    }, 10000);
  }

  private showOfflineReadyNotification() {
    console.log('📱 App is ready to work offline!');
    
    // Optional: Show offline ready notification
    if (process.env.NODE_ENV === 'development') {
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: #10b981;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 14px;
          font-weight: 500;
          z-index: 9999;
        ">
          📱 App ready for offline use
        </div>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  }

  private shouldReloadOnUpdate(): boolean {
    // Don't auto-reload during user interaction
    return !document.hasFocus() && document.visibilityState === 'hidden';
  }

  public async preloadCriticalAssets(urls: string[]): Promise<void> {
    if (this.registration?.active) {
      this.registration.active.postMessage({
        type: 'CACHE_URLS',
        payload: urls
      });
    }
  }

  public async getCacheStats(): Promise<any> {
    if (!('caches' in window)) return null;

    try {
      const cacheNames = await caches.keys();
      const stats = {
        totalCaches: cacheNames.length,
        caches: []
      };

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        (stats.caches as any).push({
          name: cacheName,
          entries: keys.length
        });
      }

      return stats;
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  }

  public async clearCaches(): Promise<boolean> {
    if (!('caches' in window)) return false;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear caches:', error);
      return false;
    }
  }

  public unregister(): Promise<boolean> {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }

    if (this.registration) {
      return this.registration.unregister();
    }

    return Promise.resolve(false);
  }
}

// Global instance
let serviceWorkerManager: ServiceWorkerManager | null = null;

export const initializeServiceWorker = async (config?: Partial<ServiceWorkerConfig>): Promise<boolean> => {
  if (!serviceWorkerManager) {
    serviceWorkerManager = new ServiceWorkerManager(config);
    
    // Make available globally for update notifications
    (window as any).serviceWorkerManager = serviceWorkerManager;
  }

  return await serviceWorkerManager.register();
};

export const getServiceWorkerManager = (): ServiceWorkerManager | null => {
  return serviceWorkerManager;
};

export const preloadAssets = (urls: string[]) => {
  serviceWorkerManager?.preloadCriticalAssets(urls);
};

export const checkForServiceWorkerUpdates = () => {
  return serviceWorkerManager?.checkForUpdates() || Promise.resolve(false);
};

export const getCacheStats = () => {
  return serviceWorkerManager?.getCacheStats() || Promise.resolve(null);
};

export const clearAllCaches = () => {
  return serviceWorkerManager?.clearCaches() || Promise.resolve(false);
};

// Cleanup function
export const cleanupServiceWorker = () => {
  if (serviceWorkerManager) {
    serviceWorkerManager.unregister();
    serviceWorkerManager = null;
    delete (window as any).serviceWorkerManager;
  }
};
