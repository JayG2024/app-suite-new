import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    // Log error to console or external service
    console.error('Global ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  clearCacheAndReload = () => {
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Clear local storage except auth
    const authKeys = ['supabase.auth.token', 'sb-auth-token'];
    const keysToKeep: string[] = [];
    
    authKeys.forEach(authKey => {
      const value = localStorage.getItem(authKey);
      if (value) keysToKeep.push(authKey);
    });
    
    const savedValues = keysToKeep.map(key => ({
      key,
      value: localStorage.getItem(key)
    }));
    
    localStorage.clear();
    
    savedValues.forEach(({ key, value }) => {
      if (value) localStorage.setItem(key, value);
    });
    
    // Clear session storage
    sessionStorage.clear();
    
    // Reload
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isAuthError = this.state.error?.message?.toLowerCase().includes('auth') ||
                         this.state.error?.message?.toLowerCase().includes('supabase');
      
      const isWhitePageError = !this.state.error?.message || 
                              this.state.error?.message === 'ChunkLoadError';

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle>
                  {isAuthError ? 'Authentication Error' : 
                   isWhitePageError ? 'Page Loading Error' : 
                   'Something went wrong'}
                </CardTitle>
              </div>
              <CardDescription>
                {isAuthError ? 'There was a problem with authentication. Please try logging in again.' :
                 isWhitePageError ? 'The page failed to load properly. This might be due to cached files.' :
                 'An unexpected error occurred. Please try refreshing the page.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && !isWhitePageError && (
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="font-mono text-sm text-destructive">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={this.handleReload}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                
                <Button variant="outline" onClick={this.clearCacheAndReload}>
                  Clear Cache & Reload
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                
                {isAuthError && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      localStorage.removeItem('supabase.auth.token');
                      window.location.href = '/admin';
                    }}
                  >
                    Login Again
                  </Button>
                )}
              </div>

              {import.meta.env.DEV && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    View Technical Details
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div className="p-4 bg-muted rounded-lg overflow-auto text-xs">
                      <p className="font-semibold mb-2">Error Stack:</p>
                      <pre>{this.state.error?.stack}</pre>
                    </div>
                    <div className="p-4 bg-muted rounded-lg overflow-auto text-xs">
                      <p className="font-semibold mb-2">Component Stack:</p>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
