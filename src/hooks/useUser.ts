import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { getUserProfile } from '../services/supabase';
import type { UserProfile } from '../services/supabase';

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { user: authUser } = useAuthState();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        if (authUser?.id) {
          const profile = await getUserProfile(authUser.id);
          setUser(profile);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser]);

  return { user, loading };
};