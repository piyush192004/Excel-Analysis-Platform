# Excel Analytics Platform

A full-stack web application for analyzing Excel files, generating charts, and providing AI-driven insights. Built with React, Vite, TypeScript, Tailwind CSS, and a Node.js/Express/MongoDB backend.

## Features
- Upload and analyze Excel files
- Generate 2D and 3D charts
- AI-powered insights
- Blog and comment system
- User authentication and profile management

## Project Structure
```
project/
  ├── server/         # Backend (Node.js/Express/MongoDB)
  ├── src/            # Frontend (React/TypeScript)
  ├── ...             # Config and setup files
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd <project-root>
   ```

2. **Install dependencies:**
   ```sh
   cd project
   npm install
   cd server
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in `project/server/` and update MongoDB URI and other secrets as needed.

4. **Start the development servers:**
   ```sh
   # In the project directory
   npm run dev:full
   ```
   - This will start both the frontend (Vite) and backend (Express) servers concurrently.

5. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000) (default)

## Contributors
- Piyush Kumar Singh 

---
Feel free to open issues or submit pull requests to contribute!
