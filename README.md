# 🚀 Team Task Manager - Premium MERN Stack App

A high-end, collaborative project and task management platform built with the MERN stack. Designed with a premium glassmorphism UI and robust role-based access control.

## ✨ Features
- **🔐 Secure Authentication**: JWT-based signup and login with role-based access (Admin & Member).
- **📊 Interactive Dashboard**: Visual statistics for tasks (Total, In Progress, Completed, Overdue) and workload breakdown per user.
- **📁 Project Management**: Admins can create projects and manage the entire team (add/remove members).
- **✅ Task Tracking**: Create, assign, and prioritize tasks with a 3-stage status workflow (To Do, In Progress, Done).
- **📜 Activity History**: Real-time logging of all major actions (project/task creation, member updates, status changes).
- **🛡️ Issue Reporting**: Integrated system for users to report bugs or issues directly to the Admin.
- **💎 Premium UI**: Stunning dark-mode design using glassmorphism, responsive layouts, and smooth Framer Motion animations.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Framer Motion, Axios, React Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Auth**: JSON Web Token (JWT), BcryptJS.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas URI

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` root and add:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## ☁️ Deployment (Railway)

This application is optimized for deployment on **Railway**.

### 1. Backend Service
- Set **Root Directory** to `backend`.
- Add Variables: `MONGO_URI`, `JWT_SECRET`, and `PORT`.
- Copy the provided **Public URL** (e.g., `https://api-production.up.railway.app`).

### 2. Frontend Service
- Set **Root Directory** to `frontend`.
- Add Variable: `VITE_API_URL` = `https://your-api-url.up.railway.app/api`.
- Railway will automatically build and serve the app.

---

- **Developer**: Sujal Garg
