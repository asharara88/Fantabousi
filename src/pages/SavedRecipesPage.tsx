import React from 'react';

const SavedRecipesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Saved Recipes
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Your saved recipes will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavedRecipesPage;