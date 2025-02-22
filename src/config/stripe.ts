export const STRIPE_CONFIG = {
  publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  priceBasic: import.meta.env.VITE_STRIPE_PRICE_BASIC || '',
  pricePremium: import.meta.env.VITE_STRIPE_PRICE_PREMIUM || ''
};