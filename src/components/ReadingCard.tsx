import React from 'react';
import { ReadingType } from '../types';
import PremiumBadge from './PremiumBadge';
import { useAuthState } from '../hooks/useAuthState';

interface Props {
  reading: ReadingType;
  onClick: () => void;
  isDarkMode: boolean;
  isSelected?: boolean;
}

const ReadingCard: React.FC<Props> = ({ reading, onClick, isDarkMode, isSelected }) => {
  const { profiles } = useAuthState();
  const Icon = reading.icon;
  
  const isAccessible = profiles?.[0]?.is_premium || 
    (profiles?.[0]?.free_readings_remaining ?? 0) > 0;

  return (
    <button
      onClick={isAccessible ? onClick : undefined}
      className={`relative p-4 rounded-xl transition-all ${
        isDarkMode 
          ? 'bg-indigo-900/40 hover:bg-indigo-900/60' 
          : 'bg-white hover:bg-gray-50'
      } ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}
      ${isSelected ? 'ring-2 ring-fuchsia-500' : ''}`}
    >
      {reading.isPremiumOnly && (
        <PremiumBadge className="absolute top-2 right-2" />
      )}
      
      <Icon className={`w-8 h-8 mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
      <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {reading.title}
      </h3>
      <p className={`text-sm ${isDarkMode ? 'text-indigo-200' : 'text-gray-600'}`}>
        {reading.description}
      </p>
      
      {!isAccessible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
          <span className="text-white text-sm font-medium">Premium Only</span>
        </div>
      )}
    </button>
  );
};

export default ReadingCard;