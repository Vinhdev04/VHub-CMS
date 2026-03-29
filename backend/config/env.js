import dotenv from 'dotenv';

dotenv.config();

function parseAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || 'admin@devcms.io';

  return raw
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

const adminEmails = parseAdminEmails();

export const env = {
  port: process.env.PORT || 4000,
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  adminEmail: adminEmails[0] || 'admin@devcms.io',
  adminEmails,
  adminPassword: process.env.ADMIN_PASSWORD || '',
};

function isValidHttpUrl(value) {
  return /^https?:\/\//i.test(value) && !value.includes('your_supabase_project_url');
}

export const hasSupabaseConfig = Boolean(
  isValidHttpUrl(env.supabaseUrl) &&
  env.supabaseAnonKey &&
  !env.supabaseAnonKey.includes('your_supabase_anon_key'),
);

export const hasFirebaseConfig = Boolean(
  env.firebaseProjectId &&
  env.firebaseClientEmail &&
  env.firebasePrivateKey &&
  !env.firebasePrivateKey.includes('REPLACE_WITH_NEW_FIREBASE_PRIVATE_KEY'),
);

export const hasAdminConfig = Boolean(
  env.adminEmails.length > 0 &&
  env.adminPassword &&
  !env.adminPassword.includes('change_this_admin_password'),
);

export function isAdminEmail(email) {
  const normalized = String(email || '').trim().toLowerCase();
  return Boolean(normalized) && env.adminEmails.includes(normalized);
}
