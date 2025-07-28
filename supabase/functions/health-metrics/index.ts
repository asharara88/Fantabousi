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

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;
    switch (action) {
      case "log_metric":
        result = await logHealthMetric(supabase, userId, data);
        break;
      case "get_metrics":
        result = await getHealthMetrics(supabase, userId, data);
        break;
      case "get_summary":
        result = await getHealthSummary(supabase, userId, data);
        break;
      case "sync_wearable":
        result = await syncWearableData(supabase, userId, data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process request" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Log a health metric
async function logHealthMetric(supabase, userId: string, data: any) {
  const { metricType, value, unit, source, metadata } = data;

  const { data: metric, error } = await supabase
    .from('health_metrics')
    .insert({
      user_id: userId,
      metric_type: metricType,
      value: value,
      unit: unit,
      source: source || 'manual',
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return { success: true, metric };
}

// Get health metrics for a user
async function getHealthMetrics(supabase, userId: string, data: any) {
  const { metricType, days = 30, limit = 100 } = data || {};
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let query = supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (metricType) {
    query = query.eq('metric_type', metricType);
  }

  const { data: metrics, error } = await query;

  if (error) throw error;
  return { success: true, metrics: metrics || [] };
}

// Get health summary
async function getHealthSummary(supabase, userId: string, data: any) {
  const { days = 7 } = data || {};
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all metrics for the time period
  const { data: metrics, error } = await supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: false });

  if (error) throw error;

  // Calculate summary statistics
  const summary = {
    totalMetrics: metrics?.length || 0,
    metricTypes: [...new Set(metrics?.map(m => m.metric_type) || [])],
    averages: {},
    trends: {}
  };

  // Calculate averages for each metric type
  const metricsByType = {};
  (metrics || []).forEach(metric => {
    if (!metricsByType[metric.metric_type]) {
      metricsByType[metric.metric_type] = [];
    }
    metricsByType[metric.metric_type].push(parseFloat(metric.value));
  });

  Object.keys(metricsByType).forEach(type => {
    const values = metricsByType[type];
    summary.averages[type] = values.reduce((sum, val) => sum + val, 0) / values.length;
  });

  return { success: true, summary };
}

// Sync wearable data
async function syncWearableData(supabase, userId: string, data: any) {
  const { deviceType, deviceData } = data;

  // Process different types of wearable data
  const metricsToInsert = [];
  
  if (deviceData.steps) {
    metricsToInsert.push({
      user_id: userId,
      metric_type: 'steps',
      value: deviceData.steps,
      unit: 'count',
      source: 'wearable',
      metadata: { device_type: deviceType },
      timestamp: new Date().toISOString()
    });
  }

  if (deviceData.heartRate) {
    metricsToInsert.push({
      user_id: userId,
      metric_type: 'heart_rate',
      value: deviceData.heartRate,
      unit: 'bpm',
      source: 'wearable',
      metadata: { device_type: deviceType },
      timestamp: new Date().toISOString()
    });
  }

  if (deviceData.sleep) {
    metricsToInsert.push({
      user_id: userId,
      metric_type: 'sleep',
      value: deviceData.sleep,
      unit: 'hours',
      source: 'wearable',
      metadata: { device_type: deviceType },
      timestamp: new Date().toISOString()
    });
  }

  if (metricsToInsert.length > 0) {
    const { error } = await supabase
      .from('health_metrics')
      .insert(metricsToInsert);

    if (error) throw error;
  }

  return { success: true, synced: metricsToInsert.length };
}