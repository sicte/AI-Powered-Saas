# AI-Powered SaaS Platform (Nexus AI) — Monorepo

A modern, production-grade AI-powered SaaS platform monorepo combining a **React/TypeScript frontend**, **Prisma database package**, **Multi-provider AI SDK (Anthropic, OpenAI, Gemini)**, and a **FastAPI Python AI microservice**.

---

![FIRST UI](https://github.com/sicte/AI-Powered-Saas/blob/main/assets/img/first.gif)

## Architecture & Monorepo Structure

```tree
├── apps/
│   └── web/                 # React + TypeScript Vite frontend (UI/Client)
├── packages/
│   ├── ai-sdk/              # Multi-provider LLM SDK (Claude, OpenAI, Gemini, Zod)
│   └── database/            # Prisma ORM schema & client configuration
├── services/
│   └── ai/                  # FastAPI Python microservice (Text chunking & embeddings)
├── docker-compose.yml       # Local infrastructure (PostgreSQL, Redis, MinIO)
└── package.json             # Root monorepo workspace configuration
```

## Features

### 🚀 Frontend (`apps/web`)
- **Landing Page:** High-converting header with live AI prompt preview simulation and call-to-actions.
- **Interactive Playground:** Live demonstration area where visitors can test AI prompts directly.
- **Application Dashboard:** Multi-model selector (`Nexus 2.0 Turbo`, `Nexus 2.0 Pro`, `Nexus 1.5`, `Nexus Vision`), temperature control, chat history, templates, and analytics view.

### 🧠 Backend & Packages (`packages/` & `services/`)
- **`@ai-saas/ai-sdk`:** Unified TypeScript SDK supporting Anthropic Claude, OpenAI GPT, and Google Gemini with robust fallback and quota handling.
- **`@ai-saas/database`:** PostgreSQL database client powered by Prisma ORM (`User`, `Organization`, `Project`, `Conversation`, `Message`, `Document`, `UsageRecord`, `Subscription`, `ApiKey`, `AuditLog`).
- **Python AI Service (`services/ai`):** FastAPI service providing document chunking and embedding generation endpoints.

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
   - **Database (Prisma):** Ensure your PostgreSQL instance is running and `.env` is configured with `DATABASE_URL`. Generate the Prisma client:
     ```bash
     npx prisma generate --schema=packages/database/prisma/schema.prisma
     ```
   - **Python AI Service (FastAPI):**
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
