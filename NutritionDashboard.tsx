import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, TrendingUp, Apple, Salad, Clock } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Doughnut } from 'react-chartjs-2';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

const NutritionDashboard: React.FC = () => {
  // Mock data for the dashboard
  const dailyIntake = {
    calories: 1850,
    calorieGoal: 2200,
    protein: 95,
    proteinGoal: 120,
    carbs: 210,
    carbsGoal: 250,
    fat: 65,
    fatGoal: 73
  };
  
  const recentMeals = [
    { id: 1, name: 'Breakfast', time: '8:30 AM', calories: 420 },
    { id: 2, name: 'Lunch', time: '12:45 PM', calories: 650 },
    { id: 3, name: 'Snack', time: '3:30 PM', calories: 180 }
  ];
  
  const macroChartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [dailyIntake.protein * 4, dailyIntake.carbs * 4, dailyIntake.fat * 9],
        backgroundColor: [
          'hsl(169deg 100% 35% / 0.8)', // Primary (teal)
          'hsl(190deg 100% 40% / 0.8)', // Secondary (blue)
          'hsl(183deg 100% 38% / 0.8)', // Tertiary (turquoise)
          'hsl(169deg 100% 45% / 0.8)'  // Primary light
        ],
        borderColor: [
          'hsl(169deg 100% 35%)', // Primary (teal)
          'hsl(190deg 100% 40%)', // Secondary (blue)
          'hsl(183deg 100% 38%)', // Tertiary (turquoise)
          'hsl(169deg 100% 45%)'  // Primary light
        ],
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#4B5563' // text-gray-600
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20 mb-3 shadow-sm">
              <Utensils className="w-5 h-5 text-primary dark:text-primary-light" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Calories</p>
            <div className="flex items-baseline">
              <p className="text-xl font-bold">{dailyIntake.calories}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ {dailyIntake.calorieGoal}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-secondary/10 dark:bg-secondary/20 mb-3 shadow-sm">
              <TrendingUp className="w-5 h-5 text-secondary dark:text-secondary-light" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Protein</p>
            <div className="flex items-baseline">
              <p className="text-xl font-bold">{dailyIntake.protein}g</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ {dailyIntake.proteinGoal}g</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-tertiary/10 dark:bg-tertiary/20 mb-3 shadow-sm">
              <Apple className="w-5 h-5 text-tertiary dark:text-tertiary-light" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Carbs</p>
            <div className="flex items-baseline">
              <p className="text-xl font-bold">{dailyIntake.carbs}g</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ {dailyIntake.carbsGoal}g</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-tertiary/10 dark:bg-tertiary/20 mb-3 shadow-sm">
              <Salad className="w-5 h-5 text-tertiary dark:text-tertiary-light" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Fat</p>
            <div className="flex items-baseline">
              <p className="text-xl font-bold">{dailyIntake.fat}g</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ {dailyIntake.fatGoal}g</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Macro breakdown and recent meals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <Card className="p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Macro Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={macroChartData} options={chartOptions} />
          </div>
          
          {/* Add a legend with percentages */}
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary mb-1"></div>
              <p className="text-xs text-center">Protein<br/>{Math.round((dailyIntake.protein * 4 / dailyIntake.calories) * 100)}%</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-tertiary mb-1"></div>
              <p className="text-xs text-center">Carbs<br/>{Math.round((dailyIntake.carbs * 4 / dailyIntake.calories) * 100)}%</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-secondary mb-1"></div>
              <p className="text-xs text-center">Fat<br/>{Math.round((dailyIntake.fat * 9 / dailyIntake.calories) * 100)}%</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium mb-1">Protein</p>
              <p className="font-bold text-secondary dark:text-secondary-light">{Math.round((dailyIntake.protein / dailyIntake.proteinGoal) * 100)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium mb-1">Carbs</p>
              <p className="font-bold text-tertiary dark:text-tertiary-light">{Math.round((dailyIntake.carbs / dailyIntake.carbsGoal) * 100)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium mb-1">Fat</p>
              <p className="font-bold text-primary dark:text-primary-light">{Math.round((dailyIntake.fat / dailyIntake.fatGoal) * 100)}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 sm:p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Meals</h3>
            <Link to="/nutrition" className="text-primary hover:text-primary-dark text-sm font-semibold">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentMeals.map(meal => (
              <div key={meal.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{meal.name}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{meal.time}</p>
                </div>
                <div className="text-right flex items-center">
                  <p className="font-bold text-primary dark:text-primary-light">{meal.calories} cal</p>
                  <ArrowRight className="w-4 h-4 ml-2 text-gray-400" />
                </div>
              </div>
            ))}
            
            <Button
              as={Link}
              to="/nutrition"
              variant="outline"
              className="w-full mt-4"
            >
              <Utensils className="w-4 h-4 mr-2" />
              Log a Meal
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Recipe recommendations */}
      <Card className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Recipes</h3>
          <Link to="/recipes" className="text-primary hover:text-primary-dark text-sm font-semibold">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock recipe recommendations */}
          {Array.from({ length: 3 }).map((_, i) => (
            <Link 
              to={`/recipes/${i + 1}`}
              key={i} 
              className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800"
            >
              <div className="h-32 bg-gradient-to-r from-primary/20 via-tertiary/20 to-secondary/20 dark:from-primary/30 dark:via-tertiary/30 dark:to-secondary/30">
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {i === 0 ? "Protein-Packed Breakfast Bowl" : 
                   i === 1 ? "Mediterranean Lunch Salad" : 
                   "Balanced Dinner Plate"}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {i === 0 ? "High protein, low carb breakfast option" : 
                   i === 1 ? "Heart-healthy lunch with omega-3s" : 
                   "Balanced macros for optimal recovery"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
        
      {/* Calorie & Macro Target Card */}
      <Card className="p-6 sm:p-8 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nutrition Goals</h3>
          <Link to="/nutrition/settings" className="text-primary hover:text-primary-dark text-sm font-semibold">
            Edit Goals
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Calories</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{dailyIntake.calorieGoal} cal</p>
          </div>
          
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Protein Target</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{dailyIntake.proteinGoal}g</p>
          </div>
          
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Carbs Target</p>
            <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{dailyIntake.carbsGoal}g</p>
          </div>
          
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fat Target</p>
            <p className="text-xl font-bold text-pink-600 dark:text-pink-400">{dailyIntake.fatGoal}g</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NutritionDashboard;