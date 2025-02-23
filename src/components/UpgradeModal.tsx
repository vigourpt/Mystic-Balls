import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useAuthState } from '../hooks/useAuthState';
import { formatPrice } from '../utils/currency';
import { PricingPlan } from '../types';
import { PAYMENT_PLANS } from '../config/plans';  // Import payment plans

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: PricingPlan) => Promise<void>;
}

const UpgradeModal: React.FC<Props> = ({ isOpen, onClose, onSubscribe }) => {
  const { user } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const handlePlanSelection = async (plan: PricingPlan) => {
    if (isLoading || !user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await onSubscribe(plan);
    } catch (error) {
      console.error('Error details:', error);
      setError(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  const basicPlan = PAYMENT_PLANS.find(plan => plan.id === 'basic')!;
  const premiumPlan = PAYMENT_PLANS.find(plan => plan.id === 'premium')!;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-indigo-950 rounded-xl max-w-4xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Upgrade Your Spiritual Journey
        </h2>
        <p className="text-indigo-200 text-center mb-8">
          Unlock unlimited readings and premium features!
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-indigo-900/50 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-2">{basicPlan.name}</h3>
            <div className="text-3xl font-bold text-white mb-4">
              {formatPrice(basicPlan.price)}<span className="text-lg font-normal text-indigo-200">/month</span>
            </div>
            <p className="text-indigo-200 mb-6">{basicPlan.description}</p>
            <ul className="space-y-4 mb-8">
              {basicPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-indigo-200">
                  <Check className="w-5 h-5 mr-2 text-fuchsia-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanSelection(basicPlan)}
              disabled={isLoading}
              className={`w-full ${
                isLoading 
                  ? 'bg-fuchsia-400 cursor-not-allowed' 
                  : 'bg-fuchsia-600 hover:bg-fuchsia-500'
              } text-white font-semibold py-2 px-4 rounded-lg transition-colors`}
            >
              {isLoading ? 'Processing...' : `Choose ${basicPlan.name}`}
            </button>
          </div>

          <div className="bg-indigo-900/50 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-2">{premiumPlan.name}</h3>
            <div className="text-3xl font-bold text-white mb-4">
              {formatPrice(premiumPlan.price)}<span className="text-lg font-normal text-indigo-200">/month</span>
            </div>
            <p className="text-indigo-200 mb-6">{premiumPlan.description}</p>
            <ul className="space-y-4 mb-8">
              {premiumPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-indigo-200">
                  <Check className="w-5 h-5 mr-2 text-fuchsia-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanSelection(premiumPlan)}
              disabled={isLoading}
              className={`w-full ${
                isLoading 
                  ? 'bg-fuchsia-400 cursor-not-allowed' 
                  : 'bg-fuchsia-600 hover:bg-fuchsia-500'
              } text-white font-semibold py-2 px-4 rounded-lg transition-colors`}
            >
              {isLoading ? 'Processing...' : `Choose ${premiumPlan.name}`}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-center">
            {error}
          </div>
        )}

        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full mt-6 text-indigo-200 hover:text-white transition-colors disabled:opacity-50"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}

export default UpgradeModal;