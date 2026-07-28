# -lutWalkDenver

## Product Brief

This repository now contains a visual prototype and a starter scaffold for a SlutWalk Denver community site.

## Project Goal

Create a gated, member-facing web experience with:

- A password-protected landing page
- A chatroom for ongoing member conversation
- A bulletin board for threaded posts and announcements
- Calendar access for events and volunteer coordination
- E-commerce for merch and older zines

## Audience

- SlutWalk Denver members
- Volunteers and organizers
- Event attendees who have the access password
- Readers and collectors looking for archived zines

## Tone And Visual Direction

- Loud, handmade, zine-inspired, and community-first
- Editorial typography with strong contrast and bold sectioning
- Flexible blocks that can absorb photos, flyers, scans, and posters
- Easy to scan on mobile while still feeling expansive on desktop

## Information Architecture

- `/` Password landing page
- `/home` Member dashboard
- `/board` Bulletin board
- `/chat` Chatroom
- `/calendar` Calendar
- `/store` Merch and zines
- `/rules` Community guidelines
- `/about` Mission and organizer info

## Landing Page Copy Draft

Headline: SlutWalk Denver Community Access

Support copy: Enter with the shared password to reach the members-only space for conversation, planning, events, and store access.

Password label: Access password

Primary button: Enter site

Helper note: Demo password for the starter is ***REMOVED***

## Dashboard Copy Draft

Welcome line: You are in. Use the dashboard to jump into conversation, board posts, upcoming events, and the store.

Section headers:

- Featured announcement
- Latest board activity
- Upcoming events
- Featured merch
- Archived zine spotlight

## Wireframe Notes

### Landing

- Centered gate card with headline, description, password field, and enter button
- Background art or poster image behind the card
- Small callout for rules, contact, or support beneath the form

### Dashboard

- Large hero block with featured announcement
- Two-column content grid on desktop, stacked on mobile
- Utility cards for calendar, chat, and store
- Product rail for shirts, zines, stickers, or patches

### Bulletin Board

- Board index on the left or top
- Thread cards with title, poster name, reply count, and last activity
- Optional image thumbnails for approved posts
- Sticky rules banner at the top

### Chatroom

- Channel list
- Message timeline
- Simple composer with attach and send controls

### Store

- Product grid with image, title, short description, price, and availability
- Zine archive section separated from merch
- Cart summary panel for checkout flow

## Content Model

Use repeatable cards and fields so the site is easy to maintain:

- Title
- Short description
- Image or poster
- Date or issue number
- Price
- Availability
- Link or CTA

## Prototype And Starter Files

- `prototype/index.html` and `prototype/styles.css` for a static visual prototype
- `app/page.tsx`, `app/layout.tsx`, and `app/globals.css` for a Next.js starter
- `package.json` and config files for a minimal runnable scaffold

## Open Questions

- Should the board support images at launch or stay text-first?
- Should the calendar be embedded or linked out?
- Which store platform should be used for fulfillment and checkout?
- Should the access password stay shared or move to member accounts later?
