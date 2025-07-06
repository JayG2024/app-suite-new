import React from 'react';

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

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 p-8">
          <h1 className="text-3xl font-bold text-red-700 dark:text-red-300 mb-4">Something went wrong</h1>
          <p className="text-lg text-red-600 dark:text-red-200 mb-4">An unexpected error occurred. Please try reloading the page.</p>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Reload Page
          </button>
          <details className="mt-6 w-full max-w-xl bg-white dark:bg-gray-900 rounded p-4 border border-red-200 dark:border-red-800 text-xs text-left">
            <summary className="cursor-pointer font-semibold text-red-700 dark:text-red-300">Error Details</summary>
            <pre className="whitespace-pre-wrap mt-2">{this.state.error?.toString()}</pre>
            <pre className="whitespace-pre-wrap mt-2">{this.state.errorInfo?.componentStack}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
