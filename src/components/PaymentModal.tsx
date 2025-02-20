import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { PricingPlan } from '../types';
import { PAYMENT_PLANS } from '../config/plans';
import LoadingSpinner from './LoadingSpinner';
import { Check } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  user: User | null;
  onSubscribe: (plan: PricingPlan) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  isDarkMode,
  onClose,
  user,
  onSubscribe
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!user) {
      setError('Please sign in to subscribe');
      return;
    }

    setSelectedPlan(plan);
    setIsLoading(true);
    setError(null);

    try {
      await onSubscribe(plan);
    } catch (err) {
      console.error('Subscription error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to process subscription. Please try again.'
      );
      setSelectedPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setIsLoading(false);
      setSelectedPlan(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} />
      <div className={`relative rounded-lg shadow-xl max-w-4xl w-full p-6 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 disabled:opacity-50"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Upgrade Your Spiritual Journey</h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Unlock unlimited readings and premium features!
          </p>
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PAYMENT_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg p-6 transition-colors ${
                isDarkMode
                  ? 'bg-indigo-900/40 hover:bg-indigo-900/60'
                  : 'bg-indigo-50 hover:bg-indigo-100'
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">
                ${plan.price}
                <span className="text-base font-normal">/month</span>
              </div>
              <p className="mb-4 text-sm">{plan.description}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading || !user}
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800'
                    : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300'
                } text-white font-medium disabled:cursor-not-allowed`}
              >
                {isLoading && selectedPlan?.id === plan.id ? (
                  <LoadingSpinner />
                ) : (
                  `Choose ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          disabled={isLoading}
          className={`mt-6 py-2 px-4 rounded-lg w-full transition-colors ${
            isDarkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          } disabled:opacity-50`}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
