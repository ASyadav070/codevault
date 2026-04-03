# Product Requirements Document (PRD): CodeVault

## 1. Project Overview
**CodeVault** is a production-ready Software as a Service (SaaS) platform designed for technical education. It serves as an advanced tech and interview preparation hub, offering gated premium content, real-time payment processing, and role-based access control.

## 2. Target Audience
Computer science students, software engineers, and tech professionals preparing for technical interviews, focusing on topics like Data Structures and Algorithms (DSA), System Design, Theory of Computation, and AI.

## 3. User Roles & Access Levels
* **Guest/Public:** Can view the landing page, browse the content catalog, and view pricing.
* **Free User:** Authenticated user with access to basic tutorials, free resources, and community access.
* **Premium User:** Authenticated user with an active Stripe subscription. Has unrestricted access to all in-depth problem breakdowns, practice quizzes, progress tracking, and premium study materials.
* **Admin:** Privileged user capable of uploading content, managing users, and categorizing resources.

## 4. Core Features
* **Identity Management:** Secure user registration and login using JWT.
* **Content Paywall:** A robust gating system that restricts access to premium content based on the user's active database subscription flag.
* **Subscription Processing:** Integrated Stripe checkout flow for purchasing "Professional" or "Enterprise" tiers.
* **Interactive Assessments:** Quizzes and progress tracking for premium users to validate their learning.
* **Admin Dashboard:** Secure endpoints for creating, updating, and deleting educational content.

## 5. User Journey (Premium Conversion)
1. User visits CodeVault and browses free content.
2. User clicks on a gated resource and encounters the Paywall.
3. User navigates to the `/pricing` page and selects a subscription plan.
4. User enters payment details via Stripe Elements checkout form.
5. Upon successful Stripe processing, the backend updates the user's status to `PREMIUM` and issues a new JWT.
6. User is redirected to their dashboard with full platform access.

## 6. Project Milestones
* **Week 1-2:** Supabase database setup and schema implementation; project initialization.
* **Week 3:** User authentication and protected routes.
* **Week 4:** Content CRUD operations and admin dashboard.
* **Week 5:** Stripe account setup, subscription plans, and webhook handlers.
* **Week 6:** Frontend Pricing page, Stripe Elements integration, and checkout flow.
* **Week 7:** Paywall implementation and access control verification.
* **Week 8:** Quiz engine, progress tracking, testing, and deployment.