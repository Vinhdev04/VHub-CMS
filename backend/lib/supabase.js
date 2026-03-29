import { createClient } from '@supabase/supabase-js';
import { env, hasSupabaseConfig } from '../config/env.js';

// Supabase client — used ONLY for auth verification (not for database)
export const supabase = hasSupabaseConfig
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null;
