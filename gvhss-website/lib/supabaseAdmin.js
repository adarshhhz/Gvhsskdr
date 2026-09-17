import { createClient } from '@supabase/supabase-js';

// DANGER: uses the service_role key, which bypasses Row Level Security.
// Only ever import this file inside /pages/api routes (server-side).
// NEVER import this in any component that runs in the browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
