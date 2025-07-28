/* eslint-disable */
import { createClient } from "npm:@supabase/supabase-js@2";

// Cors headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkoutPlannerRequest {
  endpoint: string;
  data?: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get RapidAPI credentials from environment
    const rapidApiKey = Deno.env.get("RAPIDAPI_WORKOUT_PLANNER_KEY");
    const rapidApiHost = "ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com";
    
    if (!rapidApiKey) {
      throw new Error("RapidAPI workout planner key not configured");
    }

    const { endpoint, data } = await req.json();
    
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: endpoint" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Build RapidAPI URL
    const rapidApiUrl = `https://${rapidApiHost}/${endpoint}`;
    
    console.log('Making RapidAPI request to:', rapidApiUrl);

    // Make request to RapidAPI
    const response = await fetch(rapidApiUrl, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data || {})
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RapidAPI error:', response.status, errorText);
      throw new Error(`RapidAPI request failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing AI workout planner request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process AI workout planner request",
        type: error.name || "UnknownError"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});