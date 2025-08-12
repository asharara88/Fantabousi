import React from 'react';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import ProgressRing from './ProgressRing';

interface HealthScoreCardProps {
  score: number;
  previousScore: number;
  insights: string[];
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ score, previousScore, insights }) => {
  const scoreDifference = score - previousScore;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white tracking-tight">Legacy Health Score</h3>
      
      <div className="flex items-center justify-between mb-7">
        <div className="flex-1">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{score}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">/100</span>
          </div>
          
          <div className={`flex items-center mt-1 ${
            scoreDifference > 0 
              ? 'text-green-600 dark:text-green-400' 
              : scoreDifference < 0 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-600 dark:text-gray-400'
          }`}>
            {scoreDifference > 0 ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-sm font-medium tracking-wide">+{scoreDifference} pts</span>
              </>
            ) : scoreDifference < 0 ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-sm font-medium tracking-wide">{scoreDifference} pts</span>
              </>
            ) : (
              <span className="text-sm font-medium tracking-wide">No change</span>
            )}
          </div>
        </div>
        
        <ProgressRing 
          progress={score} 
          size={100}
          color={
            score >= 80 ? 'hsl(142, 76%, 36%)' : // Green for good
            score >= 60 ? 'hsl(48, 96%, 53%)' :  // Yellow for moderate
            'hsl(0, 84%, 60%)'                   // Red for poor
          } 
          animated
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{score}</p>
          </div>
        </ProgressRing>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 tracking-wide">Legacy Insights</h4>
        <motion.ul 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
        >
          {insights.map((insight, index) => (
            <motion.li 
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 tracking-wide leading-relaxed">{insight}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Card>
  );
};

export default HealthScoreCard;