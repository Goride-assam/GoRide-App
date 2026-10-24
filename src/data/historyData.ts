import AsyncStorage from "@react-native-async-storage/async-storage";

export let rideHistory: any[] = [];

export async function saveRide(ride: any) {
  rideHistory.unshift(ride);

  await AsyncStorage.setItem(
    "rideHistory",
    JSON.stringify(rideHistory)
  );
}

export async function loadHistory() {
  const data = await AsyncStorage.getItem(
    "rideHistory"
  );

  if (data) {
    rideHistory = JSON.parse(data);
    return true;
  }

  return false;
}

export async function updateHistoryStatus(
  id: string,
  status: string
) {
  rideHistory = rideHistory.map((ride) => {
    if (
      ride.id === id ||
      ride.rideId === id
    ) {
      return {
        ...ride,
        status,
      };
    }

    return ride;
  });

  await AsyncStorage.setItem(
    "rideHistory",
    JSON.stringify(rideHistory)
  );
}
