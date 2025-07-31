/**
 * Enhanced OpenAI Proxy with Contextual Intelligence
 * 
 * This Edge Function provides context-aware AI responses using comprehensive
 * user health data, conversation history, and personalized coaching strategies.
 */

/* eslint-disable */
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enhanced system prompt with context awareness
const CONTEXTUAL_HEALTH_COACH_SYSTEM_PROMPT = `You are MyCoach™, an advanced AI health and wellness assistant created by Biowell. You provide highly personalized, evidence-based guidance using comprehensive user context.

## Core Capabilities:
- **Contextual Intelligence**: You have access to the user's complete health profile, including biometric data, supplement history, lifestyle patterns, and conversation history
- **Multi-Domain Expertise**: Nutrition, fitness, sleep optimization, stress management, supplements, mental health, and longevity
- **Personalized Coaching**: Adapt responses based on user's goals, preferences, current health status, and previous interactions
- **Evidence-Based Guidance**: All recommendations backed by scientific research with appropriate confidence levels

## User Context Integration:
When responding, consider:
1. **Current Health Metrics**: Recent biometric data, trends, and alerts
2. **Supplement Stack**: Current supplements, timing, effectiveness, and interactions
3. **Lifestyle Patterns**: Sleep quality, exercise frequency, stress levels, dietary preferences
4. **Health Goals**: Primary and secondary objectives, progress tracking
5. **Conversation History**: Previous topics, frequently asked questions, personalization score
6. **Medical Context**: Conditions, allergies, medications (recommend professional consultation when appropriate)

## Response Guidelines:
- **Personalization**: Reference specific user data when relevant (e.g., "Based on your recent sleep data showing 6.2 hours average...")
- **Actionable Advice**: Provide specific, measurable recommendations with clear next steps
- **Evidence Levels**: Indicate strength of scientific evidence (strong/moderate/limited/emerging)
- **Safety First**: Always recommend professional medical consultation for serious health concerns
- **Follow-up Questions**: Suggest relevant follow-up questions to deepen understanding
- **Progress Tracking**: Reference improvements or patterns from historical data when available

## Conversation Styles:
- **Professional**: Evidence-focused, clinical terminology when appropriate
- **Encouraging**: Supportive tone emphasizing progress and achievable goals
- **Educational**: Explain the "why" behind recommendations with scientific context
- **Practical**: Focus on implementation strategies and real-world application

## Domain-Specific Expertise:

### Nutrition:
- Macro/micronutrient optimization based on goals and current intake
- Meal timing strategies for circadian rhythm and metabolic health
- Food-supplement interactions and nutrient absorption
- Dietary pattern recommendations (Mediterranean, plant-based, etc.)

### Fitness:
- Exercise prescription based on current fitness level and goals
- Recovery optimization and periodization strategies
- Movement patterns for specific health conditions
- Integration with sleep and nutrition for optimal results

### Sleep:
- Sleep hygiene optimization based on current patterns
- Circadian rhythm regulation strategies
- Supplement timing for sleep quality
- Environmental and behavioral modifications

### Supplements:
- Evidence-based recommendations with dosing and timing
- Drug-nutrient interactions and contraindications
- Quality considerations and third-party testing
- Personalized stacking strategies based on goals and deficiencies

### Stress & Mental Health:
- Stress management techniques tailored to triggers and lifestyle
- Mindfulness and meditation guidance based on experience level
- Work-life balance strategies for specific situations
- Breathwork and relaxation techniques

## Important Guidelines:
- Never provide medical diagnosis or treatment
- Always emphasize the importance of professional medical care
- Maintain clear boundaries about scope of advice
- Reference specific studies when discussing evidence levels
- Encourage gradual, sustainable changes over quick fixes
- Celebrate progress and acknowledge challenges

Always maintain a helpful, knowledgeable, and encouraging tone while prioritizing user safety and evidence-based information.`;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionContext, userContext } = await req.json();
    
    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY in your Supabase secrets.");
    }

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    // Get Supabase credentials for context fetching
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials not found - proceeding without context enhancement");
    }

    // Initialize Supabase client for context fetching
    const supabase = createClient(supabaseUrl || "", supabaseKey || "");

    // Get user ID from authorization header
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    
    if (authHeader && supabase) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    // Build enhanced context-aware prompt
    let enhancedSystemPrompt = CONTEXTUAL_HEALTH_COACH_SYSTEM_PROMPT;
    
    if (userId && supabase) {
      try {
        const contextualData = await buildUserContext(supabase, userId);
        enhancedSystemPrompt += generateContextualPromptAddition(contextualData);
      } catch (contextError) {
        console.warn("Error fetching user context:", contextError);
      }
    }

    // Prepare messages with enhanced system prompt
    const enhancedMessages = [
      { role: "system", content: enhancedSystemPrompt },
      ...messages
    ];
    
    // Call OpenAI API with enhanced context
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4", // Use GPT-4 for better contextual understanding
        messages: enhancedMessages,
        max_tokens: 1500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from OpenAI");
    }

    const aiResponse = data.choices[0].message.content;

    // Save context-enhanced interaction
    if (userId && supabase) {
      try {
        await saveEnhancedChatHistory(supabase, userId, messages, aiResponse, sessionContext);
      } catch (saveError) {
        console.warn("Error saving chat history:", saveError);
      }
    }

    return new Response(
      JSON.stringify({ 
        result: aiResponse,
        usage: data.usage,
        context_enhanced: !!userId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error in contextual OpenAI proxy:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process request",
        fallback: "I apologize, but I'm experiencing technical difficulties. Please try asking your question again, or contact support if the issue persists."
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

/**
 * Builds comprehensive user context for AI personalization
 */
async function buildUserContext(supabase: any, userId: string) {
  try {
    // Parallel fetch for performance
    const [profile, healthMetrics, supplements, chatHistory, goals] = await Promise.all([
      getUserProfile(supabase, userId),
      getRecentHealthMetrics(supabase, userId),
      getUserSupplements(supabase, userId),
      getRecentChatHistory(supabase, userId),
      getUserGoals(supabase, userId)
    ]);

    return {
      profile,
      healthMetrics,
      supplements,
      chatHistory,
      goals,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error building user context:", error);
    return null;
  }
}

/**
 * Fetches user profile with health-relevant data
 */
async function getUserProfile(supabase: any, userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        first_name, last_name, age, gender, height, weight,
        activity_level, health_goals, diet_preference,
        sleep_hours, stress_level, medical_conditions, allergies
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.warn("Profile fetch error:", error);
      return null;
    }

    return profile;
  } catch (error) {
    console.warn("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Fetches recent health metrics for trend analysis
 */
async function getRecentHealthMetrics(supabase: any, userId: string) {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: metrics, error } = await supabase
      .from('health_metrics')
      .select('metric_type, value, unit, timestamp, source')
      .eq('user_id', userId)
      .gte('timestamp', sevenDaysAgo)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.warn("Health metrics fetch error:", error);
      return [];
    }

    // Group by metric type and calculate trends
    const metricSummary = groupMetricsByType(metrics || []);
    return metricSummary;
  } catch (error) {
    console.warn("Error fetching health metrics:", error);
    return [];
  }
}

/**
 * Fetches user's current supplement stack
 */
async function getUserSupplements(supabase: any, userId: string) {
  try {
    const { data: supplements, error } = await supabase
      .from('user_supplements')
      .select(`
        dosage, timing, start_date, purpose,
        supplement:supplements(name, description, tier)
      `)
      .eq('user_id', userId)
      .eq('subscription_active', true);

    if (error) {
      console.warn("Supplements fetch error:", error);
      return [];
    }

    return supplements?.map(s => ({
      name: s.supplement?.name,
      dosage: s.dosage,
      timing: s.timing,
      purpose: s.purpose,
      start_date: s.start_date,
      tier: s.supplement?.tier
    })) || [];
  } catch (error) {
    console.warn("Error fetching supplements:", error);
    return [];
  }
}

/**
 * Fetches recent conversation history for context continuity
 */
async function getRecentChatHistory(supabase: any, userId: string) {
  try {
    const { data: history, error } = await supabase
      .from('chat_history')
      .select('message, response, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.warn("Chat history fetch error:", error);
      return [];
    }

    return history || [];
  } catch (error) {
    console.warn("Error fetching chat history:", error);
    return [];
  }
}

/**
 * Fetches user goals and progress
 */
async function getUserGoals(supabase: any, userId: string) {
  try {
    // This would be implemented when goals table is available
    return [];
  } catch (error) {
    console.warn("Error fetching user goals:", error);
    return [];
  }
}

/**
 * Groups health metrics by type and calculates summaries
 */
function groupMetricsByType(metrics: any[]) {
  const grouped = metrics.reduce((acc, metric) => {
    const type = metric.metric_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({
      value: metric.value,
      timestamp: metric.timestamp,
      source: metric.source
    });
    return acc;
  }, {});

  // Calculate summaries for each metric type
  const summaries = Object.keys(grouped).map(type => {
    const values = grouped[type];
    const latest = values[0];
    const average = values.reduce((sum, v) => sum + parseFloat(v.value), 0) / values.length;
    
    return {
      type,
      latest_value: latest.value,
      average_7_days: Math.round(average * 100) / 100,
      data_points: values.length,
      last_recorded: latest.timestamp,
      source: latest.source
    };
  });

  return summaries;
}

/**
 * Generates contextual prompt addition based on user data
 */
function generateContextualPromptAddition(contextData: any) {
  if (!contextData) return "";

  let contextPrompt = "\n\n## USER CONTEXT:\n";

  // Profile context
  if (contextData.profile) {
    const p = contextData.profile;
    contextPrompt += `**Profile**: ${p.first_name || 'User'}`;
    if (p.age) contextPrompt += `, ${p.age} years old`;
    if (p.gender) contextPrompt += `, ${p.gender}`;
    contextPrompt += `\n`;
    
    if (p.health_goals?.length) {
      contextPrompt += `**Health Goals**: ${p.health_goals.join(', ')}\n`;
    }
    
    if (p.activity_level) {
      contextPrompt += `**Activity Level**: ${p.activity_level}\n`;
    }
    
    if (p.diet_preference) {
      contextPrompt += `**Diet Preference**: ${p.diet_preference}\n`;
    }
    
    if (p.sleep_hours) {
      contextPrompt += `**Average Sleep**: ${p.sleep_hours} hours\n`;
    }
    
    if (p.stress_level) {
      contextPrompt += `**Stress Level**: ${p.stress_level}/10\n`;
    }
    
    if (p.medical_conditions?.length) {
      contextPrompt += `**Medical Conditions**: ${p.medical_conditions.join(', ')}\n`;
    }
    
    if (p.allergies?.length) {
      contextPrompt += `**Allergies**: ${p.allergies.join(', ')}\n`;
    }
  }

  // Recent health metrics
  if (contextData.healthMetrics?.length) {
    contextPrompt += `\n**Recent Health Metrics (7 days)**:\n`;
    contextData.healthMetrics.forEach(metric => {
      contextPrompt += `- ${metric.type}: ${metric.latest_value} (avg: ${metric.average_7_days}, ${metric.data_points} readings)\n`;
    });
  }

  // Current supplements
  if (contextData.supplements?.length) {
    contextPrompt += `\n**Current Supplements**:\n`;
    contextData.supplements.forEach(supp => {
      contextPrompt += `- ${supp.name}`;
      if (supp.dosage) contextPrompt += ` (${supp.dosage})`;
      if (supp.timing?.length) contextPrompt += ` - ${supp.timing.join(', ')}`;
      if (supp.purpose) contextPrompt += ` for ${supp.purpose}`;
      contextPrompt += `\n`;
    });
  }

  // Recent conversation topics
  if (contextData.chatHistory?.length) {
    contextPrompt += `\n**Recent Discussion Topics**: `;
    const recentTopics = contextData.chatHistory
      .slice(0, 3)
      .map(chat => extractTopicFromMessage(chat.message))
      .filter(Boolean);
    
    if (recentTopics.length) {
      contextPrompt += recentTopics.join(', ') + '\n';
    }
  }

  contextPrompt += `\n**Instructions**: Use this context to provide personalized, relevant advice. Reference specific data when appropriate and build upon previous conversations. Always prioritize safety and evidence-based recommendations.\n`;

  return contextPrompt;
}

/**
 * Extracts topic from chat message for context
 */
function extractTopicFromMessage(message: string): string {
  // Simple topic extraction - could be enhanced with NLP
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('sleep')) return 'sleep';
  if (lowerMessage.includes('supplement')) return 'supplements';
  if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet')) return 'nutrition';
  if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) return 'fitness';
  if (lowerMessage.includes('stress')) return 'stress management';
  if (lowerMessage.includes('weight')) return 'weight management';
  
  return '';
}

/**
 * Saves enhanced chat history with context metadata
 */
async function saveEnhancedChatHistory(
  supabase: any, 
  userId: string, 
  messages: any[], 
  response: string, 
  sessionContext: any
) {
  try {
    const userMessage = messages[messages.length - 1];
    
    const chatRecord = {
      user_id: userId,
      message: userMessage.content,
      response: response,
      session_id: sessionContext?.session_id || null,
      context_enhanced: true,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('chat_history')
      .insert(chatRecord);

    if (error) {
      console.warn("Error saving chat history:", error);
    }
  } catch (error) {
    console.warn("Error in saveEnhancedChatHistory:", error);
  }
}
