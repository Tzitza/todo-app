# Todo App

A simple full-stack CRUD todo list application. Tasks are stored in PostgreSQL, served by a REST API written in Go, and managed through a React + TypeScript interface.

## Features

- Create, view, edit and delete tasks
- Mark tasks as completed or pending
- Data persists in PostgreSQL across restarts
- Input validation and meaningful HTTP status codes

## Tech Stack

- **Backend:** Go, [Gin](https://github.com/gin-gonic/gin), [pgx](https://github.com/jackc/pgx)
- **Database:** PostgreSQL
- **Frontend:** React, TypeScript, Vite

## Project Structure

```
todo-app/
├── backend/
│   ├── main.go        # Server setup, database connection, routes
│   ├── todo.go        # Data types
│   ├── handlers.go    # HTTP handlers (CRUD logic)
│   └── schema.sql     # Database schema
└── frontend/
    └── src/
        ├── api.ts         # Requests to the backend
        ├── types.ts       # TypeScript types
        ├── App.tsx        # Main component and state
        ├── TodoForm.tsx   # Form for adding tasks
        └── TodoItem.tsx   # Single task (view, edit, delete, toggle)
```

## API

| Method | Endpoint      | Description        | Success response |
|--------|---------------|--------------------|------------------|
| GET    | `/health`     | Health check       | `200 OK`         |
| GET    | `/todos`      | List all tasks     | `200 OK`         |
| POST   | `/todos`      | Create a task      | `201 Created`    |
| PUT    | `/todos/:id`  | Update a task      | `200 OK`         |
| DELETE | `/todos/:id`  | Delete a task      | `204 No Content` |

Error responses use the format `{"error": "message"}` with status `400` (invalid input), `404` (task not found) or `500` (server error).

Example request body for `POST /todos`:

```json
{ "title": "Learn Go", "description": "Finish the todo app" }
```

`PUT /todos/:id` expects `title`, `description` and `completed`.

## Prerequisites

- [Go](https://go.dev/dl/)
- [Node.js](https://nodejs.org/) (LTS) and npm
- [PostgreSQL](https://www.postgresql.org/download/)

## Getting Started

### 1. Set up the database

```powershell
psql -U postgres -c "CREATE DATABASE todo_app;"
psql -U postgres -d todo_app -f backend/schema.sql
```

### 2. Run the backend

The backend reads the database connection string from the `DATABASE_URL` environment variable.

```powershell
cd backend
$env:DATABASE_URL = "postgres://postgres:YOUR_PASSWORD@localhost:5432/todo_app"
go run .
```

The API will be available at `http://localhost:8080`.

### 3. Run the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Notes

- The backend allows cross-origin requests from `http://localhost:5173` (the Vite dev server). If you change the frontend port, update the CORS settings in `backend/main.go`.
- The API URL is set in `frontend/src/api.ts`.