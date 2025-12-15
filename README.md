# Task Management Application

A React-based task management application featuring a dashboard, task creation/editing, and user authentication with role-based access control.

## Technologies Used

- **Frontend**: React, Vite, TypeScript
- **State Management**: Redux Toolkit (RTK Query)
- **Styling**: SCSS (Modules), Material UI (Components)
- **Forms**: React Hook Form, Zod
- **Mock Backend**: JSON Server

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Setup Instructions

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

## Running the Application

To run the full application, you need to start both the mock backend server and the frontend development server.

### 1. Start the Backend Server

This runs the JSON Server to mock API endpoints (Users, Tasks).

```bash
npm run server
```

_The server will run on `http://localhost:3000`_

### 2. Start the Frontend

In a separate terminal, start the Vite development server.

```bash
npm run dev
```

_The application will optionally open in your browser, typically at `http://localhost:5173`_

## Login Credentials

**Admin User**:

- **Username**: Raj
- **Password**: (Any, mock auth)
- **Role**: Admin (Can create/edit all fields)

**Regular User**:

- **Username**: User2
- **Password**: (Any)
- **Role**: User (Can only edit status)

## Available Scripts

- **`npm run dev`**: Starts the frontend in development mode.
- **`npm run server`**: Starts the json-server for the mock database (`db.json`).
- **`npm run build`**: Builds the app for production to the `dist` folder.
- **`npm run lint`**: Lints the codebase using ESLint.
- **`npm run format`**: Formats code using Prettier.
- **`npm run test`**: Runs unit tests using Vitest.
