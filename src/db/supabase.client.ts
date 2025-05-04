import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

console.log('Environment variables:', {
  SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
  SUPABASE_KEY: import.meta.env.PUBLIC_SUPABASE_KEY,
  NODE_ENV: import.meta.env.NODE_ENV,
  DEV: import.meta.env.DEV,
});

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_KEY;

if (!supabaseUrl) throw new Error('PUBLIC_SUPABASE_URL environment variable is required');
if (!supabaseAnonKey) throw new Error('PUBLIC_SUPABASE_KEY environment variable is required');

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey); 