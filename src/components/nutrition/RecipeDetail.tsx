/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { ArrowLeft, Clock, Users, Award, Heart, Share2, Printer, BookmarkPlus } from 'lucide-react';
import { Recipe } from '../../api/recipeApi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Link, useNavigate } from 'react-router-dom';

interface RecipeDetailProps {
  recipe: Recipe;
  onSave?: () => void;
  isSaved?: boolean;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onSave, isSaved = false }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  const navigate = useNavigate();
  
  // Function to clean HTML from summary
  const cleanHtml = (html: string) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to recipes
        </Button>
      </div>
      
      {/* Recipe header */}
      <div className="relative rounded-xl overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center space-x-2 mb-2">
            {recipe.healthScore >= 80 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Award className="w-3 h-3 mr-1" />
                Healthy
              </span>
            )}
            {recipe.diets && recipe.diets.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {recipe.diets[0]}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{recipe.title}</h1>
          <div className="flex flex-wrap items-center text-white/80 text-sm gap-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{recipe.readyInMinutes} min</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onSave}
          className={`flex items-center ${isSaved ? 'bg-primary' : ''}`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </Button>
        <Button variant="outline" className="flex items-center">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" className="flex items-center">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" className="flex items-center">
          <BookmarkPlus className="w-4 h-4 mr-2" />
          Add to Meal Plan
        </Button>
      </div>
      
      {/* Recipe summary */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">About this Recipe</h2>
        <p className="text-gray-700 dark:text-gray-300">
          {cleanHtml(recipe.summary)}
        </p>
      </Card>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            className={`py-4 text-sm font-medium border-b-2 ${
              activeTab === 'ingredients'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </button>
          <button
            className={`py-4 text-sm font-medium border-b-2 ${
              activeTab === 'instructions'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('instructions')}
          >
            Instructions
          </button>
          <button
            className={`py-4 text-sm font-medium border-b-2 ${
              activeTab === 'nutrition'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('nutrition')}
          >
            Nutrition
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="py-4">
        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Ingredients for {recipe.servings} servings</h3>
            <ul className="space-y-2">
              {/* Mock ingredients for demo */}
              {Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Ingredient {i + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'instructions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cooking Instructions</h3>
            <ol className="space-y-4">
              {/* Mock instructions for demo */}
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                    {i + 1}
                  </span>
                  <div>
                    <p>Step {i + 1} instruction text goes here. This would contain the detailed cooking instructions for this step.</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
        
        {activeTab === 'nutrition' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Nutrition Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Per serving</p>
            
            {recipe.nutrition && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
                  <p className="text-xl font-bold">{Math.round(recipe.nutrition.calories)}</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
                  <p className="text-xl font-bold">{Math.round(recipe.nutrition.protein)}g</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
                  <p className="text-xl font-bold">{Math.round(recipe.nutrition.carbs)}g</p>
                </Card>
                <Card className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fat</p>
                  <p className="text-xl font-bold">{Math.round(recipe.nutrition.fat)}g</p>
                </Card>
              </div>
            )}
            
            {/* Additional nutrition info */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Health Benefits</h4>
              <p className="text-gray-700 dark:text-gray-300">
                This recipe has a health score of {recipe.healthScore}/100, making it a {recipe.healthScore > 70 ? 'great' : 'good'} choice for your overall wellbeing.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Similar recipes */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock similar recipes */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <h3 className="font-medium">Similar Recipe {i + 1}</h3>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>30 min</span>
                  <span>4 servings</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;