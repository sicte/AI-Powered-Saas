# AI-Powered SaaS Platform (OmniAI) — Monorepo

A modern, production-grade AI-powered SaaS platform monorepo combining a **React/TypeScript frontend**, **Prisma database package**, **Gemini AI SDK**, and a **FastAPI Python AI microservice** with PostgreSQL-backed authentication.

---

![FIRST UI](https://github.com/sicte/AI-Powered-Saas/blob/main/assets/img/first.gif)

## Architecture & Monorepo Structure

```tree
├── apps/
│   └── web/                 # React + TypeScript Vite frontend (UI/Client)
├── packages/
│   ├── ai-sdk/              # Gemini LLM SDK types & shared client helpers
│   └── database/            # Prisma ORM schema & client configuration
├── services/
│   └── ai/                  # FastAPI Python microservice (Auth, Gemini chat, text chunking & embeddings)
├── docker-compose.yml       # Local infrastructure (PostgreSQL, Redis, MinIO)
└── package.json             # Root monorepo workspace configuration
```

## Features

### 🚀 Frontend (`apps/web`)
- **Landing Page:** High-converting header with live AI prompt preview simulation and call-to-actions.
- **Interactive Playground:** Live demonstration area where visitors can test AI prompts directly.
- **Application Dashboard:** Gemini-powered AI chat with full conversation history, Save/Copy actions, and read-only navigation for anonymous demo users.
- **Authentication:** Sign Up / Sign In / Sign Out flows backed by PostgreSQL sessions. Visitors can explore with a one-click **Continue as Demo** mode (chat + AI works; other areas are read-only until sign-in).

### 🧠 Backend & Packages (`packages/` & `services/`)
- **`@ai-saas/ai-sdk`:** Shared TypeScript types and helpers for the Gemini AI integration.
- **`@ai-saas/database`:** PostgreSQL database client powered by Prisma ORM (`User`, `Organization`, `Project`, `Conversation`, `Message`, `Document`, `UsageRecord`, `Subscription`, `ApiKey`, `AuditLog`).
- **Python AI Service (`services/ai`):** FastAPI service providing auth (signup/signin/signout/demo), live Gemini chat (`POST /api/v1/generate`), and document chunking / embedding endpoints.

### 🔐 Auth API (`services/ai`)
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/v1/auth/signup` | POST | Create an account with `name`, `email`, `password` |
| `/api/v1/auth/signin` | POST | Sign in with `email`, `password` |
| `/api/v1/auth/signout` | POST | Invalidate a session `token` |
| `/api/v1/auth/demo` | POST | Create a demo session (chat enabled, read-only elsewhere) |
| `/api/v1/auth/me` | GET | Resolve the current `Bearer` token into a user |

Every chat request (`/api/v1/generate`) automatically attaches the stored session token; demo tokens work for chat, while data endpoints (e.g. `/api/v1/me/history`) require a signed-in account.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.10+ (for the Python AI microservice)
- Docker & Docker Compose (for local PostgreSQL, Redis, MinIO infrastructure)

### Installation & Running Locally

#### Option A: Running with Docker (Recommended)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start infrastructure (PostgreSQL, Redis, MinIO) via Docker Compose:
   ```bash
   npm run docker:up
   ```
3. Start the frontend development server:
   ```bash
   npm run dev:web
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Option B: Running without Docker
1. Install dependencies:
   ```bash
   npm install
   ```

2. **Run Backend (Database & Python Service):**
   - **Database (Prisma):** Ensure your PostgreSQL instance is running and `.env` is configured with `DATABASE_URL` (e.g. `postgresql://postgres:yourpass@localhost:5432/perfect_ai_saas`). Generate the Prisma client:
     ```bash
     npx prisma generate --schema=packages/database/prisma/schema.prisma
     ```
   - **Python AI Service (FastAPI):** Creates/reads the `users` and `auth_sessions` tables automatically via SQLAlchemy.
     ```bash
     cd services/ai
     pip install -r requirements.txt
     uvicorn app.main:app --reload --port 8000
     ```

3. **Run Frontend:**
   In the root directory, start the frontend development server:
   ```bash
   npm run dev:web
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Workspace Scripts

- `npm run dev:web` — Starts the Vite frontend development server.
- `npm run build:web` — Builds the frontend application for production.
- `npm run preview:web` — Locally preview the production build.
- `npm run lint:web` — Run ESLint on the frontend codebase.
- `npm run typecheck:web` — Run TypeScript type checking for the frontend.
- `npm run docker:up` — Start Docker Compose infrastructure.
- `npm run docker:down` — Stop Docker Compose infrastructure.

---

## License

MIT
