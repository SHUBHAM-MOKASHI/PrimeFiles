import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Clean the Supabase URL in case a user inputs a REST endpoint or trailing slash
const sanitizeUrl = (url) => {
  if (!url) return '';
  return url
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
};

const supabaseUrl = sanitizeUrl(rawUrl);
const supabaseAnonKey = rawKey.trim();

// Target storage bucket for PrimeFiles
export const STORAGE_BUCKET = 'primefiles-storage';

// Check if credentials are configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://')
);

// Official Supabase client with secure session persistence
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
