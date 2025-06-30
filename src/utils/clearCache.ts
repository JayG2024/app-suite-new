// Cache clearing utility with user feedback
interface CacheClearResult {
  success: boolean;
  clearedItems: string[];
  errors: string[];
  preservedItems: string[];
}

export const clearAllCaches = async (
  onProgress?: (message: string) => void,
  preserveAdditional?: string[]
): Promise<CacheClearResult> => {
  const result: CacheClearResult = {
    success: true,
    clearedItems: [],
    errors: [],
    preservedItems: []
  };

  const log = (message: string) => {
    console.log(message);
    onProgress?.(message);
  };

  log('Starting comprehensive cache purge...');
  
  // Items to preserve (auth tokens + any additional)
  const preserveKeys = ['authToken', 'userData', ...(preserveAdditional || [])];
  
  // 1. Clear localStorage (but preserve auth tokens)
  try {
    const preserved: Record<string, string> = {};
    
    // Save items to preserve
    preserveKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        preserved[key] = value;
        result.preservedItems.push(`localStorage.${key}`);
      }
    });
    
    // Get count before clearing
    const itemCount = localStorage.length;
    localStorage.clear();
    
    // Restore preserved items
    Object.entries(preserved).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    result.clearedItems.push(`localStorage (${itemCount - Object.keys(preserved).length} items)`);
    log('✓ localStorage cleared (auth preserved)');
  } catch (e) {
    const error = `Failed to clear localStorage: ${e}`;
    result.errors.push(error);
    result.success = false;
    console.error(error);
  }
  
  // 2. Clear sessionStorage
  try {
    const itemCount = sessionStorage.length;
    sessionStorage.clear();
    result.clearedItems.push(`sessionStorage (${itemCount} items)`);
    log('✓ sessionStorage cleared');
  } catch (e) {
    const error = `Failed to clear sessionStorage: ${e}`;
    result.errors.push(error);
    result.success = false;
    console.error(error);
  }
  
  // 3. Clear service worker caches
  if ('caches' in window) {
    try {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
      result.clearedItems.push(`Service worker caches (${names.length} caches)`);
      log(`✓ Service worker caches cleared (${names.length} caches)`);
    } catch (e) {
      const error = `Failed to clear service worker caches: ${e}`;
      result.errors.push(error);
      result.success = false;
      console.error(error);
    }
  }
  
  // 4. Unregister service workers
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
      result.clearedItems.push(`Service workers (${registrations.length} workers)`);
      log(`✓ Service workers unregistered (${registrations.length} workers)`);
    } catch (e) {
      const error = `Failed to unregister service workers: ${e}`;
      result.errors.push(error);
      result.success = false;
      console.error(error);
    }
  }
  
  // 5. Clear IndexedDB
  if ('indexedDB' in window) {
    try {
      const databases = await indexedDB.databases?.() || [];
      await Promise.all(
        databases.map(db => {
          if (db.name) {
            return indexedDB.deleteDatabase(db.name);
          }
        })
      );
      result.clearedItems.push(`IndexedDB (${databases.length} databases)`);
      log(`✓ IndexedDB cleared (${databases.length} databases)`);
    } catch (e) {
      // Older browsers don't support indexedDB.databases()
      log('IndexedDB clearing not supported in this browser');
    }
  }
  
  // 6. Clear cookies (domain-specific)
  try {
    // Note: This only works for cookies accessible to JavaScript (not httpOnly)
    const cookies = document.cookie.split(';');
    let clearedCookies = 0;
    
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      
      // Skip auth-related cookies
      if (name && !preserveKeys.includes(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
        clearedCookies++;
      }
    });
    
    if (clearedCookies > 0) {
      result.clearedItems.push(`Cookies (${clearedCookies} cookies)`);
      log(`✓ Cookies cleared (${clearedCookies} cookies)`);
    }
  } catch (e) {
    const error = `Failed to clear cookies: ${e}`;
    result.errors.push(error);
    console.error(error);
  }
  
  // 7. Clear memory caches by adding cache-busting to resources
  try {
    // Force reload CSS
    const links = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = link.href;
      const url = new URL(href);
      url.searchParams.set('cache-bust', Date.now().toString());
      link.href = url.toString();
    });
    
    // Force reload scripts (be careful with this)
    const scripts = document.querySelectorAll<HTMLScriptElement>('script[src]');
    const scriptsToReload: string[] = [];
    scripts.forEach(script => {
      if (!script.src.includes('cache-bust')) {
        scriptsToReload.push(script.src);
      }
    });
    
    if (links.length > 0 || scriptsToReload.length > 0) {
      result.clearedItems.push(`Forced reload: ${links.length} stylesheets, ${scriptsToReload.length} scripts`);
      log(`✓ Forced asset reload initiated`);
    }
  } catch (e) {
    console.warn('Could not force reload some assets:', e);
  }
  
  log(`Cache purge complete! Success: ${result.success}`);
  return result;
};

// Force hard reload of the page
export const forceHardReload = () => {
  // This bypasses cache completely
  window.location.reload();
  // For extra measure in some browsers
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    }).then(() => {
      window.location.reload();
    });
  }
};

// Add keyboard shortcut handler
export const setupCacheKeyboardShortcut = (
  callback?: (result: CacheClearResult) => void
) => {
  const handleKeyPress = async (e: KeyboardEvent) => {
    // Ctrl/Cmd + Shift + R to clear cache
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      const result = await clearAllCaches();
      callback?.(result);
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  
  // Return cleanup function
  return () => window.removeEventListener('keydown', handleKeyPress);
};

// Add to window for easy access in console
if (typeof window !== 'undefined') {
  (window as any).clearAllCaches = clearAllCaches;
  (window as any).forceHardReload = forceHardReload;
}