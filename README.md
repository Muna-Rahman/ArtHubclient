# ArtHub 

### 🌐 [Live Project URL](https://arthub-mauve.vercel.app)

---

## 📝 Project Overview

ArtHub is a comprehensive full-stack digital art marketplace built for the modern creative economy. The platform bridges the gap between digital creators and art enthusiasts by offering role-specific portals (Admin, Artist, and Collector). Artists can monetize their craft under specific subscription boundaries, collectors can explore, buy, and critique artwork, and administrators retain complete oversight of the ecosystem's integrity and transactions.

---

## 🌟 Core Features

### 🔐 Secure Authentication
Seamless, robust identity management powered by Better Auth.

### 🎛️ Role-Based Dashboards

#### Admin
- Monitor global sales.
- Manage platform users.
- Review transaction safety.

#### Artist
- Upload artwork.
- Track individual revenue.
- Manage membership quotas.

#### Collector
- Manage purchased galleries.
- View transaction history.
- Leave reviews.

### 💳 Stripe Payment Integration
Fast, end-to-end encrypted financial checkouts for direct artwork sales.

### 🖼️ Asset Management
Dynamic artwork uploads, portfolio organization, and presentation.

### ⭐ Verified Reviews
Interactive rating and feedback system restricted strictly to verified buyers.

### 💎 Membership Tiering
Tier-based membership plans that scale and enforce artwork upload limits dynamically.

---

## 🛠️ Technologies Used

### Frontend Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **UI Components:** @heroui/react
- **Authentication Client:** Better Auth
- **Notifications:** React Hot Toast

### Backend & Database Stack

- **Server Environment:** Express.js (Node.js)
- **Database:** MongoDB
- **Payment Gateway:** Stripe API
- **Security & Utilities:** Cors, Dotenv, Better Auth

---

## 📦 System Dependencies

### Frontend (`client/package.json`)

- next
- react
- @heroui/react
- better-auth
- react-hot-toast
- tailwindcss

### Backend (`server/package.json`)

- express
- mongodb
- stripe
- better-auth
- cors
- dotenv

---

## 🚀 Local Installation & Setup Guide

Follow these steps to configure and boot ArtHub in your local environment.

### Prerequisites

- Ensure you have Node.js (v18+ recommended) and npm installed.
- Setup a MongoDB Atlas cluster or a local MongoDB database instance.
- Create a developer account on Stripe to acquire sandbox keys.

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Muna-Rahman/arthub.git
cd arthub
```

---

### Step 2: Backend Configuration

Navigate into the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root of the `server/` directory and include the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
BETTER_AUTH_SECRET=your_auth_secret
CLIENT_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

---

### Step 3: Frontend Configuration

Open a new terminal instance and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the root of the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Start the frontend development server:

```bash
npm run dev
```

Open your browser and navigate to **http://localhost:3000** to interact with the system.
