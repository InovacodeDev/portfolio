# Migrate API from Fastify to Nest.js (FastifyAdapter)

## Overview

This document describes the planned migration of the existing `apps/api` service from a raw Fastify implementation to a Nest.js application that uses the `FastifyAdapter` under the hood. The goal is to preserve all existing behavior (routes, validation, logging, rate-limiting, and email notifications) while adopting Nest.js architecture for maintainability and conventions.

## Core Functionality

- Preserve existing endpoints under `/api/v1`:
    - `POST /api/v1/contact` — accept contact form submissions, validate with Zod, rate-limit per session, store to DB, and send notification via Resend.
    - `GET /api/v1/contacts` — list contacts (admin-facing).
    - `GET /healthz` — health check.

- Maintain existing environment-driven behavior (e.g., `DATABASE_URL`, `RESEND_API_KEY`, `REDIS_URL`, and `FORCE_DEV_DB_FALLBACK`).

## Technical Implementation

### Files to create

- `apps/api/src/main.ts` — Nest bootstrap (FastifyAdapter).
- `apps/api/src/app.module.ts` — Root module.
- `apps/api/src/controllers/contact.controller.ts` — Controller for contact endpoints.
- `apps/api/src/services/contact.service.ts` — Injectable service with business logic extracted from `routes/contact.ts`.
- `apps/api/src/nest-serverless.ts` — Optional serverless handler compatible with Vercel, reusing compiled output like existing `apps/api/api/index.js`.

### Migration Notes

- Validation: The current code uses Zod with `fastify-type-provider-zod`. In Nest controllers we will continue to validate using Zod manually inside the service or controller (to avoid adding additional Nest-specific validation libraries). Alternatively, we can integrate `class-validator` but that requires DTO conversion.

- Cookie/session handling: The existing code parses cookies manually in a `preHandler`. In Nest we will implement a global middleware or perform the session extraction inside controller routes before executing business logic.

- Rate limiting: Preserve the same Redis-backed `safeSetRateLimit` usage when `REDIS_URL` is present; otherwise fallback to in-memory Map per process (note serverless caveat).

- Database access: Reuse `@inovacode/db` Drizzle schema and helper logic (moved into `ContactService`). Keep `getDb()` helper function behavior to allow `FORCE_DEV_DB_FALLBACK`.

- Serverless handler: Keep `apps/api/api/index.js` entrypoint but update to load compiled Nest server (e.g., `dist/main.js`) and forward requests similarly to current Fastify approach.

## Dependencies

Add to `apps/api/package.json`:

- `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-fastify`, `reflect-metadata`, `rxjs`

Add devDependencies:

- `@nestjs/cli`, `@nestjs/schematics`, `@nestjs/testing`, `@types/node`, `ts-loader`, `typescript`

## Testing Strategy

- Build the `@inovacode/api` package: `pnpm --filter @inovacode/api build`
- Run Vercel dev or use Node to require `apps/api/dist/main.js` from `apps/api/api/index.js` to ensure the serverless handler can load compiled code.
- Smoke test the following endpoints locally:
    - `GET /healthz`
    - `POST /api/v1/contact` with valid/invalid bodies
    - `GET /api/v1/contacts`

## Future Considerations

- Introduce proper Nest validation pipelines using DTOs and `class-validator`.
- Add unit tests for `ContactService` and e2e tests for the controller.
- Replace in-memory rate limiter with a shared store (Redis) for production.

## Local development & proxy

When running the frontend and backend locally we want API requests from the web app to reach the Nest/Fastify backend without changing the frontend code that calls `/api/v1/...`.

- Fastify version decision
    - During migration we encountered mixed Fastify major versions in the monorepo (`fastify@5` and `fastify@4` plugins). To avoid runtime plugin version mismatches and to satisfy `@nestjs/platform-fastify` peer dependencies, the API package (`apps/api`) has been pinned to the `fastify@4` family. This keeps the Nest Fastify adapter and existing `@fastify/*` plugins compatible.
    - We removed direct usage of `fastify-type-provider-zod` from the server bootstrap (it required Fastify v5). Zod is still used inside services/controllers for validation.

- Development proxy (Vite)
    - The frontend dev server and preview server can proxy `/api` to the running API to preserve the same-origin paths used by the app. The repo includes a Vite proxy setup at `apps/web/vite.config.ts` that forwards `/api` to `http://localhost:3001` for both `dev` and `preview` environments.

- Local run steps (recommended)
    1. Build shared packages (if you haven't yet):

        ```bash
        pnpm --filter @inovacode/db build
        pnpm --filter @inovacode/api build
        ```

    2. Start the API (compiled) with a local dev DB fallback (so you don't need a running Postgres):

        ```bash
        API_PORT=3001 FORCE_DEV_DB_FALLBACK=1 node apps/api/dist/server.js
        ```

    3a. Run the frontend in dev (hot reload):

           ```bash
           pnpm --filter @inovacode/web dev
           # open http://localhost:5173
           ```

    3b. Or build + preview the frontend (the preview server will be on port 3000):

           ```bash
           pnpm --filter @inovacode/web build
           pnpm --filter @inovacode/web preview
           # open http://localhost:3000
           ```

    4. The frontend can call `/api/v1/contact` without modification; the Vite dev/preview proxy will forward that request to `http://localhost:3001/api/v1/contact`.

Notes - If you run the preview server on a different port, update `apps/web/vite.config.ts` `preview.port` or pass a PORT env to `vite preview`. - For CI or Vercel deployments ensure `@inovacode/db` is built (or its compiled JS is included) so the API function can require it at runtime.
