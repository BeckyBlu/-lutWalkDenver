# 🔐 Authentication Setup Guide

This guide provides step-by-step instructions for setting up and managing authentication for the SlutWalk Denver platform.

## 📋 Current Credentials

| Role | Password | Environment Variable | Usage |
|------|----------|---------------------|-------|
| Member | `GurlGang2030!` | `MEMBER_PASSWORD` | Access to community hub, bulletin, calendar, chat, etc. |
| Admin | `Y2K!W3r` | `ADMIN_PASSWORD` | Access to administrator dashboard, moderation tools |

**⚠️ SECURITY NOTICE**: These passwords are configured in `.env.local` and should **never** be committed to version control.

---

## 🚀 Quick Start

### 1. Set Up Environment Variables

The repository already includes a pre-configured `.env.local` file with the passwords:

```bash
# Copy .env.example to .env.local (if not already done)
cp .env.example .env.local

# Edit .env.local with your passwords (already configured)
MEMBER_PASSWORD=GurlGang2030!
ADMIN_PASSWORD=Y2K!W3r
AUTH_SECRET=your-generated-secret-key
```

**Note**: The `.env.local` file is already in `.gitignore` and will not be committed.

### 2. Generate AUTH_SECRET

If you need to generate a new `AUTH_SECRET`:

```bash
# Generate a 32-byte hex string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and set it in .env.local
AUTH_SECRET=your-generated-32-byte-hex-string
```

### 3. Start the Development Server

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 🔑 Authentication Flow

### Member Login Flow

1. User visits `/` (homepage)
2. User sees password gate
3. User enters password: `GurlGang2030!`
4. Client sends POST request to `/api/auth/login` with password
5. Server validates password against `MEMBER_PASSWORD`
6. If valid:
   - Server signs JWT token with `sub: 'member'`
   - Server sets `sw_auth` cookie (httpOnly, secure in production)
   - Server clears any existing `sw_admin` cookie
   - Client receives success response
   - Client shows protected content
7. If invalid:
   - Server returns 401 Unauthorized
   - Client shows error message

### Admin Login Flow

1. User visits `/admin-login`
2. User enters admin password: `Y2K!W3r`
3. Client sends POST request to `/api/auth/admin-login` with password
4. Server validates password against `ADMIN_PASSWORD`
5. If valid:
   - Server signs JWT token with `sub: 'admin'`
   - Server sets `sw_admin` cookie (httpOnly, secure in production, 8-hour expiry)
   - Server clears any existing `sw_auth` cookie
   - Client receives success response
   - Client redirects to `/admin`
6. If invalid:
   - Server returns 401 Unauthorized
   - Client shows error message

---

## 🛡️ Protected Routes

The following routes require authentication:

### Member-Only Routes (require `sw_auth` cookie)
- `/archive` - Community archive
- `/bulletin` - Bulletin board
- `/calendar` - Events calendar
- `/care` - Care and support resources
- `/chat` - Member chatroom
- `/community` - Community gallery
- `/education` - Education resources
- `/events` - Events management
- `/organizing` - Organizing section
- `/shop` - Community store
- `/zines` - Zines collection

### Admin-Only Routes (require `sw_admin` cookie)
- `/admin` - Administrator dashboard

### Public Routes
- `/` - Homepage (with password gate)
- `/about` - About page
- `/admin-login` - Admin login page
- `/api/auth/session` - Session validation
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/accessibility` - Accessibility statement

---

## 🔧 Configuration Files

### Environment Variables

#### `.env.local` (DO NOT COMMIT)
```bash
# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
AUTH_SECRET=slutwalk-denver-secret-key-2024-gurlgang-y2k-1234567890abcdef

# Member password
MEMBER_PASSWORD=GurlGang2030!

# Admin password
ADMIN_PASSWORD=Y2K!W3r

# Optional: Firebase configuration (if using Firebase features)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

