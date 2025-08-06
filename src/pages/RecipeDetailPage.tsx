import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { recipeApi, Recipe } from '../api/recipeApi';
import RecipeDetail from '../components/nutrition/RecipeDetail';
import { Loader2 } from 'lucide-react';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  // Demo user UUID for when no authenticated user is available
  const userId = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    if (!id) return;
    
    const recipeId = parseInt(id);
    if (isNaN(recipeId)) {
      setError('Invalid recipe ID');
      setIsLoading(false);
      return;
    }
    
    const loadRecipe = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const recipeData = await recipeApi.getRecipeById(recipeId);
        if (!recipeData) {
          throw new Error('Recipe not found');
        }
        setRecipe(recipeData);
        
        // Check if recipe is saved
        const savedRecipes = await recipeApi.getSavedRecipes(userId);
        setIsSaved(savedRecipes.some(r => r.recipeId === recipeId));
      } catch (err) {
        console.error('Error loading recipe:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecipe();
  }, [id]);

  const handleSaveRecipe = async () => {
    if (!recipe) return;
    
    try {
      if (isSaved) {
        // In a real app, you would call an API to delete the saved recipe
        setIsSaved(false);
      } else {
        await recipeApi.saveRecipe(userId, recipe, true);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8 transition-all duration-200">
      <div className="mobile-container">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
          </div>
        ) : recipe ? (
          <RecipeDetail 
            recipe={recipe} 
            onSave={handleSaveRecipe}
            isSaved={isSaved}
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">Recipe not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;