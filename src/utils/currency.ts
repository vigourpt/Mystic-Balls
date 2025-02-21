export const getCurrencySymbol = (locale: string = navigator.language): string => {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'GBP', // Default to GBP as that's what Stripe is using
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(0).replace(/[0-9]/g, '').trim();
  } catch {
    return '£'; // Fallback to GBP symbol
  }
};

export const formatPrice = (amount: number, locale: string = navigator.language): string => {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'GBP',
    });
    return formatter.format(amount);
  } catch {
    return `£${amount.toFixed(2)}`; // Fallback format
  }
};