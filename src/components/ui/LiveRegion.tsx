import React, { useEffect, useRef, useState } from 'react';

interface LiveRegionProps {
  level?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  busy?: boolean;
  children?: React.ReactNode;
  className?: string;
  clearOnUpdate?: boolean;
  delay?: number;
}

/**
 * Live Region Component for Dynamic Content Updates
 * Announces changes to screen readers while maintaining focus
 */
const LiveRegion: React.FC<LiveRegionProps> = ({
  level = 'polite',
  atomic = true,
  relevant = 'all',
  busy = false,
  children,
  className = '',
  clearOnUpdate = true,
  delay = 0
}) => {
  const regionRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<React.ReactNode>(children);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setContent(children);
      }, delay);
    } else {
      setContent(children);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [children, delay]);

  useEffect(() => {
    if (clearOnUpdate && regionRef.current && content) {
      // Clear and then set content to ensure announcement
      regionRef.current.textContent = '';
      requestAnimationFrame(() => {
        if (regionRef.current) {
          if (typeof content === 'string') {
            regionRef.current.textContent = content;
          }
        }
      });
    }
  }, [content, clearOnUpdate]);

  return (
    <div
      ref={regionRef}
      aria-live={level}
      aria-atomic={atomic}
      aria-relevant={relevant}
      aria-busy={busy}
      className={`sr-only ${className}`}
      role="status"
    >
      {content}
    </div>
  );
};

/**
 * Status Messages Component
 * Dedicated component for status messages and feedback
 */
interface StatusMessageProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible?: boolean;
  onDismiss?: () => void;
  autoHide?: boolean;
  hideDelay?: number;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  type = 'info',
  visible = true,
  onDismiss,
  autoHide = true,
  hideDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (autoHide && isVisible && hideDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, hideDelay, onDismiss]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    const baseStyles = 'p-4 rounded-md border';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200`;
      default:
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200`;
    }
  };

  const getAriaLevel = (): 'polite' | 'assertive' => {
    return type === 'error' ? 'assertive' : 'polite';
  };

  return (
    <div
      className={getTypeStyles()}
      role="alert"
      aria-live={getAriaLevel()}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="ml-4 text-current hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
            aria-label="Dismiss message"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Progress Announcer Component
 * Announces progress updates for long-running operations
 */
interface ProgressAnnouncerProps {
  progress: number;
  total: number;
  label?: string;
  announceInterval?: number;
  children?: React.ReactNode;
}

export const ProgressAnnouncer: React.FC<ProgressAnnouncerProps> = ({
  progress,
  total,
  label = 'Progress',
  announceInterval = 25, // Announce every 25% progress
  children
}) => {
  const [lastAnnouncedProgress, setLastAnnouncedProgress] = useState(0);
  const percentage = Math.round((progress / total) * 100);

  useEffect(() => {
    // Only announce at specific intervals to avoid overwhelming screen readers
    const progressThreshold = Math.floor(percentage / announceInterval) * announceInterval;
    
    if (progressThreshold > lastAnnouncedProgress && progressThreshold > 0) {
      setLastAnnouncedProgress(progressThreshold);
    }
  }, [percentage, announceInterval, lastAnnouncedProgress]);

  const getAnnouncementText = () => {
    if (percentage === 100) {
      return `${label} completed`;
    }
    if (lastAnnouncedProgress > 0) {
      return `${label} ${lastAnnouncedProgress}% complete`;
    }
    return '';
  };

  return (
    <>
      {children}
      <LiveRegion level="polite">
        {getAnnouncementText()}
      </LiveRegion>
    </>
  );
};

/**
 * Form Validation Announcer
 * Announces form validation errors and success messages
 */
interface FormValidationAnnouncerProps {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting?: boolean;
  submitStatus?: 'success' | 'error' | null;
  submitMessage?: string;
}

export const FormValidationAnnouncer: React.FC<FormValidationAnnouncerProps> = ({
  errors,
  touched,
  isSubmitting = false,
  submitStatus,
  submitMessage
}) => {
  const [announcedErrors, setAnnouncedErrors] = useState<string[]>([]);
  
  const currentErrors = Object.entries(errors)
    .filter(([field]) => touched[field])
    .map(([, error]) => error);

  useEffect(() => {
    const newErrors = currentErrors.filter(error => !announcedErrors.includes(error));
    
    if (newErrors.length > 0) {
      setAnnouncedErrors(prev => [...prev, ...newErrors]);
    }
  }, [currentErrors, announcedErrors]);

  const getErrorAnnouncement = () => {
    if (currentErrors.length === 0) return '';
    
    if (currentErrors.length === 1) {
      return `Form error: ${currentErrors[0]}`;
    }
    
    return `Form has ${currentErrors.length} errors: ${currentErrors.join(', ')}`;
  };

  const getSubmitAnnouncement = () => {
    if (isSubmitting) {
      return 'Submitting form...';
    }
    
    if (submitStatus === 'success') {
      return submitMessage || 'Form submitted successfully';
    }
    
    if (submitStatus === 'error') {
      return submitMessage || 'Form submission failed';
    }
    
    return '';
  };

  return (
    <>
      <LiveRegion level="assertive">
        {getErrorAnnouncement()}
      </LiveRegion>
      <LiveRegion level="polite">
        {getSubmitAnnouncement()}
      </LiveRegion>
    </>
  );
};

export default LiveRegion;
