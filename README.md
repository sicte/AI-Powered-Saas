# AI-Powered SaaS Platform (Nexus AI)

A modern, production-grade AI-powered SaaS platform frontend built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**. Features a rich marketing landing page, an interactive AI playground, and a fully featured user dashboard with model selection, analytics, templates, and history.

---

![FIRST UI](https://github.com/sicte/AI-Powered-Saas/blob/main/assets/img/first.gif)

## Features

### 🚀 Landing Page

- **Hero Section:** High-converting header with live AI prompt preview simulation and call-to-actions.
- **Features Section:** Detailed showcase of platform capabilities (Advanced LLM generation, multimodal support, enterprise security, API access).
- **Interactive Playground:** Live demonstration area where visitors can test AI prompts directly on the marketing site.
- **Pricing Tiers:** Clear pricing breakdown (Free, Pro, Enterprise) with feature comparison.
- **Navigation & Footer:** Responsive navigation bar with quick launch and dark-mode polished styling.

### 💼 Application Dashboard

- **AI Chat & Playground:** Multi-model selector (`Nexus 2.0 Turbo`, `Nexus 2.0 Pro`, `Nexus 1.5`, `Nexus Vision`), temperature control, and real-time generation simulation.
- **Chat History:** Persistent sidebar listing past conversations and quick session management.
- **Templates Library:** Pre-built prompts and starter templates for marketing copy, code review, data analysis, etc.
- **Analytics View:** Usage charts, token tracking, request metrics, and cost monitoring.
- **Settings & User Management:** Account preferences, API keys management, and team settings.
- **Supabase Integration:** Pre-configured Supabase client (`@supabase/supabase-js`) ready for authentication and database persistence.

---

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom color palettes and PostCSS
- **Icons:** Lucide React
- **Backend / Auth:** Supabase (`@supabase/supabase-js`)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation & Running Locally

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ai-powered-saas
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

- `npm run dev` — Starts the Vite development server.
- `npm run build` — Builds the application for production.
- `npm run preview` — Locally preview the production build.
- `npm run lint` — Run ESLint across the codebase.
- `npm run typecheck` — Run TypeScript type checking without emitting files.

---

## Project Structure

```tree
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx    # Main dashboard application & chat interface
│   │   ├── Features.tsx     # Platform features section
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Hero.tsx         # Landing page hero
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   ├── Playground.tsx   # Interactive landing page AI playground
│   │   └── Pricing.tsx      # Pricing plans component
│   ├── App.tsx              # Root component managing view states (landing / dashboard)
│   ├── index.css            # Global Tailwind CSS styles
│   └── main.tsx             # React entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## License

MIT
