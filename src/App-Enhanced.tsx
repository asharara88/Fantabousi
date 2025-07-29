import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Focus Management Imports
import FocusProvider from './components/FocusProvider';
import EnhancedNavigation from './components/layout/EnhancedNavigation';
import { initializeSkipLinks } from './utils/focusManagement';

// Your existing components
import DashboardPage from './components/pages/DashboardPage';
import FitnessPage from './components/pages/FitnessPage';
import NutritionPage from './components/pages/NutritionPage';
import SupplementsPage from './components/pages/SupplementsPage';
import BiohackingPage from './components/pages/BiohackingPage';

// Demo component for testing
import FocusManagementDemo from './components/FocusManagementDemo';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Layout component with enhanced navigation and accessibility
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // You'll get this from your auth system
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    // Your logout logic here
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Navigation */}
      <aside 
        className={`
          ${isSidebarCollapsed ? 'w-16' : 'w-64'} 
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          flex flex-col
        `}
      >
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BW</span>
            </div>
            {!isSidebarCollapsed && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                BioWell
              </h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <EnhancedNavigation
            variant="sidebar"
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            showLabels={!isSidebarCollapsed}
            collapsible={true}
          />
        </div>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="
              w-full flex items-center justify-center px-3 py-2 text-sm
              text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
              hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary/20
            "
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {!isSidebarCollapsed && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {/* This will be dynamically updated based on the current page */}
              <PageTitle />
            </h2>
            
            {/* User menu, notifications, etc. */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="
                  p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
                  hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-primary/20
                "
                aria-label="Open notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main 
          id="main-content" 
          className="flex-1 p-6 overflow-auto"
          tabIndex={-1}
        >
          {children}
        </main>

        {/* Footer */}
        <footer 
          id="footer" 
          className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4"
        >
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 BioWell. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-100">
                Privacy
              </a>
              <a href="/terms" className="hover:text-gray-900 dark:hover:text-gray-100">
                Terms
              </a>
              <a href="/accessibility" className="hover:text-gray-900 dark:hover:text-gray-100">
                Accessibility
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

/**
 * Component to dynamically show page titles
 */
const PageTitle: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/fitness':
        return 'Fitness';
      case '/fitness/workouts':
        return 'Workouts';
      case '/fitness/progress':
        return 'Fitness Progress';
      case '/fitness/goals':
        return 'Fitness Goals';
      case '/nutrition':
        return 'Nutrition';
      case '/nutrition/meals':
        return 'Meal Planning';
      case '/nutrition/diary':
        return 'Food Diary';
      case '/supplements':
        return 'Supplements';
      case '/supplements/stack':
        return 'My Stack';
      case '/supplements/store':
        return 'Supplement Store';
      case '/biohacking':
        return 'Biohacking';
      case '/focus-demo':
        return 'Focus Management Demo';
      default:
        return 'BioWell';
    }
  };

  const title = getPageTitle(location.pathname);

  // Update document title for accessibility
  useEffect(() => {
    document.title = `${title} - BioWell`;
  }, [title]);

  return <span>{title}</span>;
};

/**
 * Main App Component with Focus Management
 */
const App: React.FC = () => {
  useEffect(() => {
    // Initialize skip links on app start
    initializeSkipLinks();

    // Set up global accessibility features
    document.documentElement.lang = 'en';
    document.documentElement.setAttribute('data-theme', 'light'); // You can make this dynamic
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <FocusProvider 
          enableSkipLinks={true} 
          enableAnnouncements={true}
        >
          <Layout>
            <Routes>
              {/* Main Application Routes */}
              <Route path="/" element={<DashboardPage />} />
              
              {/* Fitness Routes */}
              <Route path="/fitness" element={<FitnessPage />} />
              <Route path="/fitness/workouts" element={<div>Workouts Page</div>} />
              <Route path="/fitness/progress" element={<div>Progress Page</div>} />
              <Route path="/fitness/goals" element={<div>Goals Page</div>} />
              
              {/* Nutrition Routes */}
              <Route path="/nutrition" element={<NutritionPage />} />
              <Route path="/nutrition/meals" element={<div>Meal Planning Page</div>} />
              <Route path="/nutrition/diary" element={<div>Food Diary Page</div>} />
              
              {/* Supplements Routes */}
              <Route path="/supplements" element={<SupplementsPage />} />
              <Route path="/supplements/stack" element={<div>My Stack Page</div>} />
              <Route path="/supplements/store" element={<div>Store Page</div>} />
              
              {/* Biohacking Route */}
              <Route path="/biohacking" element={<BiohackingPage />} />
              
              {/* Focus Management Demo Route */}
              <Route path="/focus-demo" element={<FocusManagementDemo />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </FocusProvider>
      </Router>
    </QueryClientProvider>
  );
};

/**
 * 404 Not Found Page
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <a 
        href="/"
        className="
          px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90
          focus:outline-none focus:ring-2 focus:ring-primary/20
          transition-colors
        "
      >
        Go to Dashboard
      </a>
    </div>
  );
};

export default App;
