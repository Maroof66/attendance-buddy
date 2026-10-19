import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// These are public browser credentials (never a service-role key). Environment values
// override the defaults for forks or alternate Supabase projects. RLS protects all data.
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://ytaljlipssiyjtrxptpi.supabase.co';
const publishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) || 'sb_publishable_QKHpCpE6MxXaeA5mH24D-g_fCQdEz6F';

export const cloudConfigured = Boolean(url && publishableKey && url.startsWith('https://'));
export const supabase: SupabaseClient | null = cloudConfigured
  ? createClient(url!, publishableKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
