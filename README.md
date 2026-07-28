## SlutWalk Denver web app

This repository is now a **Next.js-only** deployment target (App Router).  
The previous GitHub Pages/Netlify static fallback is removed.

## Production target and domain

- Canonical production host: **Next.js hosting platform (recommended: Vercel)**.
- Canonical domain: **`slutwalkdenver.gay`**.
- `www.slutwalkdenver.gay` should 301 redirect to `slutwalkdenver.gay`.

### Porkbun DNS setup

1. Add `slutwalkdenver.gay` and `www.slutwalkdenver.gay` in your hosting provider domain settings.
2. In Porkbun DNS:
   - Apex (`@`) record → provider target for the root domain.
   - `www` CNAME → provider target (or to apex if your provider requires that).
3. Enable HTTPS in the hosting provider dashboard.
4. Configure the provider-level canonical redirect: `www.slutwalkdenver.gay` → `https://slutwalkdenver.gay`.
5. Verify:
   - App routes load on custom domain.
   - API endpoints under `/api/*` respond on custom domain.
   - Login/logout cookie flows work over HTTPS.


## Runtime requirements

This repository contains the full application stack required for production:

| Requirement | Implementation in this repo |
| --- | --- |
| Backend server | Next.js App Router route handlers in `app/api/**` plus `middleware.ts` for protected routes. |
| Database/storage | Firebase Admin SDK on the server for Firestore records and uploaded asset metadata/storage. |
| Package manager | npm with the committed `package-lock.json`. |
| Build pipeline | `npm ci` followed by `npm run build`; production runs with `npm run start` or a Next.js-compatible platform runtime. |
| Framework | Next.js 15 with React 19 and TypeScript. |
| Custom domain | `CNAME` and `public/CNAME` both contain `slutwalkdenver.gay`. |

See [Deployment Runbook](docs/deployment-runbook.md) for the step-by-step production checklist.

## Core member flow (locked behavior)

1. Public user lands on `/`.
2. User submits member password at `/api/auth/login`.
3. Server sets `sw_auth` (httpOnly) and clears `sw_admin`.
4. Protected routes (`/archive`, `/bulletin`, `/calendar`, `/community`, `/events`, `/shop`, `/zines`) are accessible through middleware token verification.
5. Unauthorized access to protected member routes is redirected to `/`.

## Admin separation requirement

- Admin login route is separate: `/admin-login` → `/api/auth/admin-login`.
- Admin session uses `sw_admin` cookie only.
- Member session uses `sw_auth` cookie only.
- Admin login clears member cookie; member login clears admin cookie.
- `/admin` route is admin-only in middleware.

## Gallery + upload architecture

- Binary upload endpoint: `/api/upload`.
- Gallery metadata endpoints:
  - `GET /api/gallery` (member/admin access)
  - `POST /api/gallery` (admin only)
  - `DELETE /api/gallery/[id]` (admin only)
- Firestore collection: `galleryAssets`.
- Community page (`/community`) renders uploaded `community` gallery assets.
- Archive page (`/archive`) renders uploaded `archive` gallery assets grouped by category.
- Admin dashboard archive tab uploads files and publishes metadata records.

## Legacy path redirects

`next.config.mjs` now permanently redirects:

- `/index.html` → `/`
- `/about.html` → `/about`
- `/bulletin.html` → `/bulletin`
- `/calendar.html` → `/calendar`
- `/community.html` → `/community`
- `/zine.html` → `/zines`
- `/admin-login.html` → `/admin-login`

## Local development

```bash
npm install
npm run dev
```

## Validation

- Build: `npm run build`
- Type-check: `npx tsc --noEmit`

## Required environment variables

Copy `.env.example` to `.env.local` and set values for:

- `AUTH_SECRET`
- `MEMBER_PASSWORD`
- `ADMIN_PASSWORD`
- Firebase Admin SDK credentials
- Firebase client SDK values

## Architecture planning

- See [Architecture Alignment Plan](docs/architecture-alignment-plan.md) for the route, data-flow, and phased implementation plan that aligns the current Next.js prototype with the requested community hub architecture.
