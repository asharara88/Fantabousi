import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap, useFocusManagement } from '../../utils/focusManagement';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  initialFocus?: string;
  returnFocus?: boolean;
  description?: string;
  role?: 'dialog' | 'alertdialog';
}

/**
 * Accessible Modal Component with Focus Management
 * Implements WCAG 2.1 guidelines for modal dialogs
 */
const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  initialFocus,
  returnFocus = true,
  description,
  role = 'dialog'
}) => {
  const { saveFocus, restoreFocus, announce } = useFocusManagement();
  const [mounted, setMounted] = useState(false);
  
  // Focus trap configuration
  const focusTrapRef = useFocusTrap(isOpen, {
    initialFocus: initialFocus,
    escapeDeactivates: closeOnEscape,
    clickOutsideDeactivates: false, // We handle this manually
    returnFocusOnDeactivate: returnFocus
  });

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalId = useRef(`modal-${Math.random().toString(36).substr(2, 9)}`);
  const titleId = `${modalId.current}-title`;
  const descId = description ? `${modalId.current}-description` : undefined;

  // Handle mount/unmount
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle modal open/close side effects
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      if (returnFocus) {
        saveFocus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Announce modal opening
      announce(`Dialog opened: ${title}`, 'polite');
      
      // Set ARIA attributes
      document.body.setAttribute('aria-hidden', 'true');
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Remove ARIA attributes
      document.body.removeAttribute('aria-hidden');
      
      // Restore focus if modal was open
      if (returnFocus) {
        setTimeout(() => {
          if (!restoreFocus()) {
            // Fallback: focus the document body
            document.body.focus();
          }
        }, 100);
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.removeAttribute('aria-hidden');
    };
  }, [isOpen, title, announce, saveFocus, restoreFocus, returnFocus]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && isOpen) {
        event.preventDefault();
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape]);

  const handleClose = () => {
    announce('Dialog closed', 'polite');
    onClose();
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      handleClose();
    }
  };

  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4'
    };
    return sizeMap[size];
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
          >
            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                ref={focusTrapRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={`
                  w-full ${getSizeClasses()} 
                  bg-white dark:bg-gray-800 
                  rounded-lg shadow-xl 
                  focus:outline-none focus:ring-2 focus:ring-primary/20
                  ${className}
                `}
                role={role}
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descId}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 
                    id={titleId}
                    className="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    {title}
                  </h2>
                  
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={handleClose}
                      className="
                        p-2 text-gray-400 hover:text-gray-600 
                        hover:bg-gray-100 dark:hover:bg-gray-700 
                        rounded-md transition-colors
                        focus:outline-none focus:ring-2 focus:ring-primary/20
                      "
                      aria-label="Close dialog"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Description */}
                {description && (
                  <div 
                    id={descId}
                    className="px-6 pt-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {description}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {children}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default AccessibleModal;
