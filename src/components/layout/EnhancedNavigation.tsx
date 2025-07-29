import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Activity,
  Sparkles,
  Pill,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Settings,
  Utensils,
  BarChart3,
  Heart,
  Sun,
  Moon,
  Monitor,
  LogOut
} from 'lucide-react';
import { useFocusManagement } from '../../utils/focusManagement';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  children?: NavigationItem[];
  badge?: string | number;
  external?: boolean;
}

interface EnhancedNavigationProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
  className?: string;
  variant?: 'header' | 'sidebar' | 'mobile';
  showLabels?: boolean;
  collapsible?: boolean;
}

// Navigation structure with improved information architecture
const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Your personal health overview'
  },
  {
    label: 'Fitness',
    href: '/fitness',
    icon: Activity,
    description: 'Track workouts and physical activity',
    children: [
      {
        label: 'Workouts',
        href: '/fitness/workouts',
        icon: Activity,
        description: 'Log and track your workouts'
      },
      {
        label: 'Progress',
        href: '/fitness/progress',
        icon: BarChart3,
        description: 'View your fitness progress'
      },
      {
        label: 'Goals',
        href: '/fitness/goals',
        icon: Heart,
        description: 'Set and track fitness goals'
      }
    ]
  },
  {
    label: 'Nutrition',
    href: '/nutrition',
    icon: Utensils,
    description: 'Manage your diet and nutrition',
    children: [
      {
        label: 'Meal Planning',
        href: '/nutrition/meals',
        icon: Utensils,
        description: 'Plan your meals'
      },
      {
        label: 'Food Diary',
        href: '/nutrition/diary',
        icon: BarChart3,
        description: 'Track your daily intake'
      }
    ]
  },
  {
    label: 'Supplements',
    href: '/supplements',
    icon: Pill,
    description: 'Manage your supplement regimen',
    children: [
      {
        label: 'My Stack',
        href: '/supplements/stack',
        icon: Pill,
        description: 'View your supplement stack'
      },
      {
        label: 'Store',
        href: '/supplements/store',
        icon: ShoppingCart,
        description: 'Browse supplement products'
      }
    ]
  },
  {
    label: 'Biohacking',
    href: '/biohacking',
    icon: Sparkles,
    description: 'Advanced optimization tools'
  }
];

const userMenuItems: NavigationItem[] = [
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Manage your account'
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App preferences'
  }
];

/**
 * Enhanced Navigation Component
 * Improved information architecture, accessibility, and mobile usability
 */
const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  isAuthenticated = false,
  onLogout,
  className = '',
  variant = 'header',
  showLabels = true,
  collapsible = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { announce } = useFocusManagement();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  }, [location.pathname]);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const hasActiveChild = (item: NavigationItem): boolean => {
    if (!item.children) return false;
    return item.children.some(child => isActive(child.href));
  };

  const toggleSubmenu = (itemLabel: string) => {
    setOpenSubmenu(openSubmenu === itemLabel ? null : itemLabel);
    announce(`${itemLabel} submenu ${openSubmenu === itemLabel ? 'closed' : 'opened'}`, 'polite');
  };

  const handleNavigation = (href: string, label: string, external?: boolean) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href);
      announce(`Navigated to ${label}`, 'polite');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    announce(`Navigation menu ${!isMobileMenuOpen ? 'opened' : 'closed'}`, 'polite');
  };

  const renderNavigationItem = (item: NavigationItem, isChild = false) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const childActive = hasActiveChild(item);
    const isExpanded = openSubmenu === item.label;

    if (hasChildren) {
      return (
        <li key={item.label} className={isChild ? 'ml-4' : ''}>
          <button
            type="button"
            onClick={() => toggleSubmenu(item.label)}
            className={`
              w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md
              transition-colors duration-200 group
              ${(active || childActive)
                ? 'bg-primary/10 text-primary'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
              focus:outline-none focus:ring-2 focus:ring-primary/20
            `}
            aria-expanded={isExpanded}
            aria-controls={`submenu-${item.label}`}
            aria-describedby={item.description ? `desc-${item.label}` : undefined}
          >
            <div className="flex items-center">
              <item.icon className={`w-5 h-5 mr-3 ${isCollapsed && !showLabels ? 'mr-0' : ''}`} />
              {(showLabels || !isCollapsed) && (
                <span className="truncate">{item.label}</span>
              )}
            </div>
            {(showLabels || !isCollapsed) && (
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            )}
          </button>
          
          {item.description && (
            <span id={`desc-${item.label}`} className="sr-only">
              {item.description}
            </span>
          )}

          <AnimatePresence>
            {isExpanded && (
              <motion.ul
                id={`submenu-${item.label}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 space-y-1 overflow-hidden"
                role="menu"
                aria-label={`${item.label} submenu`}
              >
                {item.children?.map(child => renderNavigationItem(child, true))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
      );
    }

    return (
      <li key={item.label} className={isChild ? 'ml-4' : ''}>
        <Link
          to={item.href}
          className={`
            flex items-center px-3 py-2 text-sm font-medium rounded-md
            transition-colors duration-200 group
            ${active
              ? 'bg-primary/10 text-primary'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
            focus:outline-none focus:ring-2 focus:ring-primary/20
          `}
          onClick={() => handleNavigation(item.href, item.label, item.external)}
          aria-describedby={item.description ? `desc-${item.label}` : undefined}
          {...(item.external && {
            target: '_blank',
            rel: 'noopener noreferrer'
          })}
        >
          <item.icon className={`w-5 h-5 mr-3 ${isCollapsed && !showLabels ? 'mr-0' : ''}`} />
          {(showLabels || !isCollapsed) && (
            <>
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-2 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Link>
        
        {item.description && (
          <span id={`desc-${item.label}`} className="sr-only">
            {item.description}
          </span>
        )}
      </li>
    );
  };

  const renderUserMenu = () => (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <nav aria-label="User menu">
        <ul className="space-y-1">
          {userMenuItems.map(item => renderNavigationItem(item))}
          {onLogout && (
            <li>
              <button
                type="button"
                onClick={onLogout}
                className="
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                  text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-red-500/20
                "
              >
                <LogOut className="w-5 h-5 mr-3" />
                {(showLabels || !isCollapsed) && 'Sign Out'}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );

  if (variant === 'mobile' || (variant === 'header' && window.innerWidth < 768)) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={toggleMobileMenu}
          className="
            p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
            hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md
            focus:outline-none focus:ring-2 focus:ring-primary/20
          "
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <nav
                ref={mobileMenuRef}
                id="mobile-navigation"
                className="px-4 py-4"
                aria-label="Main navigation"
              >
                <ul className="space-y-2">
                  {navigationItems.map(item => renderNavigationItem(item))}
                </ul>
                
                {isAuthenticated && renderUserMenu()}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Navigation
  return (
    <nav
      id="main-navigation"
      className={`${className}`}
      aria-label="Main navigation"
      role="navigation"
    >
      <div className="space-y-6">
        {/* Main Navigation */}
        <div>
          <ul className="space-y-1">
            {navigationItems.map(item => renderNavigationItem(item))}
          </ul>
        </div>

        {/* User Menu */}
        {isAuthenticated && renderUserMenu()}

        {/* Collapse Toggle (for sidebar variant) */}
        {collapsible && variant === 'sidebar' && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="
              w-full flex items-center justify-center px-3 py-2 text-sm font-medium
              text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
              hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md
              border border-gray-200 dark:border-gray-700
              focus:outline-none focus:ring-2 focus:ring-primary/20
            "
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <Menu className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Collapse</span>}
          </button>
        )}
      </div>
    </nav>
  );
};

export default EnhancedNavigation;
