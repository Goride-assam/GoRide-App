export const PAYMENT_CONFIG = {
  Bike: {
    ratePerKm: 3.5,
    driverTargetPer11Km: 35,
  },

  Auto: {
    ratePerKm: 5,
    driverTargetPer11Km: 50,
  },
} as const;

export type PaymentRideType =
  keyof typeof PAYMENT_CONFIG;

/*
 * Agreed GoRide payment model:
 *
 * Bike:
 *   ₹3.50 / km
 *   11 km = ₹38.50
 *   Driver target = ₹35
 *
 * Auto:
 *   ₹5 / km
 *   11 km = ₹55
 *   Driver target = ₹50
 *
 * Razorpay + GoRide commission are included
 * inside the customer fare.
 *
 * Actual Razorpay charges can be configured
 * later when live payment is connected.
 */

export function getPaymentBreakdown(
  rideType: PaymentRideType,
  distanceKm: number
) {
  const config =
    PAYMENT_CONFIG[rideType];

  const distance =
    Math.max(0, distanceKm);

  const customerFare =
    Math.round(
      distance * config.ratePerKm * 100
    ) / 100;

  /*
   * Driver payout is calculated using
   * the agreed 11 km relationship.
   *
   * Bike:
   * ₹38.50 customer → ₹35 driver
   *
   * Auto:
   * ₹55 customer → ₹50 driver
   */
  const driverRatePerKm =
    config.driverTargetPer11Km / 11;

  const driverAmount =
    Math.round(
      distance * driverRatePerKm * 100
    ) / 100;

  const totalGoRideCut =
    Math.max(
      0,
      Math.round(
        (customerFare - driverAmount) * 100
      ) / 100
    );

  return {
    customerFare,
    driverAmount,
    gorideCommission: totalGoRideCut,
    gorideTotalCommission: totalGoRideCut,
  };
}
