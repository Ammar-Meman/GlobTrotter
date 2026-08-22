# 🌍 GlobeTrotter

> **Intelligent, Multi-City Travel Planning & Collaborative Itinerary Platform**

GlobeTrotter is a modern, full-stack travel planning application designed to help travelers discover destinations, build detailed day-by-day itineraries, manage budgets with real-time visual analytics, reorder schedules with drag-and-drop timelines, and seamlessly share or clone travel plans.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Project Structure](#-architecture--project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Database & Seeding](#2-database--seeding)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Testing](#-testing)
- [Demo Credentials](#-demo-credentials)

---

## ✨ Features

### 🗺️ Multi-City Itinerary Planning
- **Itinerary Builder & Viewer**: Build multi-city trips with dates, descriptions, cover photos, and custom activities.
- **Day-by-Day Activity Schedule**: Organize stops and activities categorized into **Transport**, **Stay**, **Activity**, and **Meal**.
- **Day-Wise Itinerary View**: Clean, read-only and editable day-by-day views for trip execution.

### 📍 Smart Destination & Activity Discovery
- **City Search**: Powered by **Geoapify Geocoding API** merged with static cost-index and popularity lookup table.
- **Activity Suggestions**: Real-time attraction and food discovery via **Geoapify Places API** with category and price filters.
- **City Photography**: Dynamic city cover photos fetched via **Pexels Photo Search API** with high-resolution curated fallbacks.

### 📊 Visual Budget Analytics
- **Category Rollup**: Instant cost breakdown across transport, accommodation, activities, and dining using interactive **Recharts** (Pie & Bar charts).
- **Daily Budget Thresholds**: Daily spending calculation with automatic over-budget warning indicators.

### ⏳ Drag-and-Drop Timeline
- **Interactive Reordering**: Reorganize trip stops and shift activity orders seamlessly using **@dnd-kit** vertical sortable lists.
- **Optimistic UI Updates**: Instant feedback on drag-and-drop with backend synchronization.

### 🔗 Public Sharing & Trip Cloning
- **Public Share Links**: Share itineraries with unique, non-guessable share IDs accessible without authentication.
- **One-Click Trip Cloning**: Clone public itineraries directly into personal accounts with dates automatically shifted from the current day.

### 🛡️ Authentication & User Profile
- **Secure Authentication**: JWT-based auth with bcrypt password hashing.
- **Saved Destinations**: Bookmark favorite cities directly to your personal profile.
- **Admin Dashboard**: System metrics including top destinations, active users, and total trip statistics.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, PostCSS, shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms & Validation**: React Hook Form, Zod
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Charts & Visuals**: Recharts, Lucide React icons

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database ORM**: Prisma ORM
- **Database**: PostgreSQL
- **Security & Auth**: JWT (`jsonwebtoken`), `bcrypt`
- **File Uploads**: Cloudinary SDK, Multer
- **External APIs**: Geoapify (Geocoding & Places), Pexels (Photo Search)

---

## 📁 Architecture & Project Structure

```
GlobTrotter/
├── frontend/                     # React + Vite client
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── components/           # UI & feature components
│   │   │   ├── trip/             # ActivityCard, BudgetChart, StopForm, Modals
│   │   │   └── ui/               # Buttons, Inputs, Cards, Dialogs
│   │   ├── lib/                  # API client, utility functions, mock data
│   │   ├── pages/                # Route pages (Dashboard, Builder, Budget, Timeline, etc.)
│   │   ├── store/                # Zustand stores (authStore, tripStore)
│   │   ├── App.jsx               # Routes & protected route wrappers
│   │   └── main.jsx              # App entry point
│   └── package.json
│
├── server/                       # Express + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma         # Prisma data models (User, Trip, Stop, Activity, etc.)
│   │   └── seed.js               # Seed script with demo and admin accounts
│   ├── scripts/                  # E2E & Discovery integration test suites
│   │   ├── test-discovery.js     # Geoapify & Pexels discovery test suite
│   │   └── test-sharing-e2e.js   # Public sharing & clone trip test suite
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── data/                 # Static city cost & popularity lookup tables
│   │   ├── middleware/           # Auth, validation, and error middleware
│   │   ├── routes/               # Express route definitions
│   │   ├── services/             # Geoapify, Pexels, Trip, Budget, Auth services
│   │   ├── validators/           # Zod schema validators
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # Server listener entry point
│   └── package.json
│
└── GlobeTrotter_API_Contract_Complete.md # API Contract & Specifications
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on Node v20/v26)
- **npm** or **pnpm**
- **PostgreSQL** database (optional for mocked frontend testing, required for live DB)

---

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `server/.env` with your credentials:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/globetrotter?schema=public"
JWT_SECRET="super-secret-jwt-key-for-globetrotter-hackathon"
JWT_EXPIRES_IN="7d"

# Optional Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="demo"
CLOUDINARY_API_KEY="demo"
CLOUDINARY_API_SECRET="demo"

# External Discovery API Keys (optional; falls back to curated mock data when empty)
GEOAPIFY_API_KEY=""
PEXELS_API_KEY=""
```

---

### 2. Database & Seeding

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to PostgreSQL database
npm run prisma:push

# Seed initial demo data (users, sample multi-stop trip, activities)
npm run seed
```

Start the backend:
```bash
# Development mode with hot-reload
npm run dev

# Or production mode
npm run start
```
*Backend runs on `http://localhost:5000`.*

---

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔐 Environment Variables

### Backend (`server/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret key for JWT signing | `super-secret-jwt-key` |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `GEOAPIFY_API_KEY` | Geoapify API key for Geocoding & Places | *(Optional)* |
| `PEXELS_API_KEY` | Pexels API key for city photo search | *(Optional)* |
| `CLOUDINARY_*` | Cloudinary credentials for media upload | *(Optional)* |

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| **Auth** | | | |
| `POST` | `/api/auth/signup` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | Login user & receive JWT token | ❌ |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | ✅ |
| **Trips** | | | |
| `GET` | `/api/trips` | List all trips owned by user | ✅ |
| `POST` | `/api/trips` | Create a new trip | ✅ |
| `GET` | `/api/trips/:id` | Get full trip with nested stops & activities | ✅ |
| `PUT` | `/api/trips/:id` | Update trip metadata | ✅ |
| `DELETE`| `/api/trips/:id` | Delete trip (cascades stops & activities) | ✅ |
| `GET` | `/api/trips/public/:shareId` | Get public trip by share ID | ❌ |
| `POST` | `/api/trips/:id/copy` | Clone trip into user's account with shifted dates | ✅ |
| **Stops & Activities** | | | |
| `POST` | `/api/trips/:tripId/stops` | Add a new stop to a trip | ✅ |
| `PUT` | `/api/stops/:id` | Update stop details | ✅ |
| `DELETE`| `/api/stops/:id` | Remove a stop | ✅ |
| `PUT` | `/api/trips/:tripId/stops/reorder` | Bulk reorder stops | ✅ |
| `POST` | `/api/stops/:stopId/activities` | Add activity under a stop | ✅ |
| `PUT` | `/api/activities/:id` | Update activity details | ✅ |
| `DELETE`| `/api/activities/:id` | Delete activity | ✅ |
| `PUT` | `/api/stops/:stopId/activities/reorder` | Bulk reorder activities | ✅ |
| **Discovery** | | | |
| `GET` | `/api/cities/search?q=paris` | Geocoded city search with costIndex/popularity | ✅ |
| `GET` | `/api/activities/search?city=Paris` | Suggested activities by city & category | ✅ |
| `GET` | `/api/cities/:cityName/image` | Representative photo for city (Pexels) | ✅ |
| **Budget & Analytics** | | | |
| `GET` | `/api/trips/:tripId/budget` | Budget rollup by category and day-wise metrics | ✅ |
| `GET` | `/api/admin/stats` | Platform usage analytics (admin only) | ✅ |

---

## 🧪 Testing

The backend includes automated integration test suites for external discovery and trip workflows:

```bash
cd server

# Run Geoapify + Pexels discovery & fallback integration tests
npm run test:discovery

# Run sharing & trip-cloning E2E tests (requires PostgreSQL running)
npm run test:sharing
```

To verify the frontend production build:
```bash
cd frontend
npm run build
```

---

## 🔑 Demo Credentials

After running `npm run seed` in the backend:

- **Demo Traveler User:**
  - **Email:** `demo@globetrotter.app`
  - **Password:** `password123`
  - *Pre-populated with a 3-city European trip across Paris, Rome, and Barcelona with full activities and budgets.*

- **Admin User:**
  - **Email:** `admin@globetrotter.app`
  - **Password:** `password123`
  - *Access to `/admin` dashboard metrics.*
