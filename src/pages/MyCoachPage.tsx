import React from 'react';
import MyCoach from '../components/chat/MyCoach';
import AdaptiveBackdrop from '../components/ui/AdaptiveBackdrop';
import ThemeToggle from '../components/ui/ThemeToggle';

const MyCoachPage: React.FC = () => {
  return (
    <AdaptiveBackdrop animationSpeed="slow" overlay={true}>
      <ThemeToggle />
      <div className="min-h-screen bg-white/30 dark:bg-black/20 backdrop-blur-sm py-6 sm:py-8 transition-all duration-200">
        <div className="mobile-container">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Coach</h1>
            <p className="text-gray-600 dark:text-gray-400">Your personal AI health assistant</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <MyCoach />
          </div>
        </div>
      </div>
    </AdaptiveBackdrop>
  );
};

export default MyCoachPage;