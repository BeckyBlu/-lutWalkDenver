# SlutWalk Denver — Overview

This repository is the implementation of the SlutWalk Denver community hub a virtual community center. It is designed for folks who want to understand the current website style, authentication model, and deployment architecture.

## What this site is

This is a privacy-first gated virtual community center web app with a hybrid static/Next.js App Router implementation.

- The root page (`/`) is the public landing experience and also serves as the member login gate.
- A lightweight alias at `/login` redirects to the same root gate.
- `index.html` is a static fallback page for legacy/static hosting and now includes a password entry flow that mirrors the app landing page.
- Member-only sections are unlocked after password entry and protected by signed cookies and middleware.
- Administrator access is separated from member access through a dedicated admin login path at `/admin-login`.

## Who should read this

This README is written for:

- community organizers evaluating the live site behavior
- server/operations staff deploying the app
- developers maintaining the admin/moderator experience
- security reviewers checking authentication and route protection

## Site style and user experience

The site is a gated virtual community center, not a traditional open CMS. It follows this pattern:

- Public landing content is visible at `/`
- Password gate appears on root when no valid member session exists
- Successful member login unlocks the member dashboard and protected navigation
- Admin login is separate and does not share the member session cookie
- Protected pages are enforced by middleware rather than client-side routing alone

### Style of site

This is a controlled-access community platform with a minimal onboarding gate. It is not a social network or a public blog. The goal is to provide:

- a safe entry point for community members
- a private dashboard for ongoing member interaction
- a separate admin channel for moderation, content updates, and uploads
- a static fallback for legacy hosting via `index.html`

## High-level architecture diagram

```
[Browser]
   |-- /index.html (static fallback)
   |-- / or /login -> app/page.tsx gated landing
   |-- /admin-login -> app/login/page.tsx -> admin auth
   |-- /admin -> protected admin dashboard
   |-- /archive, /bulletin, /calendar, /chat, /community, /shop -> protected member pages
   |-- /api/auth/* -> session creation / termination
   |-- /api/* -> protected content APIs

[Next.js App Router]
   |-- app/page.tsx
   |-- app/login/page.tsx
   |-- app/admin-login/page.tsx
   |-- app/admin/page.tsx
   |-- app/api/auth/*
   |-- middleware.ts
   |-- app/layout.tsx
   |-- lib/auth.ts, lib/authz.ts, lib/firebase-admin.ts

[Backend / Persistence]
   |-- Firebase Admin SDK -> Firestore + Storage
   |-- Signed cookies -> `sw_auth`, `sw_admin`
```

## Key routes and behavior

| Route | Purpose |
| --- | --- |
| `/` | Public landing + member password gate |
| `/login` | Alias to `/` for accessibility and legacy convenience |
| `/index.html` | Static fallback page with the same password entry experience |
| `/admin-login` | Admin password entry route |
| `/admin` | Admin-only dashboard |
| `/archive`, `/bulletin`, `/calendar`, `/chat`, `/community`, `/shop`, `/zines` | Member-protected pages |
| `/api/auth/login` | Member login endpoint (sets `sw_auth`, clears `sw_admin`) |
| `/api/auth/admin-login` | Admin login endpoint (sets `sw_admin`, clears `sw_auth`) |

## Authentication and authorization

### Member flow

1. Visitor lands on `/`.
2. They enter the member password.
3. POST `/api/auth/login` validates the password and issues `sw_auth` cookie.
4. Middleware allows protected member pages when `sw_auth` is valid.
5. Member pages redirect to `/` if the session is missing or invalid.

### Admin flow

1. Admin lands on `/admin-login`.
2. They enter the admin password.
3. POST `/api/auth/admin-login` validates the password and issues `sw_admin` cookie.
4. Middleware allows `/admin` only when `sw_admin` is valid.
5. Admin login explicitly clears the member cookie and vice versa.

### Middleware protection

Protected routes are enforced by `middleware.ts`. It checks cookies for:

- `sw_auth` → valid member session
- `sw_admin` → valid admin session

Admin routes are strictly admin-only; member routes accept either member or admin access.

## Current admin-facing implementation summary

- `app/page.tsx` — root gated landing page, member password entry, and dashboard launch.
- `app/login/page.tsx` — lightweight `/login` alias redirect.
- `app/admin-login/page.tsx` — admin password gate and redirect to admin dashboard.
- `app/admin/page.tsx` — admin dashboard and moderation controls.
- `middleware.ts` — route protection for member and admin content.
- `app/api/auth/*` — auth endpoints for login, logout, and session state.
- `lib/auth.ts` / `lib/authz.ts` — token signing, verification, and session helpers.
- `lib/firebase-admin.ts` — Firebase Admin SDK initialization and Firestore/storage helpers.
- `index.html` — static fallback page for legacy or static hosting.
- `next.config.mjs` — legacy redirects and security headers.

## Deployment and runtime

This project is intended to run in a Node-compatible Next.js hosting environment with the following requirements:

- `npm install`
- `npm run build`
- `npm run start`

It also supports static fallback behavior through `public/index.html` and legacy URL redirects configured in `next.config.mjs`.

## Validation and checks

Run the following to verify the codebase:

```bash
npm install
npm run build
npm run lint
npm test
npx tsc --noEmit
```

## Environment variables

Copy `.env.example` to `.env.local` and configure:

- `AUTH_SECRET` — JWT signing secret for session cookies.
- `MEMBER_PASSWORD` — member access password.
- `ADMIN_PASSWORD` — admin access password.
- Firebase Admin SDK credentials for Firestore and Storage.
- Firebase client SDK values for optional client-side features.

> `MEMBER_PASSWORD` and `ADMIN_PASSWORD` should be treated as deployment secrets and not committed.

## Notes for administrators

- The gate and admin separation are implemented inside the app and middleware, not through an external auth provider.
- `index.html` is intentionally a working fallback, not a dead redirect.
- Protected APIs and pages rely on the Firebase Admin SDK and signed cookies.
- The repository includes a deployment runbook at `docs/deployment-runbook.md`.
