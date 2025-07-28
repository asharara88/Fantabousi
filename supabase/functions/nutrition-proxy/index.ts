/* eslint-disable */
import { createClient } from "npm:@supabase/supabase-js@2";

// Define response types
interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  image?: string;
}

interface MealLogData {
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

// Cors headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get Supabase credentials from environment
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not found");
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, data } = await req.json();
    
    // Get user ID from JWT
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    let result;
    switch (action) {
      case "search_foods":
        result = await searchFoods(data.query);
        break;
      case "log_meal":
        result = await logMeal(supabase, userId, data);
        break;
      case "get_meal_logs":
        result = await getMealLogs(supabase, userId, data);
        break;
      case "get_nutrition_summary":
        result = await getNutritionSummary(supabase, userId, data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process request" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Search for food items
async function searchFoods(query: string) {
  // In a real implementation, you would call a nutrition API like Spoonacular or Edamam
  // For this demo, we'll return mock data
  const foods = getMockFoodData(query);
  return { foods };
}

// Log a meal
async function logMeal(supabase, userId: string | null, mealData: MealLogData) {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('food_logs')
    .insert([{
      user_id: userId,
      food_name: mealData.foodName,
      meal_type: mealData.mealType,
      calories: mealData.calories,
      protein: mealData.protein,
      carbohydrates: mealData.carbs,
      fat: mealData.fat,
      portion_size: mealData.servingSize,
      meal_time: mealData.timestamp
    }]);

  if (error) throw error;
  return { success: true };
}

// Get meal logs for a user
async function getMealLogs(supabase, userId: string | null, data: { days?: number }) {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { days = 7 } = data || {};
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: logs, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('meal_time', startDate.toISOString())
    .order('meal_time', { ascending: false });

  if (error) throw error;
  return { logs: logs || [] };
}

// Get nutrition summary
async function getNutritionSummary(supabase, userId: string | null, data: { days?: number }) {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { days = 1 } = data || {};
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: logs, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('meal_time', startDate.toISOString());

  if (error) throw error;

  const summary = {
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

  (logs || []).forEach(log => {
    summary.totalCalories += log.calories || 0;
    summary.totalProtein += log.protein || 0;
    summary.totalCarbs += log.carbohydrates || 0;
    summary.totalFat += log.fat || 0;
    summary.mealBreakdown[log.meal_type] += log.calories || 0;
  });

  return { summary };
}

// Mock food data function
function getMockFoodData(query: string): FoodItem[] {
  const allFoods: FoodItem[] = [
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
    },
    {
      id: 6,
      name: 'Spinach',
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 7,
      name: 'Sweet Potato',
      calories: 86,
      protein: 1.6,
      carbs: 20.1,
      fat: 0.1,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/89247/pexels-photo-89247.png?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 8,
      name: 'Quinoa',
      calories: 120,
      protein: 4.4,
      carbs: 21.3,
      fat: 1.9,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/7421240/pexels-photo-7421240.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 9,
      name: 'Almonds',
      calories: 579,
      protein: 21.2,
      carbs: 21.7,
      fat: 49.9,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/1013420/pexels-photo-1013420.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 10,
      name: 'Banana',
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      servingSize: '100g',
      image: 'https://images.pexels.com/photos/1166648/pexels-photo-1166648.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];
  
  // Filter foods based on query
  return allFoods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );
}