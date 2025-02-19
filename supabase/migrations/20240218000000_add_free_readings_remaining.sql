-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;

-- Add the free_readings_remaining column
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS free_readings_remaining INTEGER DEFAULT 5;

-- Update existing users to have 5 free readings if they don't have premium
UPDATE user_profiles
SET free_readings_remaining = 5
WHERE free_readings_remaining IS NULL AND NOT is_premium;

-- Recreate policies with updated conditions
CREATE POLICY "Users can read own data"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);