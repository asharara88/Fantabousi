import React from 'react';
import { motion } from 'framer-motion';
import LiveTimeDisplay from '../ui/LiveTimeDisplay';

const LiveTimeDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-light text-gray-900 dark:text-gray-100">
            Live Time Display
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Elegant date/time display with live bedtime countdown featuring 2026 aesthetic: 
            ultra-minimal, glass morphism, and premium spacing.
          </p>
        </motion.div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Full Variant */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              Full Display
            </h2>
            <LiveTimeDisplay 
              variant="full" 
              showBedtimeCountdown={true}
              bedtimeHour={23}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Perfect for dashboard heroes or main wellness displays
            </p>
          </motion.div>

          {/* Default Variant */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              Default Display
            </h2>
            <LiveTimeDisplay 
              variant="default" 
              showBedtimeCountdown={true}
              bedtimeHour={23}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ideal for sidebars or card layouts
            </p>
          </motion.div>

          {/* Compact Variant */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              Compact Display
            </h2>
            <LiveTimeDisplay 
              variant="compact" 
              showBedtimeCountdown={true}
              bedtimeHour={23}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Great for navigation bars or minimal interfaces
            </p>
          </motion.div>

          {/* Without Bedtime Countdown */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              Time Only
            </h2>
            <LiveTimeDisplay 
              variant="default" 
              showBedtimeCountdown={false}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Clean time display without sleep tracking
            </p>
          </motion.div>
        </div>

        {/* Implementation Examples */}
        <motion.div 
          className="mt-16 p-8 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-6">
            Usage Examples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Code Example 1 */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Dashboard Hero
              </h3>
              <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono">
{`<LiveTimeDisplay 
  variant="full"
  showBedtimeCountdown={true}
  bedtimeHour={23}
  className="w-full"
/>`}
                </pre>
              </div>
            </div>

            {/* Code Example 2 */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Navigation Bar
              </h3>
              <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono">
{`<LiveTimeDisplay 
  variant="compact"
  showBedtimeCountdown={true}
  bedtimeHour={22}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Design Features */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">✨</span>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              Glass Morphism
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Translucent backgrounds with subtle blur effects
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">⏰</span>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              Live Updates
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time countdown and time display
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">🎯</span>
            </div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              2026 Aesthetic
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ultra-minimal with premium spacing
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveTimeDemo;
