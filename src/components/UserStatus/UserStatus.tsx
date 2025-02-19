import React from 'react';
import { useUser } from '../../hooks';
import { useAuthState } from '../../hooks/useAuthState';

export const UserStatus: React.FC = () => {
  const { user: authUser } = useAuthState();
  const { user, loading } = useUser();
  if (loading || !authUser || !user) return null;

  return (
    <div className="absolute top-4 right-4 text-right">
      <div className="text-white/90">{authUser.email}</div>
      {!user.is_premium && (
        <div className="text-pink-300 text-sm mt-1">
          {user.free_readings_remaining ?? 5} free readings remaining
        </div>
      )}
    </div>
  );
};