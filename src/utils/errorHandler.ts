import { captureException, captureMessage, addBreadcrumb } from './sentry';
import { toast } from 'sonner';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string | number;
  data?: any;
}

export class AppError extends Error {
  public context?: ErrorContext;
  public code?: string;
  public statusCode?: number;

  constructor(message: string, code?: string, context?: ErrorContext, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.statusCode = statusCode;
  }
}

// User-friendly error messages
const ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  AUTH_FAILED: 'Authentication failed. Please log in again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please try again later.',
  SERVER_ERROR: 'An unexpected error occurred. Our team has been notified.',
  TIMEOUT: 'The request took too long. Please try again.',
  DEFAULT: 'Something went wrong. Please try again later.',
};

// Global error handler
export const handleError = (error: Error | AppError, showToast = true): void => {
  console.error('Error handled:', error);

  // Add breadcrumb
  addBreadcrumb({
    category: 'error',
    message: error.message,
    level: 'error',
    data: error instanceof AppError ? error.context : undefined,
  });

  // Capture in Sentry
  if (error instanceof AppError) {
    captureException(error, {
      code: error.code,
      context: error.context,
      statusCode: error.statusCode,
    });
  } else {
    captureException(error);
  }

  // Show user-friendly toast
  if (showToast) {
    const message = getUserFriendlyMessage(error);
    toast.error(message, {
      duration: 5000,
      action: {
        label: 'Dismiss',
        onClick: () => console.log('Error dismissed'),
      },
    });
  }
};

// Get user-friendly error message
export const getUserFriendlyMessage = (error: Error | AppError): string => {
  if (error instanceof AppError && error.code) {
    return ERROR_MESSAGES[error.code] || ERROR_MESSAGES.DEFAULT;
  }

  // Handle common error types
  if (error.message.includes('Network') || error.message.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  if (error.message.includes('401') || error.message.includes('unauthorized')) {
    return ERROR_MESSAGES.AUTH_FAILED;
  }
  if (error.message.includes('403') || error.message.includes('forbidden')) {
    return ERROR_MESSAGES.PERMISSION_DENIED;
  }
  if (error.message.includes('404')) {
    return ERROR_MESSAGES.NOT_FOUND;
  }
  if (error.message.includes('429')) {
    return ERROR_MESSAGES.RATE_LIMIT;
  }
  if (error.message.includes('timeout')) {
    return ERROR_MESSAGES.TIMEOUT;
  }

  return ERROR_MESSAGES.DEFAULT;
};

// Async error wrapper
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  context?: ErrorContext,
  options?: { showToast?: boolean; fallback?: T }
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    const appError = error instanceof AppError 
      ? error 
      : new AppError(
          error instanceof Error ? error.message : 'Unknown error',
          'UNKNOWN',
          context
        );
    
    handleError(appError, options?.showToast ?? true);
    return options?.fallback;
  }
};

// React hook for error handling
export const useErrorHandler = () => {
  const handleAsyncError = (error: Error | AppError) => {
    handleError(error);
  };

  const wrapAsync = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: ErrorContext
  ): T => {
    return (async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        const appError = error instanceof AppError 
          ? error 
          : new AppError(
              error instanceof Error ? error.message : 'Unknown error',
              'UNKNOWN',
              context
            );
        handleAsyncError(appError);
        throw error;
      }
    }) as T;
  };

  return { handleError: handleAsyncError, wrapAsync };
};

// API error handler
export const handleAPIError = (response: Response): never => {
  let code = 'SERVER_ERROR';
  let message = 'An error occurred';

  switch (response.status) {
    case 400:
      code = 'VALIDATION_ERROR';
      message = 'Invalid request';
      break;
    case 401:
      code = 'AUTH_FAILED';
      message = 'Authentication required';
      break;
    case 403:
      code = 'PERMISSION_DENIED';
      message = 'Access denied';
      break;
    case 404:
      code = 'NOT_FOUND';
      message = 'Resource not found';
      break;
    case 429:
      code = 'RATE_LIMIT';
      message = 'Too many requests';
      break;
    case 500:
    case 502:
    case 503:
      code = 'SERVER_ERROR';
      message = 'Server error';
      break;
  }

  throw new AppError(message, code, { 
    url: response.url,
    status: response.status,
    statusText: response.statusText
  }, response.status);
};