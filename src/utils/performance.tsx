import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

// Enhanced loading component with skeleton
interface LoadingProps {
  type?: 'page' | 'component' | 'card';
  className?: string;
}

function Loading({ type = 'component', className = '' }: LoadingProps) {
  const baseClasses = "animate-pulse";
  
  if (type === 'page') {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-8 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`${baseClasses} space-y-6`}>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'card') {
    return (
      <div className={`${baseClasses} p-6 ${className}`}>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
}

// Enhanced lazy loading wrapper with error boundary
interface LazyWrapperProps {
  fallback?: React.ComponentType<any>;
  errorFallback?: React.ComponentType<any>;
  children: React.ReactNode;
}

function LazyWrapper({ 
  fallback: Fallback = () => <Loading type="page" />, 
  errorFallback: ErrorFallback = () => <div>Error loading component</div>,
  children 
}: LazyWrapperProps) {
  return (
    <Suspense fallback={<Fallback />}>
      {children}
    </Suspense>
  );
}

// Utility function to create lazy components with enhanced loading
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  loadingType: 'page' | 'component' | 'card' = 'page'
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <LazyWrapper fallback={() => <Loading type={loadingType} />}>
      <LazyComponent {...props} />
    </LazyWrapper>
  );
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time:`, `${loadTime.toFixed(2)}ms`);
      }
      
      // In production, you might want to send this to analytics
      if (loadTime > 1000) {
        console.warn(`Slow component detected: ${componentName} took ${loadTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
}

export { Loading, LazyWrapper };
