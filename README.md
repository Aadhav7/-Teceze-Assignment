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
  Backend/
    config/
    controllers/
    models/
    routes/
    app.js
    server.js
  Frontend/
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
cd Backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Create a `.env` file in `Backend/` with:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Frontend

From the React app folder:

```bash
cd Frontend/frontend
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

Vercel uses the included `vercel.json` file:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- API function: `api/index.js`

In Vercel Project Settings:

- Root Directory: leave empty or set to the repository root
- Install Command: leave empty, or set to `npm install`
- Build Command: leave empty, or set to `npm run build`
- Output Directory: leave empty, or set to `dist`

Do not set Root Directory to `Backend`.

Do not use this old install command:

```text
npm install --prefix Backend && npm install --prefix Frontend/frontend
```

That command breaks when Vercel runs inside `Backend`, because it looks for `Backend/Backend/package.json`.

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
