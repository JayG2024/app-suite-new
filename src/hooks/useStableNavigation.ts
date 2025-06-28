import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook for stable navigation that handles redirect issues
 */
export const useStableNavigation = () => {
  const navigate = useNavigate();

  const stableNavigate = useCallback((path: string, options?: any) => {
    // Ensure we're on the correct domain
    if (typeof window !== 'undefined') {
      const currentHost = window.location.hostname;
      
      // If we're on www, redirect to non-www
      if (currentHost.startsWith('www.')) {
        window.location.href = `https://app-suite.io${path}`;
        return;
      }
    }

    // Use React Router navigation
    navigate(path, options);
  }, [navigate]);

  const replaceNavigate = useCallback((path: string) => {
    stableNavigate(path, { replace: true });
  }, [stableNavigate]);

  return { navigate: stableNavigate, replace: replaceNavigate };
};