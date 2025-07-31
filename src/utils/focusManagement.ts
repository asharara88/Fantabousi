/**
 * Focus Management Utilities
 * Comprehensive focus management for WCAG 2.1 Success Criterion 2.4.3 compliance
 */

export interface FocusableElement extends HTMLElement {
  focus(): void;
}

export interface FocusTrapOptions {
  initialFocus?: HTMLElement | string;
  fallbackFocus?: HTMLElement | string;
  escapeDeactivates?: boolean;
  clickOutsideDeactivates?: boolean;
  returnFocusOnDeactivate?: boolean;
  allowOutsideClick?: (event: MouseEvent) => boolean;
}

export interface FocusRestoreOptions {
  preventScroll?: boolean;
  selectText?: boolean;
}

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    'a[href]:not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
    '[contenteditable="true"]:not([tabindex="-1"])'
  ].join(',');

  return Array.from(container.querySelectorAll(focusableSelectors))
    .filter((element): element is HTMLElement => {
      return element instanceof HTMLElement && 
             element.offsetParent !== null && 
             !element.hasAttribute('disabled');
    });
};

/**
 * Focus Trap Class for modal dialogs and dropdown menus
 */
export class FocusTrap {
  private container: HTMLElement;
  private previousActiveElement: HTMLElement | null = null;
  private isActive = false;
  private handleKeyDown: (event: KeyboardEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.handleKeyDown = this.onKeyDown.bind(this);
  }

  activate(): void {
    if (this.isActive) return;

    this.previousActiveElement = document.activeElement as HTMLElement;
    this.isActive = true;
    
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Focus first focusable element
    const focusableElements = getFocusableElements(this.container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  deactivate(): void {
    if (!this.isActive) return;

    this.isActive = false;
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Restore focus to previous element
    if (this.previousActiveElement && document.contains(this.previousActiveElement)) {
      this.previousActiveElement.focus();
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (!this.isActive) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.deactivate();
      return;
    }

    if (event.key === 'Tab') {
      this.handleTabKey(event);
    }
  }

  private handleTabKey(event: KeyboardEvent): void {
    const focusableElements = getFocusableElements(this.container);
    
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}

/**
 * Focus Manager for handling focus restoration and announcements
 */
export class FocusManager {
  private static instance: FocusManager;
  private focusStack: HTMLElement[] = [];
  private announcer: HTMLElement;

  private constructor() {
    this.createAnnouncer();
  }

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  private createAnnouncer(): void {
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.id = 'focus-announcer';
    document.body.appendChild(this.announcer);
  }

  /**
   * Save current focus to stack
   */
  saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  /**
   * Restore focus from stack
   */
  restoreFocus(options: FocusRestoreOptions = {}): boolean {
    const elementToFocus = this.focusStack.pop();
    
    if (elementToFocus && document.contains(elementToFocus)) {
      try {
        elementToFocus.focus({ preventScroll: options.preventScroll });
        
        if (options.selectText && elementToFocus instanceof HTMLInputElement) {
          elementToFocus.select();
        }
        
        return true;
      } catch (error) {
        console.warn('Failed to restore focus:', error);
      }
    }
    
    return false;
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      this.announcer.textContent = '';
    }, 1000);
  }

  /**
   * Find and focus first error element
   */
  focusFirstError(container?: HTMLElement): boolean {
    const scope = container || document;
    const errorElement = scope.querySelector('[aria-invalid="true"], .error, [data-error]') as HTMLElement;
    
    if (errorElement) {
      errorElement.focus();
      this.announce('Please correct the error and try again', 'assertive');
      return true;
    }
    
    return false;
  }

  /**
   * Clear focus stack
   */
  clearStack(): void {
    this.focusStack = [];
  }
}

/**
 * React Hook for Focus Trap
 */
export const useFocusTrap = (isActive: boolean, options: FocusTrapOptions = {}) => {
  const containerRef = React.useRef<HTMLElement>(null);
  const focusTrapRef = React.useRef<FocusTrap | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    if (isActive) {
      focusTrapRef.current = new FocusTrap(containerRef.current, options);
      focusTrapRef.current.activate();
    } else if (focusTrapRef.current) {
      focusTrapRef.current.deactivate();
      focusTrapRef.current = null;
    }

    return () => {
      if (focusTrapRef.current) {
        focusTrapRef.current.deactivate();
      }
    };
  }, [isActive]);

  return containerRef;
};

/**
 * React Hook for Focus Management
 */
export const useFocusManagement = () => {
  const focusManager = React.useMemo(() => FocusManager.getInstance(), []);

  const saveFocus = React.useCallback(() => {
    focusManager.saveFocus();
  }, [focusManager]);

  const restoreFocus = React.useCallback((options?: FocusRestoreOptions) => {
    return focusManager.restoreFocus(options);
  }, [focusManager]);

  const announce = React.useCallback((message: string, priority?: 'polite' | 'assertive') => {
    focusManager.announce(message, priority);
  }, [focusManager]);

  const focusFirstError = React.useCallback((container?: HTMLElement) => {
    return focusManager.focusFirstError(container);
  }, [focusManager]);

  return {
    saveFocus,
    restoreFocus,
    announce,
    focusFirstError,
    clearStack: focusManager.clearStack.bind(focusManager)
  };
};

/**
 * Skip Links Implementation
 */
export const createSkipLink = (target: string, label: string): HTMLElement => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${target}`;
  skipLink.textContent = label;
  skipLink.className = 'skip-link';
  
  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    const targetElement = document.getElementById(target);
    
    if (targetElement) {
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return skipLink;
};

/**
 * Initialize skip links for the application
 */
export const initializeSkipLinks = (): void => {
  const skipLinksContainer = document.createElement('div');
  skipLinksContainer.className = 'skip-links';
  skipLinksContainer.setAttribute('role', 'navigation');
  skipLinksContainer.setAttribute('aria-label', 'Skip links');

  const skipLinks = [
    createSkipLink('main-content', 'Skip to main content'),
    createSkipLink('main-navigation', 'Skip to navigation'),
    createSkipLink('footer', 'Skip to footer')
  ];

  skipLinks.forEach(link => skipLinksContainer.appendChild(link));
  
  // Insert at the beginning of the body
  document.body.insertBefore(skipLinksContainer, document.body.firstChild);
};

// Import React for hooks
import React from 'react';
