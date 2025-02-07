import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, createUserProfile } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    // Check for existing session
    const checkSession = async () => {
      try {
        // First check if we have an access token in the URL (OAuth redirect)
        const hasAccessToken = window.location.hash.includes('access_token=') || 
                             window.location.hash.includes('id_token=');
        
        if (hasAccessToken) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          
          if (mounted && session?.user) {
            // Create user profile after OAuth sign in
            await createUserProfile(
              session.user.id,
              session.user.email ?? '',
              session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? null
            );
            setUser(session.user);
            setLoading(false);
            // Clean up URL after successful OAuth
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          // Normal session check
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (mounted) {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to check session');
          setLoading(false);
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    useEffect(() => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (event === 'SIGNED_IN') {
            setUser(session?.user ?? null);
            setLoading(false);
            
            // Create profile if needed for OAuth users
            if (session?.user && session.user.app_metadata.provider !== 'email') {
              try {
                await createUserProfile(
                  session.user.id,
                  session.user.email ?? '',
                  session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? null
                );
              } catch (err) {
                console.error('Error creating profile for OAuth user:', err);
              }
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setLoading(false);
          } else if (event === 'USER_UPDATED') {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }, []);

    return () => {
      mounted = false;
    };
  }, []);

  const signUpWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          email_confirmed: false
        }
      }
    });
    
    if (error) throw error;
    
    return {
      user: data.user,
      requiresEmailConfirmation: data.session === null
    };
  };

  const signIn = async (email?: string, password?: string) => {
    setLoading(true);
    setError(null);
    setConfirmEmail(false);
    
    try {
      if (email && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });
        if (error) throw error;
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setConfirmEmail(false);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            email_confirmed: false
          }
        }
      });

      if (error) throw error;

      // Check if user already exists
      if (data?.user?.identities?.length === 0) {
        throw new Error('Email already registered');
      }

      // If email confirmation is required
      if (!data.session) {
        setConfirmEmail(true);
        setLoading(false);
        return;
      }

      // If email confirmation is not required, create profile
      if (data.user) {
        try {
          await createUserProfile(
            data.user.id,
            data.user.email ?? '',
            data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null
          );
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't throw here, we still want to set the user
        }
      }

      setUser(data.user);
      setLoading(false);
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      setLoading(false);
      throw err;
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    setConfirmEmail(false);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all auth-related storage
      localStorage.removeItem('mysticballs-auth-token');
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    confirmEmail,
    signIn,
    signUp,
    signOut
  };
};

export default useAuth;