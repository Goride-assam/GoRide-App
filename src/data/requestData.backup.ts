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

export async function createRequest(ride: any) {
  const ref = await addDoc(
    collection(db, "rideRequests"),
    {
      ...ride,
      requestStatus: "New Ride Request",
      createdAt: Date.now(),
    }
  );

  rideRequest = {
    ...ride,
    id: ref.id,
    requestStatus: "New Ride Request",
  };

  return rideRequest;
}

export async function getRequest() {
  const requestsQuery = query(
    collection(db, "rideRequests"),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(requestsQuery);

  if (snapshot.empty) {
    rideRequest = null;
    return null;
  }

  const latest = snapshot.docs[0];

  rideRequest = {
    ...latest.data(),
    id: latest.id,
  };

  return rideRequest;
}

export async function updateRequestStatus(
  status: string
) {
  if (!rideRequest || !rideRequest.id) {
    return;
  }

  await updateDoc(
    doc(db, "rideRequests", rideRequest.id),
    {
      requestStatus: status,
    }
  );

  rideRequest.requestStatus = status;
}

export function listenToLatestRequest(
  callback: (request: any | null) => void
) {
  if (unsubscribeRequest) {
    unsubscribeRequest();
    unsubscribeRequest = null;
  }

  const requestsQuery = query(
    collection(db, "rideRequests"),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  unsubscribeRequest = onSnapshot(
    requestsQuery,
    (snapshot) => {
      if (snapshot.empty) {
        rideRequest = null;
        callback(null);
        return;
      }

      const latest = snapshot.docs[0];

      rideRequest = {
        ...latest.data(),
        id: latest.id,
      };

      callback(rideRequest);
    },
    (error) => {
      console.log(
        "REALTIME REQUEST ERROR:",
        error
      );
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
