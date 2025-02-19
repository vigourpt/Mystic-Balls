import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

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
