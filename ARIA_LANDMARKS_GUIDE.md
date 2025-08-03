# ARIA Landmark Regions - Implementation Guide

## Overview
This document outlines the comprehensive ARIA landmark regions implemented across the Biowell application to ensure optimal screen reader navigation and accessibility compliance.

## Implemented Landmark Regions

### 1. Banner Landmark (`role="banner"`)
**Location**: Layout.tsx header section
**Purpose**: Contains the site header with logo and primary navigation
**Implementation**: 
```tsx
<header role="banner" className="relative">
  <nav role="navigation" aria-label="Main navigation" id="main-navigation">
    <MinimalNav />
  </nav>
</header>
```

### 2. Navigation Landmark (`role="navigation"`)
**Locations**: 
- Main navigation in Layout.tsx
- Mobile navigation in Layout.tsx
- MinimalNav.tsx primary navigation

**Purpose**: Identifies primary and secondary navigation areas
**Implementation**:
```tsx
<nav role="navigation" aria-label="Primary navigation" className="items-center hidden lg:flex">
  <ul className="flex items-center space-x-1 surface-glass rounded-2xl p-1.5 shadow-md" role="menubar">
    {/* Navigation items */}
  </ul>
</nav>
```

### 3. Main Content Landmark (`role="main"`)
**Location**: Layout.tsx main content area
**Purpose**: Contains the primary content of each page
**Features**:
- Skip link target (`id="main-content"`)
- Focusable for keyboard navigation (`tabIndex={-1}`)
**Implementation**:
```tsx
<main role="main" id="main-content" className="flex-1 min-h-[calc(100vh-64px)]" tabIndex={-1}>
  <Outlet />
</main>
```

### 4. Complementary Landmark (`role="complementary"`)
**Locations**:
- Theme toggle controls in HomePage.tsx
- Theme controls in DashboardPage.tsx
**Purpose**: Contains supporting content like controls and utilities
**Implementation**:
```tsx
<aside role="complementary" aria-label="Page controls" className="fixed top-6 right-6 z-50">
  <ThemeToggle />
</aside>
```

### 5. Region Landmark (`role="region"`)
**Locations**: Major content sections across pages
**Purpose**: Identifies significant content areas with descriptive labels

#### HomePage.tsx Regions:
- **Hero Section**: `aria-labelledby="hero-heading"`
- **Features Section**: `aria-labelledby="features-heading"`  
- **Testimonials Section**: `aria-labelledby="testimonials-heading"`
- **Evidence-Based Health**: `aria-labelledby="evidence-based-health-heading"`
- **CTA Section**: `aria-labelledby="cta-heading"`

#### DashboardPage.tsx Regions:
- **BW Score Overview**: `aria-labelledby="bw-score-heading"`
- **Today's Activities**: `aria-labelledby="activities-heading"`
- **Health Overview**: `aria-labelledby="health-overview-heading"`

**Implementation Example**:
```tsx
<section role="region" aria-labelledby="hero-heading" className="relative pt-24 pb-16 overflow-hidden">
  <h1 id="hero-heading">Your Personal Smart Coach</h1>
  {/* Section content */}
</section>
```

### 6. Contentinfo Landmark (`role="contentinfo"`)
**Location**: Layout.tsx footer section
**Purpose**: Contains site-wide footer information
**Implementation**:
```tsx
<footer role="contentinfo" className="gradient-subtle border-t border-gray-200/30 dark:border-gray-700/30 text-gray-800 dark:text-white transition-colors duration-300">
  {/* Footer content */}
</footer>
```

## Skip Links Implementation

### Skip Navigation Links
**Location**: Layout.tsx (before main content)
**Purpose**: Allow keyboard users to quickly navigate to key page areas
**Features**:
- Visually hidden until focused
- High contrast styling when visible
- Direct links to main content and navigation

**Implementation**:
```tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:font-medium focus:shadow-lg"
>
  Skip to main content
</a>
<a 
  href="#main-navigation" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-44 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:font-medium focus:shadow-lg"
>
  Skip to navigation
</a>
```

## Accessibility Enhancements

### 1. Background Elements
- All decorative background elements marked with `aria-hidden="true"`
- Prevents screen readers from announcing non-essential visual elements

### 2. Navigation Structure
- Proper menu roles (`role="menubar"`, `role="menuitem"`)
- ARIA states for dropdowns (`aria-haspopup`, `aria-expanded`)
- Semantic list structure for navigation items

### 3. Heading Hierarchy
- All sections have properly associated headings using `aria-labelledby`
- Unique IDs for each heading element
- Logical heading level progression (h1 → h2 → h3)

### 4. Focus Management
- Main content area focusable for skip link navigation
- Proper focus indicators for all interactive elements
- Keyboard navigation support throughout

## Screen Reader Navigation

### Landmark Navigation Commands
Users can navigate between landmarks using screen reader shortcuts:

**NVDA/JAWS**:
- `D` - Next landmark
- `Shift + D` - Previous landmark
- `B` - Next button
- `H` - Next heading
- `L` - Next link

**VoiceOver (macOS)**:
- `VO + U` - Open rotor
- Select "Landmarks" from rotor menu
- Navigate with arrow keys

### Expected Navigation Flow
1. **Skip Links** → Quick access to main areas
2. **Banner** → Site branding and primary navigation
3. **Navigation** → Main site navigation
4. **Main** → Primary page content with region sections
5. **Complementary** → Supporting controls and utilities
6. **Contentinfo** → Site footer information

## Testing Checklist

### Screen Reader Testing
- [ ] All landmarks properly announced
- [ ] Skip links functional and visible on focus
- [ ] Heading structure logical and complete
- [ ] Navigation menus properly structured
- [ ] Background elements ignored by screen readers

### Keyboard Navigation Testing  
- [ ] Tab order logical throughout page
- [ ] Skip links work correctly
- [ ] All interactive elements reachable
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Automated Testing
- [ ] axe-core accessibility testing passes
- [ ] WAVE accessibility checker clean
- [ ] Lighthouse accessibility score 100
- [ ] HTML validation passes

## Browser Support

The implemented ARIA landmarks are supported across:
- Chrome 50+
- Firefox 45+
- Safari 10+
- Edge 79+
- Internet Explorer 11+

## Future Enhancements

### Planned Improvements
1. **Search Landmark**: Add `role="search"` for search functionality
2. **Form Landmarks**: Implement `role="form"` for complex forms
3. **Article Landmarks**: Use `role="article"` for blog posts/content
4. **Application Landmark**: Consider for interactive widgets

### Additional Accessibility Features
1. **Live Regions**: For dynamic content updates
2. **Breadcrumb Navigation**: Enhanced wayfinding
3. **Page Titles**: Dynamic title updates for SPA navigation
4. **Error Announcements**: Screen reader feedback for errors

## Resources

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA Landmark Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
