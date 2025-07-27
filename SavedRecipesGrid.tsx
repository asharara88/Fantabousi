import React, { useState, useEffect } from 'react';
import { recipeApi, SavedRecipe } from '../../api/recipeApi';
import { Card } from '../ui/Card';
import { Heart, Clock, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedRecipesGrid: React.FC = () => {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock user ID for demo purposes
  const userId = 'demo-user-id';

  useEffect(() => {
    const loadSavedRecipes = async () => {
      setIsLoading(true);
      try {
        const recipes = await recipeApi.getSavedRecipes(userId);
        setSavedRecipes(recipes);
      } catch (error) {
        console.error('Error loading saved recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedRecipes();
  }, []);

  const handleRemoveRecipe = async (recipeId: number) => {
    try {
      // In a real app, you would call an API to delete the saved recipe
      setSavedRecipes(prev => prev.filter(r => r.recipeId !== recipeId));
    } catch (error) {
      console.error('Error removing recipe:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't saved any recipes yet.</p>
        <Link
          to="/recipes"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Discover Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedRecipes.map((recipe) => (
        <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="relative">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <button 
                onClick={() => handleRemoveRecipe(recipe.recipeId)}
                className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                aria-label="Remove from saved recipes"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {recipe.title}
            </h3>
            
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>30 min</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>4 servings</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Link
                to={`/recipes/${recipe.recipeId}`}
                className="text-primary hover:text-primary-dark font-medium flex items-center"
              >
                View Recipe
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Saved {new Date(recipe.savedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SavedRecipesGrid;