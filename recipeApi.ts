import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  summary: string;
  healthScore: number;
  diets: string[];
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  } | null;
}

export interface RecipeSearchParams {
  diet?: string;
  intolerances?: string;
  excludeIngredients?: string;
  includeIngredients?: string;
  maxReadyTime?: number;
  minProtein?: number;
  maxCalories?: number;
}

export interface RecipeSearchResponse {
  recipes: Recipe[];
  total: number;
}

export interface SavedRecipe {
  id: string;
  userId: string;
  recipeId: number;
  title: string;
  image: string;
  savedAt: string;
  isFavorite: boolean;
}

// API functions
export const recipeApi = {
  // Search for recipes based on user preferences
  searchRecipes: async (params: RecipeSearchParams): Promise<RecipeSearchResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-personalized-recipes', {
        body: params
      });
      
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      
      // Fallback to mock data for demo purposes
      return {
        recipes: getMockRecipeData(),
        total: getMockRecipeData().length
      };
    }
  },
  
  // Get recipe details by ID
  getRecipeById: async (recipeId: number): Promise<Recipe | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('get-personalized-recipes', {
        body: { ids: [recipeId] }
      });
      
      if (error) throw new Error(error.message);
      return data.recipes[0] || null;
    } catch (error) {
      console.error('Error getting recipe details:', error);
      
      // Fallback to mock data
      const mockRecipes = getMockRecipeData();
      return mockRecipes.find(r => r.id === recipeId) || null;
    }
  },
  
  // Save a recipe to user's favorites
  saveRecipe: async (userId: string, recipe: Recipe, isFavorite: boolean = false): Promise<SavedRecipe> => {
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .upsert({
          user_id: userId,
          recipe_id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          saved_at: new Date().toISOString(),
          is_favorite: isFavorite
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        recipeId: data.recipe_id,
        title: data.title,
        image: data.image,
        savedAt: data.saved_at,
        isFavorite: data.is_favorite
      };
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
    }
  },
  
  // Get user's saved recipes
  getSavedRecipes: async (userId: string): Promise<SavedRecipe[]> => {
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        recipeId: item.recipe_id,
        title: item.title,
        image: item.image,
        savedAt: item.saved_at,
        isFavorite: item.is_favorite
      }));
    } catch (error) {
      console.error('Error getting saved recipes:', error);
      return [];
    }
  },
  
  // Get personalized recipe recommendations based on user profile
  getPersonalizedRecommendations: async (userId: string): Promise<Recipe[]> => {
    try {
      // First get user profile to determine preferences
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('diet_preference, dietary_restrictions, allergies, primary_health_goals')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Build search params based on user profile
      const searchParams: RecipeSearchParams = {};
      
      if (profileData.diet_preference) {
        // Map app diet preferences to Spoonacular diet params
        const dietMap: Record<string, string> = {
          'vegetarian': 'vegetarian',
          'vegan': 'vegan',
          'pescatarian': 'pescatarian',
          'keto': 'ketogenic',
          'paleo': 'paleo',
          'mediterranean': 'mediterranean'
        };
        
        searchParams.diet = dietMap[profileData.diet_preference] || '';
      }
      
      if (profileData.allergies && profileData.allergies.length > 0) {
        searchParams.intolerances = profileData.allergies.join(',');
      }
      
      if (profileData.dietary_restrictions && profileData.dietary_restrictions.length > 0) {
        searchParams.excludeIngredients = profileData.dietary_restrictions.join(',');
      }
      
      // Adjust nutrition targets based on health goals
      if (profileData.primary_health_goals && profileData.primary_health_goals.includes('Weight management')) {
        searchParams.maxCalories = 500; // Lower calorie recipes
      }
      
      if (profileData.primary_health_goals && profileData.primary_health_goals.includes('Muscle building')) {
        searchParams.minProtein = 25; // Higher protein recipes
      }
      
      // Get personalized recipes
      const { recipes } = await recipeApi.searchRecipes(searchParams);
      return recipes;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return getMockRecipeData();
    }
  }
};

// Mock data function for development and fallback
function getMockRecipeData(): Recipe[] {
  return [
    {
      id: 716429,
      title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
      image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
      readyInMinutes: 45,
      servings: 2,
      sourceUrl: "https://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html",
      summary: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs might be just the main course you are searching for. This recipe makes 2 servings with 636 calories, 21g of protein, and 20g of fat each.",
      healthScore: 76,
      diets: ["dairy free", "lacto ovo vegetarian", "vegan"],
      nutrition: {
        calories: 636,
        protein: 21,
        fat: 20,
        carbs: 83
      }
    },
    {
      id: 715538,
      title: "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
      image: "https://spoonacular.com/recipeImages/715538-556x370.jpg",
      readyInMinutes: 35,
      servings: 4,
      sourceUrl: "https://www.pinkwhen.com/bruschetta-style-pork-pasta/",
      summary: "What to make for dinner tonight?? Bruschetta Style Pork & Pasta might be a good recipe to expand your main course recipe box. This recipe makes 4 servings with 520 calories, 45g of protein, and 19g of fat each.",
      healthScore: 81,
      diets: ["dairy free"],
      nutrition: {
        calories: 520,
        protein: 45,
        fat: 19,
        carbs: 45
      }
    },
    {
      id: 782601,
      title: "Red Kidney Bean Jambalaya",
      image: "https://spoonacular.com/recipeImages/782601-556x370.jpg",
      readyInMinutes: 45,
      servings: 6,
      sourceUrl: "https://www.foodista.com/recipe/6BFKZR7Y/red-kidney-bean-jambalaya",
      summary: "Red Kidney Bean Jambalayan is a main course that serves 6. One serving contains 538 calories, 21g of protein, and 8g of fat.",
      healthScore: 96,
      diets: ["gluten free", "dairy free", "lacto ovo vegetarian", "vegan"],
      nutrition: {
        calories: 538,
        protein: 21,
        fat: 8,
        carbs: 92
      }
    }
  ];
}