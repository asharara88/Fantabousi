# Focus Management Implementation Guide

## Overview

This guide shows how to integrate the comprehensive focus management system into your BioWell application for WCAG 2.1 Success Criterion 2.4.3 compliance.

## Implementation Steps

### 1. Wrap Your Application with FocusProvider

Update your main App component to include the FocusProvider:

```tsx
// App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import FocusProvider from './components/FocusProvider';
import EnhancedNavigation from './components/layout/EnhancedNavigation';
// ... other imports

function App() {
  return (
    <BrowserRouter>
      <FocusProvider enableSkipLinks={true} enableAnnouncements={true}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Your existing layout */}
        </div>
      </FocusProvider>
    </BrowserRouter>
  );
}

export default App;
```

### 2. Update Your Layout Components

Add proper landmark regions and IDs for skip links:

```tsx
// Layout.tsx
import React from 'react';
import EnhancedNavigation from './EnhancedNavigation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Navigation Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <EnhancedNavigation 
          variant="sidebar" 
          isAuthenticated={true}
          collapsible={true}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          {/* Header content */}
        </header>

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 p-6" tabIndex={-1}>
          {children}
        </main>

        {/* Footer */}
        <footer id="footer" className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          {/* Footer content */}
        </footer>
      </div>
    </div>
  );
};

export default Layout;
```

### 3. Replace Existing Modals

Replace your existing modal components with AccessibleModal:

```tsx
// Before (StackBuilderModal.tsx)
import Modal from './Modal'; // Replace this

// After
import AccessibleModal from '../ui/AccessibleModal';
import { useFocusManagement } from '../../utils/focusManagement';

const StackBuilderModal: React.FC<Props> = ({ isOpen, onClose, ... }) => {
  const { announce } = useFocusManagement();

  const handleSave = () => {
    // ... save logic
    announce('Supplement stack saved successfully', 'polite');
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Build Your Stack"
      description="Add supplements to your personalized stack"
      initialFocus="input[name='search']"
    >
      {/* Your existing modal content */}
    </AccessibleModal>
  );
};
```

### 4. Enhance Form Components

Add focus management to your forms:

```tsx
// QuickWorkoutLogger.tsx
import { useFocusManagement } from '../../utils/focusManagement';
import { FormValidationAnnouncer } from '../ui/LiveRegion';

const QuickWorkoutLogger: React.FC = () => {
  const { announce, focusFirstError } = useFocusManagement();
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      announce('Please correct the errors and try again', 'assertive');
      focusFirstError();
      return;
    }

    // ... submit logic
    announce('Workout logged successfully', 'polite');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      
      <FormValidationAnnouncer
        errors={formErrors}
        touched={formTouched}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
      />
    </form>
  );
};
```

### 5. Update Navigation Components

Replace your existing navigation with EnhancedNavigation:

```tsx
// MinimalNav.tsx - Update to use EnhancedNavigation
import EnhancedNavigation from './EnhancedNavigation';

const MinimalNav: React.FC = () => {
  return (
    <EnhancedNavigation 
      variant="header"
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      showLabels={true}
    />
  );
};
```

### 6. Enhance Dropdown Components

Your existing AccessibleDropdown is already well-implemented! Just ensure it's being used consistently:

```tsx
// Use your existing AccessibleDropdown
import AccessibleDropdown from '../ui/AccessibleDropdown';

// Example usage
<AccessibleDropdown
  options={supplementOptions}
  value={selectedSupplement}
  onChange={setSelectedSupplement}
  searchable={true}
  placeholder="Search supplements..."
  label="Select Supplement"
  description="Choose a supplement to add to your stack"
/>
```

### 7. Add Live Regions for Dynamic Content

Use LiveRegion for dynamic content updates:

```tsx
// PWAInstallPrompt.tsx
import LiveRegion, { StatusMessage } from '../ui/LiveRegion';

const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <>
      {showPrompt && (
        <StatusMessage
          message="BioWell can be installed as an app for easier access"
          type="info"
          onDismiss={() => setShowPrompt(false)}
        />
      )}
      
      <LiveRegion level="polite">
        {installStatus && `App ${installStatus}`}
      </LiveRegion>
    </>
  );
};
```

