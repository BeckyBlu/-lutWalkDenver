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

## SlutWalk Denver Context

SlutWalk Denver is a survivor-led, intersectional demonstration against rape culture and victim-blaming. The event began in 2011 and has recurred most years since, often in early summer. Organizers and participants center marginalized groups, including sex workers, BIPOC, LGBTQ+ people, survivors, and allies.

The site should reflect that history without flattening it into generic activism branding. It should feel like a community archive, a coordination hub, and a store all in one place.

## Core Messaging

- Challenge victim-blaming and shift attention toward assaulters and systems of harm
- Center consent culture, bodily autonomy, and survivor voice
- Make space for coalition work with local nonprofits and mutual-aid partners
- Present the movement as both political and communal, not just event promotion

## Historical Anchors

- 2011 first march at Civic Center Park, with roughly 400 attendees
- Early routes looped through Civic Center Park and sometimes down Colfax Avenue
- Later events shifted to Cheesman Park and, in some years, stationary formats for safety
- Community coverage has come from local and alternative outlets, social media, and organizer posts

## Suggested Homepage Sections

- Hero statement and access gate
- Short origin story and mission block
- Featured timeline or history strip
- Partner and community allies section
- Featured announcement or next event
- Board preview
- Calendar preview
- Store preview for merch and archived zines

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

Mission line: SlutWalk Denver creates space for survivors and allies to organize, remember, and keep pushing back against victim-blaming.

Section headers:

- Featured announcement
- Latest board activity
- Upcoming events
- Featured merch
- Archived zine spotlight

## Copy Blocks To Reuse

- A one-sentence origin block for the 2011 Denver march
- A short mission block centered on consent, accountability, and survivor voice
- A community block naming allies, organizers, and partner groups
- A safety block that explains why some events are stationary or password-gated
- A store block that separates merch from archival zines

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

## Timeline Content Model

Use this if you want a compact history strip on the homepage or about page:

- 2011: first march at Civic Center Park
- 2012: continued annual rally
- 2014: benefit events and broader local attention
- 2020: pandemic-era march with rerouted safety planning
- 2021: 10th annual event at Cheesman Park pavilion

## Prototype And Starter Files

- `prototype/index.html` and `prototype/styles.css` for a static visual prototype
- `app/page.tsx`, `app/layout.tsx`, and `app/globals.css` for a Next.js starter
- `package.json` and config files for a minimal runnable scaffold

## Open Questions

- Should the board support images at launch or stay text-first?
- Should the calendar be embedded or linked out?
- Which store platform should be used for fulfillment and checkout?
- Should the access password stay shared or move to member accounts later?
