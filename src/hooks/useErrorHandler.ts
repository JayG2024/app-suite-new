import { useCallback } from 'react';
import { handleError, AppError, ErrorContext } from '@/utils/errorHandler';

export const useErrorHandler = () => {
  const handleAsyncError = useCallback((error: Error | AppError, showToast = true) => {
    handleError(error, showToast);
  }, []);

  const wrapAsync = useCallback(<T extends (...args: any[]) => Promise<any>>(
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
  }, [handleAsyncError]);

  const safeAsync = useCallback(async <T>(
    fn: () => Promise<T>,
    fallback?: T,
    context?: ErrorContext
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
      handleAsyncError(appError);
      return fallback;
    }
  }, [handleAsyncError]);

  return { 
    handleError: handleAsyncError, 
    wrapAsync, 
    safeAsync 
  };
};