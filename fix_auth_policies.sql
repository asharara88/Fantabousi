/*
  # Fix Supabase Authentication Policies
  
  This migration fixes authentication issues by ensuring proper RLS policies
  are in place for user registration and profile creation.
  
  1. Security fixes:
     - Add INSERT policy for profiles table to allow user registration
     - Ensure proper policies for all authentication flows
     - Fix any missing policies that prevent sign-in/sign-up
*/

-- Profiles table: Add missing INSERT policy for user registration
CREATE POLICY "Allow users to create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow the trigger function to insert profiles
CREATE POLICY "Allow profile creation via trigger"
  ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Ensure all authenticated users can read their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Ensure all authenticated users can update their own profile  
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Fix health_metrics policies to ensure proper access
DROP POLICY IF EXISTS "Users can view their own health metrics" ON health_metrics;
CREATE POLICY "Users can view their own health metrics"
  ON health_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own health metrics" ON health_metrics;
CREATE POLICY "Users can insert their own health metrics"
  ON health_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health metrics"
  ON health_metrics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health metrics"
  ON health_metrics
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix quiz_responses policies
DROP POLICY IF EXISTS "Users can view their own quiz responses" ON quiz_responses;
CREATE POLICY "Users can view their own quiz responses"
  ON quiz_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own quiz responses" ON quiz_responses;
CREATE POLICY "Users can insert their own quiz responses"
  ON quiz_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz responses"
  ON quiz_responses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quiz responses"
  ON quiz_responses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix chat_history policies
DROP POLICY IF EXISTS "Users can view their own chat history" ON chat_history;
CREATE POLICY "Users can view their own chat history"
  ON chat_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own chat messages" ON chat_history;
CREATE POLICY "Users can insert their own chat messages"
  ON chat_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat history"
  ON chat_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history"
  ON chat_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix user_supplements policies
CREATE POLICY "Users can update their own supplement subscriptions"
  ON user_supplements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow anonymous access to supplements for browsing before sign-up
DROP POLICY IF EXISTS "Anyone can view active supplements" ON supplements;
CREATE POLICY "Anyone can view active supplements"
  ON supplements
  FOR SELECT
  TO authenticated, anon
  USING (
    is_active = true OR 
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

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

-- Ensure cart_items policies are correct
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

-- Ensure wearable_connections policies are correct
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

-- Ensure supplement_stacks policies are correct (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'supplement_stacks') THEN
    EXECUTE 'CREATE POLICY "Users can create their own supplement stacks"
      ON supplement_stacks
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id)';
    
    EXECUTE 'CREATE POLICY "Users can view their own supplement stacks"
      ON supplement_stacks
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id)';
    
    EXECUTE 'CREATE POLICY "Users can update their own supplement stacks"
      ON supplement_stacks
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)';
    
    EXECUTE 'CREATE POLICY "Users can delete their own supplement stacks"
      ON supplement_stacks
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id)';
  END IF;
END $$;
