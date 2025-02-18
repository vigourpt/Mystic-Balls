import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { getUserProfile } from '../services/supabase';
import type { UserProfile } from '../services/supabase';

export const useUser = () => {
  const { user: authUser } = useAuthState();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authUser?.id) {
        const profile = await getUserProfile(authUser.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    };

    fetchUserProfile();
  }, [authUser]);

  return { user };
};