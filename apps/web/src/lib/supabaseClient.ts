import { createClient } from '@supabase/supabase-js';

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    storageKey: 'fsm-unified-web-session',
  },
});

function getEnv(key: string): string {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  if (!value) {
    console.warn(`Missing environment variable: ${key}`);
    return '';
  }
  return value;
}
