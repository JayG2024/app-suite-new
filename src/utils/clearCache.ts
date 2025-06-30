// Cache clearing utility
export const clearAllCaches = async () => {
  console.log('Clearing all caches...');
  
  // Clear localStorage (but preserve auth tokens)
  try {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    localStorage.clear();
    // Restore auth tokens
    if (authToken) localStorage.setItem('authToken', authToken);
    if (userData) localStorage.setItem('userData', userData);
    console.log('✓ localStorage cleared (auth preserved)');
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
  
  // Clear sessionStorage
  try {
    sessionStorage.clear();
    console.log('✓ sessionStorage cleared');
  } catch (e) {
    console.error('Failed to clear sessionStorage:', e);
  }
  
  // Clear service worker caches
  if ('caches' in window) {
    try {
      const names = await caches.keys();
      await Promise.all(names.map(name => caches.delete(name)));
      console.log('✓ Service worker caches cleared');
    } catch (e) {
      console.error('Failed to clear service worker caches:', e);
    }
  }
  
  // Unregister service workers
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
      console.log('✓ Service workers unregistered');
    } catch (e) {
      console.error('Failed to unregister service workers:', e);
    }
  }
  
  // Clear IndexedDB (if used)
  if ('indexedDB' in window) {
    try {
      const databases = await indexedDB.databases();
      await Promise.all(
        databases.map(db => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        })
      );
      console.log('✓ IndexedDB cleared');
    } catch (e) {
      // Older browsers don't support indexedDB.databases()
      console.log('IndexedDB clearing not supported');
    }
  }
  
  console.log('Cache clearing complete!');
};

// Add to window for easy access in console
if (typeof window !== 'undefined') {
  (window as any).clearAllCaches = clearAllCaches;
}