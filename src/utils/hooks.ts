import { useEffect, useRef, useCallback, useState } from 'react';
import { usePerformanceStore } from './stores';
import { useIntersectionObserver } from './performance';

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string, deps: any[] = []) {
  const renderStartTime = useRef<number>(0);
  const { addComponentRenderTime } = usePerformanceStore();

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    addComponentRenderTime(componentName, renderTime);
  }, deps);
}

// Hook for measuring page load performance
export function usePageLoadPerformance(pageName: string) {
  const { addPageLoadTime } = usePerformanceStore();

  useEffect(() => {
    const loadCompleteTime = performance.now();
    addPageLoadTime(pageName, loadCompleteTime);
    
    // Also track when all resources are loaded
    const handleLoad = () => {
      const totalLoadTime = performance.now();
      addPageLoadTime(`${pageName}_complete`, totalLoadTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [pageName, addPageLoadTime]);
}

// Hook for debouncing expensive operations
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const debounceTimer = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Hook for throttling operations
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0);

  const throttledCallback = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );

  return throttledCallback;
}

// Hook for measuring API call performance
export function useApiPerformance() {
  const { addApiResponseTime, incrementErrorCount } = usePerformanceStore();

  const measureApiCall = useCallback(
    async <T>(
      endpoint: string,
      apiCall: () => Promise<T>
    ): Promise<T> => {
      const startTime = performance.now();
      try {
        const result = await apiCall();
        const endTime = performance.now();
        addApiResponseTime(endpoint, endTime - startTime);
        return result;
      } catch (error) {
        incrementErrorCount();
        throw error;
      }
    },
    [addApiResponseTime, incrementErrorCount]
  );

  return { measureApiCall };
}

// Hook for managing scroll performance
export function useScrollPerformance() {
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const optimizedScrollHandler = useCallback(
    (handler: () => void, delay: number = 16) => {
      if (!isScrolling.current) {
        isScrolling.current = true;
        requestAnimationFrame(handler);
      }

      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, delay);
    },
    []
  );

  return { optimizedScrollHandler };
}

// Hook for lazy loading content based on visibility
export function useLazyContent<T>(
  loadContent: () => Promise<T>,
  threshold: number = 0.1
) {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const elementRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(elementRef);

  useEffect(() => {
    if (isVisible && !content && !loading) {
      setLoading(true);
      setError(null);
      
      loadContent()
        .then(setContent)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [isVisible, content, loading, loadContent]);

  return { ref: elementRef, content, loading, error };
}

// Hook for managing component visibility animations
export function useVisibilityAnimation(threshold: number = 0.1) {
  const elementRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(elementRef);

  return {
    ref: elementRef,
    isVisible,
    animationProps: {
      initial: { opacity: 0, y: 20 },
      animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };
}
