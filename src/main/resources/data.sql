-- This script is executed by Spring Boot on application startup.
-- It's a convenient way to seed the database with initial data for development and testing.

-- We use ON CONFLICT DO NOTHING to make the script idempotent.
-- This prevents errors if the script is run multiple times and the data already exists.

-- Insert a dummy PREMIUM subscription plan
-- Assuming the 'id' is of type UUID and the table is named 'subscription_plan'
INSERT INTO subscription_plan (id, name, price, duration_in_days, features)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'PREMIUM', 499.00, 30, ARRAY['Access to all premium articles', 'Ad-free experience', 'Priority support', 'Download content'])
ON CONFLICT (id) DO NOTHING;