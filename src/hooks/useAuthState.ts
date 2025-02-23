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
      try {
        const { data, error } = await supabaseClient
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();  // Get single profile

        if (error) throw error;
        return data ? [data] : null;
      } catch (error) {
        console.error('Error fetching profiles:', error);
        return null;
      }
    };

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!mounted) return;
        
        if (session) {
          console.log('Session found, fetching profiles...');
          const profiles = await fetchProfiles(session.user.id);
          console.log('Profiles fetched:', profiles);
          setState({
            user: session.user,
            loading: false,
            profiles: profiles,
            error: null
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
        console.error('Auth initialization error:', error);
        if (!mounted) return;
        setState({
          user: null,
          loading: false,
          profiles: null,
          error: error as Error
        });
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        
        if (session) {
          const profiles = await fetchProfiles(session.user.id);
          setState({
            user: session.user,
            loading: false,
            profiles: profiles,
            error: null
          });
        } else {
          setState({
            user: null,
            loading: false,
            profiles: null,
            error: null
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