import React from 'react';

const NutritionDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Nutrition Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your nutrition and dietary insights</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Nutrition dashboard content coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionDashboardPage;
