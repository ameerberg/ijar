// Platform pricing configuration
export const PLATFORM_FEE_PER_DAY = 20; // ₪20 per day

/**
 * Calculate the total price customer pays
 * @param hostDailyRate - The amount host wants to receive per day
 * @param days - Number of rental days
 * @returns Object with breakdown
 */
export function calculatePrice(hostDailyRate: number, days: number = 1) {
  const hostTotal = hostDailyRate * days;
  const platformFee = PLATFORM_FEE_PER_DAY * days;
  const customerTotal = hostTotal + platformFee;

  return {
    // What host receives
    hostDailyRate,
    hostTotal,

    // Platform fee
    platformFeePerDay: PLATFORM_FEE_PER_DAY,
    platformFeeTotal: platformFee,

    // What customer pays
    customerDailyRate: hostDailyRate + PLATFORM_FEE_PER_DAY,
    customerTotal,

    // Number of days
    days,
  };
}

/**
 * Format a delightful price display for customers
 * @param hostDailyRate - Host's daily rate
 * @returns Formatted string
 */
export function formatCustomerPrice(hostDailyRate: number): string {
  const total = hostDailyRate + PLATFORM_FEE_PER_DAY;
  return `₪${total}`;
}

/**
 * Get price breakdown for display
 * @param hostDailyRate - Host's daily rate
 * @param days - Number of days
 */
export function getPriceBreakdown(hostDailyRate: number, days: number = 3) {
  const pricing = calculatePrice(hostDailyRate, days);

  return {
    display: `₪${pricing.customerDailyRate}`,
    subtitle: `لـ ${days} أيام`,
    total: `₪${pricing.customerTotal}`,
    breakdown: [
      { label: 'سعر التأجير', amount: pricing.hostTotal },
      { label: 'رسوم المنصة', amount: pricing.platformFeeTotal },
    ],
  };
}