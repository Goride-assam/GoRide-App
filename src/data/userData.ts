import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "Customer" | "Driver" | "";

export type UserData = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
};

export let currentUser: UserData = {
  id: "",
  name: "",
  phone: "",
  email: "",
  password: "",
  role: "",
};

export async function saveUser(
  name: string,
  phone: string,
  email: string,
  password: string,
  role: string,
  id: string = ""
) {
  currentUser = {
    id: id.trim(),
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    role: role.trim() as UserRole,
  };

  await AsyncStorage.setItem("user", JSON.stringify(currentUser));
  console.log("SAVED USER:", currentUser);
  return currentUser;
}

export async function loadUser() {
  const data = await AsyncStorage.getItem("user");
  if (data) {
    try {
      const parsed = JSON.parse(data);
      currentUser = {
        id: parsed.id || "",
        name: parsed.name || "",
        phone: parsed.phone || "",
        email: parsed.email || "",
        password: parsed.password || "",
        role: parsed.role || "",
      };
      console.log("LOADED USER:", currentUser);
      return true;
    } catch (error) {
      console.log("LOAD USER PARSE ERROR:", error);
      return false;
    }
  }
  return false;
}

export async function registerCustomer(
  name: string,
  phone: string,
  email: string,
  password: string
) {
  const cleanName = name.trim();
  const cleanPhone = phone.trim();
  const cleanEmail = email.trim().toLowerCase();

  console.log("========== CUSTOMER REGISTRATION ==========");

  const firebaseResult = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );

  const firebaseUser = firebaseResult.user;
  console.log("FIREBASE CUSTOMER CREATED:", firebaseUser.uid);

  await saveUser(cleanName, cleanPhone, cleanEmail, "", "Customer", firebaseUser.uid);

  return {
    user: firebaseUser,
    firebaseUser,
  };
}

export async function loginCustomer(
  email: string,
  password: string
) {
  const loginEmail = email.trim().toLowerCase();
  console.log("========== CUSTOMER LOGIN ==========");

  const firebaseResult = await signInWithEmailAndPassword(
    auth,
    loginEmail,
    password
  );

  const firebaseUser = firebaseResult.user;

  await saveUser(
    firebaseUser.displayName || "Customer",
    firebaseUser.phoneNumber || "",
    firebaseUser.email || loginEmail,
    "",
    "Customer",
    firebaseUser.uid
  );

  console.log("FIREBASE CUSTOMER LOGIN SUCCESS:", firebaseUser.uid);
  return firebaseUser;
}

export async function checkLogin(email: string, password: string) {
  try {
    await loginCustomer(email, password);
    return true;
  } catch (error) {
    console.log("CHECK LOGIN ERROR:", error);
    return false;
  }
}

export async function restoreSupabaseUser() {
  return false; // Firebase handles its own session
}

export async function logoutUser() {
  await auth.signOut();
  currentUser = {
    id: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  };
  await AsyncStorage.removeItem("user");
  console.log("CUSTOMER LOGGED OUT");
}
