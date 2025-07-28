/* eslint-disable */
import { createClient } from "npm:@supabase/supabase-js@2";

// Cors headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define response types
interface Supplement {
  id: string;
  name: string;
  description: string;
  tier: string;
  use_case: string;
  price_aed: number;
  image_url?: string;
}

interface SupplementStack {
  id: string;
  name: string;
  category: string;
  total_price: number;
  components: any[];
}

interface UserProfile {
  id: string;
  primary_health_goals?: string[];
  health_concerns?: string[];
  fitness_goals?: string[];
  diet_preference?: string;
  activity_level?: string;
  sleep_quality?: string;
  stress_level?: number;
}

interface RecommendationResponse {
  supplements: Supplement[];
  stacks: SupplementStack[];
  personalized_message: string;
}

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

    // Get request body
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      throw new Error(`Error fetching user profile: ${profileError.message}`);
    }

    // Get supplements based on user profile
    const supplements = await getPersonalizedSupplements(supabase, profileData);
    
    // Get supplement stacks based on user profile
    const stacks = await getPersonalizedStacks(supabase, profileData);
    
    // Generate personalized message
    const personalizedMessage = generatePersonalizedMessage(profileData, supplements, stacks);
    
    const response: RecommendationResponse = {
      supplements,
      stacks,
      personalized_message: personalizedMessage
    };
    
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
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Get personalized supplements based on user profile
async function getPersonalizedSupplements(supabase, profile: UserProfile): Promise<Supplement[]> {
  try {
    // Build query based on user profile
    let query = supabase
      .from('supplements')
      .select('*')
      .eq('is_available', true)
      .not('tier', 'eq', 'red'); // Never recommend red tier supplements
    
    // Filter by health goals if available
    if (profile.primary_health_goals && profile.primary_health_goals.length > 0) {
      // This is a simplified approach - in a real app, you would have a more sophisticated matching algorithm
      const goalKeywords = profile.primary_health_goals.flatMap(goal => {
        switch (goal.toLowerCase()) {
          case 'weight management':
            return ['weight', 'metabolism', 'fat'];
          case 'muscle building':
            return ['muscle', 'protein', 'strength'];
          case 'better sleep':
            return ['sleep', 'recovery', 'relax'];
          case 'increased energy':
            return ['energy', 'fatigue', 'vitality'];
          case 'stress reduction':
            return ['stress', 'anxiety', 'calm'];
          case 'mental wellness':
            return ['cognitive', 'brain', 'focus'];
          default:
            return [goal.toLowerCase()];
        }
      });
      
      // Use OR conditions for each keyword
      if (goalKeywords.length > 0) {
        const orConditions = goalKeywords.map(keyword => 
          `use_case.ilike.%${keyword}% OR description.ilike.%${keyword}%`
        );
        query = query.or(orConditions.join(','));
      }
    }
    
    // Prioritize green tier supplements
    query = query.order('tier', { ascending: true });
    
    // Limit results
    query = query.limit(10);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error getting personalized supplements:", error);
    return [];
  }
}

// Get personalized supplement stacks based on user profile
async function getPersonalizedStacks(supabase, profile: UserProfile): Promise<SupplementStack[]> {
  try {
    // Get all stacks
    const { data, error } = await supabase
      .from('supplement_stacks')
      .select('*');
    
    if (error) throw error;
    
    // Filter stacks based on user profile
    let filteredStacks = data || [];
    
    if (profile.primary_health_goals && profile.primary_health_goals.length > 0) {
      // Map health goals to stack categories
      const categoryMap: Record<string, string[]> = {
        'weight management': ['Weight Loss', 'Metabolism'],
        'muscle building': ['Muscle Building', 'Performance'],
        'better sleep': ['Sleep / Recovery', 'Sleep'],
        'increased energy': ['Energy', 'Performance'],
        'stress reduction': ['Stress', 'Sleep / Recovery'],
        'mental wellness': ['Cognitive', 'Brain Health'],
        'immune support': ['Immune'],
        'digestive health': ['Gut Health'],
      };
      
      // Get relevant categories based on user goals
      const relevantCategories = profile.primary_health_goals
        .flatMap(goal => categoryMap[goal.toLowerCase()] || []);
      
      if (relevantCategories.length > 0) {
        filteredStacks = filteredStacks.filter(stack => 
          relevantCategories.some(category => 
            stack.category.toLowerCase().includes(category.toLowerCase())
          )
        );
      }
    }
    
    // Limit results
    return filteredStacks.slice(0, 3);
  } catch (error) {
    console.error("Error getting personalized stacks:", error);
    return [];
  }
}

// Generate personalized message based on user profile and recommendations
function generatePersonalizedMessage(profile: UserProfile, supplements: Supplement[], stacks: SupplementStack[]): string {
  try {
    // Default message
    let message = "Based on your profile, here are some supplement recommendations that may support your health goals.";
    
    // Personalize based on primary health goals
    if (profile.primary_health_goals && profile.primary_health_goals.length > 0) {
      const primaryGoal = profile.primary_health_goals[0];
      
      switch (primaryGoal.toLowerCase()) {
        case 'weight management':
          message = "I've selected supplements that may support your metabolism and weight management goals. Consider these options as part of a balanced diet and exercise routine.";
          break;
        case 'muscle building':
          message = "To support your muscle building goals, I've recommended supplements that may enhance protein synthesis and recovery. Remember that proper nutrition and training are essential foundations.";
          break;
        case 'better sleep':
          message = "Quality sleep is crucial for overall health. These supplements may help improve your sleep quality and recovery. Consider using them as part of a consistent sleep routine.";
          break;
        case 'increased energy':
          message = "For your energy goals, I've selected supplements that may support cellular energy production and reduce fatigue. Remember that adequate sleep and nutrition are fundamental.";
          break;
        case 'stress reduction':
          message = "Managing stress is important for overall wellbeing. These adaptogenic supplements may help your body respond better to stress, alongside proper self-care practices.";
          break;
        case 'mental wellness':
          message = "For cognitive support, I've recommended supplements that may enhance brain function and mental clarity. These work best alongside proper sleep, nutrition, and mental exercises.";
          break;
      }
    }
    
    // Add note about evidence tiers
    message += " Remember that green tier supplements have the strongest scientific evidence, while yellow and orange tiers have moderate or preliminary evidence.";
    
    return message;
  } catch (error) {
    console.error("Error generating personalized message:", error);
    return "Here are some supplement recommendations based on your profile.";
  }
}