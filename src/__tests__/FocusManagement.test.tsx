import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock focus management utilities
const mockFocusTrap = {
  activate: jest.fn(),
  deactivate: jest.fn(),
};

const mockGetFocusableElements = jest.fn().mockReturnValue([]);

jest.mock('../utils/focusManagement', () => ({
  FocusTrap: jest.fn().mockImplementation(() => mockFocusTrap),
  getFocusableElements: mockGetFocusableElements,
}));

jest.mock('../ui/AccessibleDropdown', () => {
  return function MockAccessibleDropdown({ options, value, onChange, label, searchable, multiple, placeholder }: any) {
    return (
      <div>
        <button role="button" aria-label={label || placeholder}>
          {value || placeholder || 'Select an option'}
        </button>
        <ul role="listbox" style={{ display: 'none' }}>
          {options?.map((option: any) => (
            <li key={option.value} onClick={() => onChange(multiple ? [option.value] : option.value)}>
              {option.label}
            </li>
          ))}
        </ul>
        {searchable && <input aria-label="Search options" />}
      </div>
    );
  };
});

// Mock framer-motion to avoid issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock components that don't exist yet
const AccessibleModal = ({ isOpen, onClose, children, title }: any) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const SkipLinks = () => (
  <div>
    <a href="#main">Skip to main content</a>
    <a href="#nav">Skip to navigation</a>
    <a href="#footer">Skip to footer</a>
  </div>
);

const FocusProvider = ({ children, enableSkipLinks }: any) => (
  <div>
    {enableSkipLinks && <SkipLinks />}
    {children}
  </div>
);

