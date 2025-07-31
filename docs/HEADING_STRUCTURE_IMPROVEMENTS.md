# Heading Structure & Accessibility Improvements

## Current Heading Structure Issues

### 1. **Inconsistent Hierarchy**
- Some pages jump from h1 to h3, skipping h2
- Dashboard components use h2/h3 without clear page structure
- Feature cards in HomePage use h3 without parent h2

### 2. **Missing Page Context**
- Some dashboard sections lack main page headings
- Component headings not properly nested within page structure

## Recommended Heading Structure

### Homepage Structure
```tsx
<h1>Your Personal Smart Coach</h1>                    // Main page title
  <h2>Why Choose Biowell?</h2>                        // Section title
    <h3>Personalized Health</h3>                      // Feature cards
    <h3>Science-Backed</h3>
    <h3>Optimize Performance</h3>
    <h3>Smart Coach</h3>
  <h2>Evidence-Based Health Optimization</h2>         // Next section
```

### Dashboard Structure
```tsx
<h1>Dashboard</h1>                                    // Main page title
  <h2>BW Score Overview</h2>                         // Section
    <h3>Sleep Quality</h3>                           // Metric cards
    <h3>Fitness Level</h3>
  <h2>Today's Supplements</h2>                       // Section
  <h2>Activity Timeline</h2>                         // Section
```

### Supplement Pages Structure
```tsx
<h1>Supplement Store</h1>                            // Main page title
  <h2>Filter & Search Supplements</h2>              // Filter section
  <h2>Evidence Tier Definitions</h2>                // Info section
  <h2>Available Supplements</h2>                     // Product grid
    <h3>[Individual Supplement Names]</h3>          // Product cards
```

## Implementation Priority

### Phase 1: Critical Structure (Immediate)
1. Add missing h1 elements to all pages
2. Ensure proper nesting (no skipped levels)
3. Add skip links for keyboard navigation

### Phase 2: Enhanced Semantics (Next Sprint)
1. Add aria-labelledby for complex sections
2. Implement section landmarks with proper headings
3. Add heading landmarks for screen readers

## CSS Improvements for Headings

```css
/* Enhanced heading styles for better visual hierarchy */
h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  margin-bottom: 1rem;
  color: hsl(var(--color-text-primary));
}

h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: hsl(var(--color-text-primary));
}

h3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: hsl(var(--color-text-primary));
}

h4 {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: hsl(var(--color-text-primary));
}

h5 {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: hsl(var(--color-text-primary));
}

h6 {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: hsl(var(--color-text-secondary));
}
```

## Skip Links Implementation

```tsx
// Add to Layout.tsx or App.tsx
<div className="skip-links">
  <a href="#main-content" className="skip-link">
    Skip to main content
  </a>
  <a href="#main-navigation" className="skip-link">
    Skip to navigation
  </a>
</div>
```

## Testing Checklist

### Screen Reader Testing
- [ ] All headings announce properly
- [ ] Heading structure makes sense when navigated sequentially
- [ ] Skip links work correctly
- [ ] Page regions are properly identified

### Keyboard Navigation
- [ ] Tab order follows logical sequence
- [ ] All headings are reachable via heading navigation (H key)
- [ ] No orphaned headings (proper nesting maintained)

### Visual Hierarchy
- [ ] Clear visual distinction between heading levels
- [ ] Consistent spacing and typography
- [ ] Readable contrast ratios maintained
