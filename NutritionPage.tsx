import React from 'react';
import NutritionTracker from '../components/nutrition/NutritionTracker';
import AIFoodAnalyzer from '../components/nutrition/AIFoodAnalyzer';

const NutritionPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('tracker');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nutrition</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your meals and monitor your nutrition</p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('tracker')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'tracker'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Manual Tracker
              </button>
              <button
                onClick={() => setActiveTab('ai-analyzer')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'ai-analyzer'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                AI Food Analyzer
              </button>
            </div>
          </div>
        </div>
        
        {activeTab === 'ai-analyzer' ? (
          <AIFoodAnalyzer />
        ) : (
          <NutritionTracker />
        )}
      </div>
    </div>
  );
};

export default NutritionPage;