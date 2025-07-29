import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import ProgressRing from './ProgressRing';

export interface MetricScore {
  name: string;
  score: number;
  weight: number;
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface BWScoreCardProps {
  metrics: MetricScore[];
  onMetricClick?: (metricName: string) => void;
}

const BWScoreCard: React.FC<BWScoreCardProps> = ({ metrics, onMetricClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate the weighted BW score
  const calculateBWScore = () => {
    const totalWeight = metrics.reduce((sum, metric) => sum + metric.weight, 0);
    const weightedScore = metrics.reduce((sum, metric) => sum + (metric.score * metric.weight), 0);
    return Math.round(weightedScore / totalWeight);
  };

  const bwScore = calculateBWScore();

  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'hsl(142, 76%, 36%)'; // Green for good
    if (score >= 60) return 'hsl(48, 96%, 53%)';  // Yellow for moderate
    return 'hsl(0, 84%, 60%)';                    // Red for poor
  };

  // Get score label
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-7 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">BW Score</h3>
          <div className="flex items-center">
            <button 
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              aria-label="Information about BW Score"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{bwScore}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">/100</span>
            </div>
            <p className="text-sm font-medium mt-1.5" style={{ color: getScoreColor(bwScore) }}>
              {getScoreLabel(bwScore)}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <ProgressRing 
              progress={bwScore} 
              size={120}
              color={getScoreColor(bwScore)}
              animated
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{bwScore}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 tracking-wide">BW Score</p>
              </div>
            </ProgressRing>
          </div>
        </div>
        
        <button 
          className="flex items-center justify-center w-full py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show Details
            </>
          )}
        </button>
      </div>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-7 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5 tracking-wide">Score Breakdown</h4>
              <div className="space-y-4">
                {metrics.map((metric) => (
                  <div 
                    key={metric.name}
                    className={cn(
                      "cursor-pointer p-4 rounded-xl transition-all",
                      "hover:bg-gray-50 dark:hover:bg-gray-800",
                      "border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
                      "hover:shadow-sm"
                    )}
                    onClick={() => onMetricClick?.(metric.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={cn(
                          "p-2 rounded-full mr-3",
                         "bg-opacity-20 dark:bg-opacity-20"
                        )} style={{ backgroundColor: metric.color, color: metric.color }}>
                        <span className="text-current">{metric.icon}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white tracking-wide">{metric.name}</span>
                      </div>
                      <span className="font-bold" style={{ color: getScoreColor(metric.score) }}>{metric.score}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <motion.div 
                        className="h-2.5 rounded-full"
                        style={{ backgroundColor: metric.color }}
                        initial={{ width: "0%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        animate={{ width: `${metric.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 tracking-wide leading-relaxed">{metric.description}</p>
                  </div>
                ))}
              </div>
               
               {/* Add total weighted score explanation */}
               <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                 <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                   About Your BW Score
                 </h4>
                 <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                   Your BioWell Score is a weighted average of key health metrics. Some factors like Sleep and Fitness have higher impact (1.5x weight) while others like Hydration have lower impact (0.8x weight).
                 </p>
                 <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Improve your score by focusing on the metrics with the lowest values or the highest weights to see the biggest impact on your overall health.
                 </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default BWScoreCard;