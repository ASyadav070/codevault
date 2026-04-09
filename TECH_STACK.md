# Technology Stack

## Frontend Layer
* **Core Library:** React 19 (leveraging concurrent rendering and hooks)
* **Styling:** Tailwind CSS v4 (JIT engine for rapid, responsive UI development)
* **Payment SDK:** CashFree JS SDK (`@cashfreepayments/cashfree-js`) for secure UI element tokenization
* **Routing:** React Router
* **Network Requests:** Axios
* **State Management:** React Context API

## Backend Layer
* **Core Framework:** Spring Boot 3.x (Enterprise-grade Java framework)
* **Security:** Spring Security with JSON Web Tokens (JWT) for stateless authentication
* **ORM / Data Access:** Spring Data JPA / Hibernate
* **Payment SDK:** CashFree Java SDK for server-side payment intent and webhook processing
* **Database Driver:** PostgreSQL Driver

## Database & Storage
* **Relational Database:** Supabase PostgreSQL (Managed cloud hosting)
* **File Storage:** Supabase Storage (for PDFs, images, and raw media)

## Third-Party Integrations
* **Payment Processor:** CashFree (Handles per-course purchases and checkout fulfillment)
