/**
 * Hardcore Cache Purge Utility
 * Clears ALL browser caches while preserving authentication
 */

export interface CachePurgeOptions {
  preserveAuth?: boolean;
  preserveItems?: string[];
  showProgress?: (message: string) => void;
}

export interface CachePurgeResult {
  success: boolean;
  clearedItems: string[];
  preservedItems: string[];
  errors: string[];
}

export async function hardcoreCachePurge(options: CachePurgeOptions = {}): Promise<CachePurgeResult> {
  const {
    preserveAuth = true,
    preserveItems = [],
    showProgress = () => {}
  } = options;

  const result: CachePurgeResult = {
    success: true,
    clearedItems: [],
    preservedItems: [],
    errors: []
  };

  try {
    showProgress('Starting hardcore cache purge...');

    // 1. Preserve auth data if requested
    const preservedData: Record<string, string> = {};
    if (preserveAuth) {
      const authKeys = ['authToken', 'userData', 'userEmail', 'userName'];
      authKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          preservedData[key] = value;
          result.preservedItems.push(key);
        }
      });
    }

    // Preserve additional items
    preserveItems.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        preservedData[key] = value;
        result.preservedItems.push(key);
      }
    });

    // 2. Clear localStorage
    showProgress('Clearing localStorage...');
    try {
      const localStorageKeys = Object.keys(localStorage);
      localStorage.clear();
      result.clearedItems.push(`localStorage (${localStorageKeys.length} items)`);
    } catch (error) {
      result.errors.push(`localStorage: ${error}`);
    }

    // 3. Clear sessionStorage
    showProgress('Clearing sessionStorage...');
    try {
      const sessionStorageKeys = Object.keys(sessionStorage);
      sessionStorage.clear();
      result.clearedItems.push(`sessionStorage (${sessionStorageKeys.length} items)`);
    } catch (error) {
      result.errors.push(`sessionStorage: ${error}`);
    }

    // 4. Restore preserved data
    showProgress('Restoring preserved data...');
    Object.entries(preservedData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    // 5. Clear Service Worker caches
    showProgress('Clearing service worker caches...');
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        result.clearedItems.push(`Service Worker caches (${cacheNames.length} caches)`);
      } catch (error) {
        result.errors.push(`Service Worker caches: ${error}`);
      }
    }

    // 6. Unregister Service Workers
    showProgress('Unregistering service workers...');
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        result.clearedItems.push(`Service Workers (${registrations.length} workers)`);
      } catch (error) {
        result.errors.push(`Service Workers: ${error}`);
      }
    }

    // 7. Clear IndexedDB
    showProgress('Clearing IndexedDB...');
    if ('indexedDB' in window) {
      try {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            if (db.name) {
              return indexedDB.deleteDatabase(db.name);
            }
          })
        );
        result.clearedItems.push(`IndexedDB (${databases.length} databases)`);
      } catch (error) {
        // IndexedDB.databases() might not be available in all browsers
        result.errors.push(`IndexedDB: ${error}`);
      }
    }

    // 8. Clear cookies for current domain
    showProgress('Clearing cookies...');
    try {
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name && !preservedData[name]) {
          // Clear cookie for all possible paths and domains
          const paths = ['/', window.location.pathname];
          const domains = [window.location.hostname, `.${window.location.hostname}`, ''];
          
          paths.forEach(path => {
            domains.forEach(domain => {
              document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
            });
          });
        }
      });
      result.clearedItems.push('Cookies');
    } catch (error) {
      result.errors.push(`Cookies: ${error}`);
    }

    // 9. Clear browser cache (requires page reload)
    showProgress('Preparing browser cache clear...');
    result.clearedItems.push('Browser cache (requires reload)');

    // 10. Clear any custom app caches
    showProgress('Clearing app-specific caches...');
    try {
      // Clear any app-specific caches
      const appCacheKeys = [
        'chatMessages',
        'app_suite_cache',
        'projectCache',
        'clientCache',
        'taskCache'
      ];
      
      appCacheKeys.forEach(key => {
        if (localStorage.getItem(key) && !preservedData[key]) {
          localStorage.removeItem(key);
          result.clearedItems.push(`App cache: ${key}`);
        }
      });
    } catch (error) {
      result.errors.push(`App caches: ${error}`);
    }

    showProgress('Cache purge complete!');
    
  } catch (error) {
    result.success = false;
    result.errors.push(`General error: ${error}`);
  }

  return result;
}

/**
 * Force a hard reload with cache bypass
 */
export function forceHardReload(): void {
  // Add cache-busting query parameter
  const url = new URL(window.location.href);
  url.searchParams.set('cachebust', Date.now().toString());
  
  // Force reload with cache bypass
  if ('caches' in window) {
    caches.keys().then(names => {
      Promise.all(names.map(name => caches.delete(name))).then(() => {
        window.location.href = url.toString();
      });
    });
  } else {
    window.location.href = url.toString();
  }
}

/**
 * Clear and reload in one action
 */
export async function purgeAndReload(options?: CachePurgeOptions): Promise<void> {
  await hardcoreCachePurge(options);
  setTimeout(() => {
    forceHardReload();
  }, 500);
}

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).hardcoreCachePurge = hardcoreCachePurge;
  (window as any).forceHardReload = forceHardReload;
  (window as any).purgeAndReload = purgeAndReload;
}