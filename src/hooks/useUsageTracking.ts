import { useState, useEffect } from 'react';
import { UserUsage } from '../types';
import { getUserProfile, incrementReadingCount, updatePremiumStatus } from '../services/firebase';

const FREE_READINGS_LIMIT = 10;

export const useUsageTracking = (userId: string | null) => {
  const [usage, setUsage] = useState<UserUsage>({
    readingsCount: 0,
    isPremium: false,
  });

  useEffect(() => {
    const loadUsage = async () => {
      if (!userId) {
        setUsage({ readingsCount: 0, isPremium: false });
        return;
      }
      
      const profile = await getUserProfile(userId);
      if (profile) {
        setUsage({
          readingsCount: profile.readingsCount || 0,
          isPremium: profile.isPremium || false,
          lastReadingDate: profile.lastReadingDate,
        });
      }
    };

    loadUsage();
  }, [userId]);

  const incrementUsage = async () => {
    if (!userId) return;

    await incrementReadingCount(userId);
    setUsage(prev => ({
      ...prev,
      readingsCount: prev.readingsCount + 1,
      lastReadingDate: new Date().toISOString(),
    }));
  };

  const hasReachedLimit = () => {
    if (!userId) return true;
    return !usage.isPremium && usage.readingsCount >= FREE_READINGS_LIMIT;
  };

  const remainingReadings = () => {
    if (!userId) return 0;
    if (usage.isPremium) return Infinity;
    return Math.max(0, FREE_READINGS_LIMIT - usage.readingsCount);
  };

  const setPremiumStatus = async (isPremium: boolean) => {
    if (!userId) return;

    await updatePremiumStatus(userId, isPremium);
    setUsage(prev => ({
      ...prev,
      isPremium,
    }));
  };

  return {
    usage,
    incrementUsage,
    hasReachedLimit,
    remainingReadings,
    setPremiumStatus,
  };
};