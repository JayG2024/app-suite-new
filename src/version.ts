// Version identifier for cache busting
export const APP_VERSION = '2.1.0-sheets-update';
export const BUILD_TIME = new Date().toISOString();

// Log version on load
if (typeof window !== 'undefined') {
  console.log(`App Suite Version: ${APP_VERSION} (Built: ${BUILD_TIME})`);
}