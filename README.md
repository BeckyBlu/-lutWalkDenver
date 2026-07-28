

## Overview

This repository contains two aligned implementations of the same SlutWalk Denver site:

- A static site at the repository root for GitHub Pages
- A Next.js app router version under `app/`

Both versions use the same structure, copy, and visual language so the deployed Pages site and the Next starter stay in sync.

## Experience

The page includes:

- A full-screen hero for SlutWalk Denver
- A shared-password member gate
- A featured campaign or announcement block
- A compact movement timeline with the years 2011, 2020, 2021, and 2022
- Zine, event, community-board, and archive sections

## Password

- Demo password: `***REMOVED***`

## Content Notes

- The site centers survivor-led organizing, digital archives, community education, and feminist media.
- The hero headline is: Reclaiming Space. Building Community. Ending Victim Blaming.
- The featured section currently acts as a placeholder for a campaign, donation push, or event announcement.
- The password gate is client-side demo behavior only; it does not provide real access control.

## Implementation

### Root static site

- [index.html](index.html) is the published landing page for GitHub Pages.
- [styles.css](styles.css) provides the full visual system for that static site.
- The page expects shared assets like `hero.jpg` in the repository root.

### Next.js app

- [app/page.tsx](app/page.tsx) renders the same experience in React.
- It stores the gate state in `localStorage` under `slutwalk-access`.
- [app/layout.tsx](app/layout.tsx) defines the metadata and root document shell.
- [app/globals.css](app/globals.css) contains the app-wide base styles and the shared design tokens.

## Deployment

- GitHub Pages should serve the repository root so it lands on [index.html](index.html).
- The old `prototype/` folder has been removed to avoid a second, unused entry point.
- `npm run build` validates the Next.js app and confirms the repo still compiles cleanly.

## File Map

- [index.html](index.html)
- [styles.css](styles.css)
- [app/page.tsx](app/page.tsx)
- [app/layout.tsx](app/layout.tsx)
- [app/globals.css](app/globals.css)
- [package.json](package.json)
- [tsconfig.json](tsconfig.json)

## Notes

- The static and Next versions are intentionally similar, not identical in implementation.
- The static page has no JavaScript gating logic; the React version does.
- The current styling assumes a dark, neon-punk palette and can be extended with image assets later.
