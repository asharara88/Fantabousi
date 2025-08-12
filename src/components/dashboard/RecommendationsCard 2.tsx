import React from 'react';
import { Card } from '../ui/Card';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
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

  return (
    <Card className="p-5">
      <div className="flex items-center mb-4">
        <Lightbulb className="w-5 h-5 text-primary mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personalized Recommendations</h3>
      </div>
      
      <motion.div 
        className="space-y-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {recommendations.map((recommendation) => (
          <motion.div 
            key={recommendation.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700"
            variants={item}
          >
            <div className="flex items-start mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(recommendation.priority)}`}>
                {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
              </span>
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">{recommendation.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{recommendation.description}</p>
            <Link 
              to={recommendation.actionLink}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
            >
              {recommendation.actionText}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};

export default RecommendationsCard;