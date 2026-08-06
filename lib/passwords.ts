const MEMBER_PASSWORD_ENV_KEYS = ['MEMBER_PASSWORD', 'SW_AUTH', 'sw_auth', 'SW__AUTH', 'sw__auth'];
const ADMIN_PASSWORD_ENV_KEYS = ['ADMIN_PASSWORD', 'SW_ADMIN', 'sw_admin'];
const DEFAULT_MEMBER_PASSWORD = 'member-password';
const DEFAULT_ADMIN_PASSWORD = 'admin-password';

function readFirstConfiguredValue(keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  return '';
}

export function getMemberPassword() {
  return readFirstConfiguredValue(MEMBER_PASSWORD_ENV_KEYS) || DEFAULT_MEMBER_PASSWORD;
}

export function getAdminPassword() {
  return readFirstConfiguredValue(ADMIN_PASSWORD_ENV_KEYS) || DEFAULT_ADMIN_PASSWORD;
}
