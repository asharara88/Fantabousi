import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  age?: number;
  height?: { value: number; unit: 'cm' | 'ft' };
  weight?: { value: number; unit: 'kg' | 'lbs' };
  activityLevel?: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';
  primaryHealthGoals?: string[];
  secondaryHealthGoals?: string[];
  healthConcerns?: string[];
  fitnessGoals?: string[];
  sleepHours?: number;
  bedTime?: string;
  wakeTime?: string;
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  exerciseFrequency?: 'never' | 'rarely' | '1-2-times' | '3-4-times' | '5-6-times' | 'daily';
  exerciseTypes?: string[];
  dietPreference?: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | 'mediterranean' | 'other';
  dietaryRestrictions?: string[];
  allergies?: string[];
  stressLevel?: number;
  stressTriggers?: string[];
  mentalHealthGoals?: string[];
  meditationExperience?: 'none' | 'beginner' | 'intermediate' | 'advanced';
  currentSupplements?: string[];
  medicationList?: string[];
  medicalConditions?: string[];
  doctorConsultation?: boolean;
  communicationPreferences?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacySettings?: {
    dataSharing?: boolean;
    analytics?: boolean;
  };
  onboardingCompleted?: boolean;
  onboardingCompletedAt?: string;
}

interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  stepProgress: Record<number, number>;
}

interface UserProfileState {
  profile: UserProfile | null;
  onboardingProgress: OnboardingProgress;
  loading: boolean;
  saving: boolean;
  error: string | null;
  loadProfile: (userId?: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (finalData?: Partial<UserProfile>) => Promise<void>;
  setOnboardingStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  updateStepProgress: (step: number, progress: number) => void;
  clearError: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  profile: null,
  onboardingProgress: {
    currentStep: 1,
    completedSteps: [],
    stepProgress: {}
  },
  loading: false,
  saving: false,
  error: null,

  loadProfile: async (userId) => {
    set({ loading: true, error: null });
    try {
      // Get current user if userId not provided
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      }

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Fetch user profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Transform database fields to match our UserProfile interface
      const profile: UserProfile = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        mobile: data.mobile,
        onboardingCompleted: data.onboarding_completed,
        // Map other fields as needed
      };

      set({ profile, loading: false });
    } catch (error) {
      console.error('Error loading profile:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load profile', 
        loading: false 
      });
    }
  },

  updateProfile: async (data) => {
    set({ saving: true, error: null });
    try {
      const { profile } = get();
      
      if (!profile?.id) {
        throw new Error('User not authenticated');
      }

      // Transform our UserProfile interface to match database fields
      const dbData: Record<string, any> = {};
      
      // Map fields
      if (data.firstName !== undefined) dbData.first_name = data.firstName;
      if (data.lastName !== undefined) dbData.last_name = data.lastName;
      if (data.mobile !== undefined) dbData.mobile = data.mobile;
      // Map other fields as needed

      const { error } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('id', profile.id);

      if (error) throw error;

      // Update local state
      set({ 
        profile: { ...profile, ...data },
        saving: false 
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile', 
        saving: false 
      });
    }
  },

  completeOnboarding: async (finalData) => {
    set({ saving: true, error: null });
    try {
      const { profile } = get();
      
      if (!profile?.id) {
        throw new Error('User not authenticated');
      }

      // Update profile with final data if provided
      if (finalData) {
        await get().updateProfile(finalData);
      }

      // Mark onboarding as completed
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Update local state
      set({ 
        profile: { 
          ...profile, 
          ...finalData,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString()
        },
        saving: false 
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to complete onboarding', 
        saving: false 
      });
    }
  },

  setOnboardingStep: (step) => {
    set(state => ({
      onboardingProgress: {
        ...state.onboardingProgress,
        currentStep: step
      }
    }));
  },

  markStepCompleted: (step) => {
    set(state => {
      const completedSteps = [...state.onboardingProgress.completedSteps];
      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
      }
      return {
        onboardingProgress: {
          ...state.onboardingProgress,
          completedSteps,
          stepProgress: {
            ...state.onboardingProgress.stepProgress,
            [step]: 100
          }
        }
      };
    });
  },

  updateStepProgress: (step, progress) => {
    set(state => ({
      onboardingProgress: {
        ...state.onboardingProgress,
        stepProgress: {
          ...state.onboardingProgress.stepProgress,
          [step]: progress
        }
      }
    }));
  },

  clearError: () => set({ error: null })
}));