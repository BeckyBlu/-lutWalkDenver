# SlutWalk Denver Testing & Validation Plan

## 📋 Overview
Comprehensive testing strategy to validate all audit findings and ensure production readiness.

---

## Phase 1: Automated Testing (Unit & Integration)

### 1.1 Authentication Testing
**Goal**: Verify all auth routes, password handling, and session management work correctly.

**Tests to implement**:
- ✅ Member login with valid password
- ✅ Member login with invalid password
- ✅ Admin login with valid password
- ✅ Admin login with invalid password
- ✅ Password whitespace handling (trim edge case)
- ✅ Session token generation and storage
- ✅ Session token retrieval and validation
- ✅ Logout clears session
- ✅ Protected routes redirect when unauthenticated
- ✅ Protected routes allow access when authenticated

**Files**: `__tests__/auth.test.ts`

---

### 1.2 Route Navigation Testing
**Goal**: Verify all links work and navigation paths are correct.

**Tests to implement**:
- ✅ Home page loads
- ✅ All navigation links present and clickable
- ✅ "Enter Community Hub" links to `/community` (not `/`)
- ✅ Organizing page accessible to members only
- ✅ Education page accessible to members only
- ✅ Care page accessible to members only
- ✅ All protected routes require authentication
- ✅ Redirect chain working correctly
- ✅ Breadcrumb navigation accurate

**Files**: `__tests__/routes.test.ts`

---

### 1.3 Semantic HTML Validation
**Goal**: Ensure proper HTML structure and ARIA labels.

**Tests to implement**:
- ✅ `<header>`, `<main>`, `<footer>` elements present
- ✅ All interactive elements have ARIA labels
- ✅ Skip link present and functional
- ✅ Proper heading hierarchy (h1, h2, h3 order)
- ✅ Form labels associated with inputs
- ✅ Image alt text present
- ✅ Landmarks properly defined

**Files**: `__tests__/a11y-semantic.test.ts`

---

### 1.4 Responsive Design Testing
**Goal**: Verify layout adapts to all viewport sizes.

**Tests to implement**:
- ✅ Mobile (320px): Full functionality
- ✅ Tablet (768px): Responsive grid layout
- ✅ Desktop (1024px): Full layout
- ✅ Large desktop (1920px): Proper spacing
- ✅ No horizontal scrolling at any viewport
- ✅ Touch targets meet 44px minimum
- ✅ Font sizes readable on all screens

**Files**: `__tests__/responsive.test.ts`

---

### 1.5 Component Tests
**Goal**: Unit test individual components.

**Tests to implement**:
- ✅ Footer component renders correctly
- ✅ Navigation component renders all links
- ✅ Gate modal form submits properly
- ✅ Dashboard cards display correctly
- ✅ Organizing/Education/Care pages load

**Files**: `__tests__/components.test.ts`

---

## Phase 2: Accessibility Testing (WAVE/WCAG AA)

### 2.1 Accessibility Audit
**Goal**: Achieve WCAG AA compliance with zero WAVE errors.

**Test points**:
- ✅ Color contrast ratio 4.5:1+ for text (WCAG AA)
- ✅ Focus indicators visible (green outline on :focus-visible)
- ✅ Keyboard navigation fully functional
- ✅ Screen reader compatible
- ✅ No redundant alt text
- ✅ Form labels properly associated
- ✅ Error messages clear and linked to inputs
- ✅ Links have descriptive text

**Tools**:
- WAVE (WebAIM) browser extension
- axe DevTools
- NVDA screen reader testing
- Keyboard-only navigation testing

**Files**: `ACCESSIBILITY_AUDIT.md`

---

### 2.2 Color Contrast Testing
**Goal**: Verify all text meets WCAG AA standards.

**Current color palette check**:
```
--pink: #ff2d95 on --bg: #120f13 ✓ (High contrast)
--text: #f5efe8 on --bg: #120f13 ✓ (High contrast)
--muted: #d5c7ba on --bg: #120f13 ✓ (WCAG AA compliant)
--green: #1dd78d (focus indicator) ✓ (High contrast)
```

**Files**: `__tests__/contrast.test.ts`

---

## Phase 3: Functional Testing

### 3.1 Login Flow Testing
**Goal**: Validate complete authentication workflow.

**Manual test steps**:
1. Navigate to homepage
2. See gate modal
3. Enter member password: `GurlGang2030!`
4. Verify successful login and redirect
5. Verify session cookie set
6. Close browser, reopen - still logged in? ✓
7. Test logout
8. Test wrong password error message

**Automated test file**: `__tests__/auth.test.ts`

---

### 3.2 Navigation Testing
**Goal**: Verify all links work end-to-end.

**Manual test steps**:
1. Login as member
2. Click "Organizing" - loads /organizing ✓
3. Click "Education" - loads /education ✓
4. Click "Care" - loads /care ✓
5. Test all main nav links
6. Test breadcrumb navigation
7. Test back button in browser

**Automated test file**: `__tests__/routes.test.ts`

---

### 3.3 Admin Portal Testing
**Goal**: Verify admin login works separately.

**Manual test steps**:
1. Navigate to /admin-login
2. Enter admin password: `Y2K!W3r`
3. Verify admin access granted
4. Verify different session from member
5. Test admin-only features
6. Logout as admin

---

## Phase 4: Responsive Design Testing

### 4.1 Viewport Testing
**Goal**: Ensure design works at all sizes.

**Test viewports**:
- ✅ Mobile (320px) - iPhone SE
- ✅ Mobile (375px) - iPhone 12
- ✅ Mobile (425px) - iPhone XL
- ✅ Tablet (768px) - iPad
- ✅ Tablet (1024px) - iPad Pro
- ✅ Desktop (1366px) - Standard
- ✅ Large (1920px) - 4K

**Testing tools**:
- Chrome DevTools responsive mode
- Firefox responsive design mode
- Physical device testing

**Files**: `__tests__/responsive.test.ts`

---

### 4.2 Device Testing
**Goal**: Test on real devices.

**Devices to test**:
- iPhone (iOS)
- Android phone
- iPad
- Desktop browsers (Chrome, Firefox, Safari)
- Edge browser

---

## Phase 5: SEO & Meta Testing

### 5.1 Meta Tags Validation
**Goal**: Verify SEO is properly configured.

**Check**:
- ✅ Title tags present
- ✅ Meta descriptions present
- ✅ OpenGraph tags configured
- ✅ Twitter card tags present
- ✅ JSON-LD structured data valid
- ✅ Sitemap.xml valid (13 URLs)
- ✅ robots.txt configured

**Automated test file**: `__tests__/seo.test.ts`

---

## Phase 6: Security Testing

### 6.1 Authentication Security
**Goal**: Verify secure password handling.

**Tests**:
- ✅ Passwords never stored in localStorage (only JWT)
- ✅ Passwords trimmed before submission
- ✅ Password input is type="password"
- ✅ Sessions use httpOnly cookies
- ✅ No sensitive data in URLs
- ✅ CORS headers properly configured
- ✅ CSP headers present

**Files**: `__tests__/security.test.ts`

---

## Phase 7: Performance Testing

### 7.1 Image Optimization
**Goal**: Verify Next.js Image optimization.

**Checks**:
- ✅ Images served in WebP/AVIF format
- ✅ Proper caching headers set
- ✅ No unoptimized images
- ✅ Lazy loading working

**Files**: `__tests__/performance.test.ts`

---

## Implementation Order

1. **Week 1**: Set up test infrastructure
   - Install testing libraries
   - Create test files structure
   - Implement auth tests

2. **Week 2**: Functional tests
   - Route navigation tests
   - Component tests
   - SEO tests

3. **Week 3**: Accessibility tests
   - WCAG AA validation
   - Screen reader testing
   - Manual audit

4. **Week 4**: Performance & security
   - Performance tests
   - Security tests
   - Final validation

---

## Test Execution Commands

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test -- auth.test.ts

# Run with coverage
npm run test -- --coverage

# Watch mode (development)
npm run test -- --watch

# Accessibility audit (manual)
npm run dev  # Then use WAVE/axe in browser
```

---

## Success Criteria

| Category | Target | Status |
|----------|--------|--------|
| Unit Tests | 95%+ coverage | Pending |
| Auth Flow | 100% functional | Pending |
| All Routes | 100% working | Pending |
| WCAG AA | 100% compliant | Pending |
| WAVE Errors | 0 errors | Pending |
| Mobile (320px) | 100% functional | Pending |
| Desktop (1920px) | 100% functional | Pending |
| SEO Meta | All present | Pending |
| Security | All checks pass | Pending |

---

## Known Issues to Address

1. **Password whitespace handling** - Need to add `.trim()` to password input
2. **Button hiding in CSS** - `.btn-row a.btn { display: none; }` - investigate why
3. **Password debugging** - Remove console logging before production

---

## Documentation Updates Needed

- [ ] ACCESSIBILITY_AUDIT.md - WCAG AA compliance details
- [ ] TEST_RESULTS.md - Automated test results
- [ ] MANUAL_TEST_LOG.md - Manual testing checklist
- [ ] DEPLOYMENT_CHECKLIST.md - Pre-launch verification

