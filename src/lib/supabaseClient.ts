import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const checkProject = async () => {
  const { data } = await supabaseClient.from('user_profiles').select('*');
  console.log('Connected to project URL:', supabaseUrl);
  console.log('Data:', data);
};
