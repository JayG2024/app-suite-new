import * as Sentry from "@sentry/react";

export const initSentry = () => {
  // Only initialize Sentry if DSN is provided
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.log('Sentry DSN not provided, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          // Mask all text content by default for privacy
          maskAllText: true,
          maskAllInputs: true,
          // Only record when there's an error
          sessionSampleRate: 0.1, // 10% of sessions
          errorSampleRate: 1.0, // 100% of sessions with errors
        }),
      ],
      
      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions
      
      // Trace propagation for distributed tracing
      tracePropagationTargets: ["localhost", "app-suite.io", /^https:\/\/app-suite\.io/],
      
      // Release tracking
      release: `app-suite@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
      
      // Environment
      environment: import.meta.env.MODE,
      
      // Filter out known issues
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Random plugins/extensions
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        // Facebook related errors
        'fb_xd_fragment',
        // Network errors
        'NetworkError',
        'Failed to fetch',
        // Old Sentry dashboard errors
        'updateFrom',
        'Object [object Object] has no method',
      ],
      
      // Before sending error to Sentry
      beforeSend(event, hint) {
        // Filter out errors from browser extensions
        if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
          frame => frame.filename?.includes('chrome-extension://') || 
                   frame.filename?.includes('moz-extension://')
        )) {
          return null;
        }
        
        // Filter out errors from old Sentry dashboard
        if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
          frame => frame.filename?.includes('sentry/scripts/') || 
                   frame.filename?.includes('raven.js')
        )) {
          return null;
        }
        
        // Filter out errors from example.com
        if (event.request?.url?.includes('example.com')) {
          return null;
        }
        
        // Add user context
        const user = localStorage.getItem('userData');
        if (user) {
          try {
            const userData = JSON.parse(user);
            event.user = {
              id: userData.id?.toString(),
              email: userData.email,
              username: userData.name,
            };
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        // Add custom context
        event.contexts = {
          ...event.contexts,
          app: {
            version: import.meta.env.VITE_APP_VERSION || '1.0.0',
            build_time: import.meta.env.VITE_BUILD_TIME || 'unknown',
          },
        };
        
        return event;
      },
    });
};

// Helper to capture exceptions with context
export const captureException = (error: Error, context?: Record<string, any>) => {
  console.error('Error captured:', error, context);
  
  if (import.meta.env.PROD) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional', context);
      }
      Sentry.captureException(error);
    });
  }
};

// Helper to capture messages with context
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) => {
  console.log(`[${level.toUpperCase()}]`, message, context);
  
  if (import.meta.env.PROD) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional', context);
      }
      scope.setLevel(level);
      Sentry.captureMessage(message);
    });
  }
};

// Helper to add breadcrumbs
export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  if (import.meta.env.PROD) {
    Sentry.addBreadcrumb(breadcrumb);
  }
};