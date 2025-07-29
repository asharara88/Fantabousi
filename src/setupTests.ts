/**
 * Setup file for accessibility testing
 */

import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers with axe-core
expect.extend(toHaveNoViolations);

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock focus and blur methods
HTMLElement.prototype.focus = jest.fn();
HTMLElement.prototype.blur = jest.fn();
HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    visibility: 'visible',
    display: 'block'
  })
});

// Suppress console warnings in tests unless explicitly testing them
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

// Global test utilities
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  preferences: {
    reducedMotion: false,
    highContrast: false,
    screenReader: false
  }
};

export const createMockElement = (tag: string, attributes: Record<string, string> = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

export const createAccessibilityTestWrapper = (children: React.ReactElement) => {
  return (
    <div role="application" aria-label="Test application">
      {children}
    </div>
  );
};
