# PulseBoard — Internal Product & Engineering Specification

> Version: v1 Hackathon Build
> Stack: MERN + Socket.io
> Product Type: Real-time Polling, Feedback & Quiz Platform

---

# 1. Product Vision

## Goal

Build a production-style platform where users can:

- create polls/quizzes
- share public links
- collect anonymous or authenticated responses
- view live analytics
- publish final results
- run live quizzes with leaderboard support

---

# 2. Product Positioning

## Core Identity

PulseBoard is:

- a realtime polling platform
- a feedback collection tool
- a lightweight live quiz engine

---

# 3. Product Modes

## 3.1 Feedback Poll

Used for:

- surveys
- classroom feedback
- event feedback
- community opinions

Features:

- anonymous/authenticated responses
- optional questions
- analytics
- public results

---

## 3.2 Quiz Mode

Used for:

- classroom quizzes
- contests
- hackathon rounds
- live trivia

Features:

- correctness
- scoring
- leaderboard
- realtime rankings
- tie-breaking by time

---

# 4. Core Product Entities

# 4.1 User

Represents authenticated platform users.

## Roles

```txt
HOST
PARTICIPANT
```

(Initially both can be same role.)

---

# 4.2 Poll

Main container.

Can behave as:

- poll
- quiz

using:

```js
type: "poll" | "quiz";
```

---

# 4.3 Question

Embedded inside poll.

Supports:

- single choice
- multiple choice

---

# 4.4 Response

Stores submitted answers.

---

# 4.5 Leaderboard Entry

Derived from responses.

Can be dynamically calculated or stored.

---

# 5. Core Features

# 5.1 Authentication

## Functionalities

- register
- login
- logout
- get current user

## Auth Strategy

### JWT + HttpOnly Cookies

Why:

- safer than localStorage
- production-style

---

# 5.2 Poll Creation

Host can:

- create poll/quiz
- add questions
- configure settings
- publish/share

---

# 5.3 Question Builder

## Supported Types

### Single Choice

```txt
Select one option
```

### Multiple Choice

```txt
Select multiple options
```

---

## Question Properties

| Property       | Description           |
| -------------- | --------------------- |
| questionText   | Main question         |
| options        | Array of options      |
| required       | Mandatory or optional |
| allowMultiple  | Single vs multiple    |
| points         | Quiz points           |
| correctAnswers | Correct option IDs    |

---

# 5.4 Poll Settings

| Setting          | Description             |
| ---------------- | ----------------------- |
| responseMode     | anonymous/authenticated |
| expiresAt        | Expiry datetime         |
| showLeaderboard  | Enable leaderboard      |
| publishResults   | Public results          |
| realtimeEnabled  | Live analytics          |
| shuffleQuestions | Optional future         |
| timerEnabled     | Future enhancement      |

---

# 5.5 Response Collection

Participant can:

- open public link
- answer questions
- submit responses

System validates:

- required questions
- expiry
- auth restrictions

---

# 5.6 Analytics Dashboard

Host can view:

- total responses
- participation trends
- question analytics
- option distributions
- quiz scores
- leaderboard

---

# 5.7 Realtime Features

Using Socket.io:

- live response count
- analytics updates
- leaderboard updates
- poll status changes

---

# 5.8 Result Publishing

Host can:

- finalize results
- publish analytics publicly

After publishing:

- same link becomes results page

---

# 6. User Flows

# 6.1 Host Flow

```txt
Register/Login
    ↓
Create Poll
    ↓
Add Questions
    ↓
Configure Settings
    ↓
Publish Poll
    ↓
Share Link
    ↓
Receive Responses
    ↓
View Live Analytics
    ↓
Publish Results
```

---

# 6.2 Participant Flow

```txt
Open Shared Link
    ↓
Authenticate (if required)
    ↓
Answer Questions
    ↓
Submit Responses
    ↓
View Thank You / Results
```

---

# 7. System Architecture

# 7.1 Frontend Architecture

# Stack

| Tech             | Purpose          |
| ---------------- | ---------------- |
| React + Vite     | Frontend         |
| TailwindCSS      | Styling          |
| Shadcn/ui        | UI components    |
| React Router     | Routing          |
| Zustand          | State management |
| Axios            | API client       |
| React Hook Form  | Form handling    |
| Zod              | Validation       |
| Socket.io Client | Realtime         |

