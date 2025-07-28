/* eslint-disable */
import { createClient } from "npm:@supabase/supabase-js@2";
import { handleTextToSpeechRequest } from "./text-to-speech.ts";
import { handleVoicesRequest } from "./voices.ts";
import { handleUserInfoRequest } from "./user-info.ts";
import { handleVoiceSettingsRequest } from "./voice-settings.ts";

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
    // Get ElevenLabs API key from environment
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      throw new Error("ElevenLabs API key not configured");
    }

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // Route to appropriate handler based on path
    if (path === "text-to-speech") {
      return await handleTextToSpeechRequest(req, apiKey, corsHeaders);
    } else if (path === "voices") {
      return await handleVoicesRequest(req, apiKey, corsHeaders);
    } else if (path === "user") {
      return await handleUserInfoRequest(req, apiKey, corsHeaders);
    } else if (path.startsWith("voice-settings")) {
      const voiceId = url.searchParams.get("voiceId");
      if (!voiceId) {
        return new Response(
          JSON.stringify({ error: "Voice ID is required" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      return await handleVoiceSettingsRequest(req, voiceId, apiKey, corsHeaders);
    }

    return new Response(
      JSON.stringify({ error: "Invalid endpoint" }),
      { 
        status: 404, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process request",
        type: error.name || "UnknownError"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});