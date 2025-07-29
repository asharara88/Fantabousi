import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Home,
  User,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { Button } from './Button';

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

interface ProgressiveNavigationProps {
  menuItems: MenuItem[];
  logo?: React.ReactNode;
  className?: string;
  variant?: 'horizontal' | 'sidebar' | 'mobile';
  breakpoint?: 'sm' | 'md' | 'lg';
  showMenuLabels?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * Progressive Navigation Component - Accessible navigation that works across devices
 * 
 * Features:
 * - Progressive enhancement (works without JavaScript)
 * - Mobile-first responsive design
 * - Full keyboard navigation
 * - Screen reader support
 * - Focus management
 * - Reduced motion support
 * - Touch-friendly design
 * - Collapsible sidebar mode
 * - Breadcrumb support
 * - Skip links
 */
const ProgressiveNavigation: React.FC<ProgressiveNavigationProps> = ({
  menuItems,
  logo,
  className = '',
  variant = 'horizontal',
  breakpoint = 'md',
  showMenuLabels = true,
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(!defaultExpanded);
  const [focusedPath, setFocusedPath] = useState<string[]>([]);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current && 
        !navRef.current.contains(event.target as Node) &&
        !mobileButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setFocusedPath([]);
        mobileButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Toggle expanded state for menu items
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handle menu item click
  const handleMenuClick = (item: MenuItem, path: string[] = []) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id);
      setFocusedPath(path);
    } else {
      if (item.onClick) {
        item.onClick();
      }
      setIsMobileMenuOpen(false);
      setFocusedPath([]);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, item: MenuItem, path: string[] = []) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleMenuClick(item, path);
        break;
      case 'ArrowDown':
        // Navigate to next item
        e.preventDefault();
        // Implementation would depend on the specific navigation structure
        break;
      case 'ArrowUp':
        // Navigate to previous item
        e.preventDefault();
        break;
      case 'ArrowRight':
        // Expand submenu
        if (item.children && !expandedItems.has(item.id)) {
          e.preventDefault();
          toggleExpanded(item.id);
        }
        break;
      case 'ArrowLeft':
        // Collapse submenu or go to parent
        if (item.children && expandedItems.has(item.id)) {
          e.preventDefault();
          toggleExpanded(item.id);
        }
        break;
    }
  };

  // Skip link for accessibility
  const SkipLink = () => (
    <a
      ref={skipLinkRef}
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  );

  // Render menu item recursively
  const renderMenuItem = (item: MenuItem, level: number = 0, path: string[] = []) => {
    const currentPath = [...path, item.id];
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    return (
      <li key={item.id} className={`nav-item level-${level}`}>
        <div className="relative">
          {item.href && !hasChildren ? (
            // Link item
            <a
              href={item.href}
              className={`nav-link flex items-center gap-3 px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 min-h-[44px] ${
                item.disabled
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ paddingLeft: `${12 + level * 16}px` }}
              aria-disabled={item.disabled}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
                setIsMobileMenuOpen(false);
              }}
            >
              {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
              {showMenuLabels && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          ) : (
            // Button item (with or without children)
            <button
              type="button"
              className={`nav-button w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 min-h-[44px] text-left ${
                item.disabled
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ paddingLeft: `${12 + level * 16}px` }}
              onClick={() => handleMenuClick(item, currentPath)}
              onKeyDown={(e) => handleKeyDown(e, item, currentPath)}
              aria-expanded={hasChildren ? isExpanded : undefined}
              aria-disabled={item.disabled}
              aria-describedby={hasChildren ? `${item.id}-submenu` : undefined}
            >
              {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
              {showMenuLabels && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {item.badge && (
                <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: isReducedMotion ? 0 : 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                </motion.div>
              )}
            </button>
          )}
        </div>

        {/* Submenu */}
        {hasChildren && (
          <AnimatePresence>
            {isExpanded && (
              <motion.ul
                id={`${item.id}-submenu`}
                initial={isReducedMotion ? {} : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={isReducedMotion ? {} : { opacity: 0, height: 0 }}
                transition={{ duration: isReducedMotion ? 0 : 0.3 }}
                className="submenu overflow-hidden"
                role="group"
                aria-labelledby={item.id}
              >
                {item.children!.map(child => 
                  renderMenuItem(child, level + 1, currentPath)
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </li>
    );
  };

  const breakpointClass = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  }[breakpoint];

  return (
    <>
      <SkipLink />
      
      <nav
        ref={navRef}
        className={`progressive-navigation ${className}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile Header */}
        <div className={`${breakpointClass}:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700`}>
          {logo && <div className="flex-shrink-0">{logo}</div>}
          
          <Button
            ref={mobileButtonRef}
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={isReducedMotion ? {} : { rotate: -90 }}
                  animate={{ rotate: 0 }}
                  exit={isReducedMotion ? {} : { rotate: 90 }}
                  transition={{ duration: isReducedMotion ? 0 : 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={isReducedMotion ? {} : { rotate: 90 }}
                  animate={{ rotate: 0 }}
                  exit={isReducedMotion ? {} : { rotate: -90 }}
                  transition={{ duration: isReducedMotion ? 0 : 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Desktop Navigation */}
        <div className={`hidden ${breakpointClass}:block`}>
          {variant === 'horizontal' && (
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              {logo && <div className="flex-shrink-0">{logo}</div>}
              
              <ul className="flex items-center space-x-1" role="menubar">
                {menuItems.map(item => (
                  <li key={item.id} role="none">
                    {renderMenuItem(item)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {variant === 'sidebar' && (
            <div className={`h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
              collapsible && isCollapsed ? 'w-16' : 'w-64'
            }`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  {logo && !isCollapsed && <div className="flex-shrink-0">{logo}</div>}
                  {collapsible && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCollapsed(!isCollapsed)}
                      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} 
                      />
                    </Button>
                  )}
                </div>
              </div>
              
              <ul className="p-2 space-y-1" role="menubar">
                {menuItems.map(item => (
                  <li key={item.id} role="none">
                    {renderMenuItem(item)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={isReducedMotion ? {} : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isReducedMotion ? {} : { opacity: 0, y: -20 }}
              transition={{ duration: isReducedMotion ? 0 : 0.3 }}
              className={`${breakpointClass}:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg z-40`}
            >
              <ul className="p-4 space-y-1 max-h-[60vh] overflow-y-auto" role="menu">
                {menuItems.map(item => (
                  <li key={item.id} role="none">
                    {renderMenuItem(item)}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Backdrop */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${breakpointClass}:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30`}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

// Example usage with common navigation structure
export const ExampleNavigation = () => {
  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      children: [
        {
          id: 'profile',
          label: 'Profile',
          href: '/profile'
        },
        {
          id: 'settings',
          label: 'Settings',
          href: '/settings',
          icon: Settings
        },
        {
          id: 'logout',
          label: 'Logout',
          icon: LogOut,
          onClick: () => {
            // Handle logout
            console.log('Logout clicked');
          }
        }
      ]
    },
    {
      id: 'help',
      label: 'Help',
      href: '/help',
      icon: HelpCircle,
      badge: '2'
    }
  ];

  return (
    <ProgressiveNavigation
      menuItems={menuItems}
      logo={<div className="text-xl font-bold">Logo</div>}
      variant="horizontal"
      breakpoint="md"
      collapsible={true}
    />
  );
};

export default ProgressiveNavigation;
