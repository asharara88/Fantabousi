/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  exercises: Exercise[];
  targetMuscles: string[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: string;
  duration?: number;
  muscleGroups: string[];
  equipment?: string[];
  instructions: string[];
}

export interface NutritionAnalysis {
  meal: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  recommendations: string[];
  healthScore: number;
}

export interface WorkoutRecommendation {
  workoutType: string;
  duration: number;
  intensity: string;
  exercises: Exercise[];
  reasoning: string;
}

// API functions
export const aiWorkoutPlannerApi = {
  // Generate personalized workout plan
  generateWorkoutPlan: async (preferences: {
    goal: string;
    experience: string;
    duration: number;
    equipment?: string[];
    targetMuscles?: string[];
  }): Promise<WorkoutPlan | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-workout-planner', {
        body: {
          endpoint: 'generate-workout-plan',
          data: preferences
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      return null;
    }
  },

  // Get exercise recommendations
  getExerciseRecommendations: async (muscleGroup: string, equipment?: string[]): Promise<Exercise[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-workout-planner', {
        body: {
          endpoint: 'get-exercises',
          data: { muscleGroup, equipment }
        }
      });
      
      if (error) throw error;
      return data?.exercises || [];
    } catch (error) {
      console.error('Error getting exercise recommendations:', error);
      return [];
    }
  },

  // Analyze food plate
  analyzeFoodPlate: async (mealDescription: string): Promise<NutritionAnalysis | null> => {
    try {
      const res = await fetch(
        `${supabaseUrl}/functions/v1/analyze-food-plate`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({ meal: mealDescription }),
        }
      );
      
      if (!res.ok) throw new Error("Failed to analyze food plate");
      return await res.json();
    } catch (error) {
      console.error('Error analyzing food plate:', error);
      return null;
    }
  },

  // Get workout recommendations based on goals
  getWorkoutRecommendations: async (userProfile: {
    goals: string[];
    experience: string;
    availableTime: number;
    preferences: string[];
  }): Promise<WorkoutRecommendation[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-workout-planner', {
        body: {
          endpoint: 'recommend-workouts',
          data: userProfile
        }
      });
      
      if (error) throw error;
      return data?.recommendations || [];
    } catch (error) {
      console.error('Error getting workout recommendations:', error);
      return [];
    }
  },

  // Analyze workout performance
  analyzeWorkoutPerformance: async (workoutData: {
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      weight?: number;
      duration?: number;
    }>;
    totalDuration: number;
    perceived_exertion: number;
  }): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-workout-planner', {
        body: {
          endpoint: 'analyze-performance',
          data: workoutData
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error analyzing workout performance:', error);
      return null;
    }
  },

  // Get nutrition recommendations
  getNutritionRecommendations: async (goals: string[], currentStats: {
    age: number;
    weight: number;
    height: number;
    activity_level: string;
  }): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-workout-planner', {
        body: {
          endpoint: 'nutrition-recommendations',
          data: { goals, stats: currentStats }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting nutrition recommendations:', error);
      return null;
    }
  }
};