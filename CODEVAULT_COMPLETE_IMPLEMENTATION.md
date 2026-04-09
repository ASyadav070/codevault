# CodeVault - Advanced Tech & Interview Prep Hub with CashFree Payment Integration

## 🎯 Project Overview

**CodeVault** is a production-ready SaaS platform for technical education with gated premium content, real payment processing via CashFree, and role-based access control.

---

## 📊 Tech Stack

```
Frontend:
├─ React 19 (concurrent rendering, hooks)
├─ Tailwind CSS v4 (JIT engine, responsive)
├─ CashFree JS SDK (@cashfreepayments/cashfree-js)
├─ Axios (API communication)
├─ React Router (navigation)
└─ React Context API (state management)

Backend:
├─ Spring Boot 3.x (enterprise-grade)
├─ Spring Security (JWT auth)
├─ Spring Data JPA/Hibernate
├─ CashFree Java SDK
└─ PostgreSQL Driver

Database & Storage:
├─ Supabase (PostgreSQL hosting)
├─ Supabase Storage (file storage)
└─ JWT tokens (stateless auth)

Payment Processing:
└─ CashFree (payment processor, per-course purchases)
```

---

## 🏗️ Database Schema (Supabase PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user', -- 'admin', 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Table
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50), -- 'article', 'paper', 'video', 'quiz'
    category VARCHAR(100), -- 'DSA', 'System Design', 'Theory of Computation', 'AI'
    access_level VARCHAR(20) DEFAULT 'FREE', -- 'FREE', 'PREMIUM'
    price DECIMAL(10, 2), -- Price for premium content
    content_url TEXT, -- Supabase Storage URL
    thumbnail_url TEXT,
    created_by UUID, -- Reference to admin user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- User Purchases Table
CREATE TABLE user_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    content_id UUID NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (content_id) REFERENCES content(id),
    UNIQUE (user_id, content_id)
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    content_id UUID NOT NULL,
    amount DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed'
    cf_order_id VARCHAR(255),
    cf_payment_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (content_id) REFERENCES content(id)
);

-- User Progress Table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    content_id UUID NOT NULL,
    progress_percentage INT DEFAULT 0,
    quiz_score INT,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (content_id) REFERENCES content(id)
);
```

---

## 🎨 Frontend Architecture (React 19 + Tailwind)

### **1. Project Structure**

```
frontend/
├─ src/
│  ├─ components/
│  │  ├─ Auth/
│  │  │  ├─ Login.jsx
│  │  │  ├─ Register.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ Common/
│  │     ├─ Navigation.jsx
│  │     ├─ Footer.jsx
│  │     └─ Loading.jsx
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ Catalog.jsx
│  │  ├─ ContentDetail.jsx
│  │  ├─ Checkout.jsx
│  │  └─ Login.jsx
│  ├─ services/
│  │  ├─ api.js
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  ├─ hooks/
│  │  ├─ useAuth.js
│  ├─ App.jsx
│  └─ main.jsx
├─ public/
├─ tailwind.config.js
├─ vite.config.js
└─ package.json
```

---

## ⚙️ Backend Architecture (Spring Boot 3.x)

### **1. Project Structure**

```
backend/
├─ src/main/java/com/codevault/
│  ├─ controller/
│  │  ├─ AuthController.java
│  │  ├─ ContentController.java
│  │  └─ PaymentController.java
│  ├─ service/
│  │  ├─ UserService.java
│  │  ├─ ContentService.java
│  │  └─ CashfreeService.java
│  ├─ repository/
│  │  ├─ UserRepository.java
│  │  ├─ ContentRepository.java
│  │  ├─ PaymentRepository.java
│  │  └─ UserPurchaseRepository.java
│  ├─ model/
│  │  ├─ User.java
│  │  ├─ Content.java
│  │  ├─ Payment.java
│  │  └─ UserPurchase.java
│  ├─ dto/
│  │  ├─ LoginRequest.java
│  │  ├─ OrderRequest.java
│  │  ├─ OrderResponse.java
│  │  └─ ContentPreviewDto.java
│  ├─ security/
│  │  ├─ JwtTokenProvider.java
│  │  ├─ JwtAuthenticationFilter.java
│  │  └─ SecurityConfig.java
│  └─ Application.java
├─ src/main/resources/
│  ├─ application.properties
└─ pom.xml
```

---

## 📋 API Endpoints Documentation

### **Authentication**
```
POST   /api/v1/auth/register           - Register new user
POST   /api/v1/auth/login              - Login user
GET    /api/v1/auth/profile            - Get user profile (protected)
```

### **Content**
```
GET    /api/v1/content                 - Get all content with purchase status
GET    /api/v1/content/{id}            - Get single content with access status
```

### **Payments**
```
POST   /api/v1/payments/create-order   - Create a CashFree order for a specific course
POST   /api/v1/payments/webhook        - CashFree webhook handler
```

---

## 🚀 Deployment Architecture

### **Frontend Deployment (Vercel)**
```
1. Build React app: npm run build
2. Push to GitHub
3. Connect to Vercel
4. Set environment variables:
   - REACT_APP_API_URL
5. Deploy automatically on push
```

### **Backend Deployment (Railway/Heroku)**
```
1. Create database in Supabase
2. Set environment variables:
   - SPRING_DATASOURCE_URL (Supabase PostgreSQL)
   - SPRING_DATASOURCE_USERNAME
   - SPRING_DATASOURCE_PASSWORD
   - CASHFREE_CLIENT_ID
   - CASHFREE_CLIENT_SECRET
   - JWT_SECRET
3. Deploy Spring Boot app
4. Configure CashFree webhook to backend URL
```

### **Database (Supabase)**
```
1. Create project in Supabase
2. Run schema.sql to create tables
3. Enable Row Level Security (RLS) for security
4. Create policies for user data access
5. Enable backups
```

---

## 📊 User Journey with CashFree

```
1. User Visits Website
   ↓
2. Browse Free Content
   ↓
3. Clicks "Explore" on a Premium Course
   ↓
4. React navigates to /content/{id}
   ↓
5. Paywall is displayed, user clicks "Upgrade to Premium"
   ↓
6. React navigates to /checkout/{id}
   ↓
7. User reviews the order and clicks "Pay Now"
   ↓
8. CashFree modal opens for payment
   ↓
9. User completes payment
   ↓
10. CashFree modal closes, frontend shows "Payment Successful" for 3 seconds
    ↓
11. User is redirected back to /content/{id}
    ↓
12. Frontend re-fetches content, backend confirms purchase, full content is displayed
```

---

## 🧪 Testing CashFree Integration

### **Test Cards**
Use the test card numbers provided in the CashFree documentation for various scenarios (success, failure, etc.).

### **Testing Purchase Flow**
```
1. Register new user
2. Go to /catalog
3. Choose a premium course and click "Explore"
4. Click "Upgrade to Premium" on the paywall
5. Click "Pay Now" on the checkout page
6. Use a CashFree test card to complete the payment
7. Verify the "Payment Successful" screen appears
8. Verify you are redirected to the content page
9. Verify the full content is now visible
10. Go back to the /catalog page and verify the course now shows as "Purchased"
```

---

## 📁 Configuration Files

### **application.properties (Backend)**
```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate

cashfree.client.id=${CASHFREE_CLIENT_ID}
cashfree.client.secret=${CASHFREE_CLIENT_SECRET}

app.jwtSecret=${JWT_SECRET}
app.jwtExpirationMs=86400000

server.port=8080
```

### **.env.local (Frontend)**
```
REACT_APP_API_URL=http://localhost:8080
```
---

This is your complete CodeVault implementation guide with CashFree integration!

Last Updated: April 2024
