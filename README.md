# LocalCraft

Live Demo - https://local-cart-gamma.vercel.app/

Hyperlocal artisan marketplace built with Next.js App Router.

LocalCraft helps buyers discover nearby handmade shops, browse products, and place orders with secure checkout. Sellers can register, create a shop, list products, and manage incoming orders.

## Features

- Role-based auth for buyers and sellers (NextAuth credentials flow)
- Seller onboarding with shop creation and location coordinates
- Geolocation-based nearby shop discovery with MongoDB geospatial queries
- Interactive shop map with React Leaflet
- Product listing and inventory tracking
- Razorpay checkout and signature verification
- Order creation, status tracking, and seller order updates
- Transactional emails to buyer and seller via Resend
- UploadThing integration for shop logos and product images

## Tech Stack

- Framework: Next.js 16 (App Router)
- Runtime: React 19
- Language: JavaScript
- Styling: Tailwind CSS 4 + custom CSS
- Auth: NextAuth v5 (credentials provider)
- Database: MongoDB + Mongoose
- Payments: Razorpay (active), Stripe routes are scaffolded placeholders
- Email: Resend
- Maps: React Leaflet + OpenStreetMap tiles
- File Uploads: UploadThing

## Project Structure

```text
src/
	app/
		(auth)/login, register
		(dashboard)/buyer, seller
		api/
			auth/[...nextauth]
			register
			shop
			shops/nearby
			products
			checkout
			checkout/verify
			orders
			orders/[orderId]
			email
			uploadthing
			stripe/products        (placeholder)
			stripe/webhook         (placeholder)
		checkout/success
		explore
		product/[productId]
		shop/[shopId]
	components/
		maps/
		products/
		seller/
		shared/
		ui/
	lib/
		auth, mongodb, razorpay, resend, stripe
	models/
		User, Shop, Product, Order
```

## Getting Started

### 1. Prerequisites

- Node.js 20+
- npm 10+ (or yarn/pnpm/bun)
- MongoDB instance (local or Atlas)
- Razorpay account (for checkout)
- Resend account (for transactional emails)
- UploadThing app credentials (for media uploads)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a .env.local file in the project root:

```env
# App URL
NEXTAUTH_URL=http://localhost:3000

# NextAuth secret (required in production)
NEXTAUTH_SECRET=your_long_random_secret

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/localcraft

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx

# Resend
RESEND_API_KEY=re_xxxxx

# UploadThing (required for file uploads)
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Optional Stripe placeholders (for future implementation)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Available Scripts

- npm run dev: Start development server
- npm run build: Create production build
- npm run start: Run production server
- npm run lint: Run ESLint

## API Overview

### Auth

- GET/POST /api/auth/[...nextauth]: NextAuth handler
- POST /api/register: Register user (buyer or seller)

### Shop and discovery

- POST /api/shop: Create seller shop
- GET /api/shop: Get current seller shop
- GET /api/shops/nearby?lng=&lat=&radius=: Find active shops near a location

### Products

- POST /api/products: Create product (seller only)
- GET /api/products?shopId=: List products (all or by shop)

### Checkout and orders

- POST /api/checkout: Create Razorpay order
- POST /api/checkout/verify: Verify payment, create order, reduce stock, trigger emails
- GET /api/orders?role=seller: Get buyer/seller orders
- PATCH /api/orders/[orderId]: Update order status (seller)

### Email and uploads

- POST /api/email: Send transactional order emails
- GET/POST /api/uploadthing: UploadThing route handler

### Stripe (placeholder routes)

- GET/POST /api/stripe/products
- POST /api/stripe/webhook

## Core Data Models

- User: name, email, password, role (buyer/seller), shop reference
- Shop: owner, name, description, logo, GeoJSON location, delivery radius
- Product: shop, seller, name, description, images, category, stock, price
- Order: buyer, seller, product, quantity, totalAmount, status, payment fields, delivery address

## Product Flow

1. User registers as buyer or seller.
2. Seller creates shop and location details.
3. Seller uploads media and publishes products.
4. Buyer discovers nearby shops from map/geolocation.
5. Buyer checks out using Razorpay.
6. Server verifies payment signature and creates order.
7. Stock is decremented and both buyer and seller receive email notifications.

## Deployment Notes

- Deploy on Vercel or any Node-compatible host.
- Add all environment variables in your deployment dashboard.
- Ensure NEXTAUTH_URL points to your production domain.
- Ensure MongoDB network access allows connections from your host.
- Configure a production sender domain in Resend.
- If implementing Stripe, replace placeholder routes with real signature verification and event handlers.

## Current Limitations and TODO

- Stripe routes are scaffolded and not yet integrated with real checkout logic.
- No automated tests configured yet.
- Add RBAC hardening and audit logging for production-grade security.
- Add rate limiting and API abuse protection.


