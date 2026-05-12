# PulseBoard

PulseBoard is a production-style MERN SaaS app for realtime polls, feedback forms, and live quizzes.

## Stack

- React + Vite + TailwindCSS
- Zustand, React Hook Form, Zod, Axios, Socket.io client
- Node.js, Express, MongoDB, Mongoose
- JWT auth with HttpOnly cookies
- Socket.io realtime rooms

## Setup

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:5000`.

## Core Features

- Register, login, logout, current-user auth
- Create polls or quizzes with one shared schema
- Anonymous or authenticated public response links
- Required questions, single choice, and multiple choice
- Quiz scoring and leaderboard ranking
- Realtime response counts, analytics, and leaderboard updates
- Published result pages
- QR code sharing from the frontend

## Environment

Backend:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pulseboard
JWT_SECRET=change-me
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
