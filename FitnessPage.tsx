import React from 'react';
import { useSearchParams } from 'react-router-dom';
import FitnessTracker from '../components/fitness/FitnessTracker';
import AIWorkoutGenerator from '../components/fitness/AIWorkoutGenerator';

const FitnessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fitness Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive workout tracking and muscle group analysis</p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <a
                href="/fitness"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' || !activeTab
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Dashboard
              </a>
              <a
                href="/fitness?tab=history"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                History
              </a>
              <a
                href="/fitness?tab=muscles"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'muscles'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Muscle Groups
              </a>
              <a
                href="/fitness?tab=ai-generator"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'ai-generator'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                AI Generator
              </a>
              <a
                href="/fitness?tab=analytics"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Analytics
              </a>
            </div>
          </div>
        </div>
        
        {activeTab === 'ai-generator' ? (
          <AIWorkoutGenerator />
        ) : (
          <FitnessTracker activeTab={activeTab} />
        )}
      </div>
    </div>
  );
};

export default FitnessPage;