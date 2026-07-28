
## Overview

This repository contains two aligned implementations of the same SlutWalk Denver experience:

- A static landing page at the repository root for GitHub Pages
- A Next.js app-router version under app/

Both versions share the same visual language, member access flow, and community-focused structure.

## Experience

The site now includes:

- A full-screen hero for SlutWalk Denver
- A shared member access gate that unlocks the protected dashboard
- A public landing section that explains the collective and directs visitors into the community space
- An About section embedded on the homepage, with [about.html](about.html) redirecting back to [index.html](index.html#about)
- A protected dashboard with timeline, zine, event, bulletin, chat, and archive sections
- Separate administrator access for organizers

## Access

- Members enter through a shared password defined in both the static page and the React page.
- Administrators use a different password for the portal experience.
- Successful entry stores access in browser storage so the protected content remains available on return visits.

## Content Notes

- The experience centers survivor-led organizing, digital archives, community education, and feminist media.
- The hero headline is: $lutWalk Denver is a living collective.
- The protected area is presented as a community hub rather than a placeholder layout.

## Implementation

### Root static site

- [index.html](index.html) is the published landing page for GitHub Pages.
- [styles.css](styles.css) provides the shared visual system for the static pages.
- The additional static pages include [shop.html](shop.html), [bulletin.html](bulletin.html), [calendar.html](calendar.html), and [admin-login.html](admin-login.html).
- [about.html](about.html) now redirects to the About section on [index.html](index.html#about).
- Static member/admin pages load [static/js/auth-guard.js](static/js/auth-guard.js) so the current gate behavior stays centralized.

### Next.js app

- [app/page.tsx](app/page.tsx) renders the same experience in React.
- [app/bulletin/page.tsx](app/bulletin/page.tsx) provides the bulletin board with chat and thread interaction.
- [app/layout.tsx](app/layout.tsx) defines the metadata and root document shell.
- [app/globals.css](app/globals.css) contains the app-wide base styles and shared design tokens.
- The access state is persisted in localStorage under slutwalk-access.

## Deployment

- GitHub Pages serves the repository root so the site opens from [index.html](index.html).
- npm run build validates the Next.js app and confirms the repository still compiles cleanly.

## File Map

- [index.html](index.html)
- [styles.css](styles.css)
- [app/page.tsx](app/page.tsx)
- [app/layout.tsx](app/layout.tsx)
- [app/globals.css](app/globals.css)
- [package.json](package.json)
- [tsconfig.json](tsconfig.json)

## To-Do

- Confirm the site flow: public landing → password entry → dashboard.
- Keep the administrator portal as a separate admin password gateway, distinct from member login.
- Add image upload support for community pages and shared asset galleries.
- Decide whether the GitHub Pages fallback should remain; if not, fold the remaining static pages into the app-router experience.

## Notes

- The static and Next versions are intentionally similar while remaining implemented differently.
- The static pages share an external auth guard script, while the React version handles access in component state.
- The styling is built around a dark, neon-punk palette that can be extended with additional media later.
