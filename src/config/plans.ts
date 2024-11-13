export const PAYMENT_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    description: 'Perfect for occasional guidance',
    features: [
      '30 readings per month',
      'All reading types',
      'Basic support'
    ],
    readingsPerMonth: 30
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    description: 'For those seeking regular insights',
    features: [
      'Unlimited readings',
      'Priority support',
      'Detailed interpretations',
      'Personal reading history'
    ],
    readingsPerMonth: Infinity
  }
];