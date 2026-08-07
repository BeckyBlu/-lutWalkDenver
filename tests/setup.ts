import '@testing-library/jest-dom';

process.env.AUTH_SECRET = 'test-secret-for-vitest-only';
process.env.MEMBER_PASSWORD = 'test-member-pass';
process.env.ADMIN_PASSWORD = 'test-admin-pass';

vi.mock('@/lib/firebase-admin', () => ({
  getAdminDb: () => ({}),
  getAdminStorage: () => ({}),
}));

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(() => undefined),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));
