import React from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../services/supabase';
import { Moon, Sun, RefreshCw, LogIn, CreditCard, Sparkles, History } from 'lucide-react';
import { FREE_READINGS_LIMIT, ANONYMOUS_FREE_READINGS_LIMIT, ADMIN_EMAIL } from '../config/constants';

interface HeaderProps {
  user: User | null;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  onSignOut: () => Promise<{ success: boolean }>;
  userProfile?: UserProfile;
  onLogin?: () => void;
  onManageSubscription?: () => void;
  onSubscribe?: () => void;
  onViewReadingHistory?: () => void;
}

// Function to reset free readings count in localStorage
const resetFreeReadings = () => {
  localStorage.removeItem('freeReadingsUsed');
  // Force a page reload to update the UI
  window.location.reload();
};

// Check if user is admin
const isAdmin = (user: User | null): boolean => {
  return !!user && user.email === ADMIN_EMAIL;
};

const Header: React.FC<HeaderProps> = ({
  user,
  isDarkMode,
  onDarkModeToggle,
  onSignOut,
  userProfile,
  onLogin,
  onManageSubscription,
  onSubscribe,
  onViewReadingHistory
}) => {
  return (
    <header className={`${isDarkMode ? 'bg-gray-800/20' : 'bg-white/10'} shadow-sm`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold text-white relative group">
            <span className="absolute inset-0 -left-8 -right-8 bg-fuchsia-500/20 blur-xl rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute inset-0 -left-8 -right-8 bg-fuchsia-500/20 blur-lg rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"></span>
            <span className="absolute inset-0 -left-8 -right-8 bg-fuchsia-500/20 blur-md rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative glow-text">Mystic Balls</span>
          </h1>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={onDarkModeToggle}
              className="p-2 rounded-lg bg-indigo-900/40 hover:bg-indigo-900/60 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </button>

            <div className="flex flex-col items-end space-y-1">
              {user ? (
                <>
                  <span className="text-sm text-white">
                    {user.email} {isAdmin(user) && <span className="ml-1 px-1 bg-fuchsia-700 rounded text-xs">Admin</span>}
                  </span>
                      {userProfile && (
                    <span className="text-sm text-fuchsia-300">
                      {userProfile.is_premium ? 
                        userProfile.plan_type === 'premium' ?
                          'Premium Member (Unlimited readings)' :
                          userProfile.plan_type === 'basic' ?
                            'Basic Member (50 readings per month)' :
                            // For existing users who don't have plan_type set yet
                            'Premium Member (Unlimited readings)' : 
                        `${userProfile.readings_count >= 0 ? Math.max(0, FREE_READINGS_LIMIT - userProfile.readings_count) : FREE_READINGS_LIMIT} free readings remaining`
                      }
                    </span>
                  )}
                  <div className="flex space-x-3">
                    {userProfile?.is_premium && (
                      <>
                        {onManageSubscription && (
                          <button
                            onClick={onManageSubscription}
                            className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
                            title="Manage your subscription"
                          >
                            <CreditCard className="w-4 h-4 mr-1" />
                            Manage Subscription
                          </button>
                        )}
                        
                        {onViewReadingHistory && (
                          <button
                            onClick={onViewReadingHistory}
                            className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
                            title="View your reading history"
                          >
                            <History className="w-4 h-4 mr-1" />
                            Reading History
                          </button>
                        )}
                      </>
                    )}
                    
                    {/* Subscribe button for authenticated users who don't have premium */}
                    {!userProfile?.is_premium && onSubscribe && (
                      <button
                        onClick={onSubscribe}
                        className="flex items-center text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-md transition-colors"
                        title="Upgrade to premium"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Upgrade
                      </button>
                    )}
                    
                    <button
                      onClick={onSignOut}
                      className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      Sign Out
                    </button>
                    
                    {/* Admin-only reset button */}
                    {isAdmin(user) && (
                      <button
                        onClick={resetFreeReadings}
                        className="flex items-center text-xs text-gray-300 hover:text-white transition-colors"
                        title="Admin: Reset free readings counter"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reset Counter
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-end space-y-1">
                  {/* Get free readings used from localStorage */}
                  {(() => {
                    const storedReadings = localStorage.getItem('freeReadingsUsed');
                    const freeReadingsUsed = storedReadings ? parseInt(storedReadings, 10) : 0;
                    const remainingReadings = Math.max(0, ANONYMOUS_FREE_READINGS_LIMIT - freeReadingsUsed);
                    
                    return (
                      <span className="text-sm text-fuchsia-300">
                        {remainingReadings} free {remainingReadings === 1 ? 'reading' : 'readings'} remaining
                        {remainingReadings === 0 && 
                          <span className="block text-xs mt-1">
                            Create an account to get 3 more free readings!
                          </span>
                        }
                      </span>
                    );
                  })()}
                  
                  <div className="flex space-x-3">
                    {/* Login button for non-authenticated users */}
                    <button
                      onClick={onLogin}
                      className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      Sign In
                    </button>
                    
                    {/* Subscribe button for non-authenticated users */}
                    {onSubscribe && (
                      <button
                        onClick={onSubscribe}
                        className="flex items-center text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-md transition-colors"
                        title="Get premium access"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Subscribe
                      </button>
                    )}
                    
                    {/* Only show Reset Counter for admin */}
                    {isAdmin(user) && (
                      <button
                        onClick={resetFreeReadings}
                        className="flex items-center text-xs text-gray-300 hover:text-white transition-colors"
                        title="Admin: Reset free readings counter"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reset Counter (Admin)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
