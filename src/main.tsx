import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simple error logging for production
const logError = (error: any, context: string) => {
  console.error(`[${context}]`, error);
  
  // Show error in development
  if (import.meta.env.DEV) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'background: red; color: white; padding: 10px; margin: 10px; font-family: monospace; font-size: 12px;';
    errorDiv.textContent = `${context}: ${error?.message || error}`;
    document.body.appendChild(errorDiv);
  }
};

// Global error handlers
window.addEventListener('error', (event) => {
  logError(event.error, 'Global Error');
});

window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason, 'Unhandled Promise');
  event.preventDefault(); // Prevent console spam
});

// Initialize app
async function initApp() {
  try {
    console.log('Initializing App Suite...');
    
    // Initialize Sentry only in production and if DSN is available
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      try {
        const { initSentry } = await import('./utils/sentry');
        initSentry();
        console.log('Sentry initialized');
      } catch (error) {
        console.warn('Sentry initialization failed:', error);
      }
    }

    const container = document.getElementById("root");
    if (!container) {
      throw new Error('Root container not found');
    }

    // Clear any existing content
    container.innerHTML = '';

    const root = createRoot(container);
    root.render(<App />);

    // Dispatch render event for prerendering
    setTimeout(() => {
      document.dispatchEvent(new Event('render-event'));
    }, 1000);

    console.log('✅ App Suite initialized successfully');
    
  } catch (error) {
    logError(error, 'App Initialization');
    
    const container = document.getElementById("root");
    if (container) {
      container.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc3545;">App Suite - Loading Error</h1>
          <p style="color: #6c757d;">We're having trouble loading the application. This might be a temporary issue.</p>
          <details style="margin-top: 20px;">
            <summary style="cursor: pointer; color: #007bff;">Technical Details</summary>
            <pre style="background: #f8f9fa; padding: 10px; border-radius: 4px; overflow: auto; font-size: 12px;">${error instanceof Error ? error.stack : error}</pre>
          </details>
          <p style="margin-top: 20px;">
            <button onclick="window.location.reload()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
              Reload Page
            </button>
          </p>
        </div>
      `;
    }
  }
}

// Start the app
initApp();
