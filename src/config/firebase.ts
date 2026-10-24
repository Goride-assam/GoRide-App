import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcR1O50m3KOGbi1IUrB7bMJRJI6XLBLRU",
  authDomain: "rideapp-385d0.firebaseapp.com",
  projectId: "rideapp-385d0",
  storageBucket: "rideapp-385d0.firebasestorage.app",
  messagingSenderId: "812226792770",
  appId: "1:812226792770:web:05746b86563e49d5f88cdb",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
