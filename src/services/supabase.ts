import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { PRODUCTION_URL } from '../config/constants';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Get the site URL based on environment
const siteUrl = import.meta.env.DEV ? 'http://localhost:5173' : PRODUCTION_URL;

// Create Supabase client with minimal config
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-site-url': siteUrl
    }
  }
});

type Tables = Database['public']['Tables'];
export type UserProfile = Tables['user_profiles']['Row'];

export const signInWithGoogle = async () => {
  try {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: siteUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
  } catch (error: unknown) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        emailRedirectTo: siteUrl,
        data: {
          email: email.trim(),
          email_confirmed: false
        }
      }
    });

    if (error) throw error;

    // Check if user already exists
    if (data?.user?.identities?.length === 0) {
      throw new Error('This email is already registered. Please sign in instead.');
    }

    // Check if email confirmation is required
    if (!data.session) {
      // Return special flag to indicate email confirmation needed
      return { ...data, requiresEmailConfirmation: true };
    }

    return data;
  } catch (error: unknown) {
    console.error('Email sign up error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (error) throw error;
    return data;
  } catch (error: unknown) {
    console.error('Email sign in error:', error);
    let errorMessage = 'Failed to sign in with email';
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

// User Profile Management
export const createUserProfile = async (userId: string, email: string, displayName?: string): Promise<UserProfile | null> => {
  const profile: Tables['user_profiles']['Insert'] = {
    id: userId,
    email,
    display_name: displayName || null,
    readings_count: 0,
    is_premium: false,
    free_readings_remaining: 5,
    last_reading_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .insert([profile])
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select()
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
    }

    if (existingProfile) {
      return existingProfile;
    }

    // If no profile exists, create one with retry logic
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    try {
      const newProfile = await createUserProfile(
        userId,
        user.user.email || '',
        user.user.email?.split('@')[0]
      );
      return newProfile;
    } catch (error) {
      // If creation fails, try fetching one more time
      const { data: retryProfile } = await supabase
        .from('user_profiles')
        .select()
        .eq('id', userId)
        .single();
      
      return retryProfile;
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

// Fix the increment_reading_count RPC call
export const incrementReadingCount = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_reading_count', {
    user_id: userId  // Changed from p_id to user_id to match the function parameter
  });

  if (error) {
    console.error('Error incrementing reading count:', error);
    throw error;
  }
};

// Fix the decrement free readings function
export const decrementFreeReadings = async (userId: string): Promise<void> => {
  // First get the current count
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('free_readings_remaining')
    .eq('id', userId)
    .single();

  if (!profile || !profile.free_readings_remaining || profile.free_readings_remaining <= 0) {
    throw new Error('No free readings remaining');
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({
      free_readings_remaining: profile.free_readings_remaining - 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error decrementing free readings:', error);
    throw error;
  }
};

export const clearAllAuthState = async () => {
  try {
    // Clear Supabase session
    await supabase.auth.signOut();
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Force reload the page
    window.location.href = '/';
  } catch (error) {
    console.error('Error clearing auth state:', error);
    throw error;
  }
};
