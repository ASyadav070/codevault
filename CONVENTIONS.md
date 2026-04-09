# Development Conventions & Best Practices

## 1. Security & Environment Variables
* **NEVER hardcode secrets:** CashFree Client ID, Client Secret, JWT Secrets, and Database URLs must be stored strictly in `.env` or environment configuration panels.
* **Token Management:** Keep JWT expiration reasonable (e.g., 24 hours) to mitigate token theft risks.
* **Data Privacy:** Never store raw payment information in the Supabase database. All sensitive payment data must be handled exclusively by CashFree's infrastructure.

## 2. API & Integration Standards
* **CashFree Webhooks:** Implement and utilize webhook handlers (`/api/v1/payments/webhook`) as the source of truth for purchase status changes, rather than relying solely on client-side success callbacks.
* **Rate Limiting:** Apply rate limiting to all authentication and payment endpoints to prevent abuse.
* **Error Handling:** Handle payment failures gracefully on the frontend, providing clear, actionable feedback to the user without exposing stack traces.

## 3. Testing Conventions
* **CashFree Sandbox Mode:** Strictly use CashFree sandbox mode during local development and non-production deployments.
* **Test Cards:** Use standard CashFree test cards for validating checkout flows.

## 4. Logging & Monitoring
* Log all CashFree transactions and webhook events in the backend for auditing purposes.
* **Sanitization:** Ensure no personally identifiable information (PII) or sensitive tokens are printed to application logs.