---

# 7.2 Frontend Folder Structure

```txt
src/
│
├── app/
│   ├── router.jsx
│   ├── providers.jsx
│
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── poll/
│   ├── analytics/
│   ├── results/
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── charts/
│   ├── layout/
│
├── features/
│   ├── auth/
│   ├── polls/
│   ├── responses/
│   ├── analytics/
│   ├── leaderboard/
│
├── hooks/
│
├── services/
│   ├── api.js
│   ├── socket.js
│
├── store/
│
├── utils/
│
└── styles/
```

---

# 8. Frontend Routes

# Public Routes

| Route               | Purpose           |
| ------------------- | ----------------- |
| /                   | Landing           |
| /login              | Login             |
| /register           | Signup            |
| /poll/:shareCode    | Public poll       |
| /quiz/:shareCode    | Public quiz       |
| /results/:shareCode | Published results |

---

# Protected Routes

| Route              | Purpose        |
| ------------------ | -------------- |
| /dashboard         | Host dashboard |
| /poll/create       | Create poll    |
| /poll/:id/edit     | Edit poll      |
| /analytics/:pollId | Analytics      |
| /settings          | User settings  |

---

# 9. Backend Architecture

# Stack

| Tech      | Purpose          |
| --------- | ---------------- |
| Node.js   | Runtime          |
| Express   | Backend          |
| MongoDB   | Database         |
| Mongoose  | ODM              |
| Socket.io | Realtime         |
| JWT       | Auth             |
| bcrypt    | Password hashing |
| Zod/Joi   | Validation       |

---

# 10. Backend Folder Structure

```txt
server/
│
├── src/
│
├── config/
│   ├── db.js
│   ├── env.js
│
├── modules/
│
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.routes.js
│   │   ├── auth.validation.js
│
│   ├── polls/
│   ├── responses/
│   ├── analytics/
│   ├── leaderboard/
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│
├── sockets/
│   ├── poll.socket.js
│
├── utils/
│
├── app.js
├── server.js
```

---

# 11. API Specification

# 11.1 Auth APIs

## Register

```http
POST /api/auth/register
```

---

## Login

```http
POST /api/auth/login
```

---

## Current User

```http
GET /api/auth/me
```

---

# 11.2 Poll APIs

## Create Poll

```http
POST /api/polls
```

---

## Get Poll

```http
GET /api/polls/:id
```

---

## Update Poll

```http
PATCH /api/polls/:id
```

---

## Delete Poll

```http
DELETE /api/polls/:id
```

---

## Publish Poll

```http
PATCH /api/polls/:id/publish
```

---

# 11.3 Response APIs

## Submit Response

```http
POST /api/responses/:pollId
```

---

## Get Responses

```http
GET /api/responses/:pollId
```

---

# 11.4 Analytics APIs

## Poll Analytics

```http
GET /api/analytics/:pollId
```

---

## Leaderboard

```http
GET /api/leaderboard/:pollId
```

---

# 12. Socket Architecture

# Socket Rooms

Each poll creates room:

```txt
poll:<pollId>
```

---

# Socket Events

# Client → Server

| Event               | Purpose           |
| ------------------- | ----------------- |
| join_poll           | Join room         |
| submit_response     | New response      |
| request_leaderboard | Fetch leaderboard |

---

# Server → Client

| Event                  | Purpose           |
| ---------------------- | ----------------- |
| response_count_updated | Live count        |
| analytics_updated      | Analytics update  |
| leaderboard_updated    | Ranking updates   |
| poll_expired           | Poll expired      |
| poll_published         | Results published |

---

# 13. Database Design

# 13.1 Users Collection

```js
{
  _id, name, email, password, avatar, createdAt;
}
```

---

# 13.2 Polls Collection

```js
{
  _id,

  title,
  description,

  type: "poll" | "quiz",

  shareCode,

  createdBy,

  status:
    "draft" |
    "active" |
    "expired" |
    "published",

  responseMode:
    "anonymous" |
    "authenticated",

  allowMultipleResponses,

  showLeaderboard,

  realtimeEnabled,

  published,

  expiresAt,

  questions: [],

  createdAt,
  updatedAt
}
```

---

# 13.3 Questions Structure

