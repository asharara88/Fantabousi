import React, { createContext, useContext, useEffect, useRef, useMemo, ReactNode } from 'react';
import { KeyboardShortcuts, LiveRegion } from '../utils/focusManagement';
import SkipLinks from './SkipLinks';

export interface FocusContextValue {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  registerShortcut: (shortcut: string, handler: () => void) => void;
  unregisterShortcut: (shortcut: string) => void;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export interface FocusProviderProps {
  children: ReactNode;
  enableSkipLinks?: boolean;
  enableGlobalShortcuts?: boolean;
  className?: string;
}

export const FocusProvider: React.FC<FocusProviderProps> = ({
  children,
  enableSkipLinks = true,
  enableGlobalShortcuts = true,
  className = ''
}) => {
  const keyboardShortcutsRef = useRef<KeyboardShortcuts | null>(null);
  const liveRegionRef = useRef<LiveRegion | null>(null);

  // Initialize keyboard shortcuts and live region
  useEffect(() => {
    if (enableGlobalShortcuts) {
      keyboardShortcutsRef.current = new KeyboardShortcuts();
      
      // Register default shortcuts
      keyboardShortcutsRef.current.register('alt+m', () => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
        }
      });
      
      keyboardShortcutsRef.current.register('alt+n', () => {
        const navigation = document.getElementById('navigation');
        if (navigation) {
          navigation.focus();
        }
      });
      
      keyboardShortcutsRef.current.register('alt+f', () => {
        const footer = document.getElementById('footer');
        if (footer) {
          footer.focus();
        }
      });
    }
    
    liveRegionRef.current = new LiveRegion();
    
    return () => {
      if (keyboardShortcutsRef.current) {
        keyboardShortcutsRef.current.destroy();
      }
      if (liveRegionRef.current) {
        liveRegionRef.current.destroy();
      }
    };
  }, [enableGlobalShortcuts]);

  // Context value - memoized to prevent unnecessary re-renders
  const contextValue: FocusContextValue = useMemo(() => ({
    announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (liveRegionRef.current) {
        liveRegionRef.current.announce(message);
      }
    },
    
    registerShortcut: (shortcut: string, handler: () => void) => {
      if (keyboardShortcutsRef.current) {
        keyboardShortcutsRef.current.register(shortcut, handler);
      }
    },
    
    unregisterShortcut: (shortcut: string) => {
      if (keyboardShortcutsRef.current) {
        keyboardShortcutsRef.current.unregister(shortcut);
      }
    }
  }), []);

  return (
    <FocusContext.Provider value={contextValue}>
      <div className={className}>
        {enableSkipLinks && <SkipLinks />}
        {children}
      </div>
    </FocusContext.Provider>
  );
};

// Hook to use focus context
export const useFocus = (): FocusContextValue => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

export default FocusProvider;
