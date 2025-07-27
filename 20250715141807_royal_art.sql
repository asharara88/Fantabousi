/*
  # Create supplement stacks table

  1. New Tables
    - `supplement_stacks` - Stores user-created supplement stacks
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `components` (jsonb) - Array of supplement objects
      - `goals` (text[]) - Array of health goals
      - `total_price` (numeric)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `supplement_stacks` table
    - Add policies for authenticated users to manage their own stacks
*/

-- Create supplement stacks table
CREATE TABLE IF NOT EXISTS supplement_stacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,
  components jsonb NOT NULL,
  goals text[],
  total_price numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_supplement_stacks_user_id ON supplement_stacks(user_id);
CREATE INDEX IF NOT EXISTS idx_supplement_stacks_category ON supplement_stacks(category);
CREATE INDEX IF NOT EXISTS idx_supplement_stacks_is_active ON supplement_stacks(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE supplement_stacks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own supplement stacks"
  ON supplement_stacks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own supplement stacks"
  ON supplement_stacks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplement stacks"
  ON supplement_stacks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own supplement stacks"
  ON supplement_stacks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_supplement_stacks_updated_at
  BEFORE UPDATE ON supplement_stacks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE supplement_stacks IS 'Stores user-created supplement stacks with components and goals';