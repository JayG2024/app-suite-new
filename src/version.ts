// Version identifier for cache busting
export const APP_VERSION = '2.2.0-routing-fix';
export const BUILD_TIME = new Date().toISOString();
export const PRIMARY_DOMAIN = 'app-suite.io'; // Non-www is primary

// Log version on load
if (typeof window !== 'undefined') {
  console.log(`App Suite Version: ${APP_VERSION} (Built: ${BUILD_TIME})`);
}