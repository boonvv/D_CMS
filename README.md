# Workspace Platform

A full-stack project workspace platform with a FastAPI + Strawberry GraphQL backend and a Vite + React + TypeScript frontend.

## Features

- JWT-based authentication
- Signup and login flows
- Project create/read/update/delete
- Task creation and completion tracking
- Dashboard, project cards, and detail pages
- Responsive dark sidebar layout
- SQLite persistence via SQLAlchemy

## Tech stack

- Backend: FastAPI, Strawberry GraphQL, SQLAlchemy, SQLite, JWT
- Frontend: Vite, React, TypeScript, React Router

## Quick start

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the frontend at http://localhost:5173 and the API at http://localhost:8000/graphql.

### GraphQL example

```graphql
query {
  projects {
    id
    title
    description
    tasks {
      id
      title
      completed
    }
  }
}
```

## Project structure

```text
backend/
  app/
frontend/
```
