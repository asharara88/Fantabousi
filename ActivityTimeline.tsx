import React from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { Pill, Utensils, Activity, Moon, Heart, Droplet } from 'lucide-react';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  type: 'supplement' | 'meal' | 'workout' | 'sleep' | 'health' | 'water';
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events }) => {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'supplement':
        return <Pill className="w-4 h-4" />;
      case 'meal':
        return <Utensils className="w-4 h-4" />;
      case 'workout':
        return <Activity className="w-4 h-4" />;
      case 'sleep':
        return <Moon className="w-4 h-4" />;
      case 'health':
        return <Heart className="w-4 h-4" />;
      case 'water':
        return <Droplet className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'supplement':
        return 'bg-primary text-white';
      case 'meal':
        return 'bg-secondary text-white';
      case 'workout':
        return 'bg-tertiary text-white';
      case 'sleep':
        return 'bg-purple-500 text-white';
      case 'health':
        return 'bg-red-500 text-white';
      case 'water':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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

  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Today's Activity</h3>
      
      <motion.div 
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {events.map((event) => (
          <motion.div 
            key={event.id}
            className="flex items-start group"
            variants={item}
          >
            <div className="flex flex-col items-center mr-4">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {event.time}
              </div>
              <div className="h-full w-px bg-gray-200 dark:bg-gray-700 my-2 group-hover:bg-primary transition-colors duration-300"></div>
            </div>
            
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md p-3 border border-gray-100 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};

export default ActivityTimeline;