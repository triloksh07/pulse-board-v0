# PulseBoard

Realtime poll & quiz platform with live analytics, public sharing, QR access, and websocket-powered updates.

## Live Demo

Frontend:
https://pulse-board-client.vercel.app

Backend API:
https://pulse-board-api.onrender.com

## Core Features

- Realtime polls & quizzes
- Public share links
- QR code sharing
- Live analytics dashboard
- WebSocket powered updates
- Authentication with HTTP-only cookies
- Public/private poll flows
- Poll publishing system
- Anonymous responses
- Quiz support with scoring
- Responsive dashboard UI

## Stack

- React + Vite + TailwindCSS
- Zustand, React Hook Form, React Router, Zod, Axios, Socket.io client
- Node.js, Express, MongoDB
- JWT auth with HttpOnly cookies
- Socket.io

### Deployment

- Vercel (frontend)
- Render (backend)
- MongoDB Atlas

## Socket Events

### Client Events

| Event       | Payload      |
| ----------- | ------------ |
| `poll:join` | `{ pollId }` |

### Server Events

| Event          | Payload                    |
| -------------- | -------------------------- |
| `poll:updated` | realtime analytics payload |

## Architecture

PulseBoard follows a separated frontend/backend architecture:

- Frontend handles realtime UI, routing, and dashboard experience
- Backend exposes REST APIs and Socket.IO realtime events
- MongoDB stores polls, responses, and analytics
- Public share codes provide anonymous participation access

## Future Improvements

- Leaderboards
- Poll scheduling
- Team collaboration
- Advanced analytics
- Redis caching
- Rate limiting improvements
- Better optimistic UI updates
- Realtime participant counters

## Setup

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:5000`.

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
