# Task Frontend

A responsive React app that consumes the [Task API](../task-api) — a Task manager with auth, list/detail/edit views, and proper loading and error handling.

## Tech stack

- React 18 + Vite
- React Router v6 (5 routes: login, register, task list, task detail, create/edit form)
- React Context (`AuthContext`) for auth state — no Redux needed at this size
- Plain CSS, responsive from ~375px up

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` if your API runs somewhere other than `http://localhost:3000`:
```
VITE_API_URL=http://localhost:3000
```

**Make sure the Task API backend is running first** (`npm start` in the `task-api` project) — this app has no mock data; every screen fetches from the real API.

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## Routes

| Path | Page | Protected? |
|---|---|---|
| `/login` | Log in | No |
| `/register` | Create account | No |
| `/tasks` | List of your tasks | Yes |
| `/tasks/new` | Create a task | Yes |
| `/tasks/:id` | Task detail | Yes |
| `/tasks/:id/edit` | Edit a task | Yes |

Protected routes redirect to `/login` if there's no auth token, and send you back to where you were after logging in.

## Features

- **Real API data** — no hardcoded arrays. List, detail, create, and edit all hit the live backend.
- **Loading states** — a spinner shows while any request is in flight.
- **Error states** — a visible banner (with a Retry button on list/detail views) shows on any failed request, including the backend being offline entirely.
- **Client-side validation** — login, register, and the task form all validate before submitting (email format, password length/match, non-empty title).
- **Responsive** — single-column, touch-friendly layout below 640px; wider layout above.

## Testing it yourself

1. Start the API (`task-api` project) and this app.
2. Register a new account, confirm you land on `/tasks`.
3. Create a task, edit it, mark it complete, delete it.
4. Stop the API server (Ctrl+C in that terminal) and refresh `/tasks` — you should see the error banner with a Retry button, not a blank screen.
5. Run `npm run build` to confirm there are no build errors before pushing.

## Project structure

```
├── src/
│   ├── api/client.js          — fetch wrapper, all API calls
│   ├── context/AuthContext.jsx — auth state (token, user, login/register/logout)
│   ├── components/            — Navbar, Spinner, ErrorBanner, ProtectedRoute
│   ├── pages/                 — Login, Register, TasksList, TaskDetail, TaskForm, NotFound
│   ├── App.jsx                — route definitions
│   └── main.jsx                — entry point
├── index.html
└── vite.config.js
```
