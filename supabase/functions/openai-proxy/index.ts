/* eslint-disable */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enhanced system prompt for health coaching
const HEALTH_COACH_SYSTEM_PROMPT = `You are MyCoach™, an AI health and wellness assistant created by Biowell. You provide evidence-based guidance on nutrition, fitness, sleep, stress management, and supplements.

Key guidelines:
- Provide personalized, actionable advice based on scientific evidence
- Always emphasize that you're not a replacement for medical professionals
- Focus on evidence-based recommendations (mention research when relevant)
- Be encouraging and supportive while remaining factual
- When discussing supplements, mention evidence tiers (strong/moderate/limited evidence)
- Keep responses conversational but informative
- If asked about serious medical conditions, recommend consulting healthcare providers

Your expertise areas:
- Nutrition and meal planning
- Exercise and fitness guidance  
- Sleep optimization
- Stress management techniques
- Evidence-based supplement recommendations
- Healthy lifestyle habits

Always maintain a helpful, knowledgeable, and encouraging tone while prioritizing user safety and evidence-based information.`;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY in your Supabase secrets.");
    }

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }
    
    // Prepare messages with system prompt
    const enhancedMessages = [
      { role: "system", content: HEALTH_COACH_SYSTEM_PROMPT },
      ...messages
    ];
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: enhancedMessages,
        max_tokens: 500,
        temperature: 0.8,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message || 'Unknown error'}`);
    }
    
    const result = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    
    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to get AI response. Please try again.";
    
    if (error.message?.includes("API key")) {
      errorMessage = "OpenAI API configuration error. Please contact support.";
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "Service temporarily busy. Please wait a moment and try again.";
    } else if (error.message?.includes("network")) {
      errorMessage = "Network connection error. Please check your internet connection.";
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage, details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});