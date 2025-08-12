import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Zap, Activity } from 'lucide-react';
import { BundleAnalyzer } from '../../utils/bundle-analyzer';
import { PerformantCard } from './PerformantComponents';

interface PerformanceMetrics {
  bundleSize: number;
  loadTime: number;
  memoryUsage: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      // Analyze performance after a delay
      setTimeout(() => {
        const bundleAnalysis = BundleAnalyzer.analyzeBundlePerformance();
        const memoryInfo = BundleAnalyzer.monitorMemoryUsage();
        
        setMetrics({
          bundleSize: bundleAnalysis.totalFiles,
          loadTime: performance.now(),
          memoryUsage: memoryInfo ? memoryInfo.used / 1024 / 1024 : 0,
          coreWebVitals: {
            lcp: 0, // Will be updated by observers
            fid: 0,
            cls: 0
          }
        });
      }, 2000);
    }
  }, []);

  // Keyboard shortcut to toggle dashboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (process.env.NODE_ENV !== 'development' || !isVisible || !metrics) {
    return null;
  }

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-500';
    if (value <= thresholds[1]) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 z-50 w-80"
    >
      <PerformantCard className="bg-black/90 text-white backdrop-blur-md border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Performance Monitor
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Bundle Size */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Bundle Files</span>
            <span className={`text-sm font-medium ${getPerformanceColor(metrics.bundleSize, [50, 100])}`}>
              {metrics.bundleSize}
            </span>
          </div>

          {/* Load Time */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Load Time</span>
            <span className={`text-sm font-medium ${getPerformanceColor(metrics.loadTime, [2000, 4000])}`}>
              {Math.round(metrics.loadTime)}ms
            </span>
          </div>

          {/* Memory Usage */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Memory Usage</span>
            <span className={`text-sm font-medium ${getPerformanceColor(metrics.memoryUsage, [50, 100])}`}>
              {Math.round(metrics.memoryUsage)}MB
            </span>
          </div>

          {/* Core Web Vitals */}
          <div className="border-t border-gray-700 pt-3">
            <h4 className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Core Web Vitals
            </h4>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-gray-400">LCP</div>
                <div className={getPerformanceColor(metrics.coreWebVitals.lcp, [2500, 4000])}>
                  {metrics.coreWebVitals.lcp || '--'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">FID</div>
                <div className={getPerformanceColor(metrics.coreWebVitals.fid, [100, 300])}>
                  {metrics.coreWebVitals.fid || '--'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">CLS</div>
                <div className={getPerformanceColor(metrics.coreWebVitals.cls * 1000, [100, 250])}>
                  {metrics.coreWebVitals.cls || '--'}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="border-t border-gray-700 pt-3">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-gray-400">
                Press Ctrl+Shift+P to toggle
              </span>
            </div>
          </div>
        </div>
      </PerformantCard>
    </motion.div>
  );
};

export default PerformanceDashboard;
