import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  adminEmail: process.env.ADMIN_EMAIL || 'admin@devcms.io',
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
  env.adminEmail &&
  env.adminPassword &&
  !env.adminPassword.includes('change_this_admin_password'),
);
