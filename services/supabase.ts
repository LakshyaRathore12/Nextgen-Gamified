
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, IS_SUPABASE_CONFIGURED } from '../config';

// In the public app, we rely 100% on the config.ts file.
// We do not check LocalStorage anymore because kids won't have your keys in their browser.

export const IS_CONFIGURED = IS_SUPABASE_CONFIGURED;

// Initialize the client
// If keys are missing, we provide a dummy client to prevent crashes before the user edits config.ts
const url = IS_CONFIGURED ? SUPABASE_URL : 'https://placeholder.supabase.co';
const key = IS_CONFIGURED ? SUPABASE_ANON_KEY : 'placeholder';

export const supabase = createClient(url, key);

// No reconnection logic needed for public app - keys are static.
export const reconnectSupabase = () => {
  console.log("App is in Public Mode. Keys are static in config.ts");
};
