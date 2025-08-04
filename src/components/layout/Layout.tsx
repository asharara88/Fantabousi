/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import MinimalNav from './MinimalNav'
import MobileNav from '../ui/MobileNav'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const navigate = useNavigate()

  // Check for user session on mount
  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        
        // If no user and not on auth pages, redirect to welcome page
        if (!data.user) {
          navigate('/welcome');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate('/welcome');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      if (event === 'SIGNED_OUT' || !session?.user) {
        navigate('/welcome');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user, don't render the layout (redirect handled above)
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Skip Links for keyboard navigation */}
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

      {/* Header with banner landmark */}
      <header role="banner" className="relative">
        <nav role="navigation" aria-label="Main navigation" id="main-navigation">
          <MinimalNav />
        </nav>
      </header>
      
      {/* Mobile Navigation - Part of navigation landmark */}
      <nav role="navigation" aria-label="Mobile navigation">
        <MobileNav 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          isLoggedIn={!!user}
          onSignOut={handleSignOut}
        />
      </nav>

      {/* Main Content - primary content landmark */}
      <main role="main" id="main-content" className="flex-1 min-h-[calc(100vh-64px)]" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Footer - contentinfo landmark */}
      <footer role="contentinfo" className="gradient-subtle border-t border-gray-200/30 dark:border-gray-700/30 text-gray-800 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="flex items-center mb-5 md:mb-0 text-left">
              {/* Use local logos from the public/logos folder. The first shows in light mode and the second in dark mode. */}
              <img
                src="/logos/biowell-dark.svg"
                alt="Biowell Logo"
                className="h-24 w-auto dark:hidden opacity-70"
              />
              <img
                src="/logos/biowell-light.svg"
                alt="Biowell Logo"
                className="h-24 w-auto hidden dark:block opacity-70"
              />
            </div>
            <div className="text-left md:text-right">
              <p className="font-medium tracking-wide text-sm">&copy; 2025 Biowell AI - Personal Smart Coach</p>
              <p className="text-text-light mt-2 tracking-wide text-sm">All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout