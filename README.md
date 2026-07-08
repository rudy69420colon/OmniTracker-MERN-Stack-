# OmniTracker

![OmniTracker](https://img.shields.io/badge/OmniTracker-MERN-6c63ff.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

OmniTracker is a comprehensive full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). It features a modern, responsive interface with a DnD (drag-and-drop) Kanban board, JWT-based authentication, and a robust backend.

## 🚀 Architecture

```ascii
                      +------------------+
                      |   Client (Web)   |
                      +--------+---------+
                               |
                               v
                     +--------------------+
                     |  Vercel (CDN)      |
                     |  React SPA         |
                     +--------+-----------+
                              | REST API / JSON
                              v
                   +------------------------+
                   | Render (App Service)   |
                   | Node.js / Express 5.0  |
                   | + Helmet / Rate Limit  |
                   | + Express Validator    |
                   +----------+-------------+
                              | Mongoose ORM
                              v
                  +--------------------------+
                  | MongoDB Atlas            |
                  | + TTL Indexes (Guests)   |
                  +--------------------------+
```

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **React Router** for declarative SPA routing
- **@dnd-kit** for accessible, performant drag-and-drop
- **Axios** for API requests (with interceptors)
- Custom CSS with Glassmorphism and CSS variables for theming

### Backend
- **Node.js** + **Express 5.0**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Tokens) for stateless authentication
- **express-validator** for input sanitization and validation
- **Helmet** & **express-rate-limit** for security

## ✨ Features

- **Guest User Mode:** One-click "Continue as Guest" creates a temporary account. MongoDB TTL indexes automatically sweep guest data after 24 hours to keep the database clean.
- **Kanban Board:** Polished drag-and-drop interface (`@dnd-kit`) with visual drag overlays and smooth transitions.
- **Optimistic UI:** Instant visual feedback on creating, updating, and deleting tasks, with automatic rollback and toast notifications on failure.
- **Dark/Light Mode:** First-class theme support built with vanilla CSS variables.
- **Robust Security:** HTTP header hardening, auth route rate limiting, and centralized validation.
- **Interactive API Docs:** Swagger/OpenAPI documentation available at `/api-docs`.

## 📦 Why MongoDB?

MongoDB is exceptionally well-suited for this project:
1. **Document Model:** Task data maps naturally to JSON-like documents without the need for complex joins.
2. **Atlas Free Tier:** Perfect for zero-cost, fully managed cloud deployments.
3. **TTL Indexes:** The guest feature relies on MongoDB's Time-To-Live indexes to automatically delete expired guest users and their tasks, requiring zero cron jobs or background sweeping logic in Node.js.

## 🚀 Deployment

The CI/CD pipeline runs on GitHub Actions:
- **Lint Gate:** Verifies frontend code quality via `oxlint`.
- **Test Gate:** Runs the Jest backend test suite.
- **Auto-Deploy:** If checks pass, Vercel (Frontend) and Render (Backend) automatically deploy from the `main` branch.

**Limitations to note:**
- Render's free tier spins down after inactivity, causing a ~30-50 second cold start on the first request.
- MongoDB Atlas M0 cluster has storage and connection limits (ideal for portfolios, not enterprise scale).

## 🐳 Running Locally with Docker

You can run the backend via Docker (multi-stage, non-root user for security):

```bash
cd backend
docker build -t omnitracker-api .
docker run -p 5000:5000 --env-file .env omnitracker-api
```

## 🔧 Local Development Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/omnitracker.git
   cd omnitracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your MongoDB URI and JWT secret to .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Ensure backend is running on port 5000, or update VITE_API_URL
   npm run dev
   ```

4. **Testing**
   ```bash
   cd backend
   npm test
   ```

## 📖 API Reference

View the interactive Swagger documentation by running the backend and navigating to `http://localhost:5000/api-docs`.

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Register a new user | No |
| `/api/auth/login` | POST | Authenticate & get token | No |
| `/api/auth/guest` | POST | Create temporary guest user | No |
| `/api/auth/me` | GET | Get current user profile | Yes |
| `/api/tasks` | GET | Get all tasks | Yes |
| `/api/tasks` | POST | Create a new task | Yes |
| `/api/tasks/:id` | PUT | Update a task | Yes |
| `/api/tasks/:id` | DELETE | Delete a task | Yes |

## 🏗️ What I'd Change at Scale

If this application needed to support thousands of concurrent users:
1. **Caching:** Introduce Redis to cache frequent queries (e.g., getting tasks) and store rate-limit counts, removing load from MongoDB.
2. **Real-time:** Replace polling or manual refresh with WebSockets (Socket.io) to sync kanban board state across multiple devices in real-time.
3. **Queueing:** Move heavy tasks (like sending welcome emails) to a background queue (BullMQ + Redis).
4. **Horizontal Scaling:** Deploy the Node.js API behind a load balancer to multiple instances.

---
Built with ❤️ using the MERN stack.
