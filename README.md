# HelpHub AI — Full-Stack Community Support Platform

A multi-page AI-powered community support platform for students and mentors, built with React, Node.js, Express, MongoDB, and Google Gemini AI.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui components
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (Bearer token in Authorization header)
- **AI:** Google Gemini API (gemini-2.0-flash-lite)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Server Setup
```bash
cd server
cp .env.example .env   # Edit with your MongoDB URI, JWT secret, and Gemini API key
npm install
node index.js
```

### Client Setup
```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

### Environment Variables

**server/.env**
```
PORT=5000
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Features

- **User Authentication** — Register, login, JWT-based auth
- **Role-Based Access** — Need Help, Can Help, Both roles + Admin
- **Help Requests** — Create, browse, filter, and offer help
- **AI-Powered** — Auto-categorize requests, suggest tags, rewrite descriptions
- **Messaging** — Direct messaging between users
- **Leaderboard** — Trust score and contribution tracking
- **Notifications** — Real-time updates for matches, status changes
- **Admin Panel** — Manage users and requests
- **Onboarding** — AI-guided skill and interest setup

## API Endpoints

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/auth` | POST /register, POST /login, GET /me | Authentication |
| `/api/requests` | GET /, GET /:id, POST /, PATCH /:id/solve, POST /:id/help | Help requests |
| `/api/messages` | GET /, POST / | Messaging |
| `/api/users` | GET /leaderboard, GET /:id, PUT /profile | User profiles |
| `/api/notifications` | GET /, PATCH /:id/read, PATCH /read-all | Notifications |
| `/api/ai` | POST /suggest, POST /onboarding, GET /insights | AI features |
| `/api/admin` | GET /stats, GET /requests, DELETE /requests/:id, GET /users, PATCH /users/:id/ban | Admin |

## Project Structure

```
helphub-ai/
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── api/                   # Axios instance
│   │   ├── components/            # UI + layout components
│   │   ├── context/               # AuthContext
│   │   ├── pages/                 # All page components
│   │   ├── routes/                # Protected route wrappers
│   │   ├── hooks/                 # Custom hooks
│   │   └── lib/                   # Utilities
│   └── ...
├── server/                        # Express backend
│   ├── config/                    # DB connection
│   ├── controllers/               # Route handlers
│   ├── middleware/                 # Auth + admin middleware
│   ├── models/                    # Mongoose schemas
│   ├── routes/                    # Express routes
│   └── utils/                     # Gemini AI helper
└── README.md
```