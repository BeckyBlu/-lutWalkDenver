# Architecture Alignment Plan

This plan maps the current Next.js App Router prototype to the requested SlutWalk Denver Community Hub architecture and data flow. It is intended to guide implementation without losing the existing work already in place: cookie-backed member/admin sessions, Firebase Admin API routes, protected middleware, public content pages, and prototype UI flows.

## 1. Target route map

The requested HTML-first route names should be represented by canonical Next.js routes and legacy redirects rather than duplicate pages.

| Requested page | Canonical route | Current status | Alignment action |
| --- | --- | --- | --- |
| `index.html` | `/` | Implemented as landing/login/dashboard hybrid | Keep `/` as public landing and member password entry; make the unlocked state a true member dashboard view. |
| `login.html` | `/` or `/login` | No separate `/login`; login form lives on `/` | Either document `/` as the login entry or add `/login` as a thin redirect/view for accessibility and direct linking. |
| `about.html` | `/about` | Implemented | Expand content to include history, mission, timeline, values, archive links, resources, and educational materials. |
| `shop.html` | `/shop` | Implemented | Keep product read flow; add cart/checkout/order-history milestones when Stripe is introduced. |
| `bulletin.html` | `/bulletin` | Implemented | Continue using posts, replies, reactions, message polling, and uploads; add moderation states and reporting. |
| `calendar.html` | `/calendar` | Implemented | Continue using events and RSVP; add Google Calendar/event-reminder integration later. |
| `admin-login.html` | `/admin-login` | Implemented | Keep separate admin password flow and redirect to `/admin` after success. |
| `admin.html` | `/admin` | Implemented | Organize dashboard tabs around statistics, members, store, calendar, moderation, archive uploads, and settings. |

## 2. Intended data flow

```text
Visitor
  |
  v
/ public landing page
  |
  +-- POST /api/auth/login ---------> sw_auth httpOnly cookie
  |                                      |
  |                                      v
  |                              protected member routes
  |                                      |
  |          +---------------------------+----------------------------+
  |          |                           |                            |
  |          v                           v                            v
  |   /api/posts + replies        /api/messages                 /api/events
  |          |                           |                            |
  |          +------------+--------------+------------+---------------+
  |                       |                           |
  |                       v                           v
  |                 Firestore collections       Firebase Storage uploads
  |                       |
  |                       v
  +-- POST /api/auth/admin-login ---> sw_admin httpOnly cookie
                                         |
                                         v
                                  /admin dashboard
                                         |
                                         v
                       moderation, product, event, archive management
```

The existing application already follows most of this path: middleware gates member pages with `sw_auth` or `sw_admin`, `/admin` requires `sw_admin`, write APIs verify cookies, and Firebase Admin routes persist posts, messages, events, products, and gallery assets.

## 3. Current architecture inventory

### Authentication and authorization

- `lib/auth.ts` signs and verifies HMAC JWTs for Node.js route handlers.
- `lib/auth-edge.ts` verifies the same JWTs in Edge middleware.
- `middleware.ts` protects member routes and admin routes.
- `/api/auth/login` creates `sw_auth` and clears `sw_admin`.
- `/api/auth/admin-login` creates `sw_admin` and clears `sw_auth`.
- `/api/auth/logout` and `/api/auth/admin-logout` clear their respective cookies.

### Member-facing routes

- `/` combines public landing, password entry, and member dashboard cards.
- `/about` contains an initial organization overview.
- `/shop` fetches products and falls back to seed products.
- `/bulletin` contains bulletin posts, replies, reactions, chat polling, and image upload support.
- `/calendar` fetches events, shows a month grid, supports RSVP, and provides calendar export links.
- `/archive`, `/community`, and `/zines` extend the requested architecture with useful archive/community content.

### Admin-facing routes

- `/admin-login` handles the separate admin password flow.
- `/admin` manages statistics, moderation, events, products, and gallery/archive uploads.

### Data and storage

- Firestore collections currently used or implied: `posts`, `posts/{id}/replies`, `messages`, `events`, `products`, and `galleryAssets`.
- Firebase Storage is used by `/api/upload` for image/PDF assets.

## 4. Key alignment gaps

1. **Public landing vs. protected dashboard separation**
   - The landing page currently hides and reveals the dashboard with local storage in addition to server cookies.
   - Plan: keep server cookies as the source of truth and add a `/api/auth/session` endpoint or server component check so UI state reflects actual cookie validity instead of local storage alone.

