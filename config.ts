
// ------------------------------------------------------------------
// PUBLIC APP CONFIGURATION
// ------------------------------------------------------------------

// instructions:
// Since you are the developer, you must PASTE your Supabase keys here.
// These keys are safe to be public (they are "Anon" keys).

export const SUPABASE_URL: string = 'YOUR_SUPABASE_URL_HERE';
export const SUPABASE_ANON_KEY: string = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Check if keys are actually set
export const IS_SUPABASE_CONFIGURED = 
  SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' && 
  !SUPABASE_URL.includes('placeholder');
