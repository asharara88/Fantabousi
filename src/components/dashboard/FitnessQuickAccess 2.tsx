import React from 'react';
import { Activity, Plus, Target, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

interface FitnessQuickAccessProps {
  variant?: 'compact' | 'expanded';
}

const FitnessQuickAccess: React.FC<FitnessQuickAccessProps> = ({ variant = 'compact' }) => {
  const quickActions = [
    {
      name: 'Dashboard',
      href: '/fitness',
      icon: <Activity className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      description: 'Overview & stats'
    },
    {
      name: 'Log Workout',
      href: '/fitness?tab=history',
      icon: <Plus className="w-4 h-4" />,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      description: 'Add new workout'
    },
    {
      name: 'Muscle Groups',
      href: '/fitness?tab=muscles',
      icon: <Target className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      description: 'Recovery status'
    },
    {
      name: 'Analytics',
      href: '/fitness?tab=analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      description: 'Progress trends'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={action.href}
              className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                  {action.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{action.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fitness Quick Access</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={action.href}
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800"
            >
              <div className="flex items-center mb-2">
                <div className={`p-3 rounded-lg ${action.color} mr-4`}>
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{action.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default FitnessQuickAccess;