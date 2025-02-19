import { useState, useEffect } from 'react';
import { UserUsage } from '../types';
import { getUserProfile } from '../services/supabase';

const defaultUsage: UserUsage = {
  readingsCount: 0,
  isPremium: false,
  readingsRemaining: 5,
  lastReadingDate: null
};

export const useUsageTracking = (userId: string | null) => {
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      if (!userId) {
        setUsage(defaultUsage);
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(userId);
        if (profile) {
          setUsage({
            readingsCount: profile.readings_count ?? 0,
            isPremium: profile.is_premium ?? false,
            lastReadingDate: profile.last_reading_date ? new Date(profile.last_reading_date) : null,
            readingsRemaining: profile.is_premium ? Infinity : (profile.free_readings_remaining ?? 5)
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch usage'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [userId]);

  return { usage, loading, error };
};