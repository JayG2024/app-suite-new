import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from "react-router-dom";
import React from "react";

export const initSentry = () => {
  // Only initialize in production
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || "", // Add your Sentry DSN to .env
      integrations: [
        new BrowserTracing({
          // Set sampling to detect performance issues
          tracingOrigins: ["localhost", "app-suite.io", /^\//],
          // Track router changes
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
          ),
        }),
        new Sentry.Replay({
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
  }
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