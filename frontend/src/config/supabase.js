import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const isValidSupabaseUrl = /^https?:\/\//i.test(supabaseUrl) && !supabaseUrl.includes('your_supabase_project_url');

export const supabase =
  isValidSupabaseUrl &&
  supabaseAnon &&
  !supabaseAnon.includes('your_supabase_anon_key')
    ? createClient(supabaseUrl, supabaseAnon)
    : null;

export const hasSupabase = Boolean(supabase);
