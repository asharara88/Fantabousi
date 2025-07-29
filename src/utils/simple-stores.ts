import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple performance metrics store
interface PerformanceState {
  metrics: {
    pageLoadTimes: Record<string, number>;
    componentRenderTimes: Record<string, number>;
    errorCount: number;
  };
  addPageLoadTime: (page: string, time: number) => void;
  addComponentRenderTime: (component: string, time: number) => void;
  incrementErrorCount: () => void;
}

export const usePerformanceStore = create<PerformanceState>()(
  persist(
    (set) => ({
      metrics: {
        pageLoadTimes: {},
        componentRenderTimes: {},
        errorCount: 0,
      },
      addPageLoadTime: (page, time) =>
        set((state) => ({
          metrics: {
            ...state.metrics,
            pageLoadTimes: {
              ...state.metrics.pageLoadTimes,
              [page]: time,
            },
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
          },
        })),
      incrementErrorCount: () =>
        set((state) => ({
          metrics: {
            ...state.metrics,
            errorCount: state.metrics.errorCount + 1,
          },
        })),
    }),
    {
      name: 'biowell-performance',
    }
  )
);

// Simple user preferences store
interface UserPreferencesState {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotifications: (enabled: boolean) => void;
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      notifications: true,
      setTheme: (theme) => set({ theme }),
      setNotifications: (notifications) => set({ notifications }),
    }),
    {
      name: 'biowell-preferences',
    }
  )
);