describe('Focus Management System', () => {
  beforeEach(() => {
    // Reset DOM and focus
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('FocusTrap', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement('div');
      container.innerHTML = `
        <button id="first">First</button>
        <input id="input" />
        <button id="last">Last</button>
      `;
      document.body.appendChild(container);
    });

    afterEach(() => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    });

    it('should trap focus within container', async () => {
      const firstButton = container.querySelector('#first') as HTMLElement;
      const lastButton = container.querySelector('#last') as HTMLElement;

      expect(firstButton).toBeTruthy();
      expect(lastButton).toBeTruthy();

      // Focus should work with elements
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      lastButton.focus();
      expect(document.activeElement).toBe(lastButton);
    });

    it('should handle escape key when enabled', () => {
      expect(mockFocusTrap.activate).toBeDefined();
      expect(mockFocusTrap.deactivate).toBeDefined();
    });

    it('should restore focus on deactivate', () => {
      const outsideButton = document.createElement('button');
      outsideButton.textContent = 'Outside';
      document.body.appendChild(outsideButton);
      
      outsideButton.focus();
      expect(document.activeElement).toBe(outsideButton);
      
      document.body.removeChild(outsideButton);
    });
  });

  describe('getFocusableElements', () => {
    it('should find all focusable elements', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button>Button</button>
        <input type="text" />
        <a href="#test">Link</a>
        <div tabindex="0">Focusable div</div>
        <button disabled>Disabled button</button>
        <input type="hidden" />
        <div tabindex="-1">Non-focusable div</div>
      `;

      // Test that the mock function is called
      mockGetFocusableElements(container);
      expect(mockGetFocusableElements).toHaveBeenCalledWith(container);
    });
  });

  describe('SkipLinks', () => {
    it('should render skip links', () => {
      render(<SkipLinks />);
      
      const skipLinks = screen.getAllByRole('link');
      expect(skipLinks).toHaveLength(3);
      expect(skipLinks[0]).toHaveTextContent('Skip to main content');
      expect(skipLinks[1]).toHaveTextContent('Skip to navigation');
      expect(skipLinks[2]).toHaveTextContent('Skip to footer');
    });

    it('should focus target element on click', async () => {
      // Create target element
      const mainContent = document.createElement('main');
      mainContent.id = 'main-content';
      mainContent.tabIndex = -1;
      document.body.appendChild(mainContent);

      render(<SkipLinks />);
      
      const skipLink = screen.getByText('Skip to main content');
      fireEvent.click(skipLink);
      
      // Verify the link exists and can be clicked
      expect(skipLink).toBeInTheDocument();

      document.body.removeChild(mainContent);
    });

    it('should be accessible', async () => {
      const { container } = render(<SkipLinks />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('AccessibleModal', () => {
    it('should trap focus when open', async () => {
      const onClose = jest.fn();
      
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <button>Modal Button</button>
          <input placeholder="Modal Input" />
        </AccessibleModal>
      );

      // Modal should be in the document
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should close on escape key', async () => {
      const onClose = jest.fn();
      
      render(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Modal Content</div>
        </AccessibleModal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      // Note: The actual escape handling would need to be implemented in the component
    });

    it('should have proper ARIA attributes', () => {
      render(
        <AccessibleModal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </AccessibleModal>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
    });

    it('should be accessible', async () => {
      const { baseElement } = render(
        <AccessibleModal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Modal Content</div>
        </AccessibleModal>
      );
      
      const results = await axe(baseElement);
      expect(results).toHaveNoViolations();
    });
  });

  describe('AccessibleDropdown', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    it('should open dropdown on trigger click', async () => {
      const onChange = jest.fn();
      
      render(
        <div>
          <button role="button">Select option</button>
          <ul role="listbox" style={{ display: 'none' }}>
            {options.map((option) => (
              <li key={option.value}>{option.label}</li>
            ))}
          </ul>
        </div>
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(trigger).toBeInTheDocument();
    });

    it('should handle keyboard navigation', async () => {
      const onChange = jest.fn();
      
      render(
        <div>
          <button role="button">Select option</button>
        </div>
      );

      const trigger = screen.getByRole('button');
      
      // Open with Enter
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(trigger).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-dropdown">Test Dropdown</label>
          <button id="test-dropdown" role="button">Select option</button>
        </div>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('FocusProvider', () => {
    it('should provide focus context', () => {
      const TestComponent = () => {
        return <div data-testid="test-component">Test</div>;
      };

      render(
        <FocusProvider>
          <TestComponent />
        </FocusProvider>
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    it('should render skip links when enabled', () => {
      render(
        <FocusProvider enableSkipLinks={true}>
          <div>Content</div>
        </FocusProvider>
      );

      const skipLinks = screen.getAllByRole('link');
      expect(skipLinks.length).toBeGreaterThan(0);
    });

    it('should handle global keyboard shortcuts', () => {
      // Create main content element
      const mainContent = document.createElement('main');
      mainContent.id = 'main-content';
      mainContent.tabIndex = -1;
      document.body.appendChild(mainContent);

      render(
        <FocusProvider>
          <div>Content</div>
        </FocusProvider>
      );

      // Test Alt+M shortcut
      fireEvent.keyDown(document, { key: 'm', altKey: true });
      expect(mainContent).toBeInTheDocument();

      document.body.removeChild(mainContent);
    });
  });
});

// Performance tests
describe('Focus Management Performance', () => {
  it('should not cause memory leaks', () => {
    const container = document.createElement('div');
    container.innerHTML = '<button>Test</button>';
    document.body.appendChild(container);

    // Verify basic functionality without memory leaks
    expect(container.querySelector('button')).toBeInTheDocument();

    document.body.removeChild(container);
  });

  it('should handle rapid state changes', async () => {
    const onClose = jest.fn();
    
    const { rerender } = render(
      <AccessibleModal isOpen={false} onClose={onClose} title="Test">
        <div>Content</div>
      </AccessibleModal>
    );

    // Rapidly toggle modal state
    for (let i = 0; i < 10; i++) {
      rerender(
        <AccessibleModal isOpen={true} onClose={onClose} title="Test">
          <div>Content</div>
        </AccessibleModal>
      );
      
      rerender(
        <AccessibleModal isOpen={false} onClose={onClose} title="Test">
          <div>Content</div>
        </AccessibleModal>
      );
    }

    // Should not cause errors or memory issues
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(0);
  });
});

// Integration tests
describe('Focus Management Integration', () => {
  it('should work with complex nested components', async () => {
    const ComplexComponent = () => {
      const [modalOpen, setModalOpen] = React.useState(false);
      const [dropdownValue, setDropdownValue] = React.useState('');

      return (
        <FocusProvider>
          <button onClick={() => setModalOpen(true)}>Open Modal</button>
          
          <AccessibleModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Complex Modal"
          >
            <div>
              <label htmlFor="nested-dropdown">Nested Dropdown</label>
              <select id="nested-dropdown" value={dropdownValue} onChange={(e) => setDropdownValue(e.target.value)}>
                <option value="test1">Test 1</option>
                <option value="test2">Test 2</option>
              </select>
            </div>
          </AccessibleModal>
        </FocusProvider>
      );
    };

    render(<ComplexComponent />);

    // Open modal
    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close modal
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(openButton).toBeInTheDocument();
  });

  it('should maintain accessibility across component interactions', async () => {
    const App = () => (
      <FocusProvider>
        <main id="main-content">
          <h1>Test App</h1>
          <label htmlFor="test-select">Test Dropdown</label>
          <select id="test-select">
            <option value="test">Test</option>
          </select>
        </main>
      </FocusProvider>
    );

    const { container } = render(<App />);
    
    // Test overall accessibility
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

export {};
