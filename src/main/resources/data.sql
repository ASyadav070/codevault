-- This script is executed by Spring Boot on application startup.
-- It's a convenient way to seed the database with initial data for development and testing.

-- We use ON CONFLICT DO NOTHING to make the script idempotent.
-- This prevents errors if the script is run multiple times and the data already exists.

-- Insert a dummy PREMIUM subscription plan
-- Assuming the 'id' is of type UUID and the table is named 'subscription_plan'
INSERT INTO subscription_plan (id, name, price, duration_in_days, features)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'PREMIUM', 499.00, 30, ARRAY['Access to all premium articles', 'Ad-free experience', 'Priority support', 'Download content'])
ON CONFLICT (id) DO NOTHING;

-- Insert FREE Content
INSERT INTO content (id, title, description, content_type, access_level, original_content_url)
VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Introduction to System Design', 'Learn the fundamentals of system design, a crucial skill for any software engineer. This article covers the basic concepts and provides a roadmap for further learning.', 'ARTICLE', 'FREE', 'https://example.com/intro-to-system-design'),
    ('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'Mastering CSS Grid', 'A comprehensive guide to CSS Grid Layout, with practical examples and tips to help you build complex responsive layouts with ease.', 'TUTORIAL', 'FREE', 'https://example.com/mastering-css-grid')
ON CONFLICT (id) DO NOTHING;

-- Insert PREMIUM Content
INSERT INTO content (id, title, description, content_type, access_level, original_content_url)
VALUES
    ('c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'Deep Dive into Microservices Architecture', 'An in-depth exploration of microservices, including patterns, best practices, and trade-offs. This guide is for experienced engineers looking to design and build scalable systems.', 'ARTICLE', 'PREMIUM', 'https://example.com/deep-dive-microservices'),
    ('d4e5f6a7-b8c9-0123-4567-890abcdef123', 'Advanced Data Structures in Java', 'A course on advanced data structures and algorithms, with a focus on real-world performance and interview preparation. Includes coding challenges and solutions.', 'COURSE', 'PREMIUM', 'https://example.com/advanced-data-structures-java')
ON CONFLICT (id) DO NOTHING;
