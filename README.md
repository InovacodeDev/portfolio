# Inovacode Portfolio (MVP)

This workspace contains the monorepo scaffold for the Inovacode landing page and portfolio.

## 🏗️ Workspaces

- `apps/web` - Frontend (Vite + React + Tailwind)
- `apps/api` - Backend (Fastify + PostgreSQL + Drizzle)
- `packages/db` - Shared DB schema (Drizzle)
- `packages/tsconfig` - Shared TypeScript configurations
- `packages/eslint-config` - Shared ESLint configurations

## 🚀 Quickstart

1. **Install dependencies:**

    ```bash
    pnpm install
    ```

2. **Configure database:**
    - Follow the guide in [`docs/setup-database.md`](./docs/setup-database.md)
    - Copy `.env.example` to `.env.local` and fill in your Supabase credentials

3. **Start development:**

    ```bash
    pnpm dev
    ```

4. **Access the applications:**
    - Frontend: http://localhost:5173
    - API: http://localhost:3000
    - Health check: http://localhost:3000/healthz

## 📋 Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm lint` - Lint all packages
- `pnpm test` - Run tests across all packages

## 🗄️ Database Setup

This project uses **Supabase** (PostgreSQL) as the database. See the complete setup guide at [`docs/setup-database.md`](./docs/setup-database.md).

Quick setup:

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local`
3. Fill in your database credentials
4. Run `pnpm dev` to start development

## 📚 Documentation

- [Database Setup](./docs/setup-database.md) - Complete Supabase configuration guide
- [Development Tasks](./docs/development/tasks.md) - Implementation backlog
- [Technical Design](./docs/development/technical_design.md) - System architecture

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, TanStack Router
- **Backend**: Fastify, TypeScript, Zod validation
- **Database**: PostgreSQL (Supabase), Drizzle ORM
- **Monorepo**: Turborepo with pnpm workspaces
- **Deploy**: Vercel (frontend) + Fly.io (backend)
