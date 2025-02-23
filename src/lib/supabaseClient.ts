import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { PRODUCTION_URL } from '../config/constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const siteUrl = import.meta.env.DEV ? 'http://localhost:5173' : PRODUCTION_URL;

// Move functions before they're used
export const checkHealth = async () => {
  try {
    // Change to a simple status check endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('Health check response:', { status: response.status, ok: response.ok });
    return { status: response.status, ok: response.ok };
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const checkProject = async () => {
  try {
    const { data, error } = await supabaseClient.from('user_profiles').select('*');
    if (error) throw error;
    console.log('Connected to project URL:', supabaseUrl);
    return data;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    throw error;
  }
};

// Then create the client and expose to window
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'mystic-balls-auth'
  },
  global: {
    headers: {
      'x-site-url': siteUrl,
      'apikey': supabaseAnonKey
    }
  }
});

// Add this line to expose supabase client to window for debugging
if (typeof window !== 'undefined') {
  (window as any).supabase = {
    ...supabaseClient,
    checkHealth,
    checkProject
  };
}

export const decrementFreeReadings = async (userId: string): Promise<void> => {
  // First get the current count
  const { data: profile } = await supabaseClient
    .from('user_profiles')
    .select('free_readings_remaining, readings_count')
    .eq('id', userId)
    .single();

  if (!profile) {
    throw new Error('Profile not found');
  }

  const freeReadingsRemaining = profile.free_readings_remaining ?? 5;

  if (freeReadingsRemaining <= 0) {
    throw new Error('No free readings remaining');
  }

  const { error } = await supabaseClient
    .from('user_profiles')
    .update({
      free_readings_remaining: freeReadingsRemaining - 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating readings:', error);
    throw error;
  }
};
