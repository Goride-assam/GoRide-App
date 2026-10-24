import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Unsubscribe,
} from "firebase/firestore";

import { db } from "../config/firebase";

export let driverLocation = {
  latitude: 26.1445,
  longitude: 91.7362,
};

const LOCAL_KEY = "driverLocation";
const FIREBASE_DOC = "driverLiveLocation";

let unsubscribeDriverLocation: Unsubscribe | null = null;

export async function saveDriverLocation(
  latitude: number,
  longitude: number
) {
  driverLocation = {
    latitude,
    longitude,
  };

  try {
    await AsyncStorage.setItem(
      LOCAL_KEY,
      JSON.stringify(driverLocation)
    );
  } catch (error) {
    console.log(
      "LOCAL LOCATION SAVE ERROR:",
      error
    );
  }

  try {
    await setDoc(
      doc(db, "driverLocation", FIREBASE_DOC),
      {
        latitude,
        longitude,
        updatedAt: Date.now(),
      },
      {
        merge: true,
      }
    );
  } catch (error) {
    console.log(
      "FIREBASE LOCATION SAVE ERROR:",
      error
    );
  }
}

export async function loadDriverLocation() {
  try {
    const snapshot = await getDoc(
      doc(db, "driverLocation", FIREBASE_DOC)
    );

    if (snapshot.exists()) {
      const data = snapshot.data();

      if (
        typeof data.latitude === "number" &&
        typeof data.longitude === "number"
      ) {
        driverLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
        };

        await AsyncStorage.setItem(
          LOCAL_KEY,
          JSON.stringify(driverLocation)
        );

        return true;
      }
    }
  } catch (error) {
    console.log(
      "FIREBASE LOCATION LOAD ERROR:",
      error
    );
  }

  try {
    const data = await AsyncStorage.getItem(
      LOCAL_KEY
    );

    if (data) {
      const saved = JSON.parse(data);

      if (
        typeof saved.latitude === "number" &&
        typeof saved.longitude === "number"
      ) {
        driverLocation = {
          latitude: saved.latitude,
          longitude: saved.longitude,
        };

        return true;
      }
    }
  } catch (error) {
    console.log(
      "LOCAL LOCATION LOAD ERROR:",
      error
    );
  }

  return false;
}

export function listenToDriverLocation(
  callback: (
    location: {
      latitude: number;
      longitude: number;
    } | null
  ) => void
) {
  stopDriverLocationListener();

  const locationRef = doc(
    db,
    "driverLocation",
    FIREBASE_DOC
  );

  unsubscribeDriverLocation = onSnapshot(
    locationRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      const data = snapshot.data();

      if (
        typeof data.latitude !== "number" ||
        typeof data.longitude !== "number"
      ) {
        callback(null);
        return;
      }

      driverLocation = {
        latitude: data.latitude,
        longitude: data.longitude,
      };

      try {
        await AsyncStorage.setItem(
          LOCAL_KEY,
          JSON.stringify(driverLocation)
        );
      } catch (error) {
        console.log(
          "LOCATION CACHE ERROR:",
          error
        );
      }

      callback(driverLocation);
    },
    (error) => {
      console.log(
        "REALTIME DRIVER LOCATION ERROR:",
        error
      );

      callback(null);
    }
  );

  return () => {
    stopDriverLocationListener();
  };
}

export function stopDriverLocationListener() {
  if (unsubscribeDriverLocation) {
    unsubscribeDriverLocation();
    unsubscribeDriverLocation = null;
  }
}
