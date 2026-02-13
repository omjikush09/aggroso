# 🚀 SpecGen (Aggroso)

**Transform ideas into actionable engineering tasks.**

SpecGen is a full-stack specification generator that takes a high-level project goal and automatically produces structured user stories and engineering tasks. It features a sleek dark-themed UI, drag-and-drop task management, persistent history, and a built-in health dashboard.

---

## ✨ Features

| Feature                         | Description                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Spec Generation**             | Enter a project goal, target users, constraints, and template — the system generates structured user stories and engineering tasks automatically. |
| **Drag & Drop Task Management** | Reorder tasks using intuitive drag-and-drop (powered by `@dnd-kit`). Tasks are grouped by category (setup, backend, frontend, compliance).        |
| **Task Completion Tracking**    | Mark individual tasks as complete/incomplete. State is persisted to the database in real time.                                                    |
| **History Sidebar**             | Browse and reload previously generated specifications. The last 5 specs are kept for quick access.                                                |
| **Markdown Export**             | Export the current spec as a Markdown document and copy it to your clipboard with one click.                                                      |
| **Health Dashboard**            | A dedicated health page shows real-time backend uptime, database connectivity, and response-time metrics.                                         |
| **Dark Theme UI**               | Premium dark-mode interface with gradient accents, glassmorphism cards, and smooth micro-animations.                                              |
| **Input Validation**            | Both client-side and server-side validation using Zod schemas.                                                                                    |
| **Docker-Ready Database**       | PostgreSQL runs via Docker Compose with persistent volumes and health checks.                                                                     |

---

## 🛠 Tech Stack

### Client

- **React 19** with TypeScript
- **Vite 7** (dev server & bundler)
- **Tailwind CSS v4** (styling)
- **@dnd-kit** (drag & drop)
- **Axios** (HTTP client)
- **Lucide React** (icons)
- **Sonner** (toast notifications)
- **shadcn/ui** components (Button, Input, Select, etc.)

### Server

- **Node.js** with **Express 5** and TypeScript
- **Prisma ORM** (PostgreSQL)
- **Zod** (request validation)
- **Nodemon** (hot reload in dev)
- **CORS** & **body-parser** middleware

### Infrastructure

- **PostgreSQL 17** via Docker Compose
- **pnpm workspaces** (monorepo management)

---

## 📦 Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 10
- **Docker** & **Docker Compose** (for PostgreSQL)

---

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone <repo-url>
cd aggroso
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the database

```bash
docker compose up -d
```

This spins up a PostgreSQL 17 container on port `5432` with:

- **User:** `user`
- **Password:** `password`
- **Database:** `aggroso`

### 4. Configure environment variables

Create a `.env` file inside the `server/` directory (or use the existing one):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aggroso?schema=public"
PORT=3001
```

### 5. Run Prisma migrations

```bash
cd server
pnpm prisma migrate dev
pnpm prisma generate
```

### 6. Start the development servers

From the **root** of the project, run both client and server simultaneously:

```bash
pnpm dev
```

Or start them individually:

```bash
# Terminal 1 — Client (Vite on http://localhost:5173)
cd client
pnpm dev

# Terminal 2 — Server (Express on http://localhost:3001)
cd server
pnpm dev
```

### 7. Open the app

Navigate to **http://localhost:5173** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint        | Description                       |
| ------ | --------------- | --------------------------------- |
| `GET`  | `/api/health`   | Health check (backend + database) |
| `POST` | `/api/generate` | Generate a new spec from input    |
| `GET`  | `/api/history`  | Get last 5 generated specs        |
| `PUT`  | `/api/spec/:id` | Update tasks/stories for a spec   |

---

## 📁 Project Structure

```
aggroso/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeatureForm.tsx       # Input form for spec generation
│   │   │   ├── HealthPage.tsx        # Health dashboard view
│   │   │   ├── HistorySidebar.tsx    # Sidebar with spec history
│   │   │   ├── TaskList.tsx          # Drag-and-drop task manager
│   │   │   └── ui/                   # Reusable UI components (Button, Input, Select)
│   │   ├── types/                    # TypeScript type definitions
│   │   ├── lib/                      # Utility functions
│   │   ├── App.tsx                   # Main application component
│   │   └── main.tsx                  # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                   # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── spec.controller.ts    # Route handlers
│   │   ├── services/
│   │   │   └── spec.service.ts       # Business logic & Prisma queries
│   │   ├── routes/
│   │   │   └── spec.routes.ts        # API route definitions
│   │   ├── schemas/
│   │   │   └── spec.schema.ts        # Zod validation schemas
│   │   ├── middlewares/
│   │   │   └── validate.ts           # Request validation middleware
│   │   ├── lib/
│   │   │   └── prisma.ts             # Prisma client instance
│   │   ├── types/
│   │   │   └── spec.ts               # TypeScript interfaces
│   │   └── app.ts                    # Express app setup
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   └── migrations/               # SQL migrations
│   ├── index.ts                      # Server entry point
│   ├── .env                          # Environment variables
│   └── package.json
│
├── docker-compose.yml        # PostgreSQL container
├── pnpm-workspace.yaml       # Monorepo workspace config
└── package.json              # Root package.json
```

---

## 🐳 Docker Compose

The `docker-compose.yml` provides a PostgreSQL 17 instance:

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# Stop and remove volumes
docker compose down -v
```

---

## 📜 Available Scripts

| Location | Command                | Description                  |
| -------- | ---------------------- | ---------------------------- |
| Root     | `pnpm dev`             | Start both client and server |
| Client   | `pnpm dev`             | Start Vite dev server        |
| Client   | `pnpm build`           | Build for production         |
| Client   | `pnpm lint`            | Run ESLint                   |
| Server   | `pnpm dev`             | Start server with Nodemon    |
| Server   | `pnpm prisma:generate` | Generate Prisma client       |

---

## 📄 License

ISC
