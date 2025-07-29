import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
  className?: string;
}

/**
 * Accessible Toast Notification System
 * 
 * Features:
 * - Screen reader announcements
 * - Keyboard navigation
 * - Auto-dismiss with pause on hover/focus
 * - Persistent toasts for critical messages
 * - Action buttons
 * - Reduced motion support
 * - Focus management
 * - ARIA live regions
 */

// Toast context for global toast management
const ToastContext = React.createContext<{
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
} | null>(null);

// Individual Toast Component
const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  persistent = false,
  action,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Auto-dismiss timer
  useEffect(() => {
// sourcery skip: use-braces
    if (persistent || isPaused) return;

    timeoutRef.current = setTimeout(() => {
      handleDismiss();
    }, timeLeft);

    // Update progress bar
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 100;
        return newTime <= 0 ? 0 : newTime;
      });
    }, 100);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timeLeft, isPaused, persistent]);

  // Pause timer on hover/focus
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  // Dismiss toast
  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, isReducedMotion ? 0 : 300);
  }, [onDismiss, isReducedMotion]);

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleDismiss();
    }
  };

  // Icon mapping
  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = iconMap[type];

  // Color mapping
  const colorMap = {
    success: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200',
    warning: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
    info: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
  };

  const progressColorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const progressPercentage = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={toastRef}
          initial={isReducedMotion ? {} : { opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={isReducedMotion ? {} : { opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: isReducedMotion ? 0 : 0.3, type: "spring", stiffness: 100 }}
          className={`toast relative max-w-sm w-full border rounded-lg shadow-lg overflow-hidden ${colorMap[type]}`}
          role="alert"
          aria-live={type === 'error' ? 'assertive' : 'polite'}
          aria-atomic="true"
          tabIndex={0}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        >
          {/* Progress Bar */}
          {!persistent && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
              <motion.div
                ref={progressRef}
                className={`h-full ${progressColorMap[type]}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="mb-1 text-sm font-medium">{title}</h4>
                {message && (
                  <p className="text-sm leading-relaxed opacity-90">{message}</p>
                )}

                {/* Action Button */}
                {action && (
                  <div className="mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={action.onClick}
                      className="-ml-2 text-current hover:bg-current/10"
                    >
                      {action.label}
                    </Button>
                  </div>
                )}
              </div>

              {/* Dismiss Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="flex-shrink-0 w-8 h-8 p-0 -mt-1 -mr-1 text-current hover:bg-current/10"
                aria-label={`Dismiss ${type} notification: ${title}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Screen Reader Content */}
          <div className="sr-only">
            {type} notification: {title}. {message}
            {!persistent && ` Auto-dismissing in ${Math.ceil(timeLeft / 1000)} seconds.`}
            {action && ` Action available: ${action.label}.`}
            Press Escape to dismiss.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Container Component
const ToastContainer: React.FC<ToastContainerProps & { toasts: ToastProps[] }> = ({
  toasts,
  position = 'top-right',
  maxToasts = 5,
  className = ''
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  const displayedToasts = toasts.slice(-maxToasts);

  if (displayedToasts.length === 0) return null;

  return (
    <div
      className={`fixed z-50 space-y-2 ${positionClasses[position]} ${className}`}
      aria-label="Notifications"
      role="region"
    >
      <AnimatePresence mode="popLayout">
        {displayedToasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for using toasts
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider: React.FC<{ 
  children: React.ReactNode;
  containerProps?: ToastContainerProps;
}> = ({ children, containerProps }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onDismiss: () => removeToast(id)
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} {...containerProps} />
    </ToastContext.Provider>
  );
};

// Utility functions for common toast types
export const toast = {
  success: (title: string, message?: string, options?: Partial<ToastProps>) => ({
    title,
    message,
    type: 'success' as const,
    ...options
  }),
  
  error: (title: string, message?: string, options?: Partial<ToastProps>) => ({
    title,
    message,
    type: 'error' as const,
    persistent: true, // Errors should be persistent by default
    ...options
  }),
  
  warning: (title: string, message?: string, options?: Partial<ToastProps>) => ({
    title,
    message,
    type: 'warning' as const,
    ...options
  }),
  
  info: (title: string, message?: string, options?: Partial<ToastProps>) => ({
    title,
    message,
    type: 'info' as const,
    ...options
  })
};

// Example usage component
export const ToastExample: React.FC = () => {
  const { addToast } = useToast();

  const showSuccessToast = () => {
    addToast(toast.success(
      'Success!',
      'Your changes have been saved successfully.',
      {
        action: {
          label: 'View Details',
          onClick: () => console.log('View details clicked')
        }
      }
    ));
  };

  const showErrorToast = () => {
    addToast(toast.error(
      'Error occurred',
      'Failed to save your changes. Please try again.',
      {
        action: {
          label: 'Retry',
          onClick: () => console.log('Retry clicked')
        }
      }
    ));
  };

  const showWarningToast = () => {
    addToast(toast.warning(
      'Warning',
      'This action cannot be undone. Please proceed with caution.'
    ));
  };

  const showInfoToast = () => {
    addToast(toast.info(
      'Information',
      'New features are now available in your dashboard.'
    ));
  };

  return (
    <div className="space-x-2">
      <Button onClick={showSuccessToast} variant="outline">
        Success Toast
      </Button>
      <Button onClick={showErrorToast} variant="outline">
        Error Toast
      </Button>
      <Button onClick={showWarningToast} variant="outline">
        Warning Toast
      </Button>
      <Button onClick={showInfoToast} variant="outline">
        Info Toast
      </Button>
    </div>
  );
};

export default Toast;
