import React, { useState } from 'react';
import { Camera, Sparkles, BarChart3, Clock, AlertCircle } from 'lucide-react';
import { aiWorkoutPlannerApi, NutritionAnalysis } from '../../api/aiWorkoutPlannerApi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

interface AIFoodAnalyzerProps {
  onAnalysisComplete?: (analysis: NutritionAnalysis) => void;
}

const AIFoodAnalyzer: React.FC<AIFoodAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mealDescription, setMealDescription] = useState('');
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeMeal = async () => {
    if (!mealDescription.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await aiWorkoutPlannerApi.analyzeFoodPlate(mealDescription);
      if (result) {
        setAnalysis(result);
        onAnalysisComplete?.(result);
      } else {
        setError('Failed to analyze meal. Please try again.');
      }
    } catch (err) {
      console.error('Error analyzing meal:', err);
      setError('Unable to analyze meal. Please check your description and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleDescriptions = [
    "Grilled chicken breast with steamed broccoli and brown rice",
    "Greek yogurt with mixed berries and granola",
    "Salmon fillet with quinoa and roasted vegetables",
    "Turkey sandwich on whole wheat with avocado and lettuce"
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
          <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Food Analyzer</h3>
          <p className="text-gray-600 dark:text-gray-400">Analyze nutritional content from meal descriptions</p>
        </div>
      </div>

      {/* Meal Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Describe Your Meal
        </label>
        <textarea
          value={mealDescription}
          onChange={(e) => setMealDescription(e.target.value)}
          placeholder="Describe what you ate... (e.g., grilled chicken breast with steamed broccoli and brown rice)"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          rows={3}
        />
        
        {/* Sample Descriptions */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {sampleDescriptions.map((sample, index) => (
              <button
                key={index}
                onClick={() => setMealDescription(sample)}
                className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <Button
        onClick={handleAnalyzeMeal}
        disabled={!mealDescription.trim() || isAnalyzing}
        className="w-full mb-6"
      >
        {isAnalyzing ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Meal...
          </>
        ) : (
          <>
            <Camera className="w-4 h-4 mr-2" />
            Analyze Nutrition
          </>
        )}
      </Button>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-200 dark:border-gray-700 pt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nutrition Summary */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Nutritional Breakdown
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">Calories</span>
                  <span className="font-bold text-lg text-primary">{analysis.calories}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Protein</span>
                    <span className="font-medium">{analysis.macros.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Carbs</span>
                    <span className="font-medium">{analysis.macros.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fat</span>
                    <span className="font-medium">{analysis.macros.fat}g</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Health Score</span>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        analysis.healthScore >= 80 ? 'bg-green-500' :
                        analysis.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-bold">{analysis.healthScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                AI Recommendations
              </h4>
              
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                  >
                    <p className="text-blue-800 dark:text-blue-300 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <Button variant="outline" className="flex-1">
              Save to Food Log
            </Button>
            <Button
              onClick={() => setMealDescription('')}
              variant="outline"
              className="flex-1"
            >
              Analyze Another Meal
            </Button>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default AIFoodAnalyzer;