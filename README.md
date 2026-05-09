# Team Task Manager

A premium MERN stack application for collaborative project and task management.

## Features
- **User Authentication**: Secure JWT-based signup and login.
- **Project Management**: Create projects, manage team members (Admin only).
- **Task Management**: Create, assign, and track tasks with priority and status.
- **Visual Dashboard**: Real-time statistics on task progress and workload.
- **Role-Based Access**: Specialized views for Admins and Members.
- **Premium UI**: Modern glassmorphism design with smooth animations.

## Tech Stack
- **Frontend**: React.js, Vite, Framer Motion, React Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JSON Web Token (JWT), BcryptJS.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Deployment
This application is designed to be deployed on **Railway**.
1. Connect your GitHub repository to Railway.
2. Add environment variables for the backend service.
3. Configure the frontend to point to the backend API URL.