2. **Route naming parity**
   - The requested `login.html` route has no canonical equivalent.
   - Plan: add `/login` as a lightweight alias to the landing login panel, then add a legacy `/login.html` redirect if needed.

3. **Data access consistency**
   - Some read endpoints are public at the API layer while pages are protected by middleware.
   - Plan: require member/admin cookies on all member-data APIs (`posts`, `events`, `products`) unless a route is deliberately public.

4. **Admin-only upload boundaries**
   - `/api/upload` currently accepts member or admin cookies, even though archive/product uploads are admin workflows.
   - Plan: allow member uploads only for bulletin/chat attachments in a constrained folder, and require admin cookies for `products`, `archive`, and `community` folders.

5. **Moderation model**
   - Delete/pin exists for posts, but comments/messages do not yet have first-class moderation state.
   - Plan: add `status`, `pinned`, `reportedAt`, `removedAt`, `removedBy`, and `moderationReason` fields where appropriate.

6. **Future database objects**
   - Users, orders, categories, announcements, resources, and archives are not yet modeled independently.
   - Plan: introduce typed service modules before adding more route handlers so pages and APIs share schemas.

7. **Accessibility hardening**
   - The visual style is present, but the app needs a focused accessibility pass.
   - Plan: add skip links, visible focus states, form labels/help text, modal focus handling, reduced-motion checks, and color contrast verification.

## 5. Proposed implementation phases

### Phase 1: Stabilize authentication and routing

- Add `/login` or document `/` as the single login route.
- Add `/api/auth/session` returning `{ role: "member" | "admin" | null }`.
- Replace local-storage-only unlock checks with session-aware UI state.
- Ensure all protected API reads enforce the same member/admin policy as protected pages.
- Add tests or smoke checks for member login, admin login, logout, and middleware redirects.

### Phase 2: Create shared domain modules

Create a small domain layer under `lib/` so API handlers and UI components use shared types and validation.

Suggested modules:

```text
lib/domain/auth.ts
lib/domain/posts.ts
lib/domain/messages.ts
lib/domain/events.ts
lib/domain/products.ts
lib/domain/gallery.ts
lib/domain/moderation.ts
```

Each module should define TypeScript types, validation helpers, Firestore collection names, and serialization utilities for timestamps.

### Phase 3: Align member features with database objects

- Posts: add categories (`announcement`, `volunteer`, `mutual-aid`, `resource`, `discussion`) and moderation status.
- Comments/replies: add author label, created timestamp serialization, moderation status, and admin deletion.
- Messages: add admin delete/hide, optional image/link metadata, and pagination.
- Announcements: either model as pinned posts or create a separate `announcements` collection.
- Resources: create a `resources` collection for educational materials and link it from `/about`, `/community`, and `/archive`.

### Phase 4: Store and orders roadmap

- Split product browsing from admin product management using a shared product schema.
- Add `categories` support for store filters.
- Add cart state in the client while Stripe is not configured.
- When ready, add Stripe Checkout endpoints and an `orders` collection.
- Add order-history only after individual user accounts replace the shared member password.

### Phase 5: Calendar roadmap

- Normalize event fields: date, start time, end time, timezone, location, description, host, capacity, RSVP count, status.
- Keep `.ics` export and Google Calendar links.
- Add Google Calendar API integration as an admin-controlled sync, not as the primary datastore.
- Add reminders only after per-user identity exists.

### Phase 6: Administrator dashboard completion

Organize `/admin` tabs around the requested sections:

1. Dashboard and community statistics.
2. Member management placeholder until real users exist.
3. Store management.
4. Calendar management.
5. Content moderation for posts, replies, messages, and uploads.
6. Archive uploads and resource publishing.
7. System settings for passwords, feature flags, and integration status.

### Phase 7: Accessibility and visual system

- Convert repeated navigation and cards into reusable components.
- Add a skip link and landmark structure to every page.
- Ensure all modals trap focus, close on Escape, and restore focus.
- Add visible focus styles matching the zine/poster aesthetic.
- Verify WCAG 2.2 AA color contrast for all text states.
- Respect `prefers-reduced-motion` across hover, animation, and transitions.

## 6. Recommended near-term task order

1. Add session endpoint and replace local-storage gate assumptions.
2. Lock down API reads/writes to mirror the route protection model.
3. Extract shared types and Firestore serializers.
4. Add moderation fields to posts, replies, and messages.
5. Expand `/about` and dashboard content to match the requested page purposes.
6. Add `/login` alias or redirect coverage for `login.html`.
7. Run an accessibility pass before adding heavier integrations.
