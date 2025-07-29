import React from 'react';
import { Card } from '../ui/Card';
import { Target, Check, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Goal {
  id: string;
  title: string;
  progress: number;
  dueDate?: string;
  status: 'on-track' | 'at-risk' | 'completed';
}

interface GoalsProgressProps {
  goals: Goal[];
}

const GoalsProgress: React.FC<GoalsProgressProps> = ({ goals }) => {
  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'on-track':
        return <Clock className="w-4 h-4" />;
      case 'at-risk':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center mb-4">
        <Target className="w-5 h-5 text-primary mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goals Progress</h3>
      </div>
      
      <div className="space-y-4">
        {goals.map((goal) => (
          <div 
            key={goal.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
              <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(goal.status)}`}>
                {getStatusIcon(goal.status)}
                <span className="ml-1">{goal.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </span>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="h-2 rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            
            {goal.dueDate && (
              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Due: {goal.dueDate}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GoalsProgress;