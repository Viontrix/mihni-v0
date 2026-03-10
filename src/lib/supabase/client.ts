import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create a mock client that returns appropriate errors when Supabase isn't configured
const createMockClient = (): SupabaseClient => {
  const notConfiguredError = { message: 'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.' };
  
  return {
    auth: {
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: notConfiguredError }),
      signUp: async () => ({ data: { user: null, session: null }, error: notConfiguredError }),
      signOut: async () => ({ error: notConfiguredError }),
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      setSession: async () => ({ data: { session: null, user: null }, error: notConfiguredError }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: null, error: notConfiguredError }),
      insert: () => Promise.resolve({ data: null, error: notConfiguredError }),
      update: () => Promise.resolve({ data: null, error: notConfiguredError }),
      delete: () => Promise.resolve({ data: null, error: notConfiguredError }),
      upsert: () => Promise.resolve({ data: null, error: notConfiguredError }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: notConfiguredError }),
        download: async () => ({ data: null, error: notConfiguredError }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as unknown as SupabaseClient;
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createMockClient();
