import React from 'react';
import PersonalizedRecipes from '../components/nutrition/PersonalizedRecipes';

const RecipesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personalized Recipes</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover recipes tailored to your nutritional needs and preferences</p>
        </div>
        
        <PersonalizedRecipes />
      </div>
    </div>
  );
};

export default RecipesPage;