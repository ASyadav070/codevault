# CodeVault Directory Structure

## Frontend (React 19)
```text
frontend/
├─ src/
│  ├─ components/
│  │  ├─ Auth/          # Login.jsx, Register.jsx, ProtectedRoute.jsx
│  │  └─ Common/        # Navigation.jsx, Footer.jsx, Loading.jsx
│  ├─ pages/            # Home.jsx, Catalog.jsx, ContentDetail.jsx, Checkout.jsx, Login.jsx, Register.jsx
│  ├─ services/         # api.js
│  ├─ context/          # AuthContext.jsx
│  ├─ hooks/            # useAuth.js
│  ├─ App.jsx
│  └─ main.jsx
├─ public/
├─ tailwind.config.js
├─ vite.config.js
└─ package.json

backend/
├─ src/main/java/com/codevault/
│  ├─ controller/       # AuthController, ContentController, PaymentController
│  ├─ service/          # UserService, ContentService, CashfreeService
│  ├─ repository/       # UserRepository, ContentRepository, PaymentRepository, UserPurchaseRepository
│  ├─ model/            # User, Content, Payment, UserPurchase
│  ├─ dto/              # LoginRequest, OrderRequest, OrderResponse, ContentPreviewDto
│  ├─ security/         # JwtTokenProvider, JwtAuthenticationFilter, SecurityConfig
│  └─ Application.java
├─ src/main/resources/
│  ├─ application.properties
└─ pom.xml
```