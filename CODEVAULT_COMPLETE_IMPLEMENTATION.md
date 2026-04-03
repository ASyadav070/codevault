# CodeVault - Advanced Tech & Interview Prep Hub with Stripe Payment Integration

## 🎯 Project Overview

**CodeVault** is a production-ready SaaS platform for technical education with gated premium content, real payment processing via Stripe, and role-based access control.

---

## 📊 Tech Stack

```
Frontend:
├─ React 19 (concurrent rendering, hooks)
├─ Tailwind CSS v3 (JIT engine, responsive)
├─ Stripe React SDK (@stripe/react-stripe-js)
├─ Axios (API communication)
├─ React Router (navigation)
└─ Redux/Context API (state management)

Backend:
├─ Spring Boot 3.x (enterprise-grade)
├─ Spring Security (JWT auth)
├─ Spring Data JPA/Hibernate
├─ Stripe Java SDK
└─ PostgreSQL Driver

Database & Storage:
├─ Supabase (PostgreSQL hosting)
├─ Supabase Storage (file storage)
└─ JWT tokens (stateless auth)

Payment Processing:
└─ Stripe (payment processor, subscriptions)
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
    subscription_status VARCHAR(20) DEFAULT 'FREE', -- 'FREE', 'PREMIUM'
    stripe_customer_id VARCHAR(255), -- Link to Stripe customer
    subscription_id VARCHAR(255), -- Stripe subscription ID
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
    content_url TEXT, -- Supabase Storage URL
    thumbnail_url TEXT,
    created_by UUID, -- Reference to admin user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Subscription Plans Table
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100), -- 'Starter', 'Professional', 'Enterprise'
    description TEXT,
    price DECIMAL(10, 2),
    billing_interval VARCHAR(20), -- 'monthly', 'yearly'
    stripe_price_id VARCHAR(255), -- Stripe price ID
    features JSONB, -- JSON array of features
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed'
    stripe_payment_id VARCHAR(255),
    subscription_plan_id UUID,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id)
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

-- Quiz Responses Table
CREATE TABLE quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    content_id UUID NOT NULL,
    responses JSONB, -- Quiz answers
    score INT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
│  │  ├─ Content/
│  │  │  ├─ ContentList.jsx
│  │  │  ├─ ContentDetail.jsx
│  │  │  ├─ Paywall.jsx
│  │  │  └─ Quiz.jsx
│  │  ├─ Subscription/
│  │  │  ├─ PricingPage.jsx
│  │  │  ├─ CheckoutForm.jsx
│  │  │  ├─ PaymentSuccess.jsx
│  │  │  └─ Dashboard.jsx
│  │  ├─ Admin/
│  │  │  ├─ AdminDashboard.jsx
│  │  │  ├─ ContentUpload.jsx
│  │  │  └─ UserManagement.jsx
│  │  └─ Common/
│  │     ├─ Navigation.jsx
│  │     ├─ Footer.jsx
│  │     └─ Loading.jsx
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ Catalog.jsx
│  │  ├─ Pricing.jsx
│  │  └─ Dashboard.jsx
│  ├─ services/
│  │  ├─ api.js
│  │  ├─ auth.js
│  │  ├─ content.js
│  │  ├─ payment.js
│  │  └─ stripe.js
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  │  └─ SubscriptionContext.jsx
│  ├─ hooks/
│  │  ├─ useAuth.js
│  │  ├─ useSubscription.js
│  │  └─ useStripe.js
│  ├─ utils/
│  │  ├─ constants.js
│  │  └─ helpers.js
│  ├─ App.jsx
│  └─ main.jsx
├─ public/
├─ tailwind.config.js
├─ vite.config.js
└─ package.json
```

### **2. Key Components**

**Home Page (Marketing)**
```jsx
// Home.jsx - Landing page showcasing CodeVault
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold text-white mb-4">
          CodeVault - Master Technical Interviews
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Comprehensive platform for DSA, System Design, and More
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
          Get Started Free
        </button>
      </section>

      {/* Content Preview */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Content</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Content cards with FREE/PREMIUM badges */}
        </div>
      </section>
    </div>
  );
}
```

**Pricing Page with Stripe**
```jsx
// PricingPage.jsx
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['Basic tutorials', 'Free resources', 'Community access'],
      priceId: null
    },
    {
      name: 'Professional',
      price: 9.99,
      features: ['All content', 'Quizzes', 'Progress tracking', 'Priority support'],
      priceId: 'price_1234567890'
    },
    {
      name: 'Enterprise',
      price: 19.99,
      features: ['Everything in Professional', 'Mentorship', 'Interview coaching', '1:1 sessions'],
      priceId: 'price_0987654321'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Choose Your Plan</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-3xl font-bold mb-4">${plan.price}/month</p>
            
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.priceId ? (
              <Elements stripe={stripePromise}>
                <CheckoutButton priceId={plan.priceId} planName={plan.name} />
              </Elements>
            ) : (
              <button className="w-full bg-gray-300 text-gray-500 py-2 rounded cursor-not-allowed">
                Current Plan
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Checkout Form with Stripe**
```jsx
// CheckoutForm.jsx
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { createSubscription } from '@/services/payment';

export default function CheckoutForm({ priceId, planName }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    
    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)
      });

      if (pmError) {
        setError(pmError.message);
        setLoading(false);
        return;
      }

      // Send to backend
      const response = await createSubscription(priceId, paymentMethod.id);
      
      if (response.success) {
        // Handle successful subscription
        window.location.href = '/dashboard?payment=success';
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <CardElement className="border p-3 rounded mb-4" />
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <button
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : `Subscribe to ${planName}`}
      </button>
    </form>
  );
}
```

**Content with Paywall**
```jsx
// ContentDetail.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getContent } from '@/services/content';
import Paywall from '@/components/Content/Paywall';

export default function ContentDetail({ contentId }) {
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getContent(contentId);
      setContent(data);
      setLoading(false);
    };
    fetchContent();
  }, [contentId]);

  if (loading) return <div>Loading...</div>;
  if (!content) return <div>Content not found</div>;

  // Check access
  const canAccess = content.access_level === 'FREE' || 
                   (user && user.subscription_status === 'PREMIUM');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
      
      {content.access_level === 'PREMIUM' && (
        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded mb-4">
          Premium Content
        </span>
      )}

      {canAccess ? (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Full content */}
          <div dangerouslySetInnerHTML={{ __html: content.body }} />
          
          {/* Interactive Quiz if available */}
          {content.quiz && <Quiz quizData={content.quiz} contentId={contentId} />}
        </div>
      ) : (
        <Paywall contentTitle={content.title} />
      )}
    </div>
  );
}
```

**Paywall Component**
```jsx
// Paywall.jsx
import { useNavigate } from 'react-router-dom';

export default function Paywall({ contentTitle }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">
        🔒 Premium Content: {contentTitle}
      </h2>
      
      <p className="text-xl mb-6">
        Upgrade to Premium to unlock this exclusive content and accelerate your learning
      </p>

      <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
        <p className="flex items-center">
          <span className="text-2xl mr-3">✓</span> In-depth solutions and explanations
        </p>
        <p className="flex items-center">
          <span className="text-2xl mr-3">✓</span> Practice quizzes and assessments
        </p>
        <p className="flex items-center">
          <span className="text-2xl mr-3">✓</span> Download study materials
        </p>
      </div>

      <button
        onClick={() => navigate('/pricing')}
        className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100"
      >
        Upgrade to Premium
      </button>
    </div>
  );
}
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
│  │  ├─ SubscriptionController.java
│  │  ├─ PaymentController.java
│  │  ├─ QuizController.java
│  │  └─ AdminController.java
│  ├─ service/
│  │  ├─ UserService.java
│  │  ├─ ContentService.java
│  │  ├─ SubscriptionService.java
│  │  ├─ PaymentService.java
│  │  ├─ StripeService.java
│  │  └─ QuizService.java
│  ├─ repository/
│  │  ├─ UserRepository.java
│  │  ├─ ContentRepository.java
│  │  ├─ SubscriptionPlanRepository.java
│  │  ├─ PaymentRepository.java
│  │  └─ QuizResponseRepository.java
│  ├─ model/
│  │  ├─ User.java
│  │  ├─ Content.java
│  │  ├─ SubscriptionPlan.java
│  │  ├─ Payment.java
│  │  └─ QuizResponse.java
│  ├─ dto/
│  │  ├─ LoginRequest.java
│  │  ├─ CreateSubscriptionRequest.java
│  │  ├─ PaymentResponse.java
│  │  └─ QuizSubmissionRequest.java
│  ├─ security/
│  │  ├─ JwtTokenProvider.java
│  │  ├─ JwtAuthenticationFilter.java
│  │  └─ SecurityConfig.java
│  ├─ exception/
│  │  ├─ UnauthorizedException.java
│  │  ├─ SubscriptionException.java
│  │  └─ GlobalExceptionHandler.java
│  └─ Application.java
├─ src/main/resources/
│  ├─ application.properties
│  └─ application-prod.properties
└─ pom.xml
```

### **2. Key Controllers**

**AuthController.java**
```java
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest request) {
        User user = userService.registerUser(request.getEmail(), request.getPassword());
        String token = jwtTokenProvider.generateToken(user.getId().toString());
        return ResponseEntity.ok(new LoginResponse(token, user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.authenticateUser(request.getEmail(), request.getPassword());
        String token = jwtTokenProvider.generateToken(user.getId().toString());
        return ResponseEntity.ok(new LoginResponse(token, user));
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal String userId) {
        User user = userService.getUserById(UUID.fromString(userId));
        return ResponseEntity.ok(user);
    }
}
```

**PaymentController.java - The Stripe Integration**
```java
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    
    @Autowired
    private StripeService stripeService;
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    @Autowired
    private UserService userService;

    @PostMapping("/create-subscription")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createSubscription(
            @RequestBody CreateSubscriptionRequest request,
            @AuthenticationPrincipal String userId) {
        
        try {
            // Get user and plan
            User user = userService.getUserById(UUID.fromString(userId));
            SubscriptionPlan plan = subscriptionService.getPlan(request.getPlanId());
            
            // Create Stripe customer if doesn't exist
            if (user.getStripeCustomerId() == null) {
                String stripeCustomerId = stripeService.createCustomer(user.getEmail(), user.getFullName());
                user.setStripeCustomerId(stripeCustomerId);
                userService.saveUser(user);
            }
            
            // Create Stripe subscription
            Subscription stripeSubscription = stripeService.createSubscription(
                user.getStripeCustomerId(),
                plan.getStripePrice_id(),
                request.getPaymentMethodId()
            );
            
            // Update user in database
            user.setSubscriptionStatus("PREMIUM");
            user.setSubscription_id(stripeSubscription.getId());
            userService.saveUser(user);
            
            // Record payment
            Payment payment = new Payment();
            payment.setUserId(user.getId());
            payment.setAmount(plan.getPrice());
            payment.setStatus("succeeded");
            payment.setStripePaymentId(stripeSubscription.getId());
            paymentService.savePayment(payment);
            
            // Generate new JWT with updated claims
            String newToken = jwtTokenProvider.generateToken(
                userId,
                user.getSubscriptionStatus(),
                user.getRole()
            );
            
            return ResponseEntity.ok(new PaymentResponse(
                "success",
                "Subscription created successfully",
                newToken
            ));
            
        } catch (StripeException e) {
            return ResponseEntity.status(400).body(
                new PaymentResponse("error", e.getMessage(), null)
            );
        }
    }

    @PostMapping("/cancel-subscription")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelSubscription(@AuthenticationPrincipal String userId) {
        try {
            User user = userService.getUserById(UUID.fromString(userId));
            
            // Cancel in Stripe
            stripeService.cancelSubscription(user.getSubscription_id());
            
            // Update in database
            user.setSubscriptionStatus("FREE");
            user.setSubscription_id(null);
            userService.saveUser(user);
            
            return ResponseEntity.ok(new PaymentResponse("success", "Subscription cancelled", null));
        } catch (StripeException e) {
            return ResponseEntity.status(400).body(
                new PaymentResponse("error", e.getMessage(), null)
            );
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleStripeWebhook(
            @RequestBody String body,
            @RequestHeader("Stripe-Signature") String sig) {
        
        try {
            Event event = stripeService.constructEvent(body, sig);
            
            switch (event.getType()) {
                case "customer.subscription.updated":
                    // Handle subscription update
                    break;
                case "customer.subscription.deleted":
                    // Handle subscription cancellation
                    break;
                case "invoice.payment_succeeded":
                    // Handle successful payment
                    break;
                case "invoice.payment_failed":
                    // Handle failed payment
                    break;
            }
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
```

**ContentController.java**
```java
@RestController
@RequestMapping("/api/v1/content")
public class ContentController {
    
    @Autowired
    private ContentService contentService;
    
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllContent(@AuthenticationPrincipal String userId) {
        User user = userId != null ? userService.getUserById(UUID.fromString(userId)) : null;
        List<Content> content = contentService.getAccessibleContent(user);
        return ResponseEntity.ok(content);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getContent(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId) {
        
        Content content = contentService.getContentById(id);
        User user = userId != null ? userService.getUserById(UUID.fromString(userId)) : null;
        
        // Check access
        boolean canAccess = content.getAccessLevel().equals("FREE") ||
                           (user != null && user.getSubscriptionStatus().equals("PREMIUM"));
        
        if (!canAccess) {
            // Return only preview for premium content
            content.setBody(content.getBody().substring(0, Math.min(500, content.getBody().length())) + "...");
            content.setAccessDenied(true);
        }
        
        return ResponseEntity.ok(content);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createContent(
            @RequestBody ContentCreateRequest request,
            @AuthenticationPrincipal String userId) {
        
        User admin = userService.getUserById(UUID.fromString(userId));
        Content content = contentService.createContent(request, admin);
        return ResponseEntity.status(201).body(content);
    }
}
```

### **3. StripeService - Core Payment Logic**

```java
@Service
public class StripeService {
    
    @Value("${stripe.secret-key}")
    private String stripeSecretKey;
    
    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    public StripeService() {
        // Stripe initialization will happen in PostConstruct
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    // Create Stripe customer
    public String createCustomer(String email, String name) throws StripeException {
        CustomerCreateParams params = CustomerCreateParams.builder()
            .setEmail(email)
            .setName(name)
            .build();
        
        Customer customer = Customer.create(params);
        return customer.getId();
    }

    // Create subscription
    public Subscription createSubscription(
            String customerId,
            String priceId,
            String paymentMethodId) throws StripeException {
        
        SubscriptionCreateParams params = SubscriptionCreateParams.builder()
            .setCustomer(customerId)
            .setPaymentBehavior(SubscriptionCreateParams.PaymentBehavior.ERROR_IF_INCOMPLETE)
            .addItem(SubscriptionCreateParams.Item.builder()
                .setPrice(priceId)
                .build())
            .setDefaultPaymentMethod(paymentMethodId)
            .build();
        
        return Subscription.create(params);
    }

    // Cancel subscription
    public void cancelSubscription(String subscriptionId) throws StripeException {
        Subscription subscription = Subscription.retrieve(subscriptionId);
        subscription.cancel();
    }

    // Construct webhook event for verification
    public Event constructEvent(String payload, String sigHeader) throws SignatureVerificationException {
        return Webhook.constructEvent(payload, sigHeader, webhookSecret);
    }

    // Get invoice
    public Invoice getInvoice(String invoiceId) throws StripeException {
        return Invoice.retrieve(invoiceId);
    }
}
```

---

## 🔐 Security & JWT Implementation

### **JwtTokenProvider.java**

```java
@Component
public class JwtTokenProvider {
    
    @Value("${app.jwtSecret}")
    private String jwtSecret;
    
    @Value("${app.jwtExpirationMs}")
    private int jwtExpirationMs;

    public String generateToken(String userId, String subscriptionStatus, String role) {
        return Jwts.builder()
            .setSubject(userId)
            .claim("subscription_status", subscriptionStatus)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public String getUserIdFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getSubscriptionStatusFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .get("subscription_status", String.class);
    }
}
```

### **JwtAuthenticationFilter.java**

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);
            
            if (jwt != null && tokenProvider.validateToken(jwt)) {
                String userId = tokenProvider.getUserIdFromToken(jwt);
                UserDetails userDetails = new User(userId, "", new ArrayList<>());
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication", ex);
        }
        
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
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
GET    /api/v1/content                 - Get all accessible content
GET    /api/v1/content/{id}            - Get single content
POST   /api/v1/content                 - Create content (admin only)
PUT    /api/v1/content/{id}            - Update content (admin only)
DELETE /api/v1/content/{id}            - Delete content (admin only)
GET    /api/v1/content/category/{cat}  - Get content by category
```

### **Payments & Subscriptions**
```
GET    /api/v1/payments/plans          - Get subscription plans
POST   /api/v1/payments/create-subscription    - Create subscription with Stripe
POST   /api/v1/payments/cancel-subscription    - Cancel subscription
GET    /api/v1/payments/history        - Get payment history
POST   /api/v1/payments/webhook        - Stripe webhook handler
```

### **Quiz & Progress**
```
GET    /api/v1/quiz/{contentId}        - Get quiz for content
POST   /api/v1/quiz/submit             - Submit quiz answers
GET    /api/v1/progress                - Get user progress
```

### **Admin**
```
POST   /api/v1/admin/users             - List all users (admin only)
PUT    /api/v1/admin/users/{id}        - Update user (admin only)
DELETE /api/v1/admin/users/{id}        - Delete user (admin only)
```

---

## 🚀 Deployment Architecture

### **Frontend Deployment (Vercel)**
```
1. Build React app: npm run build
2. Push to GitHub
3. Connect to Vercel
4. Set environment variables:
   - REACT_APP_STRIPE_PUBLIC_KEY
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
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
   - JWT_SECRET
3. Deploy Spring Boot app
4. Configure Stripe webhook to backend URL
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

## 📊 User Journey with Stripe

```
1. User Visits Website
   ↓
2. Browse Free Content
   ↓
3. Click "Upgrade" or Try Premium
   ↓
4. React navigates to /pricing
   ↓
5. User selects plan (Professional/Enterprise)
   ↓
6. React shows Elements Stripe form
   ↓
7. User enters card details (4242 4242 4242 4242 for testing)
   ↓
8. Form submits to backend with paymentMethodId
   ↓
9. Spring Boot:
   - Creates Stripe customer
   - Creates Stripe subscription
   - Updates user in database (PREMIUM)
   - Generates new JWT with PREMIUM claim
   ↓
10. Frontend receives new JWT
   ↓
11. User redirected to dashboard
   ↓
12. All content now accessible
   ↓
13. Next month: Stripe auto-charges user
   ↓
14. Stripe sends webhook to backend
   ↓
15. Backend processes webhook event
   ↓
16. User continues with access
```

---

## 🧪 Testing Stripe Integration

### **Test Cards**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Auth Required: 4000 0025 0000 3155
Expired: 4000 0000 0000 0069

Expiry: Any future date
CVC: Any 3 digits
```

### **Testing Subscription**
```
1. Register new user
2. Go to /pricing
3. Choose Professional plan
4. Enter test card (4242...)
5. Verify subscription created in Stripe dashboard
6. Check database for updated subscription_status
7. Verify JWT contains PREMIUM claim
8. Try accessing premium content
9. Should work without paywall
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

stripe.secret-key=${STRIPE_SECRET_KEY}
stripe.webhook-secret=${STRIPE_WEBHOOK_SECRET}

app.jwtSecret=${JWT_SECRET}
app.jwtExpirationMs=86400000

server.port=8080
```

### **.env.local (Frontend)**
```
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
REACT_APP_API_URL=http://localhost:8080
```

---

## 🎯 Project Milestones

### **Week 1-2: Setup & Database**
- [ ] Supabase database created
- [ ] Schema implemented
- [ ] Spring Boot project initialized
- [ ] React project initialized

### **Week 3: Authentication**
- [ ] User registration/login APIs
- [ ] JWT implementation
- [ ] React auth context
- [ ] Protected routes

### **Week 4: Content Management**
- [ ] Content CRUD APIs
- [ ] Content categorization
- [ ] Admin dashboard
- [ ] Content display UI

### **Week 5: Stripe Integration**
- [ ] Stripe account setup
- [ ] Subscription plans created
- [ ] Payment APIs implemented
- [ ] Webhook handlers

### **Week 6: Frontend Payment**
- [ ] Pricing page
- [ ] Stripe Elements integration
- [ ] Checkout flow
- [ ] Payment success/error handling

### **Week 7: Paywall & Access Control**
- [ ] Paywall implementation
- [ ] Content access verification
- [ ] Dashboard with subscription info
- [ ] Cancellation flow

### **Week 8: Quiz & Polish**
- [ ] Quiz engine
- [ ] Progress tracking
- [ ] Testing & bug fixes
- [ ] Deployment

---

## 💡 Key Implementation Tips

```
✅ DO:
├─ Store Stripe keys in environment variables
├─ Use Stripe test keys during development
├─ Implement webhook handlers for payment events
├─ Generate new JWT after subscription status change
├─ Test with test cards before going live
├─ Implement rate limiting on payment endpoints
├─ Log all Stripe transactions
├─ Handle payment failures gracefully
└─ Keep JWT expiration reasonable (24h)

❌ DON'T:
├─ Hardcode Stripe keys
├─ Store payment data in your database
├─ Skip webhook implementation
├─ Use old JWT after subscription change
├─ Test with real payment methods
├─ Forget HTTPS in production
├─ Miss error handling in payment flow
└─ Expose sensitive data in logs
```

---

This is your complete CodeVault implementation guide with Stripe integration!

Last Updated: February 2026
