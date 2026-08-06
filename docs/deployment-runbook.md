# Deployment runbook

This app is not a static placeholder site. It requires a Node.js runtime that can run Next.js App Router server code, serverless API routes, Firebase Admin SDK calls, and middleware.

## Recommended production architecture

For production, the most reliable setup is:

- Ubuntu server
- Nginx as the reverse proxy
- Porkbun for DNS
- TLS certificate installed on the server and served by Nginx
- Next.js running locally on port 3000 behind Nginx

This repository is already set up for that flow through the Next.js app, middleware, auth routes, Firebase helpers, and the canonical domain files.

## Required stack

- Package manager: npm, using the committed `package-lock.json`
- Framework/build pipeline: Next.js App Router
- Build command: `npm ci` then `npm run build`
- Runtime: `npm run start`
- Database/storage: Firebase Firestore and Firebase Storage
- Custom domain: `slutwalkdenver.gay`

## Environment setup

### Local development

1. Copy `.env.example` to `.env.local`.
2. Fill in the required values:
   - `AUTH_SECRET`
   - `MEMBER_PASSWORD`
   - `ADMIN_PASSWORD`
   - Optional Firebase values if gallery/upload features are enabled
   - `NEXT_PUBLIC_EEPSITE=false` unless you are deploying an I2P eepsite build

### Production deployment

Use a production environment file or systemd environment file such as:

```bash
/var/www/slutwalkdenver/.env.production
```

At minimum, set:

```env
NODE_ENV=production
AUTH_SECRET=replace-with-a-long-random-string
MEMBER_PASSWORD=replace-with-member-password
ADMIN_PASSWORD=replace-with-admin-password
NEXT_PUBLIC_EEPSITE=false
```

If Firebase features are enabled, also add:

```env
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

## Server setup on Ubuntu

### 1. Install Node.js and Nginx

```bash
sudo apt update
sudo apt install -y nginx nodejs npm build-essential
```

### 2. Deploy the app

```bash
sudo mkdir -p /var/www/slutwalkdenver
cd /var/www/slutwalkdenver
sudo git clone <your-repo-url> .
sudo npm ci
sudo npm run build
```

### 3. Create a systemd service

Create `/etc/systemd/system/slutwalkdenver.service` with:

```ini
[Unit]
Description=SlutWalk Denver Next.js App
After=network.target

[Service]
WorkingDirectory=/var/www/slutwalkdenver
Environment=NODE_ENV=production
EnvironmentFile=/var/www/slutwalkdenver/.env.production
ExecStart=/usr/bin/npm run start -- --hostname 127.0.0.1 --port 3000
Restart=always
RestartSec=10
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Then enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable slutwalkdenver
sudo systemctl start slutwalkdenver
sudo systemctl status slutwalkdenver
```

## Nginx reverse proxy with Porkbun SSL

### 1. Put the certificate files in place

Assuming your Porkbun files are available locally:

```bash
sudo mkdir -p /etc/ssl/certs /etc/ssl/private
sudo cp /path/to/slutwalkdenver.crt /etc/ssl/certs/slutwalkdenver.crt
sudo cp /path/to/slutwalkdenver.key /etc/ssl/private/slutwalkdenver.key
sudo cp /path/to/ca-bundle.crt /etc/ssl/certs/ca-bundle.crt
sudo chmod 600 /etc/ssl/private/slutwalkdenver.key
sudo chmod 644 /etc/ssl/certs/slutwalkdenver.crt /etc/ssl/certs/ca-bundle.crt
```

### 2. Create the Nginx site config

Create `/etc/nginx/sites-available/slutwalkdenver` with:

```nginx
server {
    listen 80;
    server_name slutwalkdenver.gay www.slutwalkdenver.gay;
    return 301 https://slutwalkdenver.gay$request_uri;
}

server {
    listen 443 ssl http2;
    server_name slutwalkdenver.gay;

    ssl_certificate /etc/ssl/certs/slutwalkdenver.crt;
    ssl_certificate_key /etc/ssl/private/slutwalkdenver.key;
    ssl_trusted_certificate /etc/ssl/certs/ca-bundle.crt;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_cache_bypass $http_upgrade;
    }
}
```

If you want an explicit HTTPS www redirect, add a separate block for `www.slutwalkdenver.gay` that returns `301 https://slutwalkdenver.gay$request_uri;`.

### 3. Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/slutwalkdenver /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## DNS with Porkbun

In Porkbun, add:

- A record for `@` pointing to your server public IP
- CNAME record for `www` pointing to `slutwalkdenver.gay`

This lets Nginx handle the redirect from `www` to the apex domain.

## Local verification

```bash
npm ci
npm run build
npm run start
```

Then open `http://localhost:3000` and verify login, protected routes, and `/api/*` routes.

## Production verification

```bash
sudo systemctl status slutwalkdenver
sudo systemctl status nginx
curl -I http://slutwalkdenver.gay
curl -I https://slutwalkdenver.gay
curl -I https://www.slutwalkdenver.gay
```

Expected behavior:

- HTTP redirects to HTTPS
- `www` redirects to the apex domain
- HTTPS serves the Next.js app correctly
- Auth cookies work over the custom domain
