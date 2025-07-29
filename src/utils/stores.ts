import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// App performance metrics store
interface PerformanceState {
  metrics: {
    pageLoadTimes: Record<string, number>;
    componentRenderTimes: Record<string, number>;
    apiResponseTimes: Record<string, number>;
    errorCount: number;
    lastUpdated: string;
  };
  addPageLoadTime: (page: string, time: number) => void;
  addComponentRenderTime: (component: string, time: number) => void;
  addApiResponseTime: (endpoint: string, time: number) => void;
  incrementErrorCount: () => void;
  clearMetrics: () => void;
}

export const usePerformanceStore = create<PerformanceState>()(
  persist(
    (set, get) => ({
      metrics: {
        pageLoadTimes: {},
        componentRenderTimes: {},
        apiResponseTimes: {},
        errorCount: 0,
        lastUpdated: new Date().toISOString(),
      },
      addPageLoadTime: (page, time) =>
        set((state) => ({
          metrics: {
            ...state.metrics,
            pageLoadTimes: {
              ...state.metrics.pageLoadTimes,
              [page]: time,
            },
            lastUpdated: new Date().toISOString(),
          },
        })),
      addComponentRenderTime: (component, time) =>
        set((state) => ({
          metrics: {
            ...state.metrics,
            componentRenderTimes: {
              ...state.metrics.componentRenderTimes,
              [component]: time,
            },
            lastUpdated: new Date().toISOString(),
          },
        })),
      addApiResponseTime: (endpoint, time) =>
        set((state) => ({
          metrics: {
            ...state.metrics,
            apiResponseTimes: {
              ...state.metrics.apiResponseTimes,
              [endpoint]: time,
            },
            lastUpdated: new Date().toISOString(),
          },
        })),
      incrementErrorCount: () =>
        set((state) => ({
          metrics: {
            ...state.metrics,
            errorCount: state.metrics.errorCount + 1,
            lastUpdated: new Date().toISOString(),
          },
        })),
      clearMetrics: () =>
        set({
          metrics: {
            pageLoadTimes: {},
            componentRenderTimes: {},
            apiResponseTimes: {},
            errorCount: 0,
            lastUpdated: new Date().toISOString(),
          },
        }),
    }),
    {
      name: 'biowell-performance-metrics',
      version: 1,
    }
  )
);

// User preferences store
interface UserPreferencesState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    supplements: boolean;
    workouts: boolean;
    meals: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: 'sm' | 'md' | 'lg' | 'xl';
  };
  privacy: {
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
  };
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  updateNotifications: (notifications: Partial<UserPreferencesState['notifications']>) => void;
  updateAccessibility: (accessibility: Partial<UserPreferencesState['accessibility']>) => void;
  updatePrivacy: (privacy: Partial<UserPreferencesState['privacy']>) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        supplements: true,
        workouts: true,
        meals: true,
      },
      accessibility: {
        reduceMotion: false,
        highContrast: false,
        fontSize: 'md',
      },
      privacy: {
        analytics: true,
        marketing: false,
        functional: true,
      },
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      updateNotifications: (notifications) =>
        set((state) => ({
          notifications: { ...state.notifications, ...notifications },
        })),
      updateAccessibility: (accessibility) =>
        set((state) => ({
          accessibility: { ...state.accessibility, ...accessibility },
        })),
      updatePrivacy: (privacy) =>
        set((state) => ({
          privacy: { ...state.privacy, ...privacy },
        })),
    }),
    {
      name: 'biowell-user-preferences',
      version: 1,
    }
  )
);

// App cache store for optimizing data fetching
interface CacheState {
  data: Record<string, {
    value: any;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
  }>;
  set: (key: string, value: any, ttl?: number) => void;
  get: (key: string) => any;
  remove: (key: string) => void;
  clear: () => void;
  isExpired: (key: string) => boolean;
}

export const useCacheStore = create<CacheState>((set, get) => ({
  data: {},
  set: (key, value, ttl = 5 * 60 * 1000) => // Default 5 minutes
    set((state) => ({
      data: {
        ...state.data,
        [key]: {
          value,
          timestamp: Date.now(),
          ttl,
        },
      },
    })),
  get: (key) => {
    const item = get().data[key];
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      get().remove(key);
      return null;
    }
    
    return item.value;
  },
  remove: (key) =>
    set((state) => {
      const newData = { ...state.data };
      delete newData[key];
      return { data: newData };
    }),
  clear: () => set({ data: {} }),
  isExpired: (key) => {
    const item = get().data[key];
    if (!item) return true;
    return Date.now() - item.timestamp > item.ttl;
  },
}));

// Enhanced API utilities with caching and performance tracking
export const apiUtils = {
  async fetchWithCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cache = useCacheStore.getState();
    const cached = cache.get(key);
    
    if (cached) {
      return cached;
    }
    
    const startTime = performance.now();
    try {
      const data = await fetchFn();
      const endTime = performance.now();
      
      // Store in cache
      cache.set(key, data, ttl);
      
      // Track performance
      const performanceStore = usePerformanceStore.getState();
      performanceStore.addApiResponseTime(key, endTime - startTime);
      
      return data;
    } catch (error) {
      const performanceStore = usePerformanceStore.getState();
      performanceStore.incrementErrorCount();
      throw error;
    }
  },
  
  async invalidateCache(pattern?: string) {
    const cache = useCacheStore.getState();
    if (pattern) {
      // Remove keys matching pattern
      Object.keys(cache.data).forEach(key => {
        if (key.includes(pattern)) {
          cache.remove(key);
        }
      });
    } else {
      cache.clear();
    }
  }
};

// Development utilities
export const devUtils = {
  logPerformanceMetrics() {
    const metrics = usePerformanceStore.getState().metrics;
    console.group('📊 BIOWELL Performance Metrics');
    console.table(metrics.pageLoadTimes);
    console.table(metrics.componentRenderTimes);
    console.table(metrics.apiResponseTimes);
    console.log('Error Count:', metrics.errorCount);
    console.log('Last Updated:', metrics.lastUpdated);
    console.groupEnd();
  },
  
  logCacheStatus() {
    const cache = useCacheStore.getState().data;
    console.group('💾 Cache Status');
    Object.entries(cache).forEach(([key, item]) => {
      const isExpired = Date.now() - item.timestamp > item.ttl;
      console.log(`${key}: ${isExpired ? '🔴 Expired' : '🟢 Valid'}`);
    });
    console.groupEnd();
  }
};

// Expose dev utils globally in development
if (process.env.NODE_ENV === 'development') {
  (window as any).biowellDevUtils = devUtils;
}
