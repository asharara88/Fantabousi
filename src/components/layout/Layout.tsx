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
        
        // If no user and not on auth pages, redirect to login
        if (!data.user) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      if (event === 'SIGNED_OUT' || !session?.user) {
        navigate('/login');
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
      {/* Header */}
      <div className="relative">
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
      <main className="flex-1 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="gradient-subtle border-t border-gray-200/30 dark:border-gray-700/30 text-gray-800 dark:text-white transition-colors duration-300">
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