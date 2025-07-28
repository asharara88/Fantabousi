/* eslint-disable */
// @deno-types="https://deno.land/x/types/npm/axios/index.d.ts"
import axios from "npm:axios@1.6.2";

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

interface SearchResponse {
  foods: FoodItem[];
  error?: string;
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
    const { query } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // In a real implementation, you would call a nutrition API like Spoonacular or Edamam
    // For this demo, we'll return mock data
    const foods = getMockFoodData(query);
    
    const response: SearchResponse = { foods };
    
    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

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