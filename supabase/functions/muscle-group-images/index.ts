/* eslint-disable */
import { createClient } from "npm:@supabase/supabase-js@2";

// Cors headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MuscleGroupRequest {
  endpoint: 'getBaseImage' | 'getIndividualColorImage' | 'getDualColorImage';
  muscleGroup?: string;
  colorHex?: string;
  colorHex2?: string; // For dual color images
  transparentBackground?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get RapidAPI credentials from environment
    const rapidApiKey = Deno.env.get("RAPIDAPI_MUSCLE_GROUP_KEY");
    const rapidApiHost = "muscle-group-image-generator.p.rapidapi.com";
    
    if (!rapidApiKey) {
      throw new Error("RapidAPI key not configured");
    }

    const url = new URL(req.url);
    const params = url.searchParams;
    
    // Extract parameters
    const endpoint = params.get('endpoint') as MuscleGroupRequest['endpoint'];
    const muscleGroup = params.get('muscleGroup');
    const colorHex = params.get('colorHex');
    const colorHex2 = params.get('colorHex2');
    const transparentBackground = params.get('transparentBackground') || '0';

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
    let rapidApiUrl = `https://${rapidApiHost}/${endpoint}`;
    const apiParams = new URLSearchParams();
    
    // Add parameters based on endpoint
    if (muscleGroup) apiParams.append('muscleGroup', muscleGroup);
    if (colorHex) apiParams.append('colorHex', colorHex.replace('#', ''));
    if (colorHex2) apiParams.append('colorHex2', colorHex2.replace('#', ''));
    apiParams.append('transparentBackground', transparentBackground);
    
    if (apiParams.toString()) {
      rapidApiUrl += `?${apiParams.toString()}`;
    }

    console.log('Making RapidAPI request to:', rapidApiUrl);

    // Make request to RapidAPI
    const response = await fetch(rapidApiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RapidAPI error:', response.status, errorText);
      throw new Error(`RapidAPI request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing muscle group request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process muscle group image request",
        type: error.name || "UnknownError"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});