```js
{
  _id,

  questionText,

  required,

  allowMultiple,

  points,

  options: [
    {
      _id,
      text
    }
  ],

  correctAnswers: []
}
```

---

# 13.4 Responses Collection

```js
{
  _id,

  pollId,

  userId,

  anonymousName,

  answers: [
    {
      questionId,
      selectedOptions
    }
  ],

  score,

  completionTime,

  submittedAt
}
```

---

# 14. ERD (Entity Relationship Diagram)

```txt
┌──────────┐
│  USERS   │
└────┬─────┘
     │ creates
     ▼
┌──────────┐
│  POLLS   │
└────┬─────┘
     │ contains
     ▼
┌──────────┐
│QUESTIONS │
└────┬─────┘
     │ answered in
     ▼
┌──────────┐
│RESPONSES │
└────┬─────┘
     │ generates
     ▼
┌────────────┐
│LEADERBOARD │
└────────────┘
```

---

# 15. Analytics Engine

# Metrics

## Poll Metrics

- total responses
- completion %
- abandonment %
- average completion time

---

## Question Metrics

- option counts
- option %
- participation count

---

## Quiz Metrics

- average score
- highest score
- lowest score
- leaderboard

---

# 16. Leaderboard Logic

# Ranking Priority

## Recommended

```txt
1. Higher score
2. Faster completion time
3. Earlier submission
```

---

# Score Formula

FinalScore = \sum QuestionPoints - TimePenalty

---

# 17. Validation Rules

# Poll Validation

- minimum 1 question
- minimum 2 options/question
- expiry must be future date

---

# Response Validation

- required questions mandatory
- valid option IDs only
- expired polls blocked

---

# 18. Security Considerations

# Required

- password hashing
- JWT validation
- protected routes
- backend validation
- rate limiting
- CORS config

---

# Important

DO NOT trust frontend validation.

Backend is source of truth.

---

# 19. Performance Considerations

# Optimize

## Poll Fetching

Use projection/select.

---

## Analytics

Avoid recalculating everything repeatedly.

Use aggregation pipelines.

---

## Socket Events

Emit minimal payloads.

Bad:

```js
emit(allResponses);
```

Good:

```js
emit(updatedCounts);
```

---

# 20. UI/UX Pages

# Landing Page

- hero
- features
- CTA

---

# Dashboard

- active polls
- recent quizzes
- analytics snapshot

---

# Poll Builder

Most important UX page.

Needs:

- dynamic forms
- drag feel
- clean editing

---

# Analytics Dashboard

Second most important page.

Should feel realtime and polished.

---

# 21. Deployment Architecture

# Frontend

Deploy on:

- [Vercel](https://vercel.com?utm_source=chatgpt.com)

---

# Backend

Deploy on:

- [Render](https://render.com?utm_source=chatgpt.com)
- or Railway

---

# Database

- [MongoDB Atlas](https://www.mongodb.com/atlas?utm_source=chatgpt.com)

---

# 22. Environment Variables

# Frontend

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

---

# Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
NODE_ENV=
```

---

# 23. Future Scope (Post Hackathon)

# Possible Extensions

- AI-generated quizzes
- charts export
- CSV export
- QR code sharing
- live timer
- question randomization
- anti-cheat
- team quizzes
- realtime host controls
- classroom mode

---

# 24. Recommended Build Order

# Phase 1

- backend setup
- auth
- DB schemas

---

# Phase 2

- poll CRUD
- question builder

---

# Phase 3

- public response flow

---

# Phase 4

- analytics engine

---

# Phase 5

- socket integration

---

# Phase 6

- leaderboard
- polish
- deployment

---

# 25. Biggest Engineering Risks

# High Risk

## Realtime sync complexity

---

## Dynamic nested forms

---

## Analytics aggregation

---

## State inconsistency

---

# 26. Final Product Philosophy

PulseBoard should feel:

- realtime
- lightweight
- interactive
- clean
- production-oriented

NOT:

- overengineered
- feature-bloated
- admin-dashboard garbage

The winner version is the one that:

- works reliably
- looks polished
- demonstrates strong architecture
- handles realtime smoothly
- feels like an actual SaaS product

And your differentiator should be:

> “Poll + Quiz + Live Analytics + Leaderboard in one unified platform.”
