import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, Plus, Calendar, ArrowRight } from 'lucide-react';
import { nutritionApi, FoodItem, MealLog, NutritionSummary } from '../../api/nutritionApi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Pie } from 'react-chartjs-2';

const NutritionTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  // Demo user UUID for when no authenticated user is available
  const userId = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    loadNutritionData();
  }, [selectedDate]);

  const loadNutritionData = async () => {
    setIsLoading(true);
    try {
      const logs = await nutritionApi.getMealLogs(userId, 1);
      const summary = await nutritionApi.getNutritionSummary(userId, 1);
      
      setMealLogs(logs);
      setNutritionSummary(summary);
    } catch (error) {
      console.error('Error loading nutrition data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await nutritionApi.searchFoods(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFood = async (food: FoodItem) => {
    try {
      await nutritionApi.logMeal({
        userId,
        foodName: food.name,
        mealType: selectedMealType,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        servingSize: food.servingSize,
        timestamp: new Date().toISOString()
      });
      
      // Refresh data
      loadNutritionData();
      setSearchResults([]);
      setSearchQuery('');
      setShowAddMeal(false);
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  // Prepare chart data
  const macroChartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [
          nutritionSummary?.totalProtein || 0,
          nutritionSummary?.totalCarbs || 0,
          nutritionSummary?.totalFat || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const mealChartData = {
    labels: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    datasets: [
      {
        data: [
          nutritionSummary?.mealBreakdown.breakfast || 0,
          nutritionSummary?.mealBreakdown.lunch || 0,
          nutritionSummary?.mealBreakdown.dinner || 0,
          nutritionSummary?.mealBreakdown.snack || 0
        ],
        backgroundColor: [
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nutrition Tracker</h2>
        <div className="flex items-center space-x-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Button
            onClick={() => setShowAddMeal(true)}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Log Meal
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Nutrition Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Summary</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Calories</p>
                  <p className="text-2xl font-bold text-primary tracking-tight">
                    {nutritionSummary?.totalCalories || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Protein</p>
                  <p className="text-2xl font-bold text-blue-500 tracking-tight">
                    {nutritionSummary?.totalProtein || 0}g
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Carbs</p>
                  <p className="text-2xl font-bold text-teal-500 tracking-tight">
                    {nutritionSummary?.totalCarbs || 0}g
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fat</p>
                  <p className="text-2xl font-bold text-red-500 tracking-tight">
                    {nutritionSummary?.totalFat || 0}g
                  </p>
                </div>
              </div>
              <div className="h-48">
                <Pie data={macroChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Meal Breakdown</h3>
              <div className="h-48 mb-4">
                <Pie data={mealChartData} options={{ maintainAspectRatio: false }} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Breakfast</span>
                  <span className="font-medium">{nutritionSummary?.mealBreakdown.breakfast || 0} cal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Lunch</span>
                  <span className="font-medium">{nutritionSummary?.mealBreakdown.lunch || 0} cal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Dinner</span>
                  <span className="font-medium">{nutritionSummary?.mealBreakdown.dinner || 0} cal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Snacks</span>
                  <span className="font-medium">{nutritionSummary?.mealBreakdown.snack || 0} cal</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Meal Logs */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Meals</h3>
            {mealLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No meals logged for today</p>
                <Button 
                  onClick={() => setShowAddMeal(true)}
                  variant="outline"
                  className="mt-4"
                >
                  Add Your First Meal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {mealLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full mr-2"
                          style={{
                            backgroundColor: 
                              log.mealType === 'breakfast' ? 'rgb(255, 159, 64)' :
                              log.mealType === 'lunch' ? 'rgb(255, 99, 132)' :
                              log.mealType === 'dinner' ? 'rgb(54, 162, 235)' :
                              'rgb(75, 192, 192)'
                          }}
                        ></span>
                        <span className="font-medium capitalize">{log.mealType}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{log.foodName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{log.servingSize}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{log.calories} cal</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        P: {log.protein}g | C: {log.carbs}g | F: {log.fat}g
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Add Meal Dialog */}
          {showAddMeal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md p-6">
                <h3 className="text-lg font-semibold mb-4">Log a Meal</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Meal Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                      <button
                        key={type}
                        className={`py-2 px-3 rounded-md text-sm font-medium capitalize ${
                          selectedMealType === type
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => setSelectedMealType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Search Food</label>
                  <div className="flex space-x-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a food..."
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} disabled={isSearching}>
                      {isSearching ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="mb-4 max-h-60 overflow-y-auto">
                    <label className="block text-sm font-medium mb-2">Results</label>
                    <div className="space-y-2">
                      {searchResults.map((food) => (
                        <div
                          key={food.id}
                          className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => handleAddFood(food)}
                        >
                          <div className="flex items-center">
                            {food.image && (
                              <img src={food.image} alt={food.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                            )}
                            <div>
                              <p className="font-medium">{food.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{food.servingSize}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{food.calories} cal</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAddMeal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSearch} disabled={!searchQuery.trim() || isSearching}>
                    Search
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NutritionTracker;