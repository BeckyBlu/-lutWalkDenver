# Deployment runbook

This app is not a static placeholder site. It requires a Node.js runtime that can run Next.js App Router server code, serverless API routes, Firebase Admin SDK calls, and middleware.

## Required stack

- **Package manager:** npm, using the committed `package-lock.json`.
- **Framework/build pipeline:** Next.js App Router. Build with `npm ci` then `npm run build`.
- **Backend server/runtime:** run the production server with `npm run start`, or deploy to a Next.js-compatible host such as Vercel that supports App Router route handlers and middleware.
- **Database/storage:** Firebase Firestore for app records and Firebase Storage for uploaded assets.
- **Custom domain:** `slutwalkdenver.gay` is the canonical host. The repository includes `CNAME` files at the repo root and in `public/` so GitHub Pages-style publishing and static artifacts both carry the domain name.

## Environment setup

1. Copy `.env.example` to `.env.local` for local development.
2. Fill in `AUTH_SECRET`, `MEMBER_PASSWORD`, and `ADMIN_PASSWORD`.
3. Create a Firebase project.
4. Add the Firebase Admin SDK values for server-side Firestore and Storage access.
5. Add the Firebase web app values for client-side SDK initialization.

## Local verification

```bash
npm ci
npm run build
npm run start
```

Then open `http://localhost:3000` and verify login, protected routes, and `/api/*` routes.

## Production checklist

1. Connect this repository to a Next.js-compatible hosting provider.
2. Configure the build command as `npm run build`.
3. Configure the install command as `npm ci`.
4. Configure the start command as `npm run start` if the provider requires one.
5. Add all required environment variables from `.env.example` in the hosting dashboard.
6. Add `slutwalkdenver.gay` as the production domain.
7. Point Porkbun DNS for the apex/root domain to the hosting provider target.
8. Add or redirect `www.slutwalkdenver.gay` to `https://slutwalkdenver.gay`.
9. Enable HTTPS and verify cookies work over the custom domain.
