# Inovacode Portfolio

This is a modern Next.js application for the Inovacode landing page and portfolio, featuring a contact form with email notifications.

## 📈 Project Status

**🎯 Migration Complete: CONCLUÍDO ✅**

-   ✅ Migrated from Turborepo monorepo to single Next.js project
-   ✅ Consolidated database (Drizzle ORM) into unified structure
-   ✅ Updated all configurations for single project architecture
-   ✅ Vercel deployment optimized with Next.js framework detection

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utilities and database
│   ├── styles/           # Global styles
│   └── types/            # TypeScript types
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🚀 Quickstart

1. **Install dependencies:**

    ```bash
    pnpm install
    ```

2. **Configure environment:**

    - Copy `.env.example` to `.env.local` and fill in your credentials:
        - `DATABASE_URL` - PostgreSQL connection string
        - `RESEND_API_KEY` - For email notifications

3. **Setup git hooks (recommended):**

    ```bash
    ./scripts/setup-hooks.sh
    ```

4. **Start development:**

    ```bash
    pnpm dev
    ```

5. **Access the application:**
    - Application: http://localhost:3000
    - Contact API: http://localhost:3000/api/contact

## 🔒 Git Hooks

This project includes git hooks to maintain code quality and dependency consistency:

-   **pre-push**: Validates frozen lockfile consistency
    -   Ensures `pnpm-lock.yaml` is in sync with `package.json`
    -   Prevents pushes with inconsistent dependencies
    -   Validates lockfile format and integrity

**Setup hooks:**

```bash
./scripts/setup-hooks.sh
```

**Skip hooks temporarily:**

```bash
git push --no-verify
```

## 📋 Available Scripts

-   `pnpm dev` - Start development server
-   `pnpm build` - Build for production
-   `pnpm start` - Start production server
-   `pnpm lint` - Lint codebase
-   `pnpm type-check` - TypeScript type checking
-   `pnpm test` - Run tests
-   `pnpm db:generate` - Generate database migrations
-   `pnpm db:migrate` - Run database migrations
-   `pnpm db:studio` - Open Drizzle Studio

## 🚀 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment with Next.js framework detection:

1. Connect your repository to Vercel
2. Configure environment variables:
    - `DATABASE_URL` - PostgreSQL connection string
    - `RESEND_API_KEY` - Email service API key
3. Deploy automatically on push

### Manual Deployment

```bash
pnpm build
pnpm start
```

## 🗄️ Database

This project uses **Drizzle ORM** with PostgreSQL. Database schema is located in `src/lib/db/`.

**Quick setup:**

1. Set up a PostgreSQL database (Supabase recommended)
2. Add `DATABASE_URL` to `.env.local`
3. Generate and run migrations:
    ```bash
    pnpm db:generate
    pnpm db:migrate
    ```

## 📚 Documentation

-   [Database Setup](./docs/setup-database.md) - Complete database configuration guide
-   [Development Tasks](./docs/development/tasks.md) - Implementation backlog
-   [Technical Design](./docs/development/technical_design.md) - System architecture
-   [Features Documentation](./docs/features/) - Feature-specific guides

## 🛠️ Tech Stack

-   **Framework**: Next.js 15 with App Router
-   **Styling**: Tailwind CSS v4
-   **Database**: PostgreSQL with Drizzle ORM
-   **Email**: Resend API
-   **Deployment**: Vercel
-   **Package Manager**: pnpm

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, Tailwind CSS, TanStack Router
-   **Backend**: Fastify, TypeScript, Zod validation
-   **Database**: PostgreSQL (Supabase), Drizzle ORM
-   **Monorepo**: Turborepo with pnpm workspaces
-   **Deploy**: Vercel (frontend) + Fly.io (backend)
