# System Architecture: CodeVault

## 1. High-Level Architecture
CodeVault utilizes a decoupled, modern web architecture. The system is split into a standalone client application and a RESTful API server, communicating over HTTP with stateless authentication.

* **Client Tier:** A Single Page Application (SPA) built with React 19, handling UI rendering, client-side routing, and CashFree SDK integration.
* **Application Tier:** A Spring Boot 3.x backend acting as the central engine for business logic, security validation, and payment webhook processing.
* **Data Tier:** A managed Supabase PostgreSQL database for relational data, alongside Supabase Storage for raw media files.
* **Third-Party Services:** CashFree for secure, per-course payment processing.

## 2. Security & Authentication
* **Stateless Authentication:** JSON Web Tokens (JWT) are used for securing API endpoints.
* **Token Lifecycle:** Upon login, Spring Boot generates a JWT containing the user's ID and `role`. This token is passed in the `Authorization: Bearer <token>` header for subsequent requests.
* **Access Control:** Access to premium content is determined on a per-request basis by checking for a valid purchase record in the `user_purchases` table, not by a global subscription status in the JWT.

## 3. Database Schema (Supabase PostgreSQL)
* **`users`**: Manages user identity and roles.
* **`content`**: Stores resource metadata, including `price` and `access_level` (FREE/PREMIUM).
* **`user_purchases`**: A mapping table that links a `user_id` to a `content_id`, granting access upon successful payment.
* **`payments`**: Logs transaction history and status for each individual purchase.
* **`user_progress` & `quiz_responses`**: Tracks user engagement and assessment scores.

## 4. Deployment Infrastructure
* **Frontend Environment:** Deployed on Vercel with automatic CI/CD pipelines linked to GitHub. Environment variables handle API routing and CashFree public keys.
* **Backend Environment:** Deployed on Railway or Heroku. Environment variables securely inject database credentials, JWT secrets, and CashFree secret/webhook keys.
* **Database Environment:** Hosted on Supabase with Row Level Security (RLS) policies enabled.
