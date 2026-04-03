# Development Conventions & Best Practices

## 1. Security & Environment Variables
* **NEVER hardcode secrets:** Stripe Secret Keys, Webhook Secrets, JWT Secrets, and Database URLs must be stored strictly in `.env` or environment configuration panels.
* **Token Management:** Keep JWT expiration reasonable (e.g., 24 hours) to mitigate token theft risks.
* **Data Privacy:** Never store raw credit card information in the Supabase database. All sensitive payment data must be handled exclusively by Stripe's infrastructure.

## 2. API & Integration Standards
* **Stripe Webhooks:** Implement and utilize webhook handlers (`/api/v1/payments/webhook`) as the source of truth for subscription status changes, rather than relying solely on client-side success callbacks.
* **Rate Limiting:** Apply rate limiting to all authentication and payment endpoints to prevent abuse.
* **Error Handling:** Handle payment failures gracefully on the frontend, providing clear, actionable feedback to the user without exposing stack traces.

## 3. Testing Conventions
* **Stripe Test Mode:** Strictly use Stripe test keys (`pk_test_...`, `sk_test_...`) during local development and non-production deployments.
* **Test Cards:** Use standard Stripe test cards for validating checkout flows:
    * *Success:* `4242 4242 4242 4242`
    * *Decline:* `4000 0000 0000 0002`
    * *CVC / Expiry:* Any 3 digits / Any future date.

## 4. Logging & Monitoring
* Log all Stripe transactions and webhook events in the backend for auditing purposes.
* **Sanitization:** Ensure no personally identifiable information (PII) or sensitive tokens are printed to application logs.