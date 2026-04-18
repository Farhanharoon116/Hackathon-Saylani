# HelpHub AI 🤝

A full-stack, AI-powered community support platform that connects students and mentors. Built for SMIT Grand Coding Night — April 2026.

---

## What It Does

HelpHub AI solves a real problem in learning communities — students struggle to find timely help, and skilled people have no structured place to offer it. HelpHub bridges that gap with:

- **Structured help requests** with AI-assisted categorization, urgency detection, and description rewrites
- **Smart helper matching** through a filterable community feed
- **Trust & reputation system** — trust scores, badges, and a leaderboard that recognizes real contributors
- **AI Center** powered by Gemini 1.5 Flash — surfaces trends, urgent requests, and platform insights
- **Real-time-like notifications** for matches, status changes, and reputation updates
- **Direct messaging** between helpers and requesters
- **Admin panel** for content moderation and platform analytics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (stored in localStorage) |
| AI | Google Gemini 1.5 Flash API |
| Dev tooling | Nodemon, concurrently |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with community stats and featured requests |
| `/auth` | Login and signup with role selection |
| `/onboarding` | Profile setup with Gemini AI suggestions |
| `/dashboard` | Personal stats, recent requests, AI insights |
| `/explore` | Filterable community feed of all help requests |
| `/create-request` | AI-assisted request creation (live Gemini suggestions) |
| `/request/:id` | Full request detail, AI summary, helper actions |
| `/messages` | Direct messaging between users |
| `/leaderboard` | Top helpers ranked by trust score and contributions |
| `/ai-center` | Platform intelligence — trends, urgency watch, mentor pool |
| `/notifications` | Live notification feed |
| `/profile` | Public profile + edit identity |
| `/admin` | Admin dashboard, request moderation, user management |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google AI Studio account for Gemini API key

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/helphub-ai.git
cd helphub-ai
```

### 2. Set up environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 4. Seed the database

```bash
cd server
node seed.js
```

This creates 4 demo users and sample requests.

### 5. Run the app

**Option A — from root (if concurrently is configured):**
```bash
npm run dev
```

**Option B — two separate terminals:**
```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

### 6. Open in browser

```
http://localhost:5173
```

---

## Demo Accounts

| Name | Email | Password | Role |
|---|---|---|---|
| Ayesha Khan | ayesha@helphub.ai | password123 | Both |
| Hassan Ali | hassan@helphub.ai | password123 | Can Help |
| Sara Noor | sara@helphub.ai | password123 | Both |
| Admin | admin@helphub.ai | password123 | Admin |

---

## AI Features (Gemini 2.5 Flash-lite)

- **Create Request** — as you type your description, Gemini suggests category, urgency, tags, and a rewritten description in real time (debounced)
- **Onboarding** — Gemini analyzes your skills and interests and suggests what you can help with and where you may need help
- **Request Detail** — every request stores an AI-generated summary for helpers scanning the feed
- **AI Center** — Gemini summarizes platform-wide trends, flags urgent requests, and surfaces helpers with strong signals

---

## Trust & Badge System

Trust score increases by **+10** every time a request you helped with is marked as solved.

| Badge | Condition |
|---|---|
| Fast Responder | 5+ contributions |
| Code Rescuer | 10+ contributions |
| Top Mentor | 20+ contributions |
| Community Voice | Trust score ≥ 80 |
| Design Ally | Trust score ≥ 100 |

---

## Project Structure

```
helphub-ai/
├── client/          # React + Vite frontend
│   └── src/
│       ├── api/         # Axios instance
│       ├── components/  # Navbar, PageHeader, UI components
│       ├── context/     # AuthContext (JWT + user state)
│       ├── pages/       # One file per route
│       └── routes/      # ProtectedRoute, AdminRoute
│
└── server/          # Node + Express backend
    ├── controllers/ # Business logic per resource
    ├── middleware/  # JWT auth, admin guard
    ├── models/      # Mongoose schemas
    ├── routes/      # Express routers
    └── utils/       # Gemini API helper
```

---

## Built At

**SMIT Grand Coding Night — April 2026**
Helplytics AI Challenge — Community Support Platform Track

---

## License

MIT
