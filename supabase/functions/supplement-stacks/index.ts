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
    const { action, stackData } = await req.json();

    // Get user ID from JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;

    // Process the request based on the action
    let result;
    switch (action) {
      case "create_stack":
        result = await createStack(supabase, userId, stackData);
        break;
      case "get_stacks":
        result = await getStacks(supabase, userId);
        break;
      case "update_stack":
        result = await updateStack(supabase, userId, stackData);
        break;
      case "analyze_stack":
        result = await analyzeStack(supabase, userId, stackData.id);
        break;
      case "delete_stack":
        result = await deleteStack(supabase, userId, stackData.id);
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

// Create a new supplement stack
async function createStack(supabase, userId, stackData) {
  // Validate required fields
  if (!stackData.name || !stackData.supplements || stackData.supplements.length === 0) {
    throw new Error("Name and supplements are required");
  }

  // Calculate total price based on supplements
  let totalPrice = 0;
  
  // Get supplement prices from the database if IDs are provided
  if (stackData.supplements.some(s => typeof s === 'string' || s.id)) {
    const supplementIds = stackData.supplements.map(s => typeof s === 'string' ? s : s.id);
    const { data: supplementsData } = await supabase
      .from('supplements')
      .select('id, price_aed')
      .in('id', supplementIds);
      
    if (supplementsData) {
      totalPrice = supplementsData.reduce((sum, s) => sum + (s.price_aed || 0), 0);
    }
  }

  // Prepare stack data
  const newStack = {
    user_id: userId,
    name: stackData.name,
    description: stackData.description || '',
    category: stackData.category || 'Custom',
    components: JSON.stringify(stackData.supplements),
    goals: stackData.goals || [],
    total_price: totalPrice,
    created_at: new Date().toISOString(),
    is_active: stackData.is_active || false
  };

  // Insert into database
  const { data, error } = await supabase
    .from('supplement_stacks')
    .insert(newStack)
    .select()
    .single();

  if (error) throw error;
  return { success: true, stack: data };
}

// Get all supplement stacks for a user
async function getStacks(supabase, userId) {
  const { data, error } = await supabase
    .from('supplement_stacks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { success: true, stacks: data || [] };
}

// Update an existing supplement stack
async function updateStack(supabase, userId, stackData) {
  if (!stackData.id) {
    throw new Error("Stack ID is required");
  }

  // Verify ownership
  const { data: existingStack, error: fetchError } = await supabase
    .from('supplement_stacks')
    .select('id')
    .eq('id', stackData.id)
    .eq('user_id', userId)
    .single();

  if (fetchError || !existingStack) {
    throw new Error("Stack not found or you don't have permission to update it");
  }

  // Calculate total price if supplements changed
  let totalPrice = stackData.total_price;
  
  if (stackData.supplements) {
    const supplementIds = stackData.supplements.map(s => typeof s === 'string' ? s : s.id);
    const { data: supplementsData } = await supabase
      .from('supplements')
      .select('id, price_aed')
      .in('id', supplementIds);
      
    if (supplementsData) {
      totalPrice = supplementsData.reduce((sum, s) => sum + (s.price_aed || 0), 0);
    }
  }

  // Prepare update data
  const updateData = {
    name: stackData.name,
    description: stackData.description,
    category: stackData.category,
    components: stackData.supplements ? JSON.stringify(stackData.supplements) : undefined,
    goals: stackData.goals,
    total_price: totalPrice,
    updated_at: new Date().toISOString(),
    is_active: stackData.is_active
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) delete updateData[key];
  });

  // Update in database
  const { data, error } = await supabase
    .from('supplement_stacks')
    .update(updateData)
    .eq('id', stackData.id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return { success: true, stack: data };
}

// Analyze a supplement stack
async function analyzeStack(supabase, userId, stackId) {
  // Verify ownership and get stack data
  const { data: stack, error: fetchError } = await supabase
    .from('supplement_stacks')
    .select('*')
    .eq('id', stackId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !stack) {
    throw new Error("Stack not found or you don't have permission to access it");
  }

  // Parse components
  let components = [];
  try {
    components = JSON.parse(stack.components);
  } catch (e) {
    console.error("Error parsing stack components:", e);
  }

  // Get supplement details
  let supplementDetails = [];
  if (components.length > 0) {
    const supplementIds = components.map(c => typeof c === 'string' ? c : c.id);
    const { data: supplements } = await supabase
      .from('supplements')
      .select('*')
      .in('id', supplementIds);
      
    supplementDetails = supplements || [];
  }

  // Perform basic analysis
  const analysis = {
    supplementCount: supplementDetails.length,
    totalPrice: stack.total_price,
    categories: [...new Set(supplementDetails.map(s => s.category).filter(Boolean))],
    evidenceLevels: {
      green: supplementDetails.filter(s => s.evidence_level === 'Green').length,
      yellow: supplementDetails.filter(s => s.evidence_level === 'Yellow').length,
      red: supplementDetails.filter(s => s.evidence_level === 'Red').length,
    },
    potentialInteractions: detectPotentialInteractions(supplementDetails),
    recommendations: generateRecommendations(supplementDetails, stack.goals)
  };

  return { 
    success: true, 
    stack, 
    supplements: supplementDetails,
    analysis 
  };
}

// Delete a supplement stack
async function deleteStack(supabase, userId, stackId) {
  // Verify ownership
  const { data: existingStack, error: fetchError } = await supabase
    .from('supplement_stacks')
    .select('id')
    .eq('id', stackId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !existingStack) {
    throw new Error("Stack not found or you don't have permission to delete it");
  }

  // Delete from database
  const { error } = await supabase
    .from('supplement_stacks')
    .delete()
    .eq('id', stackId)
    .eq('user_id', userId);

  if (error) throw error;
  return { success: true };
}

// Helper function to detect potential interactions between supplements
function detectPotentialInteractions(supplements) {
  const interactions = [];
  
  // This is a simplified example - in a real application, you would have a more
  // comprehensive database of known supplement interactions
  const knownInteractions = [
    { pair: ['Vitamin D', 'Calcium'], description: 'Synergistic: Vitamin D enhances calcium absorption' },
    { pair: ['Iron', 'Vitamin C'], description: 'Synergistic: Vitamin C enhances iron absorption' },
    { pair: ['Iron', 'Calcium'], description: 'Antagonistic: Calcium may reduce iron absorption' },
    { pair: ['Zinc', 'Copper'], description: 'Antagonistic: High zinc intake can reduce copper absorption' },
    { pair: ['Magnesium', 'Vitamin D'], description: 'Synergistic: Work together for bone health' },
    { pair: ['Omega-3', 'Vitamin E'], description: 'Synergistic: Vitamin E protects Omega-3 from oxidation' },
  ];
  
  const supplementNames = supplements.map(s => s.name);
  
  for (const interaction of knownInteractions) {
    const [supp1, supp2] = interaction.pair;
    if (supplementNames.includes(supp1) && supplementNames.includes(supp2)) {
      interactions.push(interaction);
    }
  }
  
  return interactions;
}

// Helper function to generate recommendations based on supplements and goals
function generateRecommendations(supplements, goals) {
  const recommendations = [];
  
  // Check for missing key supplements based on goals
  if (goals && goals.includes('Immune Support')) {
    const hasVitaminD = supplements.some(s => s.name.includes('Vitamin D'));
    const hasVitaminC = supplements.some(s => s.name.includes('Vitamin C'));
    const hasZinc = supplements.some(s => s.name.includes('Zinc'));
    
    if (!hasVitaminD) {
      recommendations.push('Consider adding Vitamin D for immune support');
    }
    if (!hasVitaminC) {
      recommendations.push('Consider adding Vitamin C for immune support');
    }
    if (!hasZinc) {
      recommendations.push('Consider adding Zinc for immune support');
    }
  }
  
  if (goals && goals.includes('Sleep')) {
    const hasMagnesium = supplements.some(s => s.name.includes('Magnesium'));
    const hasMelatonin = supplements.some(s => s.name.includes('Melatonin'));
    
    if (!hasMagnesium) {
      recommendations.push('Consider adding Magnesium for sleep support');
    }
    if (!hasMelatonin) {
      recommendations.push('Consider adding Melatonin for sleep support');
    }
  }
  
  // Add timing recommendations
  const hasCaffeine = supplements.some(s => s.name.toLowerCase().includes('caffeine'));
  if (hasCaffeine) {
    recommendations.push('Take caffeine-containing supplements before noon to avoid sleep disruption');
  }
  
  const hasOmega3 = supplements.some(s => 
    s.name.toLowerCase().includes('omega') || 
    s.name.toLowerCase().includes('fish oil')
  );
  if (hasOmega3) {
    recommendations.push('Take Omega-3/Fish Oil with meals to improve absorption and reduce fishy aftertaste');
  }
  
  return recommendations;
}