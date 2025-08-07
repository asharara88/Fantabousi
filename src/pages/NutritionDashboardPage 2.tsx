import React from 'react';
import NutritionDashboard from '../components/nutrition/NutritionDashboard';

const NutritionDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nutrition Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your daily nutrition and meal patterns</p>
        </div>
        
        <NutritionDashboard />
      </div>
    </div>
  );
};

export default NutritionDashboardPage;