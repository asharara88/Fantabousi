/**
 * Contextual Intelligence System for Biowell AI Coach
 * 
 * This system provides comprehensive session management, context-aware AI responses,
 * and multi-modal interaction capabilities for the health coaching experience.
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ===== TYPES & INTERFACES =====

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  health_domain: HealthDomain;
  created_at: string;
  updated_at: string;
  last_message: string;
  context_snapshot: ContextSnapshot;
  is_active: boolean;
}

export interface ContextSnapshot {
  user_profile: UserContextProfile;
  health_metrics: HealthMetricsContext;
  supplement_stack: SupplementContext[];
  goals: GoalContext[];
  preferences: UserPreferences;
  recent_activities: ActivityContext[];
  conversation_history: ConversationSummary;
}

export interface UserContextProfile {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  health_goals: string[];
  activity_level: string;
  diet_preference: string;
  sleep_pattern: SleepPattern;
  stress_level: number;
  medical_conditions: string[];
  allergies: string[];
}

export interface HealthMetricsContext {
  recent_biometrics: BiometricData[];
  trends: MetricTrend[];
  alerts: HealthAlert[];
  summary: HealthSummary;
}

export interface BiometricData {
  metric_type: string;
  value: number;
  unit: string;
  timestamp: string;
  source: 'wearable' | 'manual' | 'connected_device';
  confidence_score?: number;
}

export interface SupplementContext {
  name: string;
  dosage: string;
  timing: string[];
  start_date: string;
  purpose: string;
  effectiveness_rating?: number;
  side_effects?: string[];
}

export interface ConversationSummary {
  total_conversations: number;
  common_topics: string[];
  last_conversation_date: string;
  user_satisfaction: number;
  frequently_asked_questions: string[];
  personalization_score: number;
}

export type HealthDomain = 
  | 'general_wellness'
  | 'nutrition'
  | 'fitness'
  | 'sleep'
  | 'stress_management'
  | 'supplements'
  | 'mental_health'
  | 'recovery'
  | 'longevity';

export interface ConversationContext {
  session_id: string;
  user_context: ContextSnapshot;
  conversation_flow: ConversationFlow;
  ai_personality: AIPersonality;
  response_style: ResponseStyle;
}

export interface ConversationFlow {
  current_topic: string;
  previous_topics: string[];
  follow_up_questions: string[];
  action_items: ActionItem[];
  suggested_next_steps: string[];
}

export interface ActionItem {
  id: string;
  type: 'recommendation' | 'reminder' | 'measurement' | 'research';
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  completed: boolean;
}

export interface AIPersonality {
  tone: 'professional' | 'friendly' | 'encouraging' | 'scientific';
  detail_level: 'brief' | 'moderate' | 'comprehensive';
  evidence_focus: boolean;
  personalization_level: number;
}

export interface ResponseStyle {
  include_citations: boolean;
  provide_alternatives: boolean;
  ask_follow_ups: boolean;
  suggest_actions: boolean;
  use_analogies: boolean;
}

// ===== SESSION MANAGEMENT =====

export class SessionManager {
  private readonly contextCache: Map<string, ContextSnapshot> = new Map();

  /**
   * Creates a new chat session with contextual intelligence
   */
  async createSession(
    userId: string, 
    initialTopic: string,
    healthDomain: HealthDomain = 'general_wellness'
  ): Promise<ChatSession> {
    try {
      // Get fresh user context
      const contextSnapshot = await this.buildContextSnapshot(userId);
      
      // Generate intelligent session title based on context
      const title = this.generateSessionTitle(initialTopic, contextSnapshot);

      const sessionData = {
        user_id: userId,
        title,
        topic: initialTopic,
        health_domain: healthDomain,
        context_snapshot: contextSnapshot,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message: ''
      };

      const { data: session, error } = await supabase
        .from('chat_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      this.currentSession = session;
      this.contextCache.set(session.id, contextSnapshot);
      
      return session;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Loads an existing session and restores context
   */
  async loadSession(sessionId: string): Promise<ChatSession> {
    try {
      const { data: session, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;

      // Refresh context if session is older than 1 hour
      const sessionAge = Date.now() - new Date(session.updated_at).getTime();
      if (sessionAge > 3600000) { // 1 hour in milliseconds
        const freshContext = await this.buildContextSnapshot(session.user_id);
        await this.updateSessionContext(sessionId, freshContext);
        session.context_snapshot = freshContext;
      }

      this.currentSession = session;
      this.contextCache.set(sessionId, session.context_snapshot);
      
      return session;
    } catch (error) {
      console.error('Error loading session:', error);
      throw error;
    }
  }

  /**
   * Gets all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    try {
      const { data: sessions, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return sessions || [];
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  /**
   * Switches context between different health domains
   */
  async switchContext(sessionId: string, newDomain: HealthDomain): Promise<void> {
    try {
      const session = await this.loadSession(sessionId);
      const updatedContext = await this.buildDomainSpecificContext(
        session.user_id, 
        newDomain
      );

      await supabase
        .from('chat_sessions')
        .update({
          health_domain: newDomain,
          context_snapshot: updatedContext,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      this.contextCache.set(sessionId, updatedContext);
    } catch (error) {
      console.error('Error switching context:', error);
      throw error;
    }
  }

  /**
   * Builds comprehensive context snapshot for a user
   */
  private async buildContextSnapshot(userId: string): Promise<ContextSnapshot> {
    try {
      // Parallel data fetching for performance
      const [
        userProfile,
        healthMetrics,
        supplements,
        conversationHistory
      ] = await Promise.all([
        this.getUserProfile(userId),
        this.getHealthMetricsContext(userId),
        this.getSupplementContext(userId),
        this.getConversationSummary(userId)
      ]);

      return {
        user_profile: userProfile,
        health_metrics: healthMetrics,
        supplement_stack: supplements,
        goals: await this.getUserGoals(userId),
        preferences: await this.getUserPreferences(userId),
        recent_activities: await this.getRecentActivities(userId),
        conversation_history: conversationHistory
      };
    } catch (error) {
      console.error('Error building context snapshot:', error);
      throw error;
    }
  }

  /**
   * Builds domain-specific context for focused conversations
   */
  private async buildDomainSpecificContext(
    userId: string, 
    domain: HealthDomain
  ): Promise<ContextSnapshot> {
    const baseContext = await this.buildContextSnapshot(userId);
    
    // Enhance context with domain-specific data
    switch (domain) {
      case 'nutrition':
        baseContext.recent_activities = await this.getNutritionActivities(userId);
        break;
      case 'fitness':
        baseContext.recent_activities = await this.getFitnessActivities(userId);
        break;
      case 'sleep':
        baseContext.health_metrics = await this.getSleepMetrics(userId);
        break;
      case 'supplements':
        baseContext.supplement_stack = await this.getDetailedSupplementContext(userId);
        break;
      // Add more domain-specific enhancements
    }

    return baseContext;
  }

  /**
   * Updates session context with fresh data
   */
  private async updateSessionContext(
    sessionId: string, 
    context: ContextSnapshot
  ): Promise<void> {
    await supabase
      .from('chat_sessions')
      .update({
        context_snapshot: context,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
  }

  /**
   * Generates intelligent session titles based on context
   */
  private generateSessionTitle(topic: string, context: ContextSnapshot): string {
    const { user_profile, health_metrics } = context;
    
    // Use AI-like logic to create meaningful titles
    if (topic.toLowerCase().includes('sleep')) {
      return `Sleep Optimization - ${new Date().toLocaleDateString()}`;
    }
    
    if (topic.toLowerCase().includes('supplement')) {
      return `Supplement Review - ${user_profile.health_goals[0] || 'General'}`;
    }
    
    if (topic.toLowerCase().includes('nutrition')) {
      return `Nutrition Planning - ${user_profile.diet_preference || 'Custom'}`;
    }
    
    return `Health Chat - ${new Date().toLocaleDateString()}`;
  }

  // ===== CONTEXT FETCHING METHODS =====

  private async getUserProfile(userId: string): Promise<UserContextProfile> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        age: profile.age,
        gender: profile.gender,
        health_goals: profile.health_goals || [],
        activity_level: profile.activity_level || 'moderate',
        diet_preference: profile.diet_preference || 'omnivore',
        sleep_pattern: {
          average_hours: profile.sleep_hours || 7,
          bedtime: profile.bed_time || '22:00',
          wake_time: profile.wake_time || '06:00',
          quality: profile.sleep_quality || 'good'
        },
        stress_level: profile.stress_level || 3,
        medical_conditions: profile.medical_conditions || [],
        allergies: profile.allergies || []
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return this.getDefaultProfile(userId);
    }
  }

  private async getHealthMetricsContext(userId: string): Promise<HealthMetricsContext> {
    try {
      const { data: metrics, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return {
        recent_biometrics: metrics?.map(m => ({
          metric_type: m.metric_type,
          value: m.value,
          unit: m.unit,
          timestamp: m.timestamp,
          source: m.source || 'manual'
        })) || [],
        trends: this.calculateTrends(metrics || []),
        alerts: this.generateHealthAlerts(metrics || []),
        summary: this.generateHealthSummary(metrics || [])
      };
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return {
        recent_biometrics: [],
        trends: [],
        alerts: [],
        summary: { overall_score: 70, improvement_areas: [], strengths: [] }
      };
    }
  }

  private async getSupplementContext(userId: string): Promise<SupplementContext[]> {
    try {
      const { data: supplements, error } = await supabase
        .from('user_supplements')
        .select(`
          *,
          supplement:supplements(name, description, tier)
        `)
        .eq('user_id', userId)
        .eq('subscription_active', true);

      if (error) throw error;

      return supplements?.map(s => ({
        name: s.supplement.name,
        dosage: s.dosage || 'As directed',
        timing: s.timing || ['morning'],
        start_date: s.start_date,
        purpose: s.purpose || 'General wellness',
        effectiveness_rating: s.effectiveness_rating
      })) || [];
    } catch (error) {
      console.error('Error fetching supplements:', error);
      return [];
    }
  }

  private async getConversationSummary(userId: string): Promise<ConversationSummary> {
    try {
      const { data: history, error } = await supabase
        .from('chat_history')
        .select('message, response, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return {
        total_conversations: history?.length || 0,
        common_topics: this.extractCommonTopics(history || []),
        last_conversation_date: history?.[0]?.created_at || '',
        user_satisfaction: 4.2, // Could be calculated from feedback
        frequently_asked_questions: this.extractFAQs(history || []),
        personalization_score: this.calculatePersonalizationScore(history || [])
      };
    } catch (error) {
      console.error('Error fetching conversation summary:', error);
      return {
        total_conversations: 0,
        common_topics: [],
        last_conversation_date: '',
        user_satisfaction: 0,
        frequently_asked_questions: [],
        personalization_score: 0
      };
    }
  }

  // ===== UTILITY METHODS =====

  private getDefaultProfile(userId: string): UserContextProfile {
    return {
      id: userId,
      name: 'User',
      health_goals: ['general_wellness'],
      activity_level: 'moderate',
      diet_preference: 'omnivore',
      sleep_pattern: {
        average_hours: 7,
        bedtime: '22:00',
        wake_time: '06:00',
        quality: 'good'
      },
      stress_level: 3,
      medical_conditions: [],
      allergies: []
    };
  }

  private calculateTrends(metrics: any[]): MetricTrend[] {
    // Implement trend analysis logic
    return [];
  }

  private generateHealthAlerts(metrics: any[]): HealthAlert[] {
    // Implement alert generation logic
    return [];
  }

  private generateHealthSummary(metrics: any[]): HealthSummary {
    return {
      overall_score: 75,
      improvement_areas: ['sleep', 'hydration'],
      strengths: ['consistent_exercise', 'supplement_adherence']
    };
  }

  private extractCommonTopics(history: any[]): string[] {
    // Implement topic extraction logic
    return ['sleep', 'supplements', 'nutrition'];
  }

  private extractFAQs(history: any[]): string[] {
    // Implement FAQ extraction logic
    return [];
  }

  private calculatePersonalizationScore(history: any[]): number {
    // Implement personalization scoring logic
    return 0.8;
  }

  // Domain-specific context methods
  private async getUserGoals(userId: string): Promise<GoalContext[]> {
    // Implementation for goals
    return [];
  }

  private async getUserPreferences(userId: string): Promise<UserPreferences> {
    // Implementation for preferences
    return {
      communication_style: 'professional',
      detail_level: 'moderate',
      reminder_frequency: 'daily'
    };
  }

  private async getRecentActivities(userId: string): Promise<ActivityContext[]> {
    // Implementation for activities
    return [];
  }

  private async getNutritionActivities(userId: string): Promise<ActivityContext[]> {
    // Implementation for nutrition-specific activities
    return [];
  }

  private async getFitnessActivities(userId: string): Promise<ActivityContext[]> {
    // Implementation for fitness-specific activities
    return [];
  }

  private async getSleepMetrics(userId: string): Promise<HealthMetricsContext> {
    // Implementation for sleep-specific metrics
    return {
      recent_biometrics: [],
      trends: [],
      alerts: [],
      summary: { overall_score: 70, improvement_areas: [], strengths: [] }
    };
  }

  private async getDetailedSupplementContext(userId: string): Promise<SupplementContext[]> {
    // Implementation for detailed supplement context
    return [];
  }
}

// ===== MISSING INTERFACES =====

interface SleepPattern {
  average_hours: number;
  bedtime: string;
  wake_time: string;
  quality: string;
}

interface MetricTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  percentage_change: number;
  timeframe: string;
}

interface HealthAlert {
  type: 'warning' | 'info' | 'success';
  message: string;
  metric: string;
  severity: 'low' | 'medium' | 'high';
  action_required: boolean;
}

interface HealthSummary {
  overall_score: number;
  improvement_areas: string[];
  strengths: string[];
}

interface GoalContext {
  id: string;
  type: string;
  description: string;
  target: number;
  current: number;
  deadline?: string;
  progress_percentage: number;
}

interface UserPreferences {
  communication_style: string;
  detail_level: string;
  reminder_frequency: string;
}

interface ActivityContext {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  data: Record<string, any>;
}

// Export the session manager instance
export const sessionManager = new SessionManager();
