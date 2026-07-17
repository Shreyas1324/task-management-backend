# Task Management Backend

A RESTful Task Management API with JWT Authentication built with **Express.js**, **TypeScript**, **PostgreSQL**, and **TypeORM**.

---

## Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Runtime     | Node.js                       |
| Framework   | Express.js                    |
| Language    | TypeScript                    |
| Database    | PostgreSQL                    |
| ORM         | TypeORM                       |
| Auth        | JWT (jsonwebtoken) + bcrypt   |
| Validation  | express-validator             |
| Config      | dotenv                        |

---

## Project Structure

```
src/
├── config/
│   └── database.ts        # TypeORM DataSource
├── controllers/
│   ├── auth.controller.ts
│   └── task.controller.ts
├── entities/
│   ├── User.ts
│   └── Task.ts
├── middlewares/
│   ├── auth.ts            # JWT authentication middleware
│   └── errorHandler.ts    # Centralized error handler
├── repositories/
│   ├── user.repository.ts
│   └── task.repository.ts
├── routes/
│   ├── auth.routes.ts
│   ├── task.routes.ts
│   └── index.ts
├── services/
│   ├── auth.service.ts
│   └── task.service.ts
├── utils/
│   └── jwt.ts
├── validators/
│   ├── auth.validator.ts
│   └── task.validator.ts
├── app.ts
└── server.ts
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL running locally

### 1. Clone and install

```bash
git clone <repo-url>
cd task-management-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials and a strong `JWT_SECRET`.

### 3. Create the database

```sql
CREATE DATABASE task_management;
```

TypeORM will auto-create the tables on first run (`synchronize: true` in development).

### 4. Run in development

```bash
npm run dev
```

### 5. Build and run in production

```bash
npm run build
npm start
```

---

## Scripts

| Script          | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start dev server with hot reload     |
| `npm run build` | Compile TypeScript to `dist/`        |
| `npm start`     | Run the compiled production build    |

---

## Environment Variables

| Variable        | Description                       | Default           |
|-----------------|-----------------------------------|-------------------|
| `PORT`          | HTTP port                         | `3000`            |
| `NODE_ENV`      | Environment                       | `development`     |
| `DB_HOST`       | PostgreSQL host                   | `localhost`       |
| `DB_PORT`       | PostgreSQL port                   | `5432`            |
| `DB_USERNAME`   | PostgreSQL user                   | `postgres`        |
| `DB_PASSWORD`   | PostgreSQL password               | —                 |
| `DB_NAME`       | PostgreSQL database name          | `task_management` |
| `JWT_SECRET`    | Secret key for signing tokens     | —                 |
| `JWT_EXPIRES_IN`| Token expiry duration             | `7d`              |

---

## API Reference

All task endpoints require the `Authorization: Bearer <token>` header.

### Auth

#### `POST /api/auth/register`

Register a new user.

**Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `201`**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com" },
    "token": "<jwt>"
  }
}
```

---

#### `POST /api/auth/login`

Authenticate and receive a JWT.

**Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "name": "John Doe", "email": "john@example.com" },
    "token": "<jwt>"
  }
}
```

---

#### `POST /api/auth/logout` 🔒

Invalidate session (client-side token discard).

**Response `200`**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

### Tasks 🔒

All task routes require authentication.

#### `POST /api/tasks`

Create a new task.

**Body**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

**Response `201`**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "userId": "uuid",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### `GET /api/tasks`

Get the logged-in user's tasks. Supports pagination, search, and filtering.

**Query Parameters**

| Param       | Type    | Default | Description                         |
|-------------|---------|---------|-------------------------------------|
| `page`      | number  | `1`     | Page number                         |
| `limit`     | number  | `10`    | Results per page (max 100)          |
| `search`    | string  | —       | Filter tasks by title (case-insensitive) |
| `completed` | boolean | —       | Filter by completion status         |

**Example**
```
GET /api/tasks?page=1&limit=5&search=grocery&completed=false
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "tasks": [...],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 5,
      "totalPages": 3
    }
  }
}
```

---

#### `PUT /api/tasks/:id`

Update a task (only the owner can update).

**Body** (all fields optional)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

**Response `200`**
```json
{ "success": true, "data": { ...updatedTask } }
```

---

#### `DELETE /api/tasks/:id`

Delete a task (only the owner can delete).

**Response `200`**
```json
{ "success": true, "message": "Task deleted successfully" }
```

---

## Error Responses

All errors follow this structure:

```json
{ "success": false, "message": "Human-readable error message" }
```

Validation errors:

```json
{
  "success": false,
  "errors": [{ "field": "email", "msg": "A valid email is required" }]
}
```

| Status | Meaning                              |
|--------|--------------------------------------|
| `400`  | Validation error / bad request       |
| `401`  | Missing or invalid token             |
| `404`  | Resource not found                   |
| `409`  | Conflict (e.g. email already in use) |
| `500`  | Internal server error                |

---

## Postman Collection

Import `postman_collection.json` from the project root. The **Login** request auto-saves the token to a collection variable so all subsequent requests are pre-authenticated.
