import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This client runs in the browser and uses the public anon key.
// It is safe to expose — real access control happens via Supabase
// Row Level Security (RLS) policies on each table, not this key.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
