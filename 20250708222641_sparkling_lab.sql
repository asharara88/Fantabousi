/*
  # Create CGM Data Table

  1. New Tables
    - `cgm_data`: Stores continuous glucose monitoring data
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `timestamp` (timestamptz)
      - `glucose` (integer)
      - `events` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on cgm_data table
    - Add policies for authenticated users to manage their own data

  3. Performance
    - Create indexes for efficient querying
*/

CREATE TABLE IF NOT EXISTS public.cgm_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  glucose integer NOT NULL,
  events jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cgm_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cgm_data"
  ON public.cgm_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cgm_data"
  ON public.cgm_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cgm_data"
  ON public.cgm_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cgm_data"
  ON public.cgm_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cgm_data_user_id_timestamp 
  ON public.cgm_data (user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_cgm_data_timestamp 
  ON public.cgm_data (timestamp DESC);