#### `.env.example` (COMMITTED)
```bash
# Copy this file to .env.local and fill in real values.
# Never commit .env.local or any file that contains actual secrets.

# A long random string used to sign JWTs for member and admin sessions.
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET=

# Password for community-member access (used by /api/auth/login).
# Preferred key: MEMBER_PASSWORD. Legacy aliases accepted by the app: SW_AUTH, sw_auth, SW__AUTH, sw__auth.
# Example: MEMBER_PASSWORD=GurlGang2030!
MEMBER_PASSWORD=

# Password for administrator access (used by /api/auth/admin-login).
# Must be different from MEMBER_PASSWORD. Preferred key: ADMIN_PASSWORD.
# Legacy aliases accepted by the app: SW_ADMIN, sw_admin.
# Example: ADMIN_PASSWORD=Y2K!W3r
ADMIN_PASSWORD=

# I2P eepsite
# Set to "true" when deploying for the I2P eepsite build.
NEXT_PUBLIC_EEPSITE=

# Firebase (server-side Admin SDK)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Firebase (client-side SDK)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## 📁 Key Authentication Files

| File | Purpose |
|------|---------|
| `app/api/auth/login/route.ts` | Member login endpoint |
| `app/api/auth/admin-login/route.ts` | Admin login endpoint |
| `app/api/auth/logout/route.ts` | Logout endpoint (clears both cookies) |
| `app/api/auth/admin-logout/route.ts` | Admin logout endpoint |
| `app/api/auth/session/route.ts` | Session validation endpoint |
| `middleware.ts` | Route protection middleware |
| `lib/auth.ts` | JWT signing and verification (Node.js) |
| `lib/auth-edge.ts` | JWT verification for Edge runtime |
| `lib/passwords.ts` | Password configuration reader |

---

## 🔍 Debugging Authentication

### Common Issues and Solutions

#### Issue 1: "Incorrect password" error

**Symptoms**: User enters `GurlGang2030!` but gets "Incorrect password."

**Debugging Steps**:

1. **Check environment variables**:
   ```bash
   # Verify MEMBER_PASSWORD is set
   echo $MEMBER_PASSWORD
   
   # Or check in Node.js
   node -e "console.log(process.env.MEMBER_PASSWORD)"
   ```

2. **Check server logs**:
   ```bash
   # Look for login attempts in console
   npm run dev
   ```

3. **Test with curl**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:3000" \
     -d '{"password":"GurlGang2030!"}'
   ```
   
   **Expected Response**:
   ```json
   {"ok":true}
   ```
   With `Set-Cookie: sw_auth=...` header

4. **Check for typos**:
   - Ensure password is exactly `GurlGang2030!` (case-sensitive)
   - No extra spaces (client-side `.trim()` handles this)
   - Special characters are correct (`!` at the end)

**Solution**: Set `MEMBER_PASSWORD=GurlGang2030!` in `.env.local` and restart server.

---

#### Issue 2: CSRF Origin Mismatch

**Symptoms**: Returns 403 Forbidden, logs show "CSRF: Origin mismatch"

**Cause**: The `Origin` header doesn't match the expected origin.

**Debugging**:
```bash
# Test with correct Origin header
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"password":"GurlGang2030!"}'
```

**Solution**: Ensure requests include the correct `Origin` header matching the server's URL.

---

#### Issue 3: Cookies Not Being Set

**Symptoms**: Login succeeds but user is not authenticated on page reload.

**Debugging**:
1. Check browser DevTools → Application → Cookies
2. Look for `sw_auth` cookie
3. Verify cookie attributes:
   - `HttpOnly`: true (not visible to JavaScript)
   - `Secure`: true (in production)
   - `SameSite`: lax
   - `Path`: /

**Solution**: Ensure `credentials: 'include'` is set in fetch requests:
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // <-- This is required
  body: JSON.stringify({ password: 'GurlGang2030!' }),
});
```

---

#### Issue 4: Session Not Persisting

**Symptoms**: User logs in, but after page refresh, they're logged out.

**Debugging**:
1. Check if `sw_auth` cookie exists
2. Test `/api/auth/session` endpoint:
   ```bash
   curl -X GET http://localhost:3000/api/auth/session \
     -H "Cookie: sw_auth=YOUR_COOKIE_VALUE" \
     -H "Origin: http://localhost:3000"
   ```

**Solution**: The session endpoint should return `{ role: 'member' }` if authenticated.

---

### Manual Session Bypass (For Testing)

You can manually bypass the authentication gate for testing purposes:

```javascript
// In browser console for the homepage:
window.localStorage.setItem('slutwalk-access', 'true');
window.location.reload();
```

Or to hide the gate and show content:
```javascript
document.getElementById('gateModal').style.display = 'none';
document.getElementById('siteContent').style.display = 'block';
sessionStorage.setItem('memberAccess', 'true');
```

**Note**: This only works for client-side testing. Server-protected routes will still require valid cookies.

---

## 🔄 Password Management

### Changing Passwords

To change the member or admin passwords:

1. Edit `.env.local`:
   ```bash
   MEMBER_PASSWORD=new-member-password
   ADMIN_PASSWORD=new-admin-password
   ```

2. Restart the server:
   ```bash
   npm run dev
   ```

3. Notify all users of the password change.

### Using Legacy Password Keys

The application supports legacy environment variable names for backward compatibility:

**Member Password**:
- `MEMBER_PASSWORD` (preferred)
- `SW_AUTH`
- `sw_auth`
- `SW__AUTH`
- `sw__auth`

**Admin Password**:
- `ADMIN_PASSWORD` (preferred)
- `SW_ADMIN`
- `sw_admin`

**Priority**: The application checks these in order and uses the first one found.

---

## 🛡️ Security Best Practices

### 1. Use Strong Passwords
- Member password: `GurlGang2030!` (12 characters, mixed case, special char)
- Admin password: `Y2K!W3r` (7 characters, mixed case, special char)

**Recommendation**: Use passwords with:
- Minimum 12 characters
- Mix of uppercase and lowercase
- Numbers and special characters
- No dictionary words

### 2. Hash Passwords (Production)

For production deployments, **hash passwords with bcrypt**:

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

Update `lib/passwords.ts`:
```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getMemberPasswordHash(): string {
  return process.env.MEMBER_PASSWORD_HASH ?? '';
}
```

Generate hashed password:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('GurlGang2030!', 12);
console.log(hash); // Set this as MEMBER_PASSWORD_HASH in .env.local
```

### 3. Rate Limiting

Add rate limiting to prevent brute force attacks:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Update `app/api/auth/login/route.ts`:
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 m'), // 5 attempts per 10 minutes
});

export async function POST(request: Request) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { ok: false, message: 'Too many attempts. Try again in 10 minutes.' },
      { status: 429 }
    );
  }
  
  // ... rest of login logic
}
```

### 4. Session Management

- **Member sessions**: 30 days expiry
- **Admin sessions**: 8 hours expiry (more secure)
- **Session isolation**: Member login clears admin session and vice versa

---

## 📊 Monitoring and Logging

### Add Authentication Logging

Update `app/api/auth/login/route.ts`:

```typescript
export async function POST(request: Request) {
  const start = Date.now();
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  try {
    const { password } = await request.json();
    const memberPassword = getMemberPassword();

    if (!memberPassword || password !== memberPassword) {
      console.warn('Failed login attempt', {
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - start,
      });
      return NextResponse.json({ ok: false, message: 'Invalid password.' }, { status: 401 });
    }

    console.info('Successful member login', {
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - start,
    });

    // ... rest of login logic
  } catch (error) {
    console.error('Login error', {
      ip,
      userAgent,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - start,
    });
    return NextResponse.json({ ok: false, message: 'Internal server error.' }, { status: 500 });
  }
}
```

---

## 🚨 Emergency Access

If you're locked out of the admin dashboard:

1. **Access the server** where the application is hosted
2. **Edit the environment variables** to set a new `ADMIN_PASSWORD`
3. **Restart the application**
4. **Log in** with the new password

For Vercel deployments:
1. Go to Vercel dashboard
2. Navigate to your project
3. Go to Settings → Environment Variables
4. Update `ADMIN_PASSWORD`
5. Redeploy

---

## 📚 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Requires Auth |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Member login | No |
| POST | `/api/auth/admin-login` | Admin login | No |
| POST | `/api/auth/logout` | Logout (clears both sessions) | Yes (either) |
| POST | `/api/auth/admin-logout` | Admin logout | Yes (admin) |
| GET | `/api/auth/session` | Validate session | Yes (either) |

### Request/Response Examples

#### Member Login
**Request**:
```http
POST /api/auth/login
Content-Type: application/json
Origin: https://slutwalkdenver.gay

{
  "password": "GurlGang2030!"
}
```

**Success Response** (200):
```json
{
  "ok": true
}
```
Headers:
```http
Set-Cookie: sw_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax; Secure
Set-Cookie: sw_admin=; Path=/; HttpOnly; Max-Age=0
```

**Error Response** (401):
```json
{
  "ok": false,
  "message": "Invalid password."
}
```

#### Admin Login
**Request**:
```http
POST /api/auth/admin-login
Content-Type: application/json
Origin: https://slutwalkdenver.gay

{
  "password": "Y2K!W3r"
}
```

**Success Response** (200):
```json
{
  "ok": true
}
```
Headers:
```http
Set-Cookie: sw_admin=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=28800
Set-Cookie: sw_auth=; Path=/; HttpOnly; Max-Age=0
```

#### Session Validation
**Request**:
```http
GET /api/auth/session
Cookie: sw_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200):
```json
{
  "role": "member"
}
```
or
```json
{
  "role": "admin"
}
```
or (if not authenticated)
```json
{
  "role": null
}
```

---

## 🎯 Deployment Checklist

- [ ] Set `AUTH_SECRET` in environment variables
- [ ] Set `MEMBER_PASSWORD` (current: `GurlGang2030!`)
- [ ] Set `ADMIN_PASSWORD` (current: `Y2K!W3r`)
- [ ] Verify `.env.local` is NOT committed to Git
- [ ] Test member login with `GurlGang2030!`
- [ ] Test admin login with `Y2K!W3r`
- [ ] Test protected routes (should redirect if not authenticated)
- [ ] Test logout functionality
- [ ] Verify cookies are set with correct attributes
- [ ] Check server logs for any errors

---

## 📞 Support

For authentication issues:

1. **Check this guide** for common issues and solutions
2. **Verify environment variables** are set correctly
3. **Check server logs** for error messages
4. **Test with curl** to isolate the issue
5. **Review the code** in `app/api/auth/` directory

For security concerns:
- Rotate `AUTH_SECRET` immediately
- Change all passwords
- Review access logs
- Consider implementing rate limiting

---

*Last updated: 2024*
*Documentation version: 1.0*
