# Eterna Marketplace Platform — System Architecture

## 1. High-Level Architecture

```
+-------------------+        +-------------------+        +-------------------+
|  Buyer Web/App    | <----> |    Backend API    | <----> |   PostgreSQL DB   |
+-------------------+        +-------------------+        +-------------------+
        |                          |                            |
+-------------------+        +-------------------+        +-------------------+
| Seller Dashboard  | <----> |    Backend API    | <----> |   PostgreSQL DB   |
+-------------------+        +-------------------+        +-------------------+
```

- **Frontend:** Next.js (buyer & seller panels, SSR/SPA)
- **Backend:** Node.js (Express/Next.js API routes, modular controllers)
- **Database:** PostgreSQL (scalable, relational)
- **Auth:** JWT (role-based: admin, seller, buyer)
- **Payments:** M-Pesa ready (webhook endpoints, payment status tracking)
- **Notifications:** Modular (email/SMS/Push, event-driven)
- **Delivery/Logistics:** OTP, tracking fields, assignment logic

## 2. Core Database Schema (ERD)

- **User** (id, name, email, phone, password_hash, role, subscription_plan, ...)
- **Seller** (id, user_id, business_name, verified, ...)
- **Product** (id, seller_id, name, price, bulk_price, moq, images, inventory, ...)
- **Order** (id, buyer_id, seller_id, product_id, quantity, total_price, delivery_fee, status, payment_status, ...)
- **Payment** (id, order_id, mpesa_ref, status, ...)
- **Delivery** (id, order_id, pickup_location, delivery_location, rider_details, pickup_otp, delivery_otp, status, ...)
- **Notification** (id, user_id, type, message, read, ...)
- **Subscription** (id, seller_id, plan, start_date, end_date, ...)

## 3. API Structure (RESTful)

- `/api/auth/` (register, login, logout, refresh, roles)
- `/api/products/` (CRUD, search, filter)
- `/api/orders/` (create, update, status, buyer/seller views)
- `/api/payments/` (initiate, status, webhook)
- `/api/delivery/` (assign, track, OTP)
- `/api/notifications/` (list, mark read)
- `/api/subscriptions/` (plans, upgrade, limits)
- `/api/admin/` (users, orders, revenue, deliveries)

## 4. Security & Scalability

- JWT auth, role checks middleware
- Input validation (zod/yup)
- Modular services/controllers
- Rate limiting, logging, error handling
- Ready for horizontal scaling (stateless API, DB pooling)

---

**Next Steps:**
- Implement database schema in Prisma
- Scaffold API routes and controllers
- Set up authentication and role middleware
- Build core product/order/payment/delivery logic
- Add admin and notification modules

---

> Think like a senior software engineer building a production marketplace similar to Amazon or Jumia, but optimized for the Kenyan wholesale market.
