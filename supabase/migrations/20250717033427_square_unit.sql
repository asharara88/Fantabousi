/*
  # Update Gender Options

  1. Changes
    - Update gender check constraint to only allow 'male' and 'female' options
    - Apply to both profiles and quiz_responses tables
*/

-- Update gender check constraint in profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_gender_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_gender_check 
  CHECK (gender = ANY (ARRAY['male', 'female']));

-- Update gender check constraint in quiz_responses table
ALTER TABLE quiz_responses DROP CONSTRAINT IF EXISTS quiz_responses_gender_check;
ALTER TABLE quiz_responses ADD CONSTRAINT quiz_responses_gender_check 
  CHECK (gender = ANY (ARRAY['male', 'female']));

-- Update gender check constraint in user_profile_signin table
ALTER TABLE user_profile_signin DROP CONSTRAINT IF EXISTS profiles_gender_check;
ALTER TABLE user_profile_signin ADD CONSTRAINT profiles_gender_check 
  CHECK (gender = ANY (ARRAY['male', 'female']));