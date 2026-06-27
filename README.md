# OmniTracker — MERN Stack Task Manager

[![Backend CI](https://github.com/rudy69420colon/OmniTracker-MERN-Stack-/actions/workflows/test.yml/badge.svg)](https://github.com/rudy69420colon/OmniTracker-MERN-Stack-/actions/workflows/test.yml)
![License](https://img.shields.io/github/license/rudy69420colon/OmniTracker-MERN-Stack-)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)

A **production-ready**, full-stack task management application built with the MERN stack. Features JWT authentication, full CRUD, filtering, sorting, security hardening, and a 15-test CI-verified backend.

**🌐 Live Demo:** [omni-tracker-mern-stack.vercel.app](https://omni-tracker-mern-stack-ot5aj74ar-rudy2.vercel.app)
**⚙️ Backend API:** [omnitracker-mern-stack.onrender.com](https://omnitracker-mern-stack.onrender.com/api/health)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/login with bcrypt password hashing
- ✅ **Full Task CRUD** — Create, read, update, and delete tasks
- 🔍 **Filter & Sort** — Filter by status/priority, sort by due date or creation time
- 🔎 **Search** — Real-time search across task titles
- 🛡️ **Security** — Helmet.js headers, rate limiting, protected routes, centralized error handling
- 📱 **Responsive UI** — Glassmorphism design with smooth animations
- 🧪 **Tested** — 15 Jest + Supertest backend tests with GitHub Actions CI

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | JWT, bcryptjs |
| **Security** | Helmet.js, express-rate-limit |
| **Testing** | Jest, Supertest |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 📂 Project Structure

```
OmniTracker/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers (auth, tasks)
│   ├── middleware/     # JWT protect, error handler
│   ├── models/         # Mongoose schemas (User, Task)
│   ├── routes/         # Express routers
│   ├── tests/          # Jest + Supertest tests
│   ├── utils/          # JWT generator
│   └── server.js       # App entry point
└── frontend/
    └── src/
        ├── api/        # Axios instance with interceptors
        ├── components/ # Auth, Tasks, Common components
        ├── context/    # Auth & Theme context
        ├── hooks/      # useAuth, useTasks
        └── pages/      # Login, Register, Dashboard
```

---

## 🔌 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | Private | Get current user profile |
| GET | `/api/tasks` | Private | Get all tasks (filter/sort/search) |
| POST | `/api/tasks` | Private | Create a new task |
| GET | `/api/tasks/:id` | Private | Get a single task |
| PUT | `/api/tasks/:id` | Private | Update a task |
| DELETE | `/api/tasks/:id` | Private | Delete a task |
| GET | `/api/health` | Public | Server health check |

---

## 💻 Running Locally

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/rudy69420colon/OmniTracker-MERN-Stack-.git
cd OmniTracker-MERN-Stack-
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

App runs at `http://localhost:5173`

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

15 tests across 2 suites — auth routes and task routes — all using Jest + Supertest with mocked Mongoose models.

---

## 🏗️ Architecture Highlights

- **MVC Pattern** — Controllers, models, and routes cleanly separated on the backend
- **Custom React Hooks** — `useTasks` and `useAuth` encapsulate all API calls and state
- **Axios Interceptors** — Auto-attaches JWT to every request; handles 401 to auto-logout
- **Rate Limiting** — Auth routes limited to 20 requests/15 min per IP
- **Security Headers** — Helmet.js sets 11 HTTP security headers automatically

---

## 📄 License

MIT — see [LICENSE](./LICENSE)
