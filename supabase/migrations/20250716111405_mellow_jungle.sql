/*
  # Add Nutrition and Fitness Tables

  1. New Tables
    - `food_logs`: Stores user meal logs with nutritional information
    - `workout_sessions`: Stores user workout sessions
    - `exercise_sets`: Stores exercise details for workout sessions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create food_logs table
CREATE TABLE IF NOT EXISTS food_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_name text NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  calories integer NOT NULL,
  protein numeric NOT NULL,
  carbs numeric NOT NULL,
  fat numeric NOT NULL,
  serving_size text NOT NULL,
  meal_time timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create workout_sessions table
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_type text NOT NULL,
  duration integer NOT NULL, -- in minutes
  calories_burned integer NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create exercise_sets table
CREATE TABLE IF NOT EXISTS exercise_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_name text NOT NULL,
  sets integer NOT NULL,
  reps integer NOT NULL,
  weight numeric, -- in kg
  duration integer, -- in seconds, for timed exercises
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_food_logs_meal_time ON food_logs(meal_time);
CREATE INDEX IF NOT EXISTS idx_food_logs_user_meal_time ON food_logs(user_id, meal_time);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_timestamp ON workout_sessions(timestamp);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_timestamp ON workout_sessions(user_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_id ON exercise_sets(workout_id);

-- Enable Row Level Security
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

-- Create policies for food_logs
CREATE POLICY "Users can view their own food logs"
  ON food_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food logs"
  ON food_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food logs"
  ON food_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs"
  ON food_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for workout_sessions
CREATE POLICY "Users can view their own workout sessions"
  ON workout_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions"
  ON workout_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions"
  ON workout_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for exercise_sets
CREATE POLICY "Users can view their own exercise sets"
  ON exercise_sets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workout_sessions
    WHERE workout_sessions.id = exercise_sets.workout_id
    AND workout_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own exercise sets"
  ON exercise_sets FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM workout_sessions
    WHERE workout_sessions.id = exercise_sets.workout_id
    AND workout_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own exercise sets"
  ON exercise_sets FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM workout_sessions
    WHERE workout_sessions.id = exercise_sets.workout_id
    AND workout_sessions.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM workout_sessions
    WHERE workout_sessions.id = exercise_sets.workout_id
    AND workout_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own exercise sets"
  ON exercise_sets FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM workout_sessions
    WHERE workout_sessions.id = exercise_sets.workout_id
    AND workout_sessions.user_id = auth.uid()
  ));