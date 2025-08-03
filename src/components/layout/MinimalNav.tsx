import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Activity, 
  Sparkles, 
  Pill, 
  ShoppingCart, 
  User, 
  Menu, 
  Sun, 
  Moon, 
  Monitor,
  LogOut,
  X,
  ChevronDown,
  Settings,
  Utensils,
  BarChart3,
  Heart
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import LiveTimeDisplay from '../ui/LiveTimeDisplay';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type ThemeMode = 'light' | 'dark' | 'auto';

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme') as ThemeMode;
  if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
    return savedTheme;
  }
  return 'auto';
};

const isCurrentlyPM = () => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};

const shouldUseDarkMode = (theme: ThemeMode): boolean => {
  switch (theme) {
    case 'dark':
      return true;
    case 'light':
      return false;
    case 'auto':
      return isCurrentlyPM();
    default:
      return false;
  }
};

const MinimalNav: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSupplementsMenu, setShowSupplementsMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isDarkMode = shouldUseDarkMode(theme);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, isDarkMode]);

  // Auto mode: check time every minute when in auto mode
  useEffect(() => {
    if (theme !== 'auto') return;

    const interval = setInterval(() => {
      const newIsDarkMode = shouldUseDarkMode('auto');
      if (newIsDarkMode !== isDarkMode) {
        setTheme('auto');
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [theme, isDarkMode]);

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'auto':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/fitness', label: 'Fitness', icon: <Activity className="w-4 h-4" /> },
    { href: '/mycoach', label: 'Smart Coach', icon: <Sparkles className="w-4 h-4" /> },
    { href: '/nutrition', label: 'Nutrition', icon: <Utensils className="w-4 h-4" /> },
   { href: '/recipes', label: 'Recipes', icon: <Utensils className="w-4 h-4" /> },
    { 
      href: '/supplements', 
      label: 'Supplements', 
      icon: <Pill className="w-4 h-4" />,
      hasDropdown: true,
      dropdownItems: [
        { href: '/supplements', label: 'Browse All', icon: <Pill className="w-4 h-4" /> },
        { href: '/supplements/recommendations', label: 'Recommendations', icon: <Heart className="w-4 h-4" /> },
        { href: '/supplements/stacks', label: 'My Stacks', icon: <BarChart3 className="w-4 h-4" /> },
        { href: '/cart', label: 'Cart', icon: <ShoppingCart className="w-4 h-4" /> }
      ]
    },
  ];

  return (
    <>
      <div className="sticky top-0 z-50 transition-all duration-300 border-b glass-subtle border-gray-200/30 dark:border-gray-700/30">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center transition-opacity hover:opacity-80" aria-label="Biowell - Home">
              <img 
                src={isDarkMode 
                  ? "/logos/biowell-light.svg"
                  : "/logos/biowell-dark.svg"
                }
                alt="Biowell" 
                className="object-contain w-auto h-15" 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav aria-label="Primary navigation" className="items-center hidden lg:flex">
              <ul className="flex items-center space-x-1 surface-glass rounded-2xl p-1.5 shadow-md" role="menubar">
                {navItems.map((item) => (
                  <li key={item.href} className="relative" role="none">
                    {item.hasDropdown ? (
                      <div className="relative">
                        <button
                          onClick={() => setShowSupplementsMenu(!showSupplementsMenu)}
                          className={cn(
                            "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                            isActive(item.href)
                              ? "bg-primary text-white shadow-md scale-105"
                              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-surface-1/70"
                          )}
                          role="menuitem"
                          aria-haspopup="true"
                          aria-expanded={showSupplementsMenu}
                        >
                          <span className="mr-2">{item.icon}</span>
                          <span className="tracking-wide">{item.label}</span>
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </button>
                        
                        <AnimatePresence>
                          {showSupplementsMenu && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setShowSupplementsMenu(false)}
                              />
                              <motion.div
                                className="absolute left-0 z-50 w-56 py-2 mt-2 shadow-xl top-full surface-glass rounded-2xl"
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.2 }}
                              >
                                {item.dropdownItems?.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.href}
                                    to={dropdownItem.href}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 transition-all duration-200 dark:text-gray-300 hover:bg-surface-2/70 hover:translate-x-1"
                                    onClick={() => setShowSupplementsMenu(false)}
                                  >
                                    <span className="mr-3">{dropdownItem.icon}</span>
                                    <span className="tracking-wide">{dropdownItem.label}</span>
                                  </Link>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive(item.href)
                            ? "bg-primary text-white shadow-md scale-105"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-surface-1/70"
                        )}
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span className="tracking-wide">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

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
              
              {/* Theme Toggle */}
              <div className="relative">
                <motion.button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-surface-2/70 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getThemeIcon()}
                </motion.button>
                
                <AnimatePresence>
                  {showThemeMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowThemeMenu(false)}
                      />
                      <motion.div
                        className="absolute right-0 z-50 w-40 py-2 mt-2 shadow-xl surface-glass rounded-2xl"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {[
                          { mode: 'light' as ThemeMode, icon: Sun, label: 'Light Mode' },
                          { mode: 'dark' as ThemeMode, icon: Moon, label: 'Dark Mode' },
                          { mode: 'auto' as ThemeMode, icon: Monitor, label: 'Auto Mode' }
                        ].map(({ mode, icon: Icon, label }) => (
                          <button
                            key={mode}
                            onClick={() => handleThemeChange(mode)}
                            className={cn(
                              "flex items-center w-full px-4 py-3 text-sm transition-all duration-200",
                              theme === mode 
                                ? "text-primary bg-primary/10 font-medium scale-105" 
                                : "text-gray-700 dark:text-gray-300 hover:bg-surface-2/70 hover:translate-x-1"
                            )}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            <span className="tracking-wide">{label}</span>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/cart"
                  className={cn(
                    "p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-surface-2/70 transition-all duration-200",
                    isActive('/cart') && "text-primary bg-primary/10"
                  )}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* User Menu or Auth Buttons */}
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-surface-2/70 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-4 h-4 mr-1" />
                    <ChevronDown className="w-3 h-3" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                          className="absolute right-0 z-50 w-48 py-2 mt-2 shadow-xl surface-glass rounded-2xl"
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to="/"
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 transition-all duration-200 dark:text-gray-300 hover:bg-surface-2/70 hover:translate-x-1"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Home className="w-4 h-4 mr-3" />
                            <span className="tracking-wide">Home</span>
                          </Link>
                          <Link
                            to="/bioclock"
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 transition-all duration-200 dark:text-gray-300 hover:bg-surface-2/70 hover:translate-x-1"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            <span className="tracking-wide">Bioclock™</span>
                          </Link>
                          <div className="my-2 border-t border-gray-200/30 dark:border-gray-700/30" />
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-3 text-sm transition-all duration-200 text-error hover:bg-error/10 hover:translate-x-1"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            <span className="tracking-wide">Sign out</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="items-center hidden space-x-3 lg:flex">
                  <Link
                    to="/login"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-md tracking-wide"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-surface-2/70 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 90 }}
                      exit={{ rotate: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Advanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed left-0 right-0 z-50 border-b shadow-2xl top-16 glass border-gray-200/30 dark:border-gray-700/30 lg:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <div key={item.href}>
                      {item.hasDropdown ? (
                        <div className="space-y-1">
                          <div
                            className={cn(
                              "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                              isActive(item.href)
                               ? "gradient-primary text-white shadow-md"
                                : "text-gray-700 dark:text-gray-300"
                            )}
                          >
                            <span className="mr-3">{item.icon}</span>
                            <span className="tracking-wide">{item.label}</span>
                          </div>
                          <div className="ml-6 space-y-1">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                to={dropdownItem.href}
                                className={cn(
                                  "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                  isActive(dropdownItem.href)
                                    ? "text-primary bg-primary/10"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-surface-2/70"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span className="mr-3">{dropdownItem.icon}</span>
                                <span className="tracking-wide">{dropdownItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                            isActive(item.href)
                              ? "gradient-primary text-white shadow-md"
                              : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-surface-2/70"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="mr-3">{item.icon}</span>
                          <span className="tracking-wide">{item.label}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                  
                  {/* Mobile Auth Section */}
                  {!user && (
                    <div className="pt-4 space-y-2 border-t border-gray-200/30 dark:border-gray-700/30">
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-base font-medium tracking-wide text-gray-700 transition-all duration-200 dark:text-gray-300 hover:bg-surface-2/70 rounded-xl"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/onboarding"
                        className="block px-4 py-3 text-base font-medium tracking-wide text-center text-white shadow-md gradient-primary rounded-xl"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  )}

                  {/* Mobile User Menu */}
                  {user && (
                    <div className="pt-4 space-y-1 border-t border-gray-200/30 dark:border-gray-700/30">
                      <Link
                        to="/"
                        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 transition-all duration-200 dark:text-gray-300 hover:bg-surface-2/70 rounded-xl"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Home className="w-4 h-4 mr-3" />
                        <span className="tracking-wide">Home</span>
                      </Link>
                      <Link
                        to="/bioclock"
                        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 transition-all duration-200 dark:text-gray-300 hover:bg-surface-2/70 rounded-xl"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        <span className="tracking-wide">Bioclock™</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-base font-medium transition-all duration-200 text-error hover:bg-error/10 rounded-xl"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        <span className="tracking-wide">Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MinimalNav;