import React from 'react';
import { Clock, Users, Heart, Award } from 'lucide-react';
import { Recipe } from '../../api/recipeApi';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface RecipeCardProps {
  recipe: Recipe;
  onSave?: () => void;
  isSaved?: boolean;
  as?: typeof Link;
  to?: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSave, isSaved = false, as, to }) => {
  // Function to truncate summary and remove HTML tags
  const cleanSummary = (summary: string) => {
    const withoutTags = summary.replace(/<\/?[^>]+(>|$)/g, "");
    return withoutTags.length > 120 ? withoutTags.substring(0, 120) + "..." : withoutTags;
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col"
      as={as}
      to={to}
    >
      <div className="relative h-48">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <button 
            onClick={onSave}
            className={cn(
              "p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors z-10",
              isSaved ? "bg-primary text-white" : "bg-white/90 text-gray-800"
            )}
            aria-label={isSaved ? "Remove from saved recipes" : "Save recipe"}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center space-x-2">
            {recipe.healthScore >= 80 && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
                <Award className="w-3 h-3 mr-1" />
                Healthy
              </span>
            )}
            {recipe.diets && recipe.diets.length > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                {recipe.diets[0]}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {recipe.title}
        </h3>
        
        <p className="text-sm text-gray-800 dark:text-gray-200 mb-4 line-clamp-3 flex-1">
          {cleanSummary(recipe.summary)}
        </p>
        
        <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200 font-medium mt-auto">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{recipe.readyInMinutes} min</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
        
        {recipe.nutrition && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 -mx-5 -mb-5 p-3 rounded-b-lg">
            <div className="grid grid-cols-4 gap-2 text-center px-2">
              <div className="bg-white dark:bg-gray-700 p-2 rounded shadow-sm">
                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">Calories</p>
                <p className="font-bold text-gray-900 dark:text-white">{Math.round(recipe.nutrition.calories)}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-2 rounded shadow-sm">
                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">Protein</p>
                <p className="font-bold text-gray-900 dark:text-white">{Math.round(recipe.nutrition.protein)}g</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-2 rounded shadow-sm">
                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">Carbs</p>
                <p className="font-bold text-gray-900 dark:text-white">{Math.round(recipe.nutrition.carbs)}g</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-2 rounded shadow-sm">
                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">Fat</p>
                <p className="font-bold text-gray-900 dark:text-white">{Math.round(recipe.nutrition.fat)}g</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecipeCard;