import React from 'react';
import { X, Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthState } from '../hooks/useAuthState'; // Add this import

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuthState(); // Add this line
  
  if (!isOpen) return null;

  const handlePlanSelection = async (plan: 'basic' | 'premium') => {
    try {
      console.log('Starting checkout for plan:', plan);
      console.log('Environment variables loaded:', {
        stripeKey: !!import.meta.env.VITE_STRIPE_PUBLIC_KEY,
      });
      
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customer-email': user?.email // Add user email if available
        },
        body: JSON.stringify({ plan })
      });

      const responseData = await response.json();
      console.log('Checkout response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create checkout session');
      }

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: responseData.sessionId });
      }
    } catch (error) {
      console.error('Error details:', error); // Enhanced error logging
    }
};

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
            <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
            <div className="text-3xl font-bold text-white mb-4">
              $9.99<span className="text-lg font-normal text-indigo-200">/month</span>
            </div>
            <p className="text-indigo-200 mb-6">Perfect for occasional guidance</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-indigo-200">
                <Check className="w-5 h-5 mr-2 text-fuchsia-400" />
                50 readings per month
              </li>
              <li className="flex items-center text-indigo-200">
                <Check className="w-5 h-5 mr-2 text-fuchsia-400" />
                All reading types
              </li>
              <li className="flex items-center text-indigo-200">
                <Check className="w-5 h-5 mr-2 text-fuchsia-400" />
                Basic support
              </li>
            </ul>
            <button
              onClick={() => handlePlanSelection('basic')}
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Choose Basic
            </button>
          </div>

          <div className="bg-indigo-900/50 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <div className="text-3xl font-bold text-white mb-4">
              $19.99<span className="text-lg font-normal text-indigo-200">/month</span>
            </div>
            <p className="text-indigo-200 mb-6">For those seeking regular insights</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-indigo-200">
                <Check className="w-5 h-5 mr-2 text-fuchsia-400" />
                Unlimited readings
              </li>
              <li className="flex items-center text-indigo-200">
                <Check className="w-5 h-5 mr-2 text-fuchsia-400" />
                Priority support
              </li>
              <li className="flex items-center text-indigo-200">
                <Check className="w-5 h-5 mr-2 text-fuchsia-400" />
                Detailed interpretations
              </li>
              <li className="flex items-center text-indigo-200">
                <Check className="w-5 h-5 mr-2 text-fuchsia-400" />
                Personal reading history
              </li>
            </ul>
            <button
              onClick={() => handlePlanSelection('premium')}
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Choose Premium
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 text-indigo-200 hover:text-white transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default UpgradeModal;