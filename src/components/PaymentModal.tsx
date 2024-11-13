import React from 'react';
import { PaymentPlan } from '../types';
import { PAYMENT_PLANS } from '../config/plans';
import { Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onSubscribe: (plan: PaymentPlan) => void;
  remainingReadings: number;
}

const PaymentModal: React.FC<Props> = ({ isOpen, onClose, isDarkMode, onSubscribe, remainingReadings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${
        isDarkMode
          ? 'bg-indigo-900 text-white'
          : 'bg-white text-gray-800'
      } rounded-xl p-6 max-w-4xl w-full shadow-xl overflow-y-auto max-h-[90vh]`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Upgrade Your Spiritual Journey</h2>
          <p className={`${isDarkMode ? 'text-indigo-200' : 'text-gray-600'}`}>
            You have {remainingReadings} free readings remaining.
            Unlock unlimited readings and premium features!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PAYMENT_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`${
                isDarkMode
                  ? 'bg-indigo-800/50 hover:bg-indigo-700/50'
                  : 'bg-white hover:bg-indigo-50'
              } rounded-xl p-6 shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">
                ${plan.price}
                <span className={`text-sm ${
                  isDarkMode ? 'text-indigo-200' : 'text-gray-600'
                }`}>/month</span>
              </div>
              <p className={`mb-4 ${
                isDarkMode ? 'text-indigo-200' : 'text-gray-600'
              }`}>
                {plan.description}
              </p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className={`w-5 h-5 mr-2 ${
                      isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSubscribe(plan)}
                className={`w-full py-2 px-4 rounded-lg ${
                  isDarkMode
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-500 hover:bg-indigo-600'
                } text-white transition-colors`}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className={`mt-6 py-2 px-4 rounded-lg ${
            isDarkMode
              ? 'bg-gray-800 hover:bg-gray-700'
              : 'bg-gray-200 hover:bg-gray-300'
          } transition-colors w-full`}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;