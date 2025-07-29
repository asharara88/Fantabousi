import React from 'react';
import { Card } from '../ui/Card';
import { Pill, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  taken: boolean;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'bedtime';
}

interface SupplementTrackerProps {
  supplements: Supplement[];
  onMarkTaken: (id: string) => void;
}

const SupplementTracker: React.FC<SupplementTrackerProps> = ({ supplements, onMarkTaken }) => {
  const getTimeOfDayColor = (timeOfDay: Supplement['timeOfDay']) => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'afternoon':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'evening':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'bedtime':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Group supplements by time of day
  const groupedSupplements = supplements.reduce((acc, supplement) => {
    if (!acc[supplement.timeOfDay]) {
      acc[supplement.timeOfDay] = [];
    }
    acc[supplement.timeOfDay].push(supplement);
    return acc;
  }, {} as Record<Supplement['timeOfDay'], Supplement[]>);

  // Order of time of day
  const timeOfDayOrder: Supplement['timeOfDay'][] = ['morning', 'afternoon', 'evening', 'bedtime'];

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-primary/10 mr-3">
          <Pill className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Today's Supplements</h3>
      </div>
      
      <motion.div 
        className="space-y-7"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {timeOfDayOrder.map((timeOfDay) => {
          if (!groupedSupplements[timeOfDay] || groupedSupplements[timeOfDay].length === 0) {
            return null;
          }
          
          return (
            <div key={timeOfDay}>
              <div className="flex items-center mb-4">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getTimeOfDayColor(timeOfDay)}`}>
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  <span className="tracking-wide">{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {groupedSupplements[timeOfDay].map((supplement) => (
                  <motion.div 
                    key={supplement.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      supplement.taken
                        ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/10' 
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:shadow-md'
                    } transition-all duration-300`}
                    variants={item}
                  >
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        supplement.taken 
                          ? 'text-green-800 dark:text-green-300' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {supplement.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {supplement.dosage} • {supplement.timing}
                      </p>
                    </div>
                    
                    {supplement.taken ? (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Check className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Taken</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => onMarkTaken(supplement.id)}
                        className="text-xs bg-primary hover:bg-primary-dark"
                      >
                        Mark as Taken
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>
    </Card>
  );
};

export default SupplementTracker;