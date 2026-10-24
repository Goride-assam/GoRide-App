import AsyncStorage from "@react-native-async-storage/async-storage";

export type DriverVehicleType =
  | "Bike"
  | "E-Rickshaw";

export type DriverDocumentStatus =
  | "Not Uploaded"
  | "Pending Verification"
  | "Verified"
  | "Rejected";

export type DriverDocuments = {
  vehicleType: DriverVehicleType;

  drivingLicenseUri: string;
  identityProofUri: string;
  vehicleRcUri: string;
  insuranceUri: string;
  vehiclePhotoUri: string;

  drivingLicenseStatus: DriverDocumentStatus;
  identityProofStatus: DriverDocumentStatus;
  vehicleRcStatus: DriverDocumentStatus;
  insuranceStatus: DriverDocumentStatus;
  vehiclePhotoStatus: DriverDocumentStatus;

  submittedAt: number | null;
};

const STORAGE_KEY =
  "driverDocuments";

export let driverDocuments: DriverDocuments = {
  vehicleType: "Bike",

  drivingLicenseUri: "",
  identityProofUri: "",
  vehicleRcUri: "",
  insuranceUri: "",
  vehiclePhotoUri: "",

  drivingLicenseStatus:
    "Not Uploaded",

  identityProofStatus:
    "Not Uploaded",

  vehicleRcStatus:
    "Not Uploaded",

  insuranceStatus:
    "Not Uploaded",

  vehiclePhotoStatus:
    "Not Uploaded",

  submittedAt: null,
};

export async function saveDriverDocuments(
  documents: DriverDocuments
) {
  driverDocuments = documents;

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(documents)
  );

  return driverDocuments;
}

export async function loadDriverDocuments() {
  try {
    const saved =
      await AsyncStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return driverDocuments;
    }

    driverDocuments =
      JSON.parse(saved);

    return driverDocuments;
  } catch (error) {
    console.log(
      "DRIVER DOCUMENTS LOAD ERROR:",
      error
    );

    return driverDocuments;
  }
}

export async function clearDriverDocuments() {
  driverDocuments = {
    vehicleType: "Bike",

    drivingLicenseUri: "",
    identityProofUri: "",
    vehicleRcUri: "",
    insuranceUri: "",
    vehiclePhotoUri: "",

    drivingLicenseStatus:
      "Not Uploaded",

    identityProofStatus:
      "Not Uploaded",

    vehicleRcStatus:
      "Not Uploaded",

    insuranceStatus:
      "Not Uploaded",

    vehiclePhotoStatus:
      "Not Uploaded",

    submittedAt: null,
  };

  await AsyncStorage.removeItem(
    STORAGE_KEY
  );
}
