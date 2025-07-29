/**
 * Focus Management Configuration
 * Centralized configuration for accessibility and focus management features
 */

export interface FocusConfig {
  // Skip Links Configuration
  skipLinks: {
    enabled: boolean;
    links: Array<{
      href: string;
      label: string;
    }>;
  };

  // Focus Trap Configuration
  focusTrap: {
    escapeDeactivates: boolean;
    clickOutsideDeactivates: boolean;
    returnFocusOnDeactivate: boolean;
    initialFocusDelay: number;
  };

  // Announcement Configuration
  announcements: {
    enabled: boolean;
    debounceDelay: number;
    maxAnnouncementLength: number;
    politenessLevels: {
      navigation: 'polite' | 'assertive';
      formErrors: 'polite' | 'assertive';
      statusUpdates: 'polite' | 'assertive';
      criticalAlerts: 'polite' | 'assertive';
    };
  };

  // Keyboard Navigation
  keyboard: {
    globalShortcuts: boolean;
    shortcuts: {
      focusMain: string;
      focusNavigation: string;
      focusSearch: string;
      openCommandPalette: string;
    };
  };

  // Animation and Motion
  motion: {
    respectReducedMotion: boolean;
    defaultDuration: number;
    focusTransitionDuration: number;
  };

  // Focus Indicators
  focusIndicators: {
    enhanced: boolean;
    highContrast: boolean;
    thickness: number;
    offset: number;
    color: string;
  };

  // Development and Debugging
  development: {
    enableFocusLogging: boolean;
    enableA11yWarnings: boolean;
    visualFocusDebugging: boolean;
  };
}

/**
 * Default Configuration
 */
export const defaultFocusConfig: FocusConfig = {
  skipLinks: {
    enabled: true,
    links: [
      { href: '#main-content', label: 'Skip to main content' },
      { href: '#main-navigation', label: 'Skip to navigation' },
      { href: '#footer', label: 'Skip to footer' }
    ]
  },

  focusTrap: {
    escapeDeactivates: true,
    clickOutsideDeactivates: true,
    returnFocusOnDeactivate: true,
    initialFocusDelay: 100
  },

  announcements: {
    enabled: true,
    debounceDelay: 100,
    maxAnnouncementLength: 150,
    politenessLevels: {
      navigation: 'polite',
      formErrors: 'assertive',
      statusUpdates: 'polite',
      criticalAlerts: 'assertive'
    }
  },

  keyboard: {
    globalShortcuts: true,
    shortcuts: {
      focusMain: 'Alt+M',
      focusNavigation: 'Alt+N',
      focusSearch: 'Alt+S',
      openCommandPalette: 'Cmd+K'
    }
  },

  motion: {
    respectReducedMotion: true,
    defaultDuration: 200,
    focusTransitionDuration: 150
  },

  focusIndicators: {
    enhanced: true,
    highContrast: true,
    thickness: 2,
    offset: 2,
    color: 'hsl(var(--color-primary))'
  },

  development: {
    enableFocusLogging: process.env.NODE_ENV === 'development',
    enableA11yWarnings: process.env.NODE_ENV === 'development',
    visualFocusDebugging: false
  }
};

/**
 * Configuration for different environments
 */
export const environmentConfigs = {
  development: {
    ...defaultFocusConfig,
    development: {
      enableFocusLogging: true,
      enableA11yWarnings: true,
      visualFocusDebugging: true
    }
  },

  testing: {
    ...defaultFocusConfig,
    motion: {
      ...defaultFocusConfig.motion,
      respectReducedMotion: true,
      defaultDuration: 0,
      focusTransitionDuration: 0
    },
    announcements: {
      ...defaultFocusConfig.announcements,
      debounceDelay: 0
    }
  },

  production: {
    ...defaultFocusConfig,
    development: {
      enableFocusLogging: false,
      enableA11yWarnings: false,
      visualFocusDebugging: false
    }
  }
};

/**
 * Get configuration for current environment
 */
export const getFocusConfig = (): FocusConfig => {
  const env = process.env.NODE_ENV || 'development';
  return environmentConfigs[env as keyof typeof environmentConfigs] || defaultFocusConfig;
};

/**
 * WCAG 2.1 Compliance Checklist
 */
export const wcagCompliance = {
  'SC 2.4.1': {
    title: 'Bypass Blocks',
    description: 'A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.',
    implemented: true,
    implementation: 'Skip links component'
  },
  'SC 2.4.3': {
    title: 'Focus Order',
    description: 'If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.',
    implemented: true,
    implementation: 'Focus trap and logical focus management'
  },
  'SC 2.4.6': {
    title: 'Headings and Labels',
    description: 'Headings and labels describe topic or purpose.',
    implemented: true,
    implementation: 'Descriptive labels and ARIA attributes'
  },
  'SC 2.4.7': {
    title: 'Focus Visible',
    description: 'Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.',
    implemented: true,
    implementation: 'Enhanced focus indicators with high contrast support'
  },
  'SC 3.2.1': {
    title: 'On Focus',
    description: 'When any user interface component receives focus, it does not initiate a change of context.',
    implemented: true,
    implementation: 'Predictable focus behavior'
  },
  'SC 3.2.2': {
    title: 'On Input',
    description: 'Changing the setting of any user interface component does not automatically cause a change of context unless the user has been advised of the behavior.',
    implemented: true,
    implementation: 'Explicit user actions required for context changes'
  },
  'SC 4.1.2': {
    title: 'Name, Role, Value',
    description: 'For all user interface components, the name and role can be programmatically determined.',
    implemented: true,
    implementation: 'Proper ARIA attributes and semantic HTML'
  }
};

/**
 * Accessibility Testing Checklist
 */
export const accessibilityTesting = {
  automated: [
    'axe-core accessibility testing',
    'Lighthouse accessibility audit',
    'Wave accessibility evaluation',
    'eslint-plugin-jsx-a11y linting'
  ],
  manual: [
    'Keyboard navigation testing',
    'Screen reader testing (NVDA, JAWS, VoiceOver)',
    'High contrast mode testing',
    'Zoom testing (up to 400%)',
    'Color contrast verification',
    'Focus indicator visibility',
    'Mobile accessibility testing'
  ],
  screenReaders: [
    'NVDA (Windows)',
    'JAWS (Windows)',
    'VoiceOver (macOS/iOS)',
    'TalkBack (Android)',
    'Dragon NaturallySpeaking (voice control)'
  ]
};

/**
 * Performance Considerations
 */
export const performanceGuidelines = {
  focusTrap: {
    recommendation: 'Use requestAnimationFrame for focus changes',
    implementation: 'Debounce frequent focus updates'
  },
  announcements: {
    recommendation: 'Limit announcement frequency',
    implementation: 'Debounce and queue announcements'
  },
  eventListeners: {
    recommendation: 'Clean up event listeners properly',
    implementation: 'Use proper cleanup in useEffect hooks'
  },
  animations: {
    recommendation: 'Respect prefers-reduced-motion',
    implementation: 'Disable animations when requested'
  }
};

export default getFocusConfig;
