import React, { createContext, useContext, useEffect, useState } from 'react';
import { FocusManager } from '../utils/focusManagement';
import SkipLinks from './ui/SkipLinks';

interface FocusContextType {
  focusManager: FocusManager;
  isReducedMotion: boolean;
  isHighContrast: boolean;
}

const FocusContext = createContext<FocusContextType | null>(null);

interface FocusProviderProps {
  children: React.ReactNode;
  enableSkipLinks?: boolean;
  enableAnnouncements?: boolean;
}

/**
 * Focus Provider Component
 * Manages application-wide focus behavior and accessibility features
 */
const FocusProvider: React.FC<FocusProviderProps> = ({
  children,
  enableSkipLinks = true,
  enableAnnouncements = true
}) => {
  const [focusManager] = useState(() => FocusManager.getInstance());
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Detect user preferences
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    setIsReducedMotion(reducedMotionQuery.matches);
    setIsHighContrast(highContrastQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  // Handle page navigation announcements
  useEffect(() => {
    if (!enableAnnouncements) return;

    const handleRouteChange = () => {
      // Announce page changes to screen readers
      setTimeout(() => {
        const pageTitle = document.title;
        const mainHeading = document.querySelector('h1')?.textContent;
        const announcement = mainHeading || pageTitle || 'Page changed';
        focusManager.announce(`Page loaded: ${announcement}`, 'polite');
      }, 100);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    
    // For React Router, we'll need to listen to location changes
    // This is a basic implementation - you might want to integrate with your router
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === document.title) {
          handleRouteChange();
        }
      });
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      observer.disconnect();
    };
  }, [focusManager, enableAnnouncements]);

  // Add landmark regions if missing
  useEffect(() => {
    const addLandmarkIfMissing = (selector: string, role: string, id: string) => {
      if (!document.querySelector(selector)) {
        const element = document.createElement('div');
        element.setAttribute('role', role);
        element.id = id;
        element.className = 'sr-only';
        document.body.appendChild(element);
      }
    };

    addLandmarkIfMissing('main', 'main', 'main-content');
    addLandmarkIfMissing('nav', 'navigation', 'main-navigation');
    addLandmarkIfMissing('footer', 'contentinfo', 'footer');
  }, []);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyboard = (event: KeyboardEvent) => {
      // Alt + M: Focus main content
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content') || 
                           document.querySelector('main') ||
                           document.querySelector('[role="main"]');
        if (mainContent) {
          (mainContent as HTMLElement).focus();
          focusManager.announce('Focused main content', 'polite');
        }
      }

      // Alt + N: Focus navigation
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        const navigation = document.getElementById('main-navigation') ||
                          document.querySelector('nav') ||
                          document.querySelector('[role="navigation"]');
        if (navigation) {
          const firstLink = navigation.querySelector('a, button') as HTMLElement;
          if (firstLink) {
            firstLink.focus();
            focusManager.announce('Focused navigation', 'polite');
          }
        }
      }

      // Alt + S: Focus search (if available)
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLElement;
        if (searchInput) {
          searchInput.focus();
          focusManager.announce('Focused search', 'polite');
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyboard);
    return () => document.removeEventListener('keydown', handleGlobalKeyboard);
  }, [focusManager]);

  const contextValue: FocusContextType = {
    focusManager,
    isReducedMotion,
    isHighContrast
  };

  return (
    <FocusContext.Provider value={contextValue}>
      {enableSkipLinks && <SkipLinks />}
      {children}
    </FocusContext.Provider>
  );
};

export const useFocusContext = (): FocusContextType => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocusContext must be used within a FocusProvider');
  }
  return context;
};

export default FocusProvider;
