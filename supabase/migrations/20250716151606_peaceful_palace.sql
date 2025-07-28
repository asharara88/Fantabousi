/*
  # Create Saved Recipes Table

  1. New Tables
    - `saved_recipes`: Stores user's saved recipes
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `recipe_id` (integer)
      - `title` (text)
      - `image` (text)
      - `saved_at` (timestamptz)
      - `is_favorite` (boolean)

  2. Security
    - Enable RLS on saved_recipes table
    - Add policies for authenticated users to manage their own saved recipes
*/

-- Create saved_recipes table
CREATE TABLE IF NOT EXISTS saved_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id integer NOT NULL,
  title text NOT NULL,
  image text,
  saved_at timestamptz DEFAULT now(),
  is_favorite boolean DEFAULT false
);

-- Create unique constraint on user_id and recipe_id
CREATE UNIQUE INDEX IF NOT EXISTS saved_recipes_user_recipe_idx
  ON saved_recipes(user_id, recipe_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id
  ON saved_recipes(user_id);

-- Enable Row Level Security
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view their own saved recipes"
  ON saved_recipes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved recipes"
  ON saved_recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved recipes"
  ON saved_recipes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved recipes"
  ON saved_recipes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE saved_recipes IS 'Stores recipes saved by users';