import React, { createContext, useContext, useEffect } from 'react';
import SkipLinks from './ui/SkipLinks';

interface FocusContextType {
  // Add focus-related context methods here if needed
}

const FocusContext = createContext<FocusContextType>({});

export const useFocus = () => useContext(FocusContext);

interface FocusProviderProps {
  children: React.ReactNode;
  enableSkipLinks?: boolean;
}

const FocusProvider: React.FC<FocusProviderProps> = ({ 
  children, 
  enableSkipLinks = false 
}) => {
  useEffect(() => {
    const handleGlobalKeydown = (event: KeyboardEvent) => {
      // Alt+M: Focus main content
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Alt+N: Focus navigation
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        const navigation = document.getElementById('navigation');
        if (navigation) {
          navigation.focus();
          navigation.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  }, []);

  return (
    <FocusContext.Provider value={{}}>
      {enableSkipLinks && <SkipLinks />}
      {children}
    </FocusContext.Provider>
  );
};

export default FocusProvider;
