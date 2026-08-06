## SlutWalk Denver web app

This repository is a privacy-first community platform for SlutWalkDenver.gay, built with Next.js App Router, React 19, TypeScript, and Firebase. It combines a public landing experience, protected member spaces, an administrator dashboard, a community bulletin board, a calendar, an archive/gallery system, and a member chatroom designed for end-to-end encrypted communication.

## Everyday analogy

Think of SlutWalkDenver.gay as a community center.

- The public lobby is the landing page, where visitors can learn about the community and enter the member experience.
- The receptionist is the authentication layer, checking whether someone is a member or an administrator.
- The members-only rooms are the protected community pages for the bulletin board, calendar, gallery, archive, and chatroom.
- The staff-only office is the administrator dashboard, where organizers can moderate content and manage events, products, and uploads.
- The bulletin board is the community bulletin board for public posts and announcements.
- The lounge is the private member chatroom, where conversations are designed to stay private.
- The calendar wall is the events calendar.
- The archive room is the archive and gallery experience.
- The gift shop is the community store.
- The locked filing cabinets are the Firestore database and Firebase Storage, which hold content and metadata securely.
- The secure storage room is the private encryption and key-management layer for member communications.

In this analogy, visitors can enter the lobby, but they cannot enter the members-only rooms without the correct membership check. That is why the receptionist checks membership before allowing entry. The filing cabinets stay locked because they contain sensitive community records and user data that should not be exposed casually.

## Production target and domain

- Canonical production host: **Porkbun-hosted site with a Next.js-compatible runtime behind the domain**.
- Canonical domain: **`slutwalkdenver.gay`**.
- `www.slutwalkdenver.gay` should 301 redirect to `slutwalkdenver.gay`.

## Landing Page and current experience flow

The current experience is a single gated home experience: visitors land on the public page, enter the member password to unlock the community hub, and can then move into the protected sections. Administrators use a separate login path for the admin dashboard.

Landing Page
↓
Password Entry (gate modal, with `/index.html` static fallback and `/login` alias)
↓
Unlocked Community Hub / member dashboard
↓
Protected pages (About, Store, Bulletin, Chat, Calendar, Gallery, Archive)
↓
Separate administrator login path
↓
Administrator dashboard
↓
Administrator logout
↓
Return to the member experience

The administrator dashboard supports content controls for delete, add, and edit actions across posts, events, products, and gallery items.

### Current implementation snapshot

- app/donate/page.tsx — simplified donation/support page with care-oriented links.
- app/page.tsx — gated landing experience with session syncing and password entry.
- app/login/page.tsx — lightweight `/login` alias to the gated landing page.
- app/admin/page.tsx — administrator dashboard and moderation controls.
- middleware.ts — protected member and admin paths.
- app/layout.tsx — SEO metadata, canonical tags, icons, manifest, and structured data.
- app/globals.css — accessibility-oriented styling updates and improved contrast.
- app/components/Footer.tsx — shared footer with contact, social, and legal links.
- app/archive/page.tsx — archive and gallery experience for historical and educational material.
- public/sitemap.xml, public/robots.txt, and index.html — SEO and static fallback support.
- .env.local — local-only secrets and credentials, kept out of Git and never committed.

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
4. Protected routes (`/archive`, `/bulletin`, `/calendar`, `/chat`, `/community`, `/events`, `/shop`, `/zines`) are accessible through middleware token verification.
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

## Community chatroom architecture

- The member chatroom lives at `/chat`.
- Messages are encrypted client-side before transmission using Web Crypto AES-GCM.
- The server stores ciphertext only, with the plaintext never logged or exposed server-side.
- The chatroom supports key generation, key export, and offline-friendly encrypted message storage semantics.
- The privacy model is designed to support future device verification, key rotation, and encrypted key backup workflows.

## Blockchain note

- Blockchain is optional and not required for messaging.
- If enabled later, it should only store SHA-256 hashes for consent, moderation, or document integrity evidence; never plaintext messages, images, files, or personal identifiers.

## Legacy path redirects

`next.config.mjs` now permanently redirects:

- `/index.html` → `/`
- `/login.html` → `/login`
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
- Tests: `npm test`

## Hacking on the source

This repository is a Next.js web app, so the development workflow is based on Node.js and npm rather than a Java build system.

### Build system overview

- Runtime/build toolchain: Node.js + npm
- Framework: Next.js App Router with React 19 and TypeScript
- Main development commands:
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npx tsc --noEmit`
  - `npm test`

### Where to start when exploring the codebase

- `app/` — pages, route handlers, and UI components
- `lib/` — authentication, Firebase helper modules, and shared logic
- `public/` — static assets and SEO files
- `docs/` — deployment and architecture notes

### Notes for contributors

- The password gate and member/admin access flow are implemented in the app routes and middleware rather than in a separate backend service.
- Firebase is used for persistent content and uploads, while the auth flow is handled locally with signed cookies and server-side verification.
- Keep local secrets in `.env.local` and do not commit them.

## Required environment variables

Copy `.env.example` to `.env.local` and set values for:

- `AUTH_SECRET` - A long random string used to sign JWTs for member and admin sessions. Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `MEMBER_PASSWORD` for the shared community-member password. **Current password: `***REMOVED***`**
  - Legacy deployment keys `SW_AUTH`, `sw_auth`, `SW__AUTH`, and `sw__auth` are also accepted for compatibility, but `MEMBER_PASSWORD` is preferred.
- `ADMIN_PASSWORD` for administrator access.
  - Legacy deployment keys `SW_ADMIN` and `sw_admin` are also accepted for compatibility, but `ADMIN_PASSWORD` is preferred.
- Firebase Admin SDK credentials (optional, for gallery/upload features)
- Firebase client SDK values (optional, for client-side Firebase features)

## Architecture planning

- See [Architecture Alignment Plan](docs/architecture-alignment-plan.md) for the route, data-flow, and phased implementation plan that aligns the current Next.js prototype with the requested community hub architecture.
