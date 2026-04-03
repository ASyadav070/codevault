# System Architecture: CodeVault

## 1. High-Level Architecture
CodeVault utilizes a decoupled, modern web architecture. The system is split into a standalone client application and a RESTful API server, communicating over HTTP with stateless authentication.

* **Client Tier:** A Single Page Application (SPA) built with React 19, handling UI rendering, client-side routing, and Stripe Element tokenization.
* **Application Tier:** A Spring Boot 3.x backend acting as the central engine for business logic, security validation, and payment webhook processing.
* **Data Tier:** A managed Supabase PostgreSQL database for relational data, alongside Supabase Storage for raw media files.
* **Third-Party Services:** Stripe for secure payment processing and subscription lifecycle management.

## 2. Security & Authentication
* **Stateless Authentication:** JSON Web Tokens (JWT) are used for securing API endpoints.
* **Token Lifecycle:** Upon login, Spring Boot generates a JWT containing the user's ID, `role`, and `subscription_status`. This token is passed in the `Authorization: Bearer <token>` header for subsequent requests.
* **Dynamic Claim Updates:** When a user successfully subscribes via Stripe, a new JWT is generated with the updated `PREMIUM` claim to grant immediate access without requiring a re-login.

## 3. Database Schema (Supabase PostgreSQL)
* **`users`**: Manages identity, roles, and Stripe customer linkages.
* **`content`**: Stores resource metadata, categorized by `access_level` (FREE/PREMIUM) and `content_type`.
* **`subscription_plans`**: Maps platform tiers to Stripe `price_id`s.
* **`payments`**: Logs transaction history and status.
* **`user_progress` & `quiz_responses`**: Tracks user engagement and assessment scores.

## 4. Deployment Infrastructure
* **Frontend Environment:** Deployed on Vercel with automatic CI/CD pipelines linked to GitHub. Environment variables handle API routing and Stripe public keys.
* **Backend Environment:** Deployed on Railway or Heroku. Environment variables securely inject database credentials, JWT secrets, and Stripe secret/webhook keys.
* **Database Environment:** Hosted on Supabase with Row Level Security (RLS) policies enabled.