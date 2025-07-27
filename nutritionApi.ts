import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  image?: string;
}

export interface MealLog {
  id: string;
  userId: string;
  foodName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  timestamp: string;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealBreakdown: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
}

// Demo user UUID for when no authenticated user is available
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

// API functions
export const nutritionApi = {
  // Search for food items
  searchFoods: async (query: string): Promise<FoodItem[]> => {
    try {
      // Use Supabase Edge Function to proxy the request to a nutrition API
      const { data, error } = await supabase.functions.invoke('nutrition-search', {
        body: { query }
      });
      
      if (error) throw new Error(error.message);
      return data.foods || [];
    } catch (error) {
      console.error('Error searching foods:', error);
      // Fallback to mock data for demo purposes
      return mockFoodSearch(query);
    }
  },
  
  // Log a meal
  logMeal: async (mealData: Omit<MealLog, 'id'>): Promise<MealLog> => {
    // Handle demo user - return mock data instead of hitting database
    if (mealData.userId === DEMO_USER_ID) {
      return {
        id: `demo-${Date.now()}`,
        userId: mealData.userId,
        foodName: mealData.foodName,
        mealType: mealData.mealType,
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
        servingSize: mealData.servingSize,
        timestamp: mealData.timestamp
      };
    }

    try {
      const { data, error } = await supabase
        .from('food_logs')
        .insert([{
          user_id: mealData.userId,
          food_name: mealData.foodName,
          meal_type: mealData.mealType,
          calories: mealData.calories,
          protein: mealData.protein,
          carbs: mealData.carbs,
          fat: mealData.fat,
          serving_size: mealData.servingSize,
          meal_time: mealData.timestamp
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        foodName: data.food_name,
        mealType: data.meal_type,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        servingSize: data.serving_size,
        timestamp: data.meal_time
      };
    } catch (error) {
      console.error('Error logging meal:', error);
      throw error;
    }
  },
  
  // Get meal logs for a user
  getMealLogs: async (userId: string, days: number = 7): Promise<MealLog[]> => {
    // Handle demo user - return mock data instead of hitting database
    if (userId === DEMO_USER_ID) {
      return mockMealLogs(userId, days);
    }

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('meal_time', startDate.toISOString())
        .order('meal_time', { ascending: false });
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        foodName: item.food_name,
        mealType: item.meal_type,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        servingSize: item.serving_size,
        timestamp: item.meal_time
      }));
    } catch (error) {
      console.error('Error getting meal logs:', error);
      // Fallback to mock data for demo purposes
      return mockMealLogs(userId, days);
    }
  },
  
  // Get nutrition summary
  getNutritionSummary: async (userId: string, days: number = 1): Promise<NutritionSummary> => {
    // Handle demo user - return mock data instead of hitting database
    if (userId === DEMO_USER_ID) {
      return mockNutritionSummary();
    }

    try {
      const logs = await nutritionApi.getMealLogs(userId, days);
      
      const summary: NutritionSummary = {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealBreakdown: {
          breakfast: 0,
          lunch: 0,
          dinner: 0,
          snack: 0
        }
      };
      
      logs.forEach(log => {
        summary.totalCalories += log.calories;
        summary.totalProtein += log.protein;
        summary.totalCarbs += log.carbs;
        summary.totalFat += log.fat;
        summary.mealBreakdown[log.mealType] += log.calories;
      });
      
      return summary;
    } catch (error) {
      console.error('Error getting nutrition summary:', error);
      // Fallback to mock data
      return mockNutritionSummary();
    }
  }
};

// Mock data functions for development and fallback
function mockFoodSearch(query: string): FoodItem[] {
  const foods = [
    {
      id: 1,
      name: 'Chicken Breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 2,
      name: 'Brown Rice',
      calories: 112,
      protein: 2.6,
      carbs: 23.5,
      fat: 0.9,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      name: 'Salmon',
      calories: 208,
      protein: 20,
      carbs: 0,
      fat: 13,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/3296279/pexels-photo-3296279.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 4,
      name: 'Avocado',
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 5,
      name: 'Greek Yogurt',
      calories: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/4397920/pexels-photo-4397920.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];
  
  return foods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );
}

function mockMealLogs(userId: string, days: number): MealLog[] {
  const logs: MealLog[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Breakfast
    logs.push({
      id: `breakfast-${i}`,
      userId,
      foodName: 'Greek Yogurt with Berries',
      mealType: 'breakfast',
      calories: 220,
      protein: 15,
      carbs: 25,
      fat: 8,
      servingSize: '1 bowl',
      timestamp: new Date(date.setHours(8, 0, 0)).toISOString()
    });
    
    // Lunch
    logs.push({
      id: `lunch-${i}`,
      userId,
      foodName: 'Chicken Salad',
      mealType: 'lunch',
      calories: 350,
      protein: 30,
      carbs: 15,
      fat: 18,
      servingSize: '1 plate',
      timestamp: new Date(date.setHours(13, 0, 0)).toISOString()
    });
    
    // Dinner
    logs.push({
      id: `dinner-${i}`,
      userId,
      foodName: 'Salmon with Vegetables',
      mealType: 'dinner',
      calories: 420,
      protein: 35,
      carbs: 20,
      fat: 22,
      servingSize: '1 plate',
      timestamp: new Date(date.setHours(19, 0, 0)).toISOString()
    });
    
    // Snack
    logs.push({
      id: `snack-${i}`,
      userId,
      foodName: 'Protein Bar',
      mealType: 'snack',
      calories: 180,
      protein: 12,
      carbs: 18,
      fat: 6,
      servingSize: '1 bar',
      timestamp: new Date(date.setHours(16, 0, 0)).toISOString()
    });
  }
  
  return logs;
}

function mockNutritionSummary(): NutritionSummary {
  return {
    totalCalories: 1170,
    totalProtein: 92,
    totalCarbs: 78,
    totalFat: 54,
    mealBreakdown: {
      breakfast: 220,
      lunch: 350,
      dinner: 420,
      snack: 180
    }
  };
}