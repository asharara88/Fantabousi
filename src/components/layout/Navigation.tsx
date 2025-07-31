import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Sparkles,
  Info,
  Utensils,
  Activity,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  User,
  Settings
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
  type?: 'main' | 'account';
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: NavigationItem[];
}

const Navigation: React.FC<NavigationProps> = ({ 
  isMobile = false, 
  onItemClick,
  type = 'main'
}) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Close submenu when route changes
  useEffect(() => {
    setOpenSubmenu(null);
  }, [location.pathname]);

  const mainNavigation: NavigationItem[] = [
    { 
      name: 'Home', 
      href: '/',
      icon: <Home className="w-4 h-4" />,
      children: [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: 'Fitness', href: '/fitness', icon: <Activity className="w-4 h-4" /> },
        { name: 'Nutrition', href: '/nutrition', icon: <Utensils className="w-4 h-4" /> }
      ]
    },
    { 
      name: 'Fitness', 
      href: '/fitness', 
      icon: <Activity className="w-5 h-5" /> 
    },
    { 
      name: 'Smart Coach',
      href: '/mycoach', 
      icon: <Sparkles className="w-5 h-5" /> 
    },
    { 
      name: 'Personalized Supplements', 
      href: '/supplements', 
      icon: null,
      children: [
        { name: 'My Stacks', href: '/my-stacks', icon: null },
        { name: 'Recommendations', href: '/recommendations', icon: null },
        { name: 'Supplement Store', href: '/supplement-store', icon: null },
        { name: 'All Supplements', href: '/supplements', icon: null },
        { name: 'My Cart', href: '/cart', icon: null }
      ]
    }
  ];
  
  const accountNavigation: NavigationItem[] = [
    { 
      name: 'Account', 
      href: '/login', 
      icon: <User className="w-5 h-5" />,
      children: [
        { name: 'Profile', href: '/profile', icon: <User className="w-4 h-4" /> },
        { name: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
        { name: 'About', href: '/about', icon: <Info className="w-4 h-4" /> }
      ]
    }
  ];
  
  const navigation = type === 'main' ? mainNavigation : accountNavigation;

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(prev => prev === name ? null : name);
  };

  const isActive = (item: NavigationItem) => {
    if (item.href === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname === item.href || 
           (item.href !== '/' && location.pathname.startsWith(item.href)) ||
           (item.children?.some(child => location.pathname === child.href || 
                                        (child.href !== '/' && location.pathname.startsWith(child.href))));
  };

  const renderNavItem = (item: NavigationItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item);
    const isSubmenuOpen = openSubmenu === item.name || 
                         (hasChildren && item.children?.some(child => isActive(child)));

    const handleToggleSubmenu = () => {
      if (hasChildren) {
        toggleSubmenu(item.name);
      } else if (onItemClick) {
        onItemClick();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggleSubmenu();
      }
    };

    return (
      <div key={item.name} className={cn(
        "w-full",
        depth > 0 && "pl-4"
      )}>
        <div className="flex flex-col w-full">
          {hasChildren ? (
            <button
              type="button"
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors text-left",
                isItemActive
                  ? "text-primary font-medium"
                  : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              onClick={handleToggleSubmenu}
              onKeyDown={handleKeyDown}
              aria-expanded={isSubmenuOpen}
              aria-haspopup="menu"
            >
              <span className="flex items-center flex-1 tracking-wide">
                {item.icon && <span className="mr-3">{item.icon}</span>}
                <span>{item.name}</span>
              </span>
              
              <span className="ml-2">
                {isSubmenuOpen ?
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" /> :
                  <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                }
              </span>
            </button>
          ) : (
            <Link 
              to={item.href}
              className={cn(
                "flex items-center w-full px-4 py-3 rounded-lg transition-colors tracking-wide",
                isItemActive
                  ? "text-primary font-medium"
                  : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              onClick={() => {
                if (onItemClick) {
                  onItemClick();
                }
              }}
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              <span>{item.name}</span>
            </Link>
          )}
          
          {hasChildren && isSubmenuOpen && (
            <div className="pl-2 mt-2 mb-2 space-y-2 border-l-2 border-gray-100 animate-slideDown dark:border-gray-700">
              {item.children?.map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <nav className={cn(
      "flex flex-col space-y-1",
      isMobile ? "w-full" : "hidden md:flex md:space-x-8 md:flex-row md:space-y-0"
    )}>
      {navigation.map(item => renderNavItem(item))}
    </nav>
  );
};

export default Navigation;