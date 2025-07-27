import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import Navigation from '../layout/Navigation';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
  onSignOut?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  isOpen, 
  onClose, 
  isLoggedIn = false,
  onSignOut
}) => {
  const location = useLocation();

  // Close mobile nav when route changes
  React.useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
    >
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button 
            onClick={onClose}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 touch-target min-h-[44px] min-w-[44px]"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-4">
              Main Menu
            </h3>
           {isOpen && <Navigation isMobile onItemClick={onClose} type="main" />}
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-4">
              Account
            </h3>
           {isOpen && <Navigation isMobile onItemClick={onClose} type="account" />}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col space-y-4">
            {isLoggedIn ? (
              <button 
                onClick={() => {
                  onSignOut?.();
                  onClose();
                }}
                className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-900 dark:text-white touch-target min-h-[44px]"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center justify-center w-full px-4 py-3 bg-primary text-white rounded-lg font-medium touch-target min-h-[44px]"
                  onClick={onClose}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-900 dark:text-white touch-target min-h-[44px]"
                  onClick={onClose}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;