import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor, Zap, Wifi, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    setIsStandalone(isStandaloneMode || isIOSStandalone);
    setIsIOS(isIOSDevice);
    setIsInstalled(isStandaloneMode || isIOSStandalone);

    // Listen for the install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after user has used the app for a bit
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-prompt-dismissed')) {
          setShowPrompt(true);
        }
      }, 30000); // Show after 30 seconds
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA installation');
      } else {
        console.log('User dismissed PWA installation');
        localStorage.setItem('pwa-prompt-dismissed', 'true');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const benefits = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Lightning Fast',
      description: 'Instant loading, even offline'
    },
    {
      icon: <Wifi className="w-5 h-5" />,
      title: 'Works Offline',
      description: 'Access your health data anywhere'
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Smart Notifications',
      description: 'Get health reminders and insights'
    },
    {
      icon: isIOS ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />,
      title: 'Native Experience',
      description: 'Feels like a native mobile app'
    }
  ];

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Card className="max-w-md w-full bg-white dark:bg-gray-900 p-6 relative">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Install Biowell AI
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Get the full app experience with enhanced features and offline access
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-primary">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {isIOS ? (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">
                    Install on iOS:
                  </h3>
                  <ol className="text-blue-800 dark:text-blue-200 text-xs space-y-1">
                    <li>1. Tap the share button <span className="font-mono">⬆️</span> in Safari</li>
                    <li>2. Scroll down and tap "Add to Home Screen"</li>
                    <li>3. Tap "Add" to install Biowell AI</li>
                  </ol>
                </div>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="w-full"
                >
                  Got it!
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleInstallClick}
                  className="flex-1"
                  disabled={!deferredPrompt}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Manual install button component
export const PWAInstallButton: React.FC<{ 
  variant?: 'default' | 'minimal';
  className?: string;
}> = ({ variant = 'default', className = '' }) => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    setIsInstalled(isStandaloneMode || isIOSStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (isInstalled || !canInstall) return null;

  const handleClick = () => {
    const event = new CustomEvent('pwa-install-requested');
    window.dispatchEvent(event);
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors ${className}`}
        title="Install Biowell AI"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Install App</span>
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );
};

export default PWAInstallPrompt;
