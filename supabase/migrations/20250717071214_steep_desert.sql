/*
  # Audio Cache System

  1. New Tables
    - `audio_cache`: Stores cached audio data for text-to-speech responses
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `cache_key` (text)
      - `audio_data` (bytea)
      - `content_type` (text)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)
  
  2. Security
    - Enable RLS on `audio_cache` table
    - Add policies for authenticated users to manage their own audio cache
  
  3. Maintenance
    - Add function and trigger for automatic cleanup of expired cache entries
*/

-- Create audio_cache table
CREATE TABLE IF NOT EXISTS audio_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cache_key text NOT NULL,
  audio_data bytea NOT NULL,
  content_type text NOT NULL DEFAULT 'audio/mpeg',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Create unique index on user_id and cache_key
CREATE UNIQUE INDEX audio_cache_user_id_cache_key_idx ON audio_cache (user_id, cache_key);

-- Create index on expires_at for cleanup operations
CREATE INDEX audio_cache_expires_at_idx ON audio_cache (expires_at);

-- Create indexes for efficient lookups
CREATE INDEX idx_audio_cache_cache_key ON audio_cache (cache_key);
CREATE INDEX idx_audio_cache_user_id ON audio_cache (user_id);
CREATE INDEX idx_audio_cache_expires_at ON audio_cache (expires_at);

-- Enable Row Level Security
ALTER TABLE audio_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own audio cache"
  ON audio_cache
  FOR SELECT
  TO public
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own audio cache"
  ON audio_cache
  FOR INSERT
  TO public
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own audio cache"
  ON audio_cache
  FOR UPDATE
  TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own audio cache"
  ON audio_cache
  FOR DELETE
  TO public
  USING (user_id = auth.uid());

-- Create function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_audio_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM audio_cache
  WHERE expires_at < now();
END;
$$;

-- Create a trigger function
CREATE OR REPLACE FUNCTION trigger_cleanup_audio_cache()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM cleanup_expired_audio_cache();
  RETURN NEW;
END;
$$;

-- Create a trigger that runs the cleanup function periodically
CREATE TRIGGER auto_cleanup_audio_cache
AFTER INSERT OR UPDATE ON audio_cache
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_cleanup_audio_cache();