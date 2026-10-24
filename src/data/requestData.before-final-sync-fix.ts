import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";

import { db } from "../config/firebase";

export let rideRequest: any = null;

let unsubscribeRequest: Unsubscribe | null = null;

export const NEW_RIDE = "New Ride Request";
export const ACCEPTED = "Driver Accepted 🚗";
export const STARTED = "Ride Started 🛺";
export const COMPLETED = "Ride Completed ✅";

const ACTIVE_STATUSES = [
  NEW_RIDE,
  ACCEPTED,
  STARTED,
];

function firestoreRequest(item: any) {
  return {
    ...item.data(),
    id: item.id,
  };
}

export async function createRequest(ride: any) {
  const requestData = {
    ...ride,
    requestStatus: NEW_RIDE,
    createdAt: Date.now(),
  };

  console.log("========== CREATE REQUEST ==========");
  console.log("REQUEST DATA:", requestData);

  const ref = await addDoc(
    collection(db, "rideRequests"),
    requestData
  );

  rideRequest = {
    ...requestData,
    id: ref.id,
  };

  console.log(
    "🔥 FIREBASE DOCUMENT ID:",
    ref.id
  );

  console.log(
    "🔥 REQUEST CREATED:",
    rideRequest
  );

  return rideRequest;
}

export async function getRequest() {
  try {
    const requestsQuery = query(
      collection(db, "rideRequests"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const snapshot = await getDocs(
      requestsQuery
    );

    if (snapshot.empty) {
      rideRequest = null;
      return null;
    }

    const requests = snapshot.docs
      .map((item) => firestoreRequest(item))
      .sort(
        (a: any, b: any) =>
          Number(b.createdAt || 0) -
          Number(a.createdAt || 0)
      );

    const activeRequest = requests.find(
      (item: any) =>
        ACTIVE_STATUSES.includes(
          String(
            item.requestStatus || ""
          ).trim()
        )
    );

    if (!activeRequest) {
      rideRequest = null;
      return null;
    }

    rideRequest = activeRequest;

    console.log(
      "🔥 ACTIVE REQUEST:",
      rideRequest
    );

    return rideRequest;
  } catch (error) {
    console.log(
      "GET REQUEST ERROR:",
      error
    );

    return null;
  }
}

export async function updateRequestStatus(
  status: string
) {
  if (!rideRequest?.id) {
    console.log(
      "NO CURRENT REQUEST ID"
    );
    return;
  }

  await updateDoc(
    doc(
      db,
      "rideRequests",
      rideRequest.id
    ),
    {
      requestStatus: status,
      updatedAt: Date.now(),
    }
  );

  rideRequest = {
    ...rideRequest,
    requestStatus: status,
  };
}

export function listenToLatestRequest(
  callback: (
    request: any | null
  ) => void
) {
  if (unsubscribeRequest) {
    unsubscribeRequest();
    unsubscribeRequest = null;
  }

  const requestsQuery = query(
    collection(db, "rideRequests"),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  unsubscribeRequest = onSnapshot(
    requestsQuery,
    (snapshot) => {
      console.log(
        "🔥 FIREBASE REQUEST COUNT:",
        snapshot.size
      );

      const requests = snapshot.docs
        .map((item) =>
          firestoreRequest(item)
        )
        .sort(
          (a: any, b: any) =>
            Number(b.createdAt || 0) -
            Number(a.createdAt || 0)
        );

      const activeRequest = requests.find(
        (item: any) =>
          ACTIVE_STATUSES.includes(
            String(
              item.requestStatus || ""
            ).trim()
          )
      );

      if (!activeRequest) {
        rideRequest = null;
        callback(null);
        return;
      }

      rideRequest = activeRequest;

      console.log(
        "🔥 ACTIVE REQUEST:",
        activeRequest
      );

      callback(activeRequest);
    },
    (error) => {
      console.log(
        "REALTIME REQUEST ERROR:",
        error
      );

      callback(null);
    }
  );

  return () => {
    if (unsubscribeRequest) {
      unsubscribeRequest();
      unsubscribeRequest = null;
    }
  };
}

export function stopRequestListener() {
  if (unsubscribeRequest) {
    unsubscribeRequest();
    unsubscribeRequest = null;
  }
}
