import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    
    // Log error to console
    console.error('Uncaught error:', error, errorInfo);
    
    // Send to Sentry in production
    if (import.meta.env.PROD) {
      Sentry.withScope((scope) => {
        scope.setContext('errorBoundary', {
          componentStack: errorInfo.componentStack,
        });
        Sentry.captureException(error);
      });
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6 text-muted-foreground">
            We apologize for the inconvenience. Our team has been notified of this issue.
          </p>
          <Button onClick={this.handleReset}>Try Again</Button>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="mt-6 p-4 bg-muted rounded-md text-left overflow-auto max-w-full">
              <p className="font-mono text-sm mb-2">{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <pre className="font-mono text-xs overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
