// Version identifier for cache busting
export const APP_VERSION = '2.3.0-cache-clean';
export const BUILD_TIME = new Date().toISOString();
export const PRIMARY_DOMAIN = 'app-suite.io'; // Non-www is primary

// Log version on load
if (typeof window !== 'undefined') {
  console.log(`App Suite Version: ${APP_VERSION} (Built: ${BUILD_TIME})`);
  
  // Clear old cache on version change
  const lastVersion = localStorage.getItem('app_version');
  if (lastVersion && lastVersion !== APP_VERSION) {
    console.log('New version detected, clearing cache...');
    localStorage.clear();
    sessionStorage.clear();
    // Clear service worker cache if exists
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  }
  localStorage.setItem('app_version', APP_VERSION);
}