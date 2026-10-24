const {setGlobalOptions} = require("firebase-functions");
const {onCall, HttpsError} = require("firebase-functions/https");

setGlobalOptions({maxInstances: 10});

const PAYMENT_CONFIG = {
  Bike: {
    ratePerKm: 3.5,
    driverTargetPer11Km: 35,
  },
  Auto: {
    ratePerKm: 5,
    driverTargetPer11Km: 50,
  },
};

exports.calculateRidePayment = onCall((request) => {
  const data = request.data || {};

  const rideType = data.rideType;
  const distanceKm = Number(data.distanceKm);

  if (rideType !== "Bike" && rideType !== "Auto") {
    throw new HttpsError(
        "invalid-argument",
        "Invalid ride type.",
    );
  }

  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    throw new HttpsError(
        "invalid-argument",
        "Invalid distance.",
    );
  }

  const config = PAYMENT_CONFIG[rideType];

  const customerFare =
    Math.round(distanceKm * config.ratePerKm * 100) / 100;

  const driverRatePerKm =
    config.driverTargetPer11Km / 11;

  const driverAmount =
    Math.round(distanceKm * driverRatePerKm * 100) / 100;

  const gorideCommission =
    Math.max(
        0,
        Math.round((customerFare - driverAmount) * 100) / 100,
    );

  return {
    rideType,
    distanceKm,
    customerFare,
    driverAmount,
    gorideCommission,
  };
});
