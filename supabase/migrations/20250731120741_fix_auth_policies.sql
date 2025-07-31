/*
  # Core Schema and Auth Policies Fix
  
  This migration creates the core database schema and ensures proper RLS policies
  are in place for user registration and profile creation.
*/

-- First, let's recreate the core schema if it doesn't exist

-- Profiles table (core user data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  mobile TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health metrics table (from wearables)
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  deep_sleep NUMERIC,
  rem_sleep NUMERIC,
  steps INTEGER,
  calories INTEGER,
  heart_rate INTEGER,
  bmi NUMERIC,
  weight NUMERIC,
  cgm NUMERIC,
  health_score INTEGER,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Quiz responses
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER,
  gender TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  health_goals TEXT[],
  sleep_hours NUMERIC,
  exercise_frequency TEXT,
  diet_preference TEXT,
  stress_level TEXT,
  existing_conditions TEXT[],
  medications TEXT[],
  supplements TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wearable connections
CREATE TABLE IF NOT EXISTS wearable_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Supplements catalog
CREATE TABLE IF NOT EXISTS supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT[],
  dosage TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscribed supplements
CREATE TABLE IF NOT EXISTS user_supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supplement_id UUID NOT NULL REFERENCES supplements(id) ON DELETE CASCADE,
  subscription_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, supplement_id)
);

-- Chat history
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supplement_id uuid NOT NULL REFERENCES supplements(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_supplement_idx ON cart_items(user_id, supplement_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_date ON health_metrics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
  DROP POLICY IF EXISTS "Allow users to create their own profile" ON profiles;
  DROP POLICY IF EXISTS "Allow profile creation via trigger" ON profiles;
  DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
  
  -- Health metrics
  DROP POLICY IF EXISTS "Users can view their own health metrics" ON health_metrics;
  DROP POLICY IF EXISTS "Users can insert their own health metrics" ON health_metrics;
  DROP POLICY IF EXISTS "Users can update their own health metrics" ON health_metrics;
  DROP POLICY IF EXISTS "Users can delete their own health metrics" ON health_metrics;
  
  -- Quiz responses
  DROP POLICY IF EXISTS "Users can view their own quiz responses" ON quiz_responses;
  DROP POLICY IF EXISTS "Users can insert their own quiz responses" ON quiz_responses;
  DROP POLICY IF EXISTS "Users can update their own quiz responses" ON quiz_responses;
  DROP POLICY IF EXISTS "Users can delete their own quiz responses" ON quiz_responses;
  
  -- Wearable connections
  DROP POLICY IF EXISTS "Users can view their own wearable connections" ON wearable_connections;
  DROP POLICY IF EXISTS "Users can insert their own wearable connections" ON wearable_connections;
  DROP POLICY IF EXISTS "Users can update their own wearable connections" ON wearable_connections;
  DROP POLICY IF EXISTS "Users can delete their own wearable connections" ON wearable_connections;
  
  -- Supplements
  DROP POLICY IF EXISTS "Anyone can view active supplements" ON supplements;
  DROP POLICY IF EXISTS "Admins can insert supplements" ON supplements;
  DROP POLICY IF EXISTS "Admins can update supplements" ON supplements;
  
  -- User supplements
  DROP POLICY IF EXISTS "Users can view their own supplement subscriptions" ON user_supplements;
  DROP POLICY IF EXISTS "Users can insert their own supplement subscriptions" ON user_supplements;
  DROP POLICY IF EXISTS "Users can update their own supplement subscriptions" ON user_supplements;
  DROP POLICY IF EXISTS "Users can delete their own supplement subscriptions" ON user_supplements;
  
  -- Chat history
  DROP POLICY IF EXISTS "Users can view their own chat history" ON chat_history;
  DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_history;
  DROP POLICY IF EXISTS "Users can update their own chat history" ON chat_history;
  DROP POLICY IF EXISTS "Users can delete their own chat history" ON chat_history;
  
  -- Cart items
  DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
  DROP POLICY IF EXISTS "Users can insert cart items" ON cart_items;
  DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
  DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore errors if policies don't exist
END $$;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to create their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow profile creation via trigger"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- HEALTH METRICS POLICIES
CREATE POLICY "Users can view their own health metrics"
  ON health_metrics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health metrics"
  ON health_metrics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics"
  ON health_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health metrics"
  ON health_metrics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- QUIZ RESPONSES POLICIES
CREATE POLICY "Users can view their own quiz responses"
  ON quiz_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz responses"
  ON quiz_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz responses"
  ON quiz_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quiz responses"
  ON quiz_responses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- WEARABLE CONNECTIONS POLICIES
CREATE POLICY "Users can view their own wearable connections"
  ON wearable_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wearable connections"
  ON wearable_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wearable connections"
  ON wearable_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wearable connections"
  ON wearable_connections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- SUPPLEMENTS POLICIES
CREATE POLICY "Anyone can view active supplements"
  ON supplements FOR SELECT
  TO authenticated, anon
  USING (
    is_active = true OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can insert supplements"
  ON supplements FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

CREATE POLICY "Admins can update supplements"
  ON supplements FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- USER SUPPLEMENTS POLICIES
CREATE POLICY "Users can view their own supplement subscriptions"
  ON user_supplements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own supplement subscriptions"
  ON user_supplements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplement subscriptions"
  ON user_supplements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own supplement subscriptions"
  ON user_supplements FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- CHAT HISTORY POLICIES
CREATE POLICY "Users can view their own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat history"
  ON chat_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history"
  ON chat_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- CART ITEMS POLICIES
CREATE POLICY "Users can view their own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create profile creation function with proper security
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    avatar_url,
    is_admin,
    onboarding_completed,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    FALSE,
    FALSE,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS create_profile_after_signup ON auth.users;
CREATE TRIGGER create_profile_after_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_new_user();
