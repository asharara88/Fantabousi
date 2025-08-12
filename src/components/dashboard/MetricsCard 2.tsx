import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'tertiary' | 'purple' | 'yellow';
  expandedContent?: React.ReactNode;
  isExpanded?: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  expandedContent,
  isExpanded = false,
}) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 text-primary',
    secondary: 'from-secondary/20 to-secondary/5 text-secondary',
    tertiary: 'from-tertiary/20 to-tertiary/5 text-tertiary',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-500',
    yellow: 'from-yellow-500/20 to-yellow-500/5 text-yellow-500',
  };

  const changeColor = change.type === 'increase' 
    ? 'text-green-600 dark:text-green-400' 
    : change.type === 'decrease' 
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-600 dark:text-gray-400';

  return (
    <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
      <div
        className={cn(
          "p-6 transition-all duration-300",
          colorClasses[color]
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">{value}</p>
            <div className={`flex items-center mt-1 ${changeColor}`}>
              {change.type === 'increase' ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : change.type === 'decrease' ? (
                <ArrowDown className="w-4 h-4 mr-1" />
              ) : null}
              <span className="text-sm font-medium">{Math.abs(change.value)}%</span>
            </div>
          </div>
          <div className={`p-3.5 rounded-xl bg-white dark:bg-gray-700 shadow-md ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
      
      {/* Expandable Content */}
      {expandedContent && (
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 pt-0 border-t border-gray-100 dark:border-gray-700">
            {expandedContent}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MetricsCard;