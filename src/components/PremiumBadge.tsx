import React from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  className?: string;
}

const PremiumBadge: React.FC<Props> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-medium px-2 py-1 rounded-full ${className}`}>
      <Sparkles size={12} />
      <span>Premium</span>
    </div>
  );
};

export default PremiumBadge;