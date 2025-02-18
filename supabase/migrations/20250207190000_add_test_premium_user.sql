-- Update specific user to premium status
UPDATE users
SET 
  is_premium = true,
  updated_at = now()
WHERE email = 'vigourpt@me.com';