import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const RedirectHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we're on www subdomain
    if (window.location.hostname.startsWith('www.')) {
      // Redirect to non-www preserving the path
      const newUrl = window.location.href.replace('www.app-suite.io', 'app-suite.io');
      window.location.replace(newUrl);
      return;
    }

    // Force a re-render if the page appears blank
    const checkAndReload = () => {
      const root = document.getElementById('root');
      if (root && root.children.length === 0) {
        console.warn('Blank page detected, forcing reload');
        window.location.reload();
      }
    };

    // Check after a short delay
    const timer = setTimeout(checkAndReload, 100);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
};

export default RedirectHandler;