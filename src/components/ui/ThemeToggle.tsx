import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      case 'auto':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getLabel = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'auto':
        return 'Auto';
      default:
        return 'Auto';
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-white/20 dark:bg-black/30 backdrop-blur-md border border-white/30 dark:border-gray-700/50 rounded-full shadow-lg hover:bg-white/30 dark:hover:bg-black/40 transition-all duration-300 text-gray-800 dark:text-white"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      title={`Current theme: ${getLabel(theme)} - Click to switch`}
      aria-label={`Switch theme from ${getLabel(theme)}`}
    >
      {getIcon(theme)}
      <span className="hidden sm:inline text-sm font-medium">{getLabel(theme)}</span>
    </motion.button>
  );
};

export default ThemeToggle;
