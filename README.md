# CodeVault - Advanced Tech & Interview Prep Hub

CodeVault is a modern web application designed to help users master technical interviews through a curated collection of free and premium content. This platform features a robust Spring Boot backend, a sleek React frontend, and integrates CashFree for secure per-course payment processing.

## 🚀 Features

*   **User Authentication:** Secure registration and login with JWT-based authentication.
*   **Content Catalog:** Browse a rich catalog of technical content (articles, videos, quizzes).
*   **Access Control:** Free content is openly accessible, while premium content requires a one-time purchase.
*   **Per-Course Purchase:** Users can purchase individual premium courses using CashFree.
*   **Dynamic Paywall:** Premium content is locked behind a paywall until purchased.
*   **Responsive UI:** A modern, dark-mode user interface built with React and Tailwind CSS.
*   **Protected Routes:** Ensures authenticated access to core application features.
*   **Payment Integration:** Seamless checkout experience powered by CashFree.
*   **Webhook Handling:** Backend processes CashFree webhooks to confirm purchases and grant access.

## 🛠️ Tech Stack

### Frontend
*   **React 19:** Core JavaScript library for building user interfaces.
*   **Tailwind CSS v4:** Utility-first CSS framework for rapid styling.
*   **React Router:** Declarative routing for React applications.
*   **Axios:** Promise-based HTTP client for API requests.
*   **CashFree JS SDK:** Client-side integration for CashFree payments.
*   **React Context API:** For global state management (e.g., authentication).

### Backend
*   **Spring Boot 3.x:** Powerful Java framework for building RESTful APIs.
*   **Spring Security:** Provides robust authentication and authorization.
*   **JSON Web Tokens (JWT):** For stateless API authentication.
*   **Spring Data JPA & Hibernate:** For database interaction and ORM.
*   **CashFree Java SDK:** Server-side integration for CashFree order creation and webhook verification.
*   **PostgreSQL Driver:** Database connectivity.

### Database & Storage
*   **Supabase PostgreSQL:** Managed relational database.
*   **Supabase Storage:** For storing media files associated with content.

## 🏗️ Architecture Overview

The application follows a client-server architecture:
*   **Frontend:** A React SPA consumes the backend API, handles user interaction, and integrates with the CashFree JS SDK for payment initiation.
*   **Backend:** A Spring Boot application exposes RESTful APIs for authentication, content management, and payment processing. It interacts with the PostgreSQL database and the CashFree API.
*   **Database:** Supabase PostgreSQL stores user data, content metadata, payment records, and user purchase history.
*   **CashFree:** Handles the secure processing of payments and notifies the backend via webhooks upon transaction completion.

## 🚀 Getting Started

### Prerequisites

*   Java 17 or higher
*   Node.js (LTS version) and npm/yarn
*   PostgreSQL database (e.g., via Supabase or local installation)
*   CashFree Merchant Account (for API keys and webhook setup)

### 1. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Database Configuration:**
    *   Create a PostgreSQL database (e.g., on Supabase).
    *   Update `src/main/resources/application.properties` with your database credentials:
        ```properties
        spring.datasource.url=jdbc:postgresql://<your-supabase-host>:5432/<your-database-name>
        spring.datasource.username=<your-database-user>
        spring.datasource.password=<your-database-password>
        spring.jpa.hibernate.ddl-auto=update # Or 'create' for first run, then 'validate'
        ```
    *   **Apply Schema:** The application will attempt to create/update tables based on the JPA entities. Ensure your `payments` table has a `content_id` column and not `subscription_plan_id`. If you're migrating, you might need to run manual SQL:
        ```sql
        ALTER TABLE payments ADD COLUMN content_id UUID;
        ALTER TABLE payments ALTER COLUMN subscription_plan_id DROP NOT NULL; -- If it exists
        ALTER TABLE payments DROP COLUMN subscription_plan_id; -- If you want to remove it
        ALTER TABLE payments ALTER COLUMN content_id SET NOT NULL;
        ALTER TABLE payments ADD CONSTRAINT fk_payments_content FOREIGN KEY (content_id) REFERENCES content(id);
        ```
    *   **Seed Data (Optional):** Manually insert some `content` entries, including premium ones with a `price`.

3.  **CashFree Configuration:**
    *   Obtain your CashFree `Client ID` and `Client Secret` from your CashFree merchant dashboard.
    *   Add these to `application.properties`:
        ```properties
        cashfree.client.id=<YOUR_CASHFREE_CLIENT_ID>
        cashfree.client.secret=<YOUR_CASHFREE_CLIENT_SECRET>
        ```
    *   **Webhook Setup:** Configure a webhook in your CashFree dashboard to point to your backend's `/api/v1/payments/webhook` endpoint (e.g., `https://your-backend-url/api/v1/payments/webhook`).

4.  **JWT Secret:**
    *   Generate a strong, random string for your JWT secret and add it to `application.properties`:
        ```properties
        app.jwtSecret=<YOUR_VERY_SECRET_JWT_KEY>
        ```

5.  **Run the Backend:**
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend should start on `http://localhost:8080`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    *   Create a `.env.local` file in the `frontend/` directory.
    *   Add your backend API URL:
        ```
        VITE_REACT_APP_API_URL=http://localhost:8080/api/v1
        ```

4.  **Run the Frontend:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend should open in your browser, typically at `http://localhost:5173`.

## 🧪 Testing the Payment Flow

1.  **Register a new user** through the `/register` page.
2.  **Log in** with the newly created user.
3.  Navigate to the **Catalog** (`/catalog`).
4.  Identify a **PREMIUM** course. It should display its price and an "Explore" button.
5.  Click "Explore" on a premium course. This will take you to the **Content Detail** page, where you'll see a paywall.
6.  Click "Upgrade to Premium" on the paywall. This will redirect you to the **Checkout** page.
7.  On the Checkout page, review the order and click "Pay Now".
8.  The **CashFree modal** will appear. Use CashFree's sandbox test card details to complete a successful payment.
9.  Upon successful payment, the CashFree modal will close, and the frontend will display a "Payment Successful!" message for 3 seconds.
10. You will then be **automatically redirected** to the Content Detail page for the purchased course.
11. The full content of the course should now be visible, and the paywall should be gone.
12. Navigate back to the **Catalog**. The purchased course should now display "Purchased" and a "Continue Learning" button instead of the price and "Explore".

## 🤝 Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

## 📄 License

This project is licensed under the MIT License.

---

Last Updated: April 2024
