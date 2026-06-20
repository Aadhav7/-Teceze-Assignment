# Employee Management System

A simple CRUD web application for managing employee records.

## Features

- View all employees in a table
- Add a new employee
- Edit employee name, designation, and salary
- Delete an employee with confirmation
- Auto-generated unique employee number
- Persistent data using MongoDB
- Required field validation
- Positive salary validation with decimal support

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose

## Project Structure

```text
Assesment/
  api/
    index.js
  backend/
    config/
    controllers/
    models/
    routes/
    app.js
    server.js
  frontend/
    src/
    package.json
    vite.config.js
  package.json
  vercel.json
```

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Create a `.env` file in `backend/` with:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Frontend

From the React app folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Vercel Deployment

Deploy from the repository root:

```text
Assesment/
```

Vercel uses the included `vercel.json` file. It explicitly builds:

- Static frontend: root `package.json` with output in `dist`
- API function: `api/index.js` with `@vercel/node`

In Vercel Project Settings:

- Root Directory: leave empty or set to the repository root
- Framework Preset: `Other`
- Install Command: leave empty
- Build Command: leave empty
- Output Directory: leave empty

Do not set Root Directory to `backend` or `frontend`.

Do not use this old install command:

```text
npm install --prefix backend && npm install --prefix frontend
```

That command breaks when Vercel runs inside `backend`, because it looks for `backend/backend/package.json`.

Add this environment variable in Vercel Project Settings:

```text
MONGO_URI=your_mongodb_connection_string
```

Do not upload `.env` to GitHub. The frontend calls `/api/employees`, and Vercel rewrites that path to the serverless Express API.

## API Endpoints

```text
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:employeeNo
DELETE /api/employees/:employeeNo
```

## Notes

Employee numbers are generated automatically by the backend. Salary must be greater than zero.
