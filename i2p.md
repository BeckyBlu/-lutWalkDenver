# Accessing $lutWalk Denver via I2P

$lutWalk Denver operates a privacy-preserving eepsite inside the
[I2P anonymity network](https://geti2p.net). Members who need stronger
operational security — avoiding clearnet IP logging by hosting providers,
CDNs, or network observers — can access the full community dashboard
through I2P without changing their passwords or losing any features.

---

## What is I2P?

I2P (Invisible Internet Project) is a self-contained anonymity network
that routes traffic through a distributed set of encrypted tunnels.
Unlike a VPN, no single provider can see both who you are and what you
are accessing. Traffic never leaves I2P until it reaches the destination
server, which is also inside the network.

---

## Step 1 — Install the I2P Router

Choose the distribution that matches your system:

| Platform | Download |
|---|---|
| Windows / macOS / Linux | [geti2p.net/en/download](https://geti2p.net/en/download/) |
| Debian / Ubuntu | [geti2p.net/en/download/debian](https://geti2p.net/en/download/debian) |
| Android | [i2p.io/get-i2p](https://i2p.io/get-i2p) |

After installation, start the router and wait for it to integrate into
the network (usually 5–15 minutes on first run). The router console is
at `http://127.0.0.1:7657`.

---

## Step 2 — Configure Your Browser

The recommended setup is **Firefox with FoxyProxy**:

1. Install [FoxyProxy Standard](https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard/).
2. Add a new proxy:
   - **Host**: `127.0.0.1`
   - **Port**: `4444`
   - **Protocol**: HTTP
3. Set FoxyProxy to use this proxy for `.i2p` addresses only
   (pattern: `*.i2p`).
4. Leave all other traffic on your normal connection (or use Tor for
   that too — your choice).

Alternatively, use the I2P Browser Bundle, which pre-configures
everything automatically.

---

## Step 3 — Visit the Eepsite

Once your router is running and the browser proxy is set:

| Address type | Address |
|---|---|
| Base32 (auto-generated) | *(address published separately by organizers)* |
| Vanity hostname | `slutwalkdenver.i2p` *(pending registration at stats.i2p)* |

> **Note:** The eepsite and the clearnet site share the same member
> password and the same administrator password. No separate credentials
> are needed.

---

## Privacy Properties on I2P

- Your IP address is never exposed to the Next.js server or Firebase.
- The JWT session cookies (`sw_auth`, `sw_admin`) are scoped to the
  `.i2p` hostname and never leave the I2P network.
- All Firestore reads and writes go through the Next.js API layer
  (server-side), so the **browser makes zero direct requests to Google**.
- The CSP header (`Content-Security-Policy`) blocks any accidental
  clearnet resource load at the browser level.
- `Referrer-Policy: no-referrer` prevents leaking the eepsite address
  if a member clicks an external link.

---

## Tradeoffs vs. Clearnet

| Feature | Clearnet | I2P eepsite |
|---|---|---|
| Speed | Fast | Slower (routing overhead) |
| Firebase Storage images | Load normally | May not load (external CDN) |
| Real-time chat | ~5 s polling | ~5 s polling |
| IP privacy | None (server sees IP) | Full (server sees I2P address) |
| Stripe | Removed (donate link only) | Same |

---

## For Organizers — Publishing the Eepsite Address

1. On the server running `next start`, open the I2P router console at
   `http://127.0.0.1:7657`.
2. Go to **Hidden Services Manager → Add Server Tunnel**.
3. Set the tunnel target to `127.0.0.1:3000` (or your Next.js port).
4. Save and note the auto-generated `.b32.i2p` address.
5. Optionally register a vanity name at [stats.i2p](http://stats.i2p)
   pointing to that `.b32.i2p` address.
6. Share the address with members through a secure channel (Signal,
   encrypted email, in-person).
7. Update this file and the in-app notice in `app/page.tsx` with the
   actual address once it is confirmed.

---

## Static Eepsite (Lighter Alternative)

If a full server is not available, the root static site (GitHub Pages)
can be served directly inside I2P without any server infrastructure.
The static files (`index.html`, `styles.css`, `static/js/`) have no
external resource dependencies and are I2P-safe out of the box.
Features not available in the static version: live Firestore data,
admin portal, image uploads.