### 8. Update Media Components

Enhance your media players with better focus management:

```tsx
// AccessibleMediaPlayer.tsx - Enhance existing component
import { useFocusManagement } from '../../utils/focusManagement';

const AccessibleMediaPlayer: React.FC = ({ src, title }) => {
  const { announce } = useFocusManagement();

  const handlePlay = () => {
    announce(`Playing ${title}`, 'polite');
  };

  const handlePause = () => {
    announce('Paused', 'polite');
  };

  // ... rest of component with enhanced announcements
};
```

## Navigation Structure Improvements

### Simplified Information Architecture

The new navigation structure follows UX best practices:

1. **Reduced Menu Depth**: Maximum 2 levels deep
2. **Clear Categorization**: Logical grouping by function
3. **Consistent Naming**: Descriptive, action-oriented labels
4. **Mobile-Optimized**: Touch-friendly design with proper spacing

### Menu Structure

```
Dashboard (/)
├── Fitness (/fitness)
│   ├── Workouts (/fitness/workouts)
│   ├── Progress (/fitness/progress)
│   └── Goals (/fitness/goals)
├── Nutrition (/nutrition)
│   ├── Meal Planning (/nutrition/meals)
│   └── Food Diary (/nutrition/diary)
├── Supplements (/supplements)
│   ├── My Stack (/supplements/stack)
│   └── Store (/supplements/store)
└── Biohacking (/biohacking)
```

## Accessibility Features Implemented

### WCAG 2.1 Compliance

✅ **2.4.1 Bypass Blocks**: Skip links implemented
✅ **2.4.3 Focus Order**: Logical focus sequence
✅ **2.4.6 Headings and Labels**: Descriptive labels
✅ **2.4.7 Focus Visible**: Enhanced focus indicators
✅ **3.2.1 On Focus**: No unexpected context changes
✅ **3.2.2 On Input**: Predictable functionality
✅ **4.1.2 Name, Role, Value**: Proper ARIA attributes

### Focus Management Features

1. **Focus Trapping**: Modals trap focus within content
2. **Focus Restoration**: Returns focus after modal close
3. **Skip Links**: Keyboard navigation shortcuts
4. **Live Regions**: Screen reader announcements
5. **Error Handling**: Focus moves to first error
6. **Dynamic Content**: Announces content changes

### Mobile Usability

1. **Touch Targets**: Minimum 44px touch targets
2. **Swipe Gestures**: Natural mobile navigation
3. **Responsive Design**: Adapts to screen size
4. **Reduced Motion**: Respects user preferences

## Testing Guidelines

### Manual Testing

1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
3. **Focus Indicators**: Ensure visible focus states
4. **Mobile Testing**: Test on actual devices

### Automated Testing

```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react jest-axe

# Run accessibility tests
npm run test:a11y
```

### Browser Testing

Test with:
- Chrome + ChromeVox
- Firefox + NVDA
- Safari + VoiceOver
- Edge + Narrator

## Performance Considerations

1. **Code Splitting**: Load focus utilities only when needed
2. **Event Delegation**: Efficient event handling
3. **Debouncing**: Throttle announcements to avoid spam
4. **Memory Management**: Clean up event listeners

## Migration Checklist

- [ ] Install FocusProvider in App.tsx
- [ ] Add skip links styles to CSS
- [ ] Replace existing modals with AccessibleModal
- [ ] Update form validation with announcements
- [ ] Enhance navigation with EnhancedNavigation
- [ ] Add live regions for dynamic content
- [ ] Test with keyboard navigation
- [ ] Test with screen readers
- [ ] Validate WCAG 2.1 compliance

## Support and Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

This implementation provides a solid foundation for accessible focus management while maintaining the existing design and functionality of your BioWell application.
