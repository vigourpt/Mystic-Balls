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
  const readingsCount = profile.readings_count ?? 0;

  if (freeReadingsRemaining <= 0) {
    throw new Error('No free readings remaining');
  }

  const { error } = await supabaseClient
    .from('user_profiles')
    .update({
      free_readings_remaining: freeReadingsRemaining - 1,
      readings_count: readingsCount + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating readings:', error);
    throw error;
  }
};
