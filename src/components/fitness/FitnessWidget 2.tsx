import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { fitnessApi, FitnessSummary } from '../../api/fitnessApi';
import { motion, AnimatePresence } from 'framer-motion';

interface FitnessWidgetProps {
  expanded?: boolean;
  onToggle?: () => void;
}

const FitnessWidget: React.FC<FitnessWidgetProps> = ({ expanded = false, onToggle }) => {
  const [summary, setSummary] = useState<FitnessSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFitnessSummary();
  }, []);

  const loadFitnessSummary = async () => {
    setIsLoading(true);
    try {
      const data = await fitnessApi.getFitnessSummary('demo-user-id', 7);
      setSummary(data);
    } catch (error) {
      console.error('Error loading fitness summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30 mr-3">
              <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fitness</h3>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Compact View */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {summary?.totalWorkouts || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">workouts</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Calories</p>
            <p className="text-lg font-bold text-red-500">
              {summary?.totalCaloriesBurned || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">burned</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
            <p className="text-lg font-bold text-green-500">
              {Math.round((summary?.totalActiveMinutes || 0) / 60)}h
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">this week</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            as={Link}
            to="/fitness"
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Activity className="w-4 h-4 mr-1" />
            Dashboard
          </Button>
          <Button
            as={Link}
            to="/fitness?tab=history"
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-1" />
            History
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              {/* Recent Activity */}
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Activity</h4>
              <div className="space-y-2 mb-4">
                {summary?.dailyMetrics.slice(-3).reverse().map((metric) => (
                  <div key={metric.date} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Date(metric.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600 dark:text-orange-400">{metric.workouts} workouts</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 dark:text-gray-300">{metric.caloriesBurned} cal</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extended Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  as={Link}
                  to="/fitness?tab=muscles"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Muscle Groups
                </Button>
                <Button
                  as={Link}
                  to="/fitness?tab=analytics"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Analytics
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default FitnessWidget;