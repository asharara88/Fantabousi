/*
  # Enhanced Onboarding System

  1. New Fields
    - Add additional fields to profiles table for comprehensive user data
    - Add corresponding fields to quiz_responses table for compatibility
    - Add onboarding_completed_at timestamp to track completion time

  2. Indexes
    - Create indexes for frequently queried fields to improve performance

  3. Comments
    - Add descriptive comments for complex fields
*/

-- Add new columns to profiles table for enhanced onboarding if they don't exist
DO $$
BEGIN
  -- Health & Demographics
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'age') THEN
    ALTER TABLE profiles ADD COLUMN age INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'height') THEN
    ALTER TABLE profiles ADD COLUMN height JSONB;
    COMMENT ON COLUMN profiles.height IS 'User height stored as JSON with value and unit fields';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'weight') THEN
    ALTER TABLE profiles ADD COLUMN weight JSONB;
    COMMENT ON COLUMN profiles.weight IS 'User weight stored as JSON with value and unit fields';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'activity_level') THEN
    ALTER TABLE profiles ADD COLUMN activity_level TEXT;
  END IF;
  
  -- Health Goals & Preferences
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'primary_health_goals') THEN
    ALTER TABLE profiles ADD COLUMN primary_health_goals TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'secondary_health_goals') THEN
    ALTER TABLE profiles ADD COLUMN secondary_health_goals TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'health_concerns') THEN
    ALTER TABLE profiles ADD COLUMN health_concerns TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'fitness_goals') THEN
    ALTER TABLE profiles ADD COLUMN fitness_goals TEXT[];
  END IF;
  
  -- Lifestyle Information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'sleep_hours') THEN
    ALTER TABLE profiles ADD COLUMN sleep_hours NUMERIC(3,1);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bed_time') THEN
    ALTER TABLE profiles ADD COLUMN bed_time TIME WITHOUT TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'wake_time') THEN
    ALTER TABLE profiles ADD COLUMN wake_time TIME WITHOUT TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'sleep_quality') THEN
    ALTER TABLE profiles ADD COLUMN sleep_quality TEXT;
  END IF;
  
  -- Exercise & Diet
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'exercise_frequency') THEN
    ALTER TABLE profiles ADD COLUMN exercise_frequency TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'exercise_types') THEN
    ALTER TABLE profiles ADD COLUMN exercise_types TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'diet_preference') THEN
    ALTER TABLE profiles ADD COLUMN diet_preference TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'dietary_restrictions') THEN
    ALTER TABLE profiles ADD COLUMN dietary_restrictions TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'allergies') THEN
    ALTER TABLE profiles ADD COLUMN allergies TEXT[];
  END IF;
  
  -- Mental Health & Stress
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stress_level') THEN
    ALTER TABLE profiles ADD COLUMN stress_level INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'stress_triggers') THEN
    ALTER TABLE profiles ADD COLUMN stress_triggers TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'mental_health_goals') THEN
    ALTER TABLE profiles ADD COLUMN mental_health_goals TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'meditation_experience') THEN
    ALTER TABLE profiles ADD COLUMN meditation_experience TEXT;
  END IF;
  
  -- Supplement & Medical History
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'current_supplements') THEN
    ALTER TABLE profiles ADD COLUMN current_supplements TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'medication_list') THEN
    ALTER TABLE profiles ADD COLUMN medication_list TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'medical_conditions') THEN
    ALTER TABLE profiles ADD COLUMN medical_conditions TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'doctor_consultation') THEN
    ALTER TABLE profiles ADD COLUMN doctor_consultation BOOLEAN DEFAULT false;
  END IF;
  
  -- Preferences & Settings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'communication_preferences') THEN
    ALTER TABLE profiles ADD COLUMN communication_preferences JSONB;
    COMMENT ON COLUMN profiles.communication_preferences IS 'User communication preferences stored as JSON';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'privacy_settings') THEN
    ALTER TABLE profiles ADD COLUMN privacy_settings JSONB;
    COMMENT ON COLUMN profiles.privacy_settings IS 'User privacy settings stored as JSON';
  END IF;
  
  -- Timestamps
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'onboarding_completed_at') THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed_at TIMESTAMPTZ;
    COMMENT ON COLUMN profiles.onboarding_completed_at IS 'Timestamp when user completed onboarding process';
  END IF;
  
  -- Add constraints for enum fields
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_activity_level_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_activity_level_check 
    CHECK (activity_level = ANY (ARRAY['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active']));
  
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_gender_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_gender_check 
    CHECK (gender = ANY (ARRAY['male', 'female', 'non-binary', 'prefer-not-to-say']));
  
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_diet_preference_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_diet_preference_check 
    CHECK (diet_preference = ANY (ARRAY['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'mediterranean', 'other']));
  
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_sleep_quality_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_sleep_quality_check 
    CHECK (sleep_quality = ANY (ARRAY['poor', 'fair', 'good', 'excellent']));
  
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_exercise_frequency_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_exercise_frequency_check 
    CHECK (exercise_frequency = ANY (ARRAY['never', 'rarely', '1-2-times', '3-4-times', '5-6-times', 'daily']));
  
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_meditation_experience_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_meditation_experience_check 
    CHECK (meditation_experience = ANY (ARRAY['none', 'beginner', 'intermediate', 'advanced']));
  
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_stress_level_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_stress_level_check 
    CHECK ((stress_level >= 1) AND (stress_level <= 10));
  
  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON profiles(onboarding_completed);
  CREATE INDEX IF NOT EXISTS idx_profiles_primary_health_goals ON profiles USING GIN(primary_health_goals);
  CREATE INDEX IF NOT EXISTS idx_profiles_fitness_goals ON profiles USING GIN(fitness_goals);
  CREATE INDEX IF NOT EXISTS idx_profiles_diet_preference ON profiles(diet_preference);
  CREATE INDEX IF NOT EXISTS idx_profiles_activity_level ON profiles(activity_level);
  CREATE INDEX IF NOT EXISTS idx_profiles_mobile ON profiles(mobile);
END $$;

-- Add corresponding fields to quiz_responses table for backward compatibility
DO $$
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'secondary_health_goals') THEN
    ALTER TABLE quiz_responses ADD COLUMN secondary_health_goals TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'health_concerns') THEN
    ALTER TABLE quiz_responses ADD COLUMN health_concerns TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'fitness_goals') THEN
    ALTER TABLE quiz_responses ADD COLUMN fitness_goals TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'bed_time') THEN
    ALTER TABLE quiz_responses ADD COLUMN bed_time TIME WITHOUT TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'wake_time') THEN
    ALTER TABLE quiz_responses ADD COLUMN wake_time TIME WITHOUT TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'sleep_quality') THEN
    ALTER TABLE quiz_responses ADD COLUMN sleep_quality TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'exercise_types') THEN
    ALTER TABLE quiz_responses ADD COLUMN exercise_types TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'dietary_restrictions') THEN
    ALTER TABLE quiz_responses ADD COLUMN dietary_restrictions TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'allergies') THEN
    ALTER TABLE quiz_responses ADD COLUMN allergies TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'stress_triggers') THEN
    ALTER TABLE quiz_responses ADD COLUMN stress_triggers TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'mental_health_goals') THEN
    ALTER TABLE quiz_responses ADD COLUMN mental_health_goals TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'meditation_experience') THEN
    ALTER TABLE quiz_responses ADD COLUMN meditation_experience TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'current_supplements') THEN
    ALTER TABLE quiz_responses ADD COLUMN current_supplements TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'medication_list') THEN
    ALTER TABLE quiz_responses ADD COLUMN medication_list TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'medical_conditions') THEN
    ALTER TABLE quiz_responses ADD COLUMN medical_conditions TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'doctor_consultation') THEN
    ALTER TABLE quiz_responses ADD COLUMN doctor_consultation BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'height') THEN
    ALTER TABLE quiz_responses ADD COLUMN height JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'weight') THEN
    ALTER TABLE quiz_responses ADD COLUMN weight JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_responses' AND column_name = 'activity_level') THEN
    ALTER TABLE quiz_responses ADD COLUMN activity_level TEXT;
  END IF;
  
  -- Add constraints for enum fields
  ALTER TABLE quiz_responses DROP CONSTRAINT IF EXISTS quiz_responses_activity_level_check;
  ALTER TABLE quiz_responses ADD CONSTRAINT quiz_responses_activity_level_check 
    CHECK (activity_level = ANY (ARRAY['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active']));
  
  ALTER TABLE quiz_responses DROP CONSTRAINT IF EXISTS quiz_responses_sleep_quality_check;
  ALTER TABLE quiz_responses ADD CONSTRAINT quiz_responses_sleep_quality_check 
    CHECK (sleep_quality = ANY (ARRAY['poor', 'fair', 'good', 'excellent']));
  
  ALTER TABLE quiz_responses DROP CONSTRAINT IF EXISTS quiz_responses_meditation_experience_check;
  ALTER TABLE quiz_responses ADD CONSTRAINT quiz_responses_meditation_experience_check 
    CHECK (meditation_experience = ANY (ARRAY['none', 'beginner', 'intermediate', 'advanced']));
END $$;