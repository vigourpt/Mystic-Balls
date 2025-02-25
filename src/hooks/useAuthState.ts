import { useState, useEffect } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabaseClient } from '../lib/supabaseClient';
import { UserProfile } from '../services/supabase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  profiles: UserProfile[] | null;
  error: Error | null;
}

export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,  // Start with loading true
    profiles: null,
    error: null
  });

  useEffect(() => {
    let mounted = true;  // Add mounted check

    const fetchProfiles = async (userId: string) => {
      if (!mounted) return null;
      const MAX_RETRIES = 3;
      let attempts = 0;

      while (attempts < MAX_RETRIES) {
        try {
          const { data, error } = await supabaseClient
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();  // Get single profile

          if (error) throw error;
          return data ? [data] : null;
        } catch (error) {
          attempts++;
          console.error(`Error fetching profiles (attempt ${attempts}/${MAX_RETRIES}):`, {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : null,
          });

          if (attempts >= MAX_RETRIES) {
            console.error('Max retries reached. Unable to fetch profiles.');
            return null;
          }
        }
      }
    };

    /**
     * Initializes the authentication state by checking for an existing session.
     * If a session is found, it fetches the user's profile and updates the state.
     * Handles errors gracefully and ensures the component is still mounted before updating state.
     */
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication state...');
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!mounted) return;

        // Check if a valid session exists
        if (session) {
          console.log('Valid session found:', session);
          const profiles = await fetchProfiles(session.user.id);
          console.log('Profiles successfully fetched:', profiles);
          setState({
            user: session.user,
            loading: false,
            profiles: profiles,
            error: null,
          });
        } else if (session && !session.user) {
          console.warn('Session exists but user is missing:', session);
          setState({
            user: null,
            loading: false,
            profiles: null,
            error: new Error('Session is invalid: user data is missing'),
          });
        } else {
          console.log('No session found');
          setState({
            user: null,
            loading: false,
            profiles: null,
            error: null
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : null,
          context: 'initializeAuth',
        });
        if (!mounted) return;
        setState({
          user: null,
          loading: false,
          profiles: null,
          error: error instanceof Error ? error : new Error('Unknown error occurred during auth initialization'),
        });
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        try {
          if (session && session.user) {
            console.log('Auth state changed: valid session detected');
            const profiles = await fetchProfiles(session.user.id);
            setState({
              user: session.user,
              loading: false,
              profiles: profiles,
              error: null,
            });
          } else {
            console.warn('Auth state changed: no valid session');
            setState({
              user: null,
              loading: false,
              profiles: null,
              error: null,
            });
          }
        } catch (error) {
          console.error('Error handling auth state change:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : null,
          });
          setState({
            user: null,
            loading: false,
            profiles: null,
            error: error instanceof Error ? error : new Error('Unknown error occurred during auth state change'),
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
};

export default useAuthState;