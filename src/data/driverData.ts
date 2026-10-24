import AsyncStorage from "@react-native-async-storage/async-storage";

export const driverData = {
  name: "Raj Kumar",
  phone: "9876543210",
  vehicle: "Swift Dzire",
  vehicleNo: "AS01AB1234",
  rating: "4.8 ⭐",
};

/*
 * DRIVER ONLINE / OFFLINE
 *
 * The Driver screen uses this same storage key.
 * The actual Online/Offline UI state is handled
 * inside src/app/driver/index.tsx.
 */
export let driverOnline = false;

const DRIVER_ONLINE_KEY = "goride_driver_online";

export async function setDriverOnline(
  status: boolean
) {
  driverOnline = status;

  try {
    await AsyncStorage.setItem(
      DRIVER_ONLINE_KEY,
      String(status)
    );
  } catch (error) {
    console.log(
      "DRIVER ONLINE SAVE ERROR:",
      error
    );
  }
}

export async function loadDriverOnline() {
  try {
    const saved = await AsyncStorage.getItem(
      DRIVER_ONLINE_KEY
    );

    if (saved === "true") {
      driverOnline = true;
    } else {
      driverOnline = false;
    }

    return driverOnline;
  } catch (error) {
    console.log(
      "DRIVER ONLINE LOAD ERROR:",
      error
    );

    driverOnline = false;
    return false;
  }
}

/*
 * LOAD REGISTERED DRIVER INFORMATION
 */
export async function loadRegisteredDriver() {
  try {
    const saved = await AsyncStorage.getItem(
      "driverRegistration"
    );

    if (!saved) {
      return;
    }

    const registeredDriver = JSON.parse(saved);

    if (registeredDriver?.name) {
      driverData.name = registeredDriver.name;
    }

    if (registeredDriver?.phone) {
      driverData.phone = registeredDriver.phone;
    }

    if (registeredDriver?.vehicle) {
      driverData.vehicle = registeredDriver.vehicle;
    }

    if (registeredDriver?.vehicleNo) {
      driverData.vehicleNo =
        registeredDriver.vehicleNo;
    }

    if (registeredDriver?.rating) {
      driverData.rating =
        registeredDriver.rating;
    }
  } catch (error) {
    console.log(
      "DRIVER DATA LOAD ERROR:",
      error
    );
  }
}
