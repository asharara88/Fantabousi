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
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])',
    'audio[controls]',
    'video[controls]'
  ].join(', ');

  const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));

  return elements.filter(element => {
    // Check if element is visible and not disabled
    return (
      element.offsetWidth > 0 &&
      element.offsetHeight > 0 &&
      !element.hasAttribute('disabled') &&
      element.tabIndex !== -1 &&
      window.getComputedStyle(element).visibility !== 'hidden'
    );
  });
};

/**
 * Focus Trap Class for modal dialogs and dropdown menus
 */
export class FocusTrap {
  private container: HTMLElement;
  private options: FocusTrapOptions;
  private previousActiveElement: HTMLElement | null = null;
  private isActive = false;
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;

  constructor(container: HTMLElement, options: FocusTrapOptions = {}) {
    this.container = container;
    this.options = {
      escapeDeactivates: true,
      clickOutsideDeactivates: true,
      returnFocusOnDeactivate: true,
      ...options
    };
  }

  activate(): void {
    if (this.isActive) return;

    this.previousActiveElement = document.activeElement as HTMLElement;
    this.updateFocusableElements();
    this.addEventListeners();
    this.setInitialFocus();
    this.isActive = true;
  }

  deactivate(): void {
    if (!this.isActive) return;

    this.removeEventListeners();
    
    if (this.options.returnFocusOnDeactivate && this.previousActiveElement) {
      this.restoreFocus(this.previousActiveElement);
    }

    this.isActive = false;
  }

  private updateFocusableElements(): void {
    const focusableElements = getFocusableElements(this.container);
    this.firstFocusableElement = focusableElements[0] || null;
    this.lastFocusableElement = focusableElements[focusableElements.length - 1] || null;
  }

  private setInitialFocus(): void {
    let targetElement: HTMLElement | null = null;

    if (this.options.initialFocus) {
      if (typeof this.options.initialFocus === 'string') {
        targetElement = this.container.querySelector(this.options.initialFocus);
      } else {
        targetElement = this.options.initialFocus;
      }
    }

    if (!targetElement) {
      targetElement = this.firstFocusableElement;
    }

    if (!targetElement && this.options.fallbackFocus) {
      if (typeof this.options.fallbackFocus === 'string') {
        targetElement = document.querySelector(this.options.fallbackFocus);
      } else {
        targetElement = this.options.fallbackFocus;
      }
    }

    if (targetElement) {
      targetElement.focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') {
      this.handleTabKey(event);
    } else if (event.key === 'Escape' && this.options.escapeDeactivates) {
      event.preventDefault();
      this.deactivate();
    }
  };

  private handleTabKey(event: KeyboardEvent): void {
    if (!this.firstFocusableElement || !this.lastFocusableElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusableElement) {
        event.preventDefault();
        this.lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusableElement) {
        event.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  }

  private handleClickOutside = (event: MouseEvent): void => {
    if (this.options.clickOutsideDeactivates) {
      if (this.options.allowOutsideClick && this.options.allowOutsideClick(event)) {
        return;
      }

      if (!this.container.contains(event.target as Node)) {
        this.deactivate();
      }
    }
  };

  private addEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  private removeEventListeners(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  private restoreFocus(element: HTMLElement, options: FocusRestoreOptions = {}): void {
    try {
      element.focus({ preventScroll: options.preventScroll });
      
      if (options.selectText && element instanceof HTMLInputElement) {
        element.select();
      }
    } catch (error) {
      console.warn('Failed to restore focus:', error);
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
