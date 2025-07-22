// PWA registration and service worker utilities
export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWACapabilities {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  hasServiceWorker: boolean;
  hasNotificationPermission: boolean;
  hasBackgroundSync: boolean;
  hasPushMessaging: boolean;
  isOnline: boolean;
}

export interface PWAUpdateInfo {
  available: boolean;
  version?: string;
  releaseNotes?: string;
}

// Extend ServiceWorkerRegistration for compatibility
interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: {
    register: (tag: string) => Promise<void>;
  };
}

class PWAService {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private registration: ExtendedServiceWorkerRegistration | null = null;
  private updateCheckInterval: NodeJS.Timeout | null = null;
  private callbacks: {
    install: Array<() => void>;
    update: Array<(info: PWAUpdateInfo) => void>;
    offline: Array<() => void>;
    online: Array<() => void>;
  } = {
    install: [],
    update: [],
    offline: [],
    online: []
  };

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Register service worker
    await this.registerServiceWorker();

    // Set up install prompt handler
    this.setupInstallPrompt();

    // Set up network status monitoring
    this.setupNetworkMonitoring();

    // Set up automatic update checking
    this.setupUpdateChecking();

    // Set up push notifications
    this.setupPushNotifications();
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none' // Always check for updates
        });

        console.log('[PWA] Service Worker registered successfully');

        // Listen for service worker updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New version available
                  this.notifyUpdate({
                    available: true,
                    version: 'latest',
                    releaseNotes: 'New features and improvements available'
                  });
                } else {
                  // First install
                  console.log('[PWA] Service Worker installed for the first time');
                }
              }
            });
          }
        });

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data);
        });

        // Check for waiting service worker on load
        if (this.registration.waiting) {
          this.notifyUpdate({
            available: true,
            version: 'waiting'
          });
        }

      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    } else {
      console.warn('[PWA] Service Workers not supported');
    }
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Store the event so it can be triggered later
      this.deferredPrompt = e as any;
      
      console.log('[PWA] Install prompt available');
      
      // Notify listeners that install is available
      this.callbacks.install.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('[PWA] Install callback error:', error);
        }
      });
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      this.deferredPrompt = null;
    });
  }

  private setupNetworkMonitoring(): void {
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        this.callbacks.online.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('[PWA] Online callback error:', error);
          }
        });
      } else {
        this.callbacks.offline.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('[PWA] Offline callback error:', error);
          }
        });
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial check
    updateOnlineStatus();
  }

  private setupUpdateChecking(): void {
    // Check for updates every 30 minutes
    this.updateCheckInterval = setInterval(async () => {
      await this.checkForUpdates();
    }, 30 * 60 * 1000);

    // Also check when the page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  private async setupPushNotifications(): Promise<void> {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('[PWA] Notification permission granted');
      }
    } catch (error) {
      console.warn('[PWA] Could not request notification permission:', error);
    }
  }

  private handleServiceWorkerMessage(data: any): void {
    if (!data || typeof data !== 'object') return;
    
    switch (data.type) {
      case 'CACHE_UPDATED':
        console.log('[PWA] Cache updated');
        break;
      case 'BACKGROUND_SYNC':
        console.log('[PWA] Background sync completed');
        break;
      case 'PUSH_RECEIVED':
        console.log('[PWA] Push notification received');
        break;
      default:
        console.log('[PWA] Service worker message:', data);
    }
  }

  private notifyUpdate(info: PWAUpdateInfo): void {
    this.callbacks.update.forEach(callback => {
      try {
        callback(info);
      } catch (error) {
        console.error('[PWA] Update callback error:', error);
      }
    });
  }

  public async checkForUpdates(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
      console.log('[PWA] Checked for updates');
    } catch (error) {
      console.error('[PWA] Update check failed:', error);
    }
  }

  public async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return false;
    }

    try {
      // Show the install prompt
      await this.deferredPrompt.prompt();
      
      // Wait for the user's response
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        this.deferredPrompt = null;
        return true;
      } else {
        console.log('[PWA] User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
      return false;
    }
  }

  public async updateApp(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      console.warn('[PWA] No update available');
      return;
    }

    // Tell the waiting service worker to become active
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload the page to use the new service worker
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  public async enableNotifications(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('[PWA] Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('[PWA] Notification permission error:', error);
      return false;
    }
  }

  public async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration || !('PushManager' in window)) {
      console.warn('[PWA] Push messaging not supported');
      return null;
    }

    try {
      // Check if already subscribed
      let subscription = await this.registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Create new subscription
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            process.env.REACT_APP_VAPID_PUBLIC_KEY || ''
          )
        });
      }

      console.log('[PWA] Push subscription created');
      return subscription;
    } catch (error) {
      console.error('[PWA] Push subscription failed:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  public async registerBackgroundSync(tag: string): Promise<void> {
    if (!this.registration || !('sync' in this.registration)) {
      console.warn('[PWA] Background sync not supported');
      return;
    }

    try {
      const syncManager = this.registration?.sync;
      if (syncManager && typeof syncManager.register === 'function') {
        await syncManager.register(tag);
        console.log(`[PWA] Background sync registered: ${tag}`);
      }
    } catch (error) {
      console.error('[PWA] Background sync registration failed:', error);
    }
  }

  public getCapabilities(): PWACapabilities {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    return {
      isInstallable: Boolean(this.deferredPrompt),
      isInstalled: isStandalone,
      isStandalone,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasNotificationPermission: Notification?.permission === 'granted',
      hasBackgroundSync: Boolean(this.registration && 'sync' in this.registration),
      hasPushMessaging: Boolean(this.registration && 'pushManager' in this.registration),
      isOnline: navigator.onLine
    };
  }

  public onInstallAvailable(callback: () => void): () => void {
    this.callbacks.install.push(callback);
    return () => {
      const index = this.callbacks.install.indexOf(callback);
      if (index > -1) {
        this.callbacks.install.splice(index, 1);
      }
    };
  }

  public onUpdateAvailable(callback: (info: PWAUpdateInfo) => void): () => void {
    this.callbacks.update.push(callback);
    return () => {
      const index = this.callbacks.update.indexOf(callback);
      if (index > -1) {
        this.callbacks.update.splice(index, 1);
      }
    };
  }

  public onOffline(callback: () => void): () => void {
    this.callbacks.offline.push(callback);
    return () => {
      const index = this.callbacks.offline.indexOf(callback);
      if (index > -1) {
        this.callbacks.offline.splice(index, 1);
      }
    };
  }

  public onOnline(callback: () => void): () => void {
    this.callbacks.online.push(callback);
    return () => {
      const index = this.callbacks.online.indexOf(callback);
      if (index > -1) {
        this.callbacks.online.splice(index, 1);
      }
    };
  }

  public async showNotification(
    title: string,
    options: NotificationOptions = {}
  ): Promise<void> {
    if (!this.registration) {
      // Fallback to browser notification
      if (Notification.permission === 'granted') {
        new Notification(title, options);
      }
      return;
    }

    try {
      const notificationOptions: NotificationOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        requireInteraction: true,
        ...options
      };
      
      // Add vibration pattern if supported (via service worker)
      const enhancedOptions = {
        ...notificationOptions,
        data: {
          ...options.data,
          vibrate: [200, 100, 200]
        }
      };
      
      await this.registration.showNotification(title, enhancedOptions);
    } catch (error) {
      console.error('[PWA] Show notification failed:', error);
    }
  }

  public async clearAllCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('[PWA] All caches cleared');
    } catch (error) {
      console.error('[PWA] Cache clearing failed:', error);
    }
  }

  public async getCacheSize(): Promise<number> {
    try {
      if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
        return 0;
      }

      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    } catch (error) {
      console.error('[PWA] Cache size estimation failed:', error);
      return 0;
    }
  }

  public destroy(): void {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }

    // Clear all callbacks
    this.callbacks = {
      install: [],
      update: [],
      offline: [],
      online: []
    };
  }
}

// Create singleton instance
const pwaService = new PWAService();

export default pwaService;
