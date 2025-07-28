/* eslint-disable */
import { createClient } from "npm:@supabase/supabase-js@2";

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

    // Get the request body
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

    // Process the request based on the action
    let result;
    switch (action) {
      case "save_chat_message":
        result = await saveChatMessage(supabase, userId, data);
        break;
      case "get_chat_history":
        result = await getChatHistory(supabase, userId, data);
        break;
      case "get_user_context":
        result = await getUserContext(supabase, userId);
        break;
      case "create_chat_session":
        result = await createChatSession(supabase, userId, data);
        break;
      case "update_session":
        result = await updateSession(supabase, userId, data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Save a chat message
async function saveChatMessage(supabase, userId, data) {
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  const { message, response, sessionId } = data;

  const { data: chatData, error } = await supabase
    .from('chat_history')
    .insert({
      user_id: userId,
      message,
      response,
      session_id: sessionId,
      role: 'user',
      timestamp: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return { success: true, data: chatData };
}

// Get chat history for a user
async function getChatHistory(supabase, userId, data) {
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  const { sessionId, limit = 50 } = data || {};

  let query = supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (sessionId) {
    query = query.eq('session_id', sessionId);
  }

  const { data: history, error } = await query;

  if (error) throw error;
  return { success: true, data: history || [] };
}

// Get user context for personalized responses
async function getUserContext(supabase, userId) {
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Get recent health metrics (if available)
    const { data: metrics, error: metricsError } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
    }

    // Get user supplements
    const { data: supplements, error: supplementsError } = await supabase
      .from('user_supplements')
      .select(`
        *,
        supplement:supplements(name, description, tier)
      `)
      .eq('user_id', userId)
      .eq('subscription_active', true);

    if (supplementsError) {
      console.error('Error fetching supplements:', supplementsError);
    }

    return {
      success: true,
      context: {
        profile: profile || {},
        metrics: metrics || [],
        supplements: supplements || []
      }
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return { success: false, error: error.message };
  }
}

// Create a new chat session
async function createChatSession(supabase, userId, data) {
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  const { title } = data || {};

  const { data: session, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: userId,
      title: title || 'New Chat',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return { success: true, data: session };
}

// Update chat session metadata
async function updateSession(supabase, userId, data) {
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  const { sessionId, title, lastMessage } = data;

  if (!sessionId) {
    throw new Error("Session ID is required");
  }

  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  if (title) updateData.title = title;
  if (lastMessage) updateData.last_message = lastMessage;

  const { data: session, error } = await supabase
    .from('chat_sessions')
    .update(updateData)
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return { success: true, data: session };
}