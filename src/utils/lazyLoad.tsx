import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Lazy load wrapper
export const lazyLoad = (importFunc: () => Promise<any>) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};