import { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/supabaseClient';
import { UserProfile } from '../services/supabase';

export const useDataFetching = (userId: string | null) => {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setData(data as UserProfile);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, loading, error };
};