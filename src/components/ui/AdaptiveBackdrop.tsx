import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdaptiveBackdropProps {
  children?: React.ReactNode;
  className?: string;
  overlay?: boolean;
  animationSpeed?: 'slow' | 'medium' | 'fast';
}

const AdaptiveBackdrop: React.FC<AdaptiveBackdropProps> = ({ 
  children, 
  className = '', 
  overlay = true,
  animationSpeed = 'slow'
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const isDarkMode = htmlElement.classList.contains('dark') || 
                        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkMode);
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case 'fast': return 15;
      case 'medium': return 25;
      case 'slow': return 35;
      default: return 25;
    }
  };

  const animationDuration = getAnimationDuration();

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Background Container */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Dark Theme Background */}
              <div 
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c20-20 60-20 60 20s-40 40-60 20z' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.1'/%3E%3Cpath d='M40 60c20-20 60-20 60 20s-40 40-60 20z' fill='none' stroke='%2300ffff' stroke-width='0.3' opacity='0.2'/%3E%3Cpath d='M60 10c20-20 60-20 60 20s-40 40-60 20z' fill='none' stroke='%2300ff88' stroke-width='0.4' opacity='0.15'/%3E%3C/svg%3E")`
                }}
              />
              
              {/* Animated Wave Elements - Dark Theme */}
              <motion.div
                className="absolute inset-0 opacity-40"
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.3) 50%, rgba(139, 92, 246, 0.3) 100%)',
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(59, 130, 246, 0.3) 100%)',
                    'linear-gradient(225deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(16, 185, 129, 0.3) 100%)',
                    'linear-gradient(315deg, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.3) 50%, rgba(139, 92, 246, 0.3) 100%)'
                  ]
                }}
                transition={{
                  duration: animationDuration,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Floating Wave Paths - Dark */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full overflow-hidden"
                animate={{
                  transform: ['translateX(-100px) rotate(0deg)', 'translateX(100px) rotate(360deg)']
                }}
                transition={{
                  duration: animationDuration * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <svg className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20" viewBox="0 0 400 400">
                  <path
                    d="M50 200 Q200 50 350 200 T650 200"
                    fill="none"
                    stroke="url(#blueGradient)"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                      <stop offset="50%" stopColor="rgba(16, 185, 129, 0.8)" />
                      <stop offset="100%" stopColor="rgba(139, 92, 246, 0.8)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 opacity-15"
                animate={{
                  transform: ['translateX(100px) rotate(360deg)', 'translateX(-100px) rotate(0deg)']
                }}
                transition={{
                  duration: animationDuration * 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <path
                    d="M350 200 Q200 350 50 200 T-250 200"
                    fill="none"
                    stroke="url(#greenGradient)"
                    strokeWidth="4"
                    className="drop-shadow-lg"
                  />
                  <defs>
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(16, 185, 129, 0.9)" />
                      <stop offset="50%" stopColor="rgba(34, 197, 94, 0.9)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0.9)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Light Theme Background */}
              <div 
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-50 via-cyan-50 to-emerald-50"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c20-20 60-20 60 20s-40 40-60 20z' fill='none' stroke='%23000000' stroke-width='0.3' opacity='0.05'/%3E%3Cpath d='M40 60c20-20 60-20 60 20s-40 40-60 20z' fill='none' stroke='%2306b6d4' stroke-width='0.2' opacity='0.1'/%3E%3Cpath d='M60 10c20-20 60-20 60 20s-40 40-60 20z' fill='none' stroke='%2310b981' stroke-width='0.25' opacity='0.08'/%3E%3C/svg%3E")`
                }}
              />
              
              {/* Animated Wave Elements - Light Theme */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(6, 182, 212, 0.2) 0%, rgba(16, 185, 129, 0.2) 50%, rgba(139, 92, 246, 0.2) 100%)',
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(6, 182, 212, 0.2) 100%)',
                    'linear-gradient(225deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 50%, rgba(16, 185, 129, 0.2) 100%)',
                    'linear-gradient(315deg, rgba(6, 182, 212, 0.2) 0%, rgba(16, 185, 129, 0.2) 50%, rgba(139, 92, 246, 0.2) 100%)'
                  ]
                }}
                transition={{
                  duration: animationDuration,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Floating Wave Paths - Light */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full overflow-hidden"
                animate={{
                  transform: ['translateX(-100px) rotate(0deg)', 'translateX(100px) rotate(360deg)']
                }}
                transition={{
                  duration: animationDuration * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <svg className="absolute top-1/4 left-1/4 w-96 h-96 opacity-25" viewBox="0 0 400 400">
                  <path
                    d="M50 200 Q200 50 350 200 T650 200"
                    fill="none"
                    stroke="url(#lightBlueGradient)"
                    strokeWidth="2"
                    className="drop-shadow-sm"
                  />
                  <defs>
                    <linearGradient id="lightBlueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(6, 182, 212, 0.6)" />
                      <stop offset="50%" stopColor="rgba(16, 185, 129, 0.6)" />
                      <stop offset="100%" stopColor="rgba(139, 92, 246, 0.6)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 opacity-20"
                animate={{
                  transform: ['translateX(100px) rotate(360deg)', 'translateX(-100px) rotate(0deg)']
                }}
                transition={{
                  duration: animationDuration * 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <path
                    d="M350 200 Q200 350 50 200 T-250 200"
                    fill="none"
                    stroke="url(#lightGreenGradient)"
                    strokeWidth="3"
                    className="drop-shadow-sm"
                  />
                  <defs>
                    <linearGradient id="lightGreenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(16, 185, 129, 0.7)" />
                      <stop offset="50%" stopColor="rgba(34, 197, 94, 0.7)" />
                      <stop offset="100%" stopColor="rgba(6, 182, 212, 0.7)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glassmorphism Overlay */}
        {overlay && (
          <motion.div 
            className="absolute inset-0 backdrop-blur-[0.5px] bg-white/5 dark:bg-black/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        )}

        {/* Subtle Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AdaptiveBackdrop;
