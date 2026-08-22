<div align="center">

# 🌍 GlobeTrotter
### *Intelligent, Multi-City Travel Planning & Collaborative Itinerary Platform*

[![Live Frontend](https://img.shields.io/badge/Vercel-Live%20Frontend-black?style=for-the-badge&logo=vercel)](https://globaltrotter-pixelpwnz.vercel.app)
[![Live Backend](https://img.shields.io/badge/Render-API%20Backend-46E3B7?style=for-the-badge&logo=render)](https://globtrotter-pixelpwnz.onrender.com/api/health)
[![Postman Docs](https://img.shields.io/badge/Postman-API%20Documentation-FF6C37?style=for-the-badge&logo=postman)](https://documenter.getpostman.com/view/50839472/2sBYArVt6R)

---

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=flat-square)](https://github.com/pmndrs/zustand)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 📑 Table of Contents

- [🚀 Live Links & Documentation](#-live-links--documentation)
- [🎯 Project Overview & Vision](#-project-overview--vision)
- [✨ Core Features](#-core-features)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [🏛️ System Architecture Diagram](#️-system-architecture-diagram)
- [🗄️ Database ER Diagram](#️-database-er-diagram)
- [📁 Folder Structure](#-folder-structure)
- [⚡ API Reference](#-api-reference)
- [🔒 Security & Hardening](#-security--hardening)
- [💻 Local Development & Setup](#-local-development--setup)
- [🧪 Automated Test Suite](#-automated-test-suite)
- [👤 Demo Accounts](#-demo-accounts)

---

## 🚀 Live Links & Documentation

| Service | Link | Description |
| :--- | :--- | :--- |
| **🌐 Production Web App** | [https://globaltrotter-pixelpwnz.vercel.app](https://globaltrotter-pixelpwnz.vercel.app) | Production Single-Page React App on Vercel |
| **🚂 REST API Backend** | [https://globtrotter-pixelpwnz.onrender.com/api](https://globtrotter-pixelpwnz.onrender.com/api) | Production Express API service on Render |
| **📄 Postman API Docs** | [https://documenter.getpostman.com/view/50839472/2sBYArVt6R](https://documenter.getpostman.com/view/50839472/2sBYArVt6R) | Published interactive Postman documentation |

---

## 🎯 Project Overview & Vision

GlobeTrotter solves the fragmentation of modern travel planning by integrating **discovery, itinerary building, budget rollup, drag-and-drop timeline reordering, multi-language localization, and social sharing** into one unified, ultra-responsive application.

### Why GlobeTrotter?
- **All-in-One Workspace**: Eliminates the need to jump across separate note apps, spreadsheets, map tools, and expense trackers.
- **Deep Indian & Global Context**: Curated coverage of 25+ iconic Indian destinations (Jaipur, Varanasi, Goa, Munnar, Leh, Agra, etc.) and global hubs with realistic cost indexes, best seasons, and local flavors.
- **Dynamic Visuals**: Real-time spending analytics via Recharts and intuitive `@dnd-kit` drag-and-drop schedule organization.

---

## ✨ Core Features

### 🗺️ 1. Multi-City Itinerary Planning
- Create custom trips with start/end dates, cover photos via Cloudinary, and privacy controls (*Public/Private*).
- Add multiple city stops with auto-sequencing, geographic coordinates, and duration calculations.
- Schedule detailed activities across 4 core categories: **Transport**, **Stay**, **Activity**, and **Meal**.
- Read-only day-wise itinerary view with timing badges, category tags, and cost rollups.

### ⏳ 2. Interactive Drag-and-Drop Timeline
- Reorder activities and adjust daily schedules dynamically using `@dnd-kit` sortable lists.
- Optimistic UI updates provide zero-latency feedback with background backend synchronization (`PUT /api/stops/:stopId/activities/reorder`).

### 📍 3. Destination & Activity Explorer
- **Explore Cities (`/cities`)**: Filter 25+ Indian destinations by region (*North, South, West, East, Central*), daily budget slider, cost index, and vibe tags.
- **City Comparison Matrix**: Side-by-side comparison of multiple cities across cost index, daily budget, best travel season, and signature cuisine.
- **Activity Discovery (`/activities`)**: Browse curated tours, heritage walks, and street food tastings with verified Pexels CDN photography.

### 📊 4. Real-Time Budget Analytics
- Categorized expense rollup (*Transport, Accommodation, Activities, Meals*) displayed via Recharts Pie & Bar charts.
- Daily threshold tracking with automated over-budget alerts and average daily spending metrics.

### 🔗 5. Social Sharing & 1-Click Trip Cloning
- **Public Itinerary Links (`/share/:shareId`)**: Shareable, read-only itinerary view accessible without authentication.
- **One-Click Clone**: Duplicate any public trip into your personal dashboard with all stops and activities automatically shifted to start today.

### 🌐 6. Multi-Language Internationalization (i18n)
- Comprehensive translation across **6 languages**:
  - 🇬🇧 English (`en`)
  - 🇮🇳 Hindi (`hi` — हिन्दी)
  - 🇯🇵 Japanese (`ja` — 日本語)
  - 🇪🇸 Spanish (`es` — Español)
  - 🇫🇷 French (`fr` — Français)
  - 🇩🇪 German (`de` — Deutsch)
- Language preferences persist per user profile and seamlessly localize Navbar, Dashboard, Itineraries, and City Explorer.

### 🛡️ 7. Account Security & Administration
- JWT authentication with secure password hashing (`bcrypt`).
- **Password-Protected Account Deletion**: Modal requires password re-entry before account removal to prevent accidental deletion.
- **Admin Dashboard (`/admin`)**: Real-time metrics on total users, active travelers, trip distributions, and top destinations.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS, CSS Custom Properties, and responsive micro-animations
- **State Management**: Zustand stores (`authStore.js`, `tripStore.js`, `languageStore.js`)
- **Routing**: React Router v6 with `RequireAuth` guard and Vercel SPA rewrites
- **Forms & Validation**: React Hook Form with Zod schemas
- **Drag & Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Visuals & Charts**: Recharts, Lucide React icons

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Security & Headers**: `helmet`, `express-rate-limit`, `cors`
- **Authentication**: JWT (`jsonwebtoken`) + `bcrypt`
- **File Uploads**: Cloudinary SDK + Multer
- **Discovery Services**: Geoapify (Geocoding & Places), Pexels (Photography CDN)

---

## 🏛️ System Architecture Diagram

```mermaid
graph TD
    subgraph Client ["Frontend (Vercel)"]
        A[React 18 + Vite SPA] --> B[Zustand State Stores]
        B --> C[React Router v6]
        C --> D[dnd-kit Timeline]
        C --> E[Recharts Analytics]
        C --> F[i18n Multi-Language]
    end

    subgraph Gateway ["Security & Middleware Layer"]
        G[Helmet Security Headers] --> H[CORS Allowed Origins]
        H --> I[Global & Auth Rate Limiters]
        I --> J[JWT Authentication Guard]
    end

    subgraph Server ["Backend API (Render)"]
        K[Express 5 REST Router]
        K --> L[Trip & Itinerary Service]
        K --> M[Budget Aggregator]
        K --> N[Discovery & Image Service]
        K --> O[User & Profile Service]
    end

    subgraph Database ["Data & Storage"]
        P[(PostgreSQL Database)]
        Q[Cloudinary Media CDN]
    end

    subgraph ExternalAPIs ["External Integrations"]
        R[Geoapify Geocoding & Places]
        S[Pexels Photography API]
    end

    A -->|HTTPS Requests| G
    J --> K
    L -->|Prisma Client| P
    M -->|Prisma Client| P
    O -->|Prisma Client| P
    N --> R
    N --> S
    K --> Q
```

---

## 🗄️ Database ER Diagram

```mermaid
erDiagram
    USER ||--o{ TRIP : "owns / creates"
    USER ||--o{ SAVED_DESTINATION : "bookmarks"
    TRIP ||--o{ STOP : "contains"
    STOP ||--o{ ACTIVITY : "schedules"

    USER {
        string id PK
        string email UK
        string password
        string name
        string photoUrl
        string language
        boolean isAdmin
        datetime createdAt
    }

    SAVED_DESTINATION {
        string id PK
        string userId FK
        string cityName
        datetime createdAt
    }

    TRIP {
        string id PK
        string userId FK
        string name
        datetime startDate
        datetime endDate
        string description
        string coverPhoto
        string shareId UK
        boolean isPublic
        float budgetLimit
        datetime createdAt
        datetime updatedAt
    }

    STOP {
        string id PK
        string tripId FK
        string cityName
        string country
        datetime startDate
        datetime endDate
        float latitude
        float longitude
        float costIndex
        int popularity
        int order
        datetime createdAt
    }

    ACTIVITY {
        string id PK
        string stopId FK
        string name
        string type
        string category
        float cost
        int duration
        string description
        string imageUrl
        datetime scheduledAt
        int order
        datetime createdAt
    }
```

---

## 📁 Folder Structure

```
GlobTrotter/
├── render.yaml                          # Render Web Service Blueprint
├── vercel.json                          # Vercel SPA Routing Configuration
│
├── frontend/                            # React + Vite Client
│   ├── src/
│   │   ├── components/                  # UI & Feature Components
│   │   │   ├── trip/                    # ActivityCard, BudgetChart, StopForm, Modals
│   │   │   ├── ui/                      # Buttons, Inputs, Cards, Dialogs
│   │   │   ├── Logo.jsx                 # Dynamic Branding
│   │   │   ├── Navbar.jsx               # Navigation Bar with i18n & Admin Links
│   │   │   └── RequireAuth.jsx          # Protected Route Guard
│   │   ├── lib/                         # API Client, Utilities, i18n Dictionary
│   │   ├── pages/                       # Route Pages (Dashboard, Builder, Budget, etc.)
│   │   ├── store/                       # Zustand Stores (authStore, tripStore, languageStore)
│   │   ├── App.jsx                      # React Router Hierarchy
│   │   └── main.jsx                     # Entry Point
│   └── package.json
│
└── server/                              # Express + Prisma REST API
    ├── prisma/
    │   ├── schema.prisma                # Database Schema Definitions
    │   └── seed.js                      # Massive Seed Script (5 Users, 10 Trips)
    ├── scripts/                         # Automated Integration & E2E Test Suites
    ├── src/
    │   ├── controllers/                 # Express Route Handlers
    │   ├── data/                        # Curated Indian Cities Dataset (25+ destinations)
    │   ├── lib/                         # JWT, Prisma Client, Cloudinary Helpers
    │   ├── middleware/                  # Auth Guards, Admin Guard, Error Handler
    │   ├── routes/                      # API Route Definitions
    │   ├── services/                    # Business Logic Layer
    │   ├── validators/                  # Zod Input Schemas
    │   ├── app.js                       # Express App, Security Headers & Rate Limits
    │   └── server.js                    # HTTP Server Listener
    └── package.json
```

---

## ⚡ API Reference

### 🔐 Auth Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/signup` | Create a new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | ❌ |
| `POST` | `/api/auth/forgot-password` | Request password reset | ❌ |
| `GET` | `/api/auth/me` | Rehydrate user profile from JWT | ✅ |

### 👤 Profile Endpoints (`/api/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `PUT` | `/api/users/me` | Update user name, avatar, or language | ✅ |
| `DELETE` | `/api/users/me` | Delete account with password verification | ✅ |
| `GET` | `/api/users/me/saved-destinations` | List bookmarked destinations | ✅ |
| `POST` | `/api/users/me/saved-destinations` | Save city to wishlist | ✅ |
| `DELETE` | `/api/users/me/saved-destinations/:id`| Remove city from wishlist | ✅ |

### 🧳 Trip Management (`/api/trips`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/trips` | List all trips for current user | ✅ |
| `POST` | `/api/trips` | Create a new multi-city trip | ✅ |
| `GET` | `/api/trips/:id` | Get full nested trip with stops & activities | ✅ |
| `PUT` | `/api/trips/:id` | Update trip details & public visibility | ✅ |
| `DELETE` | `/api/trips/:id` | Delete trip and cascade delete stops | ✅ |
| `GET` | `/api/trips/public/:shareId` | Get public shared itinerary | ❌ |
| `POST` | `/api/trips/:id/copy` | Clone trip & shift dates to today | ✅ |

### 📍 Stops & Activities
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/trips/:tripId/stops` | Add city stop to trip | ✅ |
| `PUT` | `/api/stops/:id` | Update stop dates & coordinates | ✅ |
| `DELETE` | `/api/stops/:id` | Remove stop & cascade activities | ✅ |
| `PUT` | `/api/trips/:tripId/stops/reorder` | Bulk reorder stops sequence | ✅ |
| `POST` | `/api/stops/:stopId/activities` | Add activity (Transport, Stay, Activity, Meal) | ✅ |
| `PUT` | `/api/activities/:id` | Update activity timing & cost | ✅ |
| `DELETE` | `/api/activities/:id` | Remove activity | ✅ |
| `PUT` | `/api/stops/:stopId/activities/reorder`| Bulk reorder activities sequence | ✅ |

### 📊 Analytics, Discovery & Admin
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/trips/:tripId/budget` | Get budget category breakdown & daily threshold | ✅ |
| `GET` | `/api/cities/search?q=...` | Search destinations with cost index & season | ✅ |
| `GET` | `/api/activities/search?city=...` | Search curated activities & tours | ✅ |
| `GET` | `/api/cities/:cityName/image` | Get high-resolution city cover photo | ✅ |
| `POST` | `/api/uploads` | Upload media to Cloudinary CDN | ✅ |
| `GET` | `/api/admin/stats` | Platform analytics & user metrics | ✅ *(Admin)* |

---

## 🔒 Security & Hardening

- **JWT Secret Enforcement**: Server fails fast if `JWT_SECRET` is undefined.
- **Bcrypt Password Hashing**: Passwords stored with 10 salt rounds.
- **HTTP Security Headers**: `helmet` configured with strict CSP, X-Frame-Options, and HSTS.
- **Dual-Layer Rate Limiting**:
  - Global limiter: **200 requests / 15 min** per IP.
  - Strict Auth limiter: **20 requests / 15 min** on sensitive endpoints (`/signup`, `/login`, `/forgot-password`).
- **File Upload Safety**: Strict MIME-type filter (`image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`) and 5 MB size limit.
- **Account Security**: Password confirmation required prior to account deletion.

---

## 💻 Local Development & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **pnpm**: v9.0.0 or higher
- **PostgreSQL**: Local instance or hosted connection string

### 1. Clone & Install
```bash
git clone https://github.com/rishab11250/GlobTrotter.git
cd GlobTrotter
```

### 2. Backend Setup
```bash
cd server
pnpm install
cp .env.example .env
```
Update `server/.env`:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/globetrotter"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
NODE_ENV="development"
CORS_ORIGINS="http://localhost:5173,http://localhost:5174"
GEOAPIFY_API_KEY="your-geoapify-key"
PEXELS_API_KEY="your-pexels-key"
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```
Run Prisma migrations and seed demo data:
```bash
pnpm prisma db push
pnpm seed
pnpm dev
```

### 3. Frontend Setup
```bash
cd ../frontend
pnpm install
cp .env.example .env
```
Update `frontend/.env`:
```env
VITE_API_URL="http://localhost:5000/api"
```
Start Vite development server:
```bash
pnpm dev
```
Navigate to **`http://localhost:5173`** in your browser.

---

## 🧪 Automated Test Suite

Run the automated backend test suites:
```bash
cd server

# Test city & activity discovery, Pexels CDN, and mock fallbacks
pnpm test:discovery

# Test public sharing and copy-trip cloning end-to-end
pnpm test:sharing
```

---

## 👤 Demo Accounts

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@globetrotter.app` | `password123` | Full access + Admin Dashboard (`/admin`) |
| **Standard User** | `demo@globetrotter.app` | `password123` | Full travel planner access |
| **Personal Demo** | `rishab11250@gmail.com` | `rishab25nov` | Full travel planner access |

---

<div align="center">
Built with ❤️ for the Odoo Global Hackathon.
</div>
