# CodeVault Directory Structure

## Frontend (React 19)
```text
frontend/
├─ src/
│  ├─ components/
│  │  ├─ Auth/          # Login.jsx, Register.jsx, ProtectedRoute.jsx
│  │  ├─ Content/       # ContentList.jsx, ContentDetail.jsx, Paywall.jsx, Quiz.jsx
│  │  ├─ Subscription/  # PricingPage.jsx, CheckoutForm.jsx, PaymentSuccess.jsx, Dashboard.jsx
│  │  ├─ Admin/         # AdminDashboard.jsx, ContentUpload.jsx, UserManagement.jsx
│  │  └─ Common/        # Navigation.jsx, Footer.jsx, Loading.jsx
│  ├─ pages/            # Home.jsx, Catalog.jsx, Pricing.jsx, Dashboard.jsx
│  ├─ services/         # api.js, auth.js, content.js, payment.js, stripe.js
│  ├─ context/          # AuthContext.jsx, SubscriptionContext.jsx
│  ├─ hooks/            # useAuth.js, useSubscription.js, useStripe.js
│  ├─ utils/            # constants.js, helpers.js
│  ├─ App.jsx
│  └─ main.jsx
├─ public/
├─ tailwind.config.js
├─ vite.config.js
└─ package.json

backend/
├─ src/main/java/com/codevault/
│  ├─ controller/       # AuthController, ContentController, PaymentController, etc.
│  ├─ service/          # UserService, ContentService, StripeService, etc.
│  ├─ repository/       # UserRepository, ContentRepository, PaymentRepository, etc.
│  ├─ model/            # User, Content, SubscriptionPlan, Payment, etc.
│  ├─ dto/              # LoginRequest, CreateSubscriptionRequest, PaymentResponse, etc.
│  ├─ security/         # JwtTokenProvider, JwtAuthenticationFilter, SecurityConfig
│  ├─ exception/        # UnauthorizedException, GlobalExceptionHandler, etc.
│  └─ Application.java
├─ src/main/resources/
│  ├─ application.properties
│  └─ application-prod.properties
└─ pom.xml