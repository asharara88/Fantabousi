# 🕐 LiveTimeDisplay Component

## Overview
An elegant date/time display component with live bedtime countdown, designed with 2026 aesthetic principles featuring ultra-minimal design, glass morphism effects, and subtle animations.

## Features

### ✨ **Real-time Updates**
- Live time display updating every second
- Dynamic bedtime countdown with hours, minutes, and seconds
- Automatic next-day calculation when bedtime has passed

### 🎨 **2026 Aesthetic Design**
- **Glass Morphism**: Translucent backgrounds with backdrop blur effects
- **Ultra-Minimal**: Clean typography with premium spacing
- **Subtle Animations**: Smooth transitions and hover effects
- **Premium Spacing**: Carefully crafted margins and padding

### 🌓 **Smart Theming**
- Automatic dark/light mode adaptation
- Context-aware greeting messages based on time of day
- Dynamic icons (moon for evening/night, clock for day)

### 📱 **Responsive Variants**
- **Full**: Perfect for dashboard heroes or main wellness displays
- **Default**: Ideal for sidebars or card layouts  
- **Compact**: Great for navigation bars or minimal interfaces

## Usage

### Basic Implementation
```tsx
import LiveTimeDisplay from '../ui/LiveTimeDisplay';

// Default variant with bedtime countdown
<LiveTimeDisplay 
  showBedtimeCountdown={true}
  bedtimeHour={23} // 11 PM
/>
```

### Navigation Bar Integration
```tsx
// Compact variant for nav bars
<LiveTimeDisplay 
  variant="compact"
  showBedtimeCountdown={true}
  bedtimeHour={22} // 10 PM
/>
```

### Dashboard Hero
```tsx
// Full variant for main displays
<LiveTimeDisplay 
  variant="full"
  showBedtimeCountdown={true}
  bedtimeHour={23}
  className="w-full"
/>
```

### Time Only (No Bedtime)
```tsx
// Clean time display without sleep tracking
<LiveTimeDisplay 
  variant="default"
  showBedtimeCountdown={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `undefined` | Additional CSS classes |
| `showBedtimeCountdown` | `boolean` | `true` | Whether to show bedtime countdown |
| `bedtimeHour` | `number` | `23` | Bedtime hour (24-hour format) |
| `variant` | `'default' \| 'compact' \| 'full'` | `'default'` | Display variant |

## Design Philosophy

### Glass Morphism Effects
- `backdrop-blur-xl` for smooth glass effect
- Subtle gradient overlays with low opacity
- Elegant border treatments with transparency

### Typography Hierarchy
```css
/* Time Display */
font-family: ui-monospace; /* Mono font for time */
font-weight: 300; /* Light weight for elegance */
letter-spacing: 0.05em; /* Wide tracking for readability */

/* Body Text */
font-weight: 400-500; /* Medium weights for balance */
color: subtle grays; /* Gentle on the eyes */
```

### Color Palette
- **Primary**: Indigo gradients for bedtime elements
- **Neutral**: Sophisticated grays for main content
- **Accent**: Green for motivational elements
- **Glass**: White/transparent overlays

### Animation Principles
- **Entrance**: Smooth fade-in with subtle scale
- **Hover**: Gentle scale and color transitions
- **Live Updates**: Seamless number changes
- **Duration**: 200-400ms for optimal feel

## Integration Examples

### In MinimalNav (Current Implementation)
```tsx
{/* Right Side Actions */}
<div className="flex items-center space-x-3">
  {/* Live Time Display - Hidden on smaller screens */}
  <div className="hidden xl:block">
    <LiveTimeDisplay 
      variant="compact" 
      showBedtimeCountdown={true}
      bedtimeHour={23}
    />
  </div>
  {/* Other nav elements */}
</div>
```

### Dashboard Widget
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1">
    <LiveTimeDisplay 
      variant="full"
      className="h-full"
    />
  </div>
  {/* Other dashboard widgets */}
</div>
```

## Accessibility Features

### Screen Reader Support
- Semantic HTML structure
- ARIA labels for time elements
- Descriptive text for countdown status

### Keyboard Navigation
- Focusable elements where appropriate
- Clear focus indicators
- Logical tab order

### Visual Accessibility
- High contrast ratios
- Scalable fonts
- Respects user's motion preferences

## Browser Compatibility
- Modern browsers with CSS backdrop-filter support
- Graceful degradation for older browsers
- Mobile-optimized touch interactions

## Performance Considerations
- Efficient React hooks for time updates
- Minimal re-renders with optimized state
- Lightweight animations with CSS transforms
- Lazy loading for non-critical features

## Customization

### Custom Bedtime
```tsx
<LiveTimeDisplay 
  bedtimeHour={22} // 10 PM bedtime
  showBedtimeCountdown={true}
/>
```

### Styling Overrides
```tsx
<LiveTimeDisplay 
  className="custom-time-display"
  variant="default"
/>
```

```css
.custom-time-display {
  /* Custom glass effect */
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## Related Components
- **MinimalNav**: Navigation integration
- **DashboardWidget**: Main dashboard usage
- **UserProfile**: Personal time preferences
- **SleepTracking**: Bedtime optimization features

---

**Live Demo**: Visit `/demo/live-time` to see all variants in action

**Design Philosophy**: Embracing 2026 aesthetic with ultra-minimal, glass morphism, and premium spacing for an elevated user experience. 🚀
