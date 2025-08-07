/* trunk-ignore-all(prettier) */
import React from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import MinimalNav from './MinimalNav'
import MobileNav from '../ui/MobileNav'
import { createClient } from '@supabase/supabase-js'
import { BIOWELL_LOGOS } from './src/constants/branding'

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
  const navigate = useNavigate()

  // Check for user session on mount
  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      {/* Skip Links for Accessibility */}
      <div className="skip-links">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <a href="#main-navigation" className="skip-link">
          Skip to navigation
        </a>
      </div>
      
      {/* Header */}
      <div className="relative" id="main-navigation">
        <MinimalNav />
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        isLoggedIn={!!user}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main id="main-content" className="flex-1 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-gray-800 transition-colors duration-300 border-t gradient-subtle border-gray-200/30 dark:border-gray-700/30 dark:text-white">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between md:flex-row">
            <div className="flex items-center mb-5 text-left md:mb-0">
              <img 
                src={BIOWELL_LOGOS.LIGHT_THEME}
                alt="Biowell Logo" 
                className="w-auto h-24 dark:hidden opacity-70" 
              />
              <img 
                src={BIOWELL_LOGOS.DARK_THEME}
                alt="Biowell Logo" 
                className="hidden w-auto h-24 dark:block opacity-70" 
              />
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm font-medium tracking-wide">&copy; 2025 Biowell AI - Personal Digital Health Coach</p>
              <p className="mt-2 text-sm tracking-wide text-text-light">All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout