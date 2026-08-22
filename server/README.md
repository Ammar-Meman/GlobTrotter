# GlobeTrotter Backend API

Backend service for GlobeTrotter travel planning app built with Node.js, Express, Prisma, and PostgreSQL.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT, bcrypt
- **Validation**: Zod
- **Media Uploads**: Cloudinary

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```
Configure:
- `PORT` (default: 5000)
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### 3. Database & Prisma
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database / run migrations
npm run prisma:migrate
# or
npm run prisma:push

# Seed database
npm run seed
```

### 4. Run Server
```bash
# Development mode (nodemon)
npm run dev

# Production mode
npm run start
```
Server runs on `http://localhost:5000`. Health check at `GET /api/health`.
