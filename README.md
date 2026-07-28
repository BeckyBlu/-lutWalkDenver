
## Overview

This repository contains two aligned implementations of the same SlutWalk Denver experience:

- A static landing page at the repository root for GitHub Pages
- A Next.js app-router version under app/

Both versions share the same structure, copy, and visual language so the published Pages site and the React version stay in sync.

## Experience

The site now includes:

- A full-screen hero for SlutWalk Denver
- A member access gate for the private community space
- A featured campaign section centered on the next organizing circle
- A movement timeline with the years 2011, 2020, 2021, and 2022
- Zine spotlights, event listings, a community bulletin board, a member chatroom, and archive sections

## Access

- Members enter through a shared access password defined in the static page and the React page.
- A successful entry stores access in browser storage so the protected content remains available on return visits.

## Content Notes

- The experience centers survivor-led organizing, digital archives, community education, and feminist media.
- The hero headline is: Reclaiming Space. Building Community. Ending Victim Blaming.
- The featured section now invites visitors to join the next organizing circle and support community action.
- The protected area is presented as a community space rather than a placeholder layout.

## Implementation

### Root static site

- [index.html](index.html) is the published landing page for GitHub Pages.
- [styles.css](styles.css) provides the shared visual system for that static site.

### Next.js app

- [app/page.tsx](app/page.tsx) renders the same experience in React.
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

## Notes

- The static and Next versions are intentionally similar, while remaining implemented differently.
- The static page uses inline script for the access gate, while the React version handles it in component state.
- The styling is built around a dark, neon-punk palette that can be extended with additional media later.
