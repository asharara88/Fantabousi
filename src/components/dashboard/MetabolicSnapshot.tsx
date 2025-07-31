import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MetabolicSnapshotProps {
  averageGlucose: number;
  timeInRange: number;
  currentGlucose: number;
  trend: 'rising' | 'falling' | 'stable';
}

const MetabolicSnapshot: React.FC<MetabolicSnapshotProps> = ({
  averageGlucose,
  timeInRange,
  currentGlucose,
  trend
}) => {
  const getGlucoseStatus = (glucose: number) => {
    if (glucose < 70) return { status: 'Low', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
    if (glucose > 180) return { status: 'High', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' };
    return { status: 'Normal', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'falling':
        return <motion.div
          animate={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <TrendingUp className="w-4 h-4 text-blue-500" />
        </motion.div>;
      case 'stable':
        return <div className="w-4 h-4 border-t-2 border-green-500"></div>;
      default:
        return null;
    }
  };

  const status = getGlucoseStatus(currentGlucose);

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3">
            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Metabolic Health
            </h3>
                        <p className="text-sm text-muted">
              Average glucose today
            </p>
          </div>
        </div>
        <Link 
          to="/metabolism" 
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          View Details →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-muted">Current</p>
          <div className="flex items-center justify-center">
            <p className={`text-xl font-bold ${status.color}`}>
              {currentGlucose}
            </p>
            <div className="ml-2">
              {getTrendIcon()}
            </div>
          </div>
          <p className="text-xs text-disabled">mg/dL</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-muted">Time in Range</p>
          <p className="text-xl font-bold text-green-500">
            {timeInRange}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">70-180 mg/dL</p>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">24hr Average</p>
          <p className="font-medium text-gray-900 dark:text-white">{averageGlucose} mg/dL</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 dark:text-gray-400">Status</p>
          <p className={`font-medium ${status.color}`}>{status.status}</p>
        </div>
      </div>

      {/* Mini glucose chart preview */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Last 6 hours</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Tap to view full chart</p>
        </div>
        <div className="h-8 flex items-end space-x-1">
          {Array.from({ length: 12 }, (_, i) => {
            const height = Math.random() * 20 + 10;
            const isHigh = height > 25;
            const isLow = height < 15;
            const barId = `${Date.now()}-${Math.random()}-${i}`;
            
            const getBarColor = () => {
              if (isHigh) return 'bg-orange-400';
              if (isLow) return 'bg-red-400';
              return 'bg-green-400';
            };
            
            return (
              <motion.div
                key={barId}
                className={`flex-1 rounded-sm ${getBarColor()}`}
                style={{ height: `${height}px` }}
                initial={{ height: 0 }}
                animate={{ height: `${height}px` }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default MetabolicSnapshot;