# DSA Revision Tracker

A production-quality web application to help users remember solved DSA (Data Structures and Algorithms) problems using a fixed 1-4-7 day revision strategy.

## Tech Stack
**Frontend:** React, TypeScript, Vite, Tailwind CSS v3, Shadcn UI, React Router v6, React Hook Form, Zod, Zustand.
**Backend:** Node.js, Express, TypeScript, Mongoose.
**Database:** MongoDB.
**Authentication:** Google OAuth 2.0 (JWT + HTTP-Only Cookies).

## Core Features
- **Google OAuth:** Secure authentication system using `google-auth-library`.
- **Add Questions:** Track DSA problems with comprehensive metadata (Platform, Difficulty, Approach, Topics, Space/Time complexity).
- **Auto-Scheduling Revision Engine:** Automatically schedules revisions for Day 1, Day 4, and Day 7 after the initial solve.
- **Dashboard:** A dynamic interface displaying today's target revisions. Mark tasks as done to keep the schedule clean.
- **All Questions Library:** Searchable, filterable, and paginated global datatable mapping the entire user repository.
- **Statistics Dashboard:** KPI heatmaps tracking total volume, weak vs strong topics, and difficulty spread.
- **Calendar Visualization:** Heatmap calendar mapping revision density securely to allow proactive workload management.

## Project Structure
- `/frontend` - React SPA (Vite)
- `/backend` - Node/Express Server
- `/docs` - Project documentation and AI workflows (Changelog, Status, Next Tasks)

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)
- Google Cloud Console Account (for OAuth Credentials)

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=a_secure_random_string_here
```
Run the backend:
```bash
npm run dev
```
*(The backend will start on http://localhost:5000)*

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
Run the frontend:
```bash
npm run dev
```
*(The frontend will start on http://localhost:5173)*

## API Endpoints

### Authentication
- `POST /api/auth/google` - Login using Google OAuth token
- `POST /api/auth/logout` - Clear auth cookies
- `GET /api/auth/me` - Fetch active user profile

### Questions
- `POST /api/questions` - Create a new DSA entry (auto-spawns 3 Revisions)
- `GET /api/questions` - Paginated fetch `?page=1&limit=10&search=&difficulty=&topic=`

### Revisions
- `GET /api/revisions/today` - Fetch due / overdue items up to UTC midnight
- `PATCH /api/revisions/:id/complete` - Mark a specific revision sequence as complete

### Insights
- `GET /api/statistics` - Global KPI aggregations
- `GET /api/calendar` - Density heatmap mapped via `?startDate&endDate`
