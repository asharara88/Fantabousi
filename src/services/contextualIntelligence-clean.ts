/**
 * Simplified Contextual Intelligence System for Biowell AI Coach
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
  stress_level: number;
  medical_conditions: string[];
}

export interface HealthMetricsContext {
  weight: number;
  body_fat?: number;
  muscle_mass?: number;
  last_updated: string;
}

export interface SupplementContext {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  start_date: string;
}

export interface ConversationSummary {
  total_messages: number;
  common_topics: string[];
  personalization_score: number;
  last_session_date: string;
}

export type HealthDomain = 
  | 'nutrition'
  | 'fitness'
  | 'supplements'
  | 'sleep'
  | 'stress_management'
  | 'weight_management'
  | 'general_wellness';

export interface GoalContext {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ActivityContext {
  type: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface UserPreferences {
  communication_style: 'formal' | 'casual' | 'motivational';
  reminder_frequency: 'daily' | 'weekly' | 'as_needed';
  focus_areas: HealthDomain[];
}

export interface SleepPattern {
  bedtime: string;
  wake_time: string;
  average_duration: number;
  quality_score: number;
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
      // Generate intelligent session title
      const title = this.generateSessionTitle(initialTopic);

      const sessionData = {
        user_id: userId,
        title,
        topic: initialTopic,
        health_domain: healthDomain,
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
      
      return session;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Loads an existing session
   */
  async loadSession(sessionId: string): Promise<ChatSession> {
    try {
      const { data: session, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error loading session:', error);
      throw error;
    }
  }

  /**
   * Updates session activity
   */
  async updateSessionActivity(sessionId: string, lastMessage: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({
          last_message: lastMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  /**
   * Generates a contextual session title
   */
  private generateSessionTitle(topic: string): string {
    const titleMappings: Record<string, string> = {
      'nutrition': 'Nutrition Discussion',
      'fitness': 'Fitness Planning',
      'supplements': 'Supplement Guidance',
      'sleep': 'Sleep Optimization',
      'stress': 'Stress Management',
      'weight': 'Weight Management'
    };

    // Simple keyword matching
    for (const [keyword, title] of Object.entries(titleMappings)) {
      if (topic.toLowerCase().includes(keyword)) {
        return title;
      }
    }

    return 'Health Chat';
  }

  /**
   * Builds context snapshot for user
   */
  async buildContextSnapshot(userId: string): Promise<ContextSnapshot> {
    // Return minimal context for now
    return {
      user_profile: {
        id: userId,
        name: 'User',
        health_goals: [],
        activity_level: 'moderate',
        diet_preference: 'balanced',
        stress_level: 5,
        medical_conditions: []
      },
      health_metrics: {
        weight: 0,
        last_updated: new Date().toISOString()
      },
      supplement_stack: [],
      goals: [],
      preferences: {
        communication_style: 'casual',
        reminder_frequency: 'weekly',
        focus_areas: ['general_wellness']
      },
      recent_activities: [],
      conversation_history: {
        total_messages: 0,
        common_topics: [],
        personalization_score: 0.5,
        last_session_date: new Date().toISOString()
      }
    };
  }
}

// Export the session manager instance
export const sessionManager = new SessionManager();
