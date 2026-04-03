---

### 5. TECH_STACK.md

```markdown
# Technology Stack

## Frontend Layer
* **Core Library:** React 19 (leveraging concurrent rendering and hooks)
* **Styling:** Tailwind CSS v3 (JIT engine for rapid, responsive UI development)
* **Payment SDK:** Stripe React SDK (`@stripe/react-stripe-js`) for secure UI element tokenization
* **Routing:** React Router
* **Network Requests:** Axios
* **State Management:** Redux or React Context API

## Backend Layer
* **Core Framework:** Spring Boot 3.x (Enterprise-grade Java framework)
* **Security:** Spring Security with JSON Web Tokens (JWT) for stateless authentication
* **ORM / Data Access:** Spring Data JPA / Hibernate
* **Payment SDK:** Stripe Java SDK for server-side payment intent and webhook processing
* **Database Driver:** PostgreSQL Driver

## Database & Storage
* **Relational Database:** Supabase PostgreSQL (Managed cloud hosting)
* **File Storage:** Supabase Storage (for PDFs, images, and raw media)

## Third-Party Integrations
* **Payment Processor:** Stripe (Handles recurring subscriptions, customer generation, and checkout fulfillment)