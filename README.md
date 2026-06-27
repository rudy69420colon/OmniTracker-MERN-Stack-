# Task Tracker (MERN Stack)

A production-ready Task Tracker web application built with the MERN stack (MongoDB, Express, React, Node.js). Features JWT authentication, full CRUD capabilities, and a responsive glassmorphism UI.

## 🚀 Features

- **User Authentication:** Secure signup and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Task Management:** Create, read, update, and delete tasks.
- **Filtering & Sorting:** Filter tasks by status (To Do, In Progress, Done) or priority (Low, Medium, High). Sort by due date.
- **Responsive Design:** Premium UI built with pure CSS, featuring glassmorphism and smooth animations.
- **Security:** Protected API routes, environment variable management, and centralized error handling.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router v6
- Axios (with interceptors for auth)
- Lucide React (Icons)
- React Hot Toast (Notifications)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs (Password hashing)

## 💻 Running Locally

### 1. Prerequisites
- Node.js installed
- MongoDB installed locally OR a MongoDB Atlas cloud account

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## 📂 Architecture Highlights
- **Separation of Concerns:** Controllers, models, and routes are cleanly separated on the backend.
- **Custom Hooks:** Frontend API calls and state management are encapsulated in `useTasks` and `useAuth` hooks.
- **Axios Interceptors:** Automatically attaches JWT tokens to outgoing requests and handles 401 Unauthorized responses to auto-logout users.
