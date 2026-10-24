import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "../../config/supabase";

import {
  DriverDocumentStatus,
  DriverDocuments,
  driverDocuments,
  loadDriverDocuments,
  saveDriverDocuments,
} from "../../data/driverDocumentsData";

const BUCKET_NAME = "driver-documents";
const DRIVER_REGISTRATION_KEY = "driverRegistration";

type DocumentKey =
  | "drivingLicense"
  | "identityProof"
  | "vehicleRc"
  | "insurance"
  | "vehiclePhoto";

type DocumentInfo = {
  key: DocumentKey;
  title: string;
  icon: string;
  uriKey:
    | "drivingLicenseUri"
    | "identityProofUri"
    | "vehicleRcUri"
    | "insuranceUri"
    | "vehiclePhotoUri";
  statusKey:
    | "drivingLicenseStatus"
    | "identityProofStatus"
    | "vehicleRcStatus"
    | "insuranceStatus"
    | "vehiclePhotoStatus";
};

const DOCUMENTS: DocumentInfo[] = [
  {
    key: "drivingLicense",
    title: "Driving License",
    icon: "🪪",
    uriKey: "drivingLicenseUri",
    statusKey: "drivingLicenseStatus",
  },
  {
    key: "identityProof",
    title: "Identity Proof",
    icon: "👤",
    uriKey: "identityProofUri",
    statusKey: "identityProofStatus",
  },
  {
    key: "vehicleRc",
    title: "Vehicle RC",
    icon: "📋",
    uriKey: "vehicleRcUri",
    statusKey: "vehicleRcStatus",
  },
  {
    key: "insurance",
    title: "Vehicle Insurance",
    icon: "🛡️",
    uriKey: "insuranceUri",
    statusKey: "insuranceStatus",
  },
  {
    key: "vehiclePhoto",
    title: "Vehicle Photo",
    icon: "🚕",
    uriKey: "vehiclePhotoUri",
    statusKey: "vehiclePhotoStatus",
  },
];

export default function DriverDocumentsScreen() {
  const [documents, setDocuments] =
    useState<DriverDocuments>(driverDocuments);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] =
    useState<DocumentKey | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const saved = await loadDriverDocuments();
        setDocuments({ ...saved });
      } catch (error) {
        console.log(
          "DRIVER DOCUMENTS SCREEN LOAD ERROR:",
          error
        );
      }
    };

    loadDocuments();
  }, []);

  const getDriverId = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.log(
        "SUPABASE GET USER ERROR:",
        error
      );
    }

    if (user?.id) {
      return user.id;
    }

    const registration =
      await AsyncStorage.getItem(
        DRIVER_REGISTRATION_KEY
      );

    if (registration) {
      try {
        const parsed = JSON.parse(registration);

        if (parsed?.phone) {
          return String(parsed.phone).trim();
        }
      } catch (error) {
        console.log(
          "DRIVER REGISTRATION PARSE ERROR:",
          error
        );
      }
    }

    return "";
  };

  const uploadDocument = async (
    documentInfo: DocumentInfo
  ) => {
    if (uploading) {
      return;
    }

    try {
      setUploading(documentInfo.key);

      const result =
        await DocumentPicker.getDocumentAsync({
          type: [
            "image/*",
            "application/pdf",
          ],
          copyToCacheDirectory: true,
          multiple: false,
        });

      if (result.canceled) {
        setUploading(null);
        return;
      }

      const selectedFile =
        result.assets?.[0];

      if (!selectedFile) {
        Alert.alert(
          "File Error",
          "Could not select the document."
        );
        return;
      }

      const driverId =
        await getDriverId();

      if (!driverId) {
        Alert.alert(
          "Login Required",
          "Please login as a driver before uploading documents."
        );
        return;
      }

      const safeDriverId =
        driverId.replace(
          /[^a-zA-Z0-9_-]/g,
          "_"
        );

      const originalName =
        selectedFile.name ||
        `${documentInfo.key}.file`;

      const extension =
        originalName.includes(".")
          ? originalName
              .split(".")
              .pop()
              ?.toLowerCase() || "file"
          : "file";

      const filePath =
        `${safeDriverId}/${documentInfo.key}_${Date.now()}.${extension}`;

      console.log(
        "========== DRIVER DOCUMENT UPLOAD =========="
      );

      console.log(
        "DOCUMENT:",
        documentInfo.title
      );

      console.log(
        "FILE:",
        originalName
      );

      console.log(
        "PATH:",
        filePath
      );

      const response =
        await fetch(selectedFile.uri);

      if (!response.ok) {
        throw new Error(
          "Could not read the selected file."
        );
      }

      const fileBuffer =
        await response.arrayBuffer();

      const contentType =
        selectedFile.mimeType ||
        "application/octet-stream";

      const {
        error: uploadError,
      } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(
          filePath,
          fileBuffer,
          {
            contentType,
            upsert: true,
          }
        );

      if (uploadError) {
        console.log(
          "SUPABASE DOCUMENT UPLOAD ERROR:",
          uploadError
        );

        throw uploadError;
      }

      const updatedDocuments: DriverDocuments = {
        ...documents,

        [documentInfo.uriKey]:
          filePath,

        [documentInfo.statusKey]:
          "Pending Verification" as DriverDocumentStatus,

        submittedAt:
          Date.now(),
      };

      await saveDriverDocuments(
        updatedDocuments
      );

      setDocuments({
        ...updatedDocuments,
      });

      Alert.alert(
        "Upload Successful ✅",
        `${documentInfo.title} uploaded successfully and is now pending verification.`
      );

      console.log(
        "✅ DRIVER DOCUMENT UPLOAD SUCCESS:",
        filePath
      );
    } catch (error: any) {
      console.log(
        "DRIVER DOCUMENT UPLOAD ERROR:",
        error
      );

      Alert.alert(
        "Upload Failed ❌",
        error?.message ||
          "Could not upload the document. Please try again."
      );
    } finally {
      setUploading(null);
    }
  };

  const getStatusText = (
    status: DriverDocumentStatus
  ) => {
    if (status === "Verified") {
      return "✅ VERIFIED";
    }

    if (status === "Pending Verification") {
      return "🟡 PENDING VERIFICATION";
    }

    if (status === "Rejected") {
      return "❌ REJECTED";
    }

    return "⚪ NOT UPLOADED";
  };

  const getStatusStyle = (
    status: DriverDocumentStatus
  ) => {
    if (status === "Verified") {
      return styles.verifiedStatus;
    }

    if (status === "Pending Verification") {
      return styles.pendingStatus;
    }

    if (status === "Rejected") {
      return styles.rejectedStatus;
    }

    return styles.notUploadedStatus;
  };

  const getUploadedText = (
    info: DocumentInfo
  ) => {
    const uri =
      documents[info.uriKey];

    if (!uri) {
      return "No document uploaded";
    }

    return "Document uploaded";
  };

  const submitAllDocuments = async () => {
    if (loading) {
      return;
    }

    const missingDocuments =
      DOCUMENTS.filter(
        (item) =>
          !documents[item.uriKey]
      );

    if (missingDocuments.length > 0) {
      Alert.alert(
        "Documents Missing",
        `Please upload all required documents first.\n\nMissing: ${missingDocuments
          .map((item) => item.title)
          .join(", ")}`
      );

      return;
    }

    try {
      setLoading(true);

      const updatedDocuments: DriverDocuments = {
        ...documents,
        drivingLicenseStatus:
          documents.drivingLicenseUri
            ? "Pending Verification"
            : "Not Uploaded",

        identityProofStatus:
          documents.identityProofUri
            ? "Pending Verification"
            : "Not Uploaded",

        vehicleRcStatus:
          documents.vehicleRcUri
            ? "Pending Verification"
            : "Not Uploaded",

        insuranceStatus:
          documents.insuranceUri
            ? "Pending Verification"
            : "Not Uploaded",

        vehiclePhotoStatus:
          documents.vehiclePhotoUri
            ? "Pending Verification"
            : "Not Uploaded",

        submittedAt: Date.now(),
      };

      await saveDriverDocuments(
        updatedDocuments
      );

      setDocuments({
        ...updatedDocuments,
      });

      Alert.alert(
        "Submitted Successfully ✅",
        "All driver documents have been submitted for verification.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "DRIVER DOCUMENT SUBMIT ERROR:",
        error
      );

      Alert.alert(
        "Submit Failed ❌",
        error?.message ||
          "Could not submit your documents."
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadedCount =
    DOCUMENTS.filter(
      (item) =>
        !!documents[item.uriKey]
    ).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>
        GoRide 🚲
      </Text>

      <Text style={styles.title}>
        Driver Documents
      </Text>

      <Text style={styles.subtitle}>
        Upload your documents for driver verification.
      </Text>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>
          DOCUMENT PROGRESS
        </Text>

        <Text style={styles.progressCount}>
          {uploadedCount} / {DOCUMENTS.length}
        </Text>

        <Text style={styles.progressText}>
          Upload all required documents to submit your verification.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          🔐 Private & Secure
        </Text>

        <Text style={styles.infoText}>
          Your documents are stored in GoRide's private document storage.
          They are not publicly accessible.
        </Text>
      </View>

      {DOCUMENTS.map((item) => {
        const status =
          documents[item.statusKey];

        const isUploading =
          uploading === item.key;

        return (
          <View
            key={item.key}
            style={styles.documentCard}
          >
            <View style={styles.documentHeader}>
              <Text style={styles.documentIcon}>
                {item.icon}
              </Text>

              <View style={styles.documentHeaderText}>
                <Text style={styles.documentTitle}>
                  {item.title}
                </Text>

                <Text style={styles.documentUploaded}>
                  {getUploadedText(item)}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.statusBadge,
                getStatusStyle(status),
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(status)}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                isUploading &&
                  styles.disabledButton,
              ]}
              onPress={() =>
                uploadDocument(item)
              }
              disabled={
                !!uploading || loading
              }
              activeOpacity={0.8}
            >
              <Text style={styles.uploadButtonText}>
                {isUploading
                  ? "UPLOADING..."
                  : documents[item.uriKey]
                  ? "REPLACE DOCUMENT"
                  : "UPLOAD DOCUMENT"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity
        style={[
          styles.submitButton,
          (loading ||
            uploadedCount !==
              DOCUMENTS.length) &&
            styles.disabledSubmitButton,
        ]}
        onPress={
          submitAllDocuments
        }
        disabled={
          loading ||
          uploadedCount !==
            DOCUMENTS.length
        }
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          {loading
            ? "SUBMITTING..."
            : "📤 SUBMIT FOR VERIFICATION"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.backButtonText}>
          ← BACK
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        GoRide • Safe • Simple • Reliable
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8D6",
  },

  content: {
    padding: 20,
    paddingBottom: 45,
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#111",
    textAlign: "center",
    marginTop: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
    textAlign: "center",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },

  progressCard: {
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  progressTitle: {
    color: "#FFD400",
    fontSize: 12,
    fontWeight: "900",
  },

  progressCount: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 4,
  },

  progressText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    opacity: 0.9,
  },

  infoCard: {
    backgroundColor: "#FFF8CC",
    borderWidth: 1,
    borderColor: "#FFD400",
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
  },

  infoText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
    marginTop: 5,
  },

  documentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    elevation: 4,
  },

  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  documentIcon: {
    fontSize: 32,
    marginRight: 12,
  },

  documentHeaderText: {
    flex: 1,
  },

  documentTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
  },

  documentUploaded: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  statusBadge: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 14,
    alignSelf: "flex-start",
  },

  notUploadedStatus: {
    backgroundColor: "#EEEEEE",
  },

  pendingStatus: {
    backgroundColor: "#FFF0B3",
  },

  verifiedStatus: {
    backgroundColor: "#DDF5E2",
  },

  rejectedStatus: {
    backgroundColor: "#FFE0E0",
  },

  statusText: {
    color: "#111",
    fontSize: 11,
    fontWeight: "900",
  },

  uploadButton: {
    backgroundColor: "#FFD400",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
  },

  disabledButton: {
    opacity: 0.5,
  },

  uploadButtonText: {
    color: "#111",
    fontSize: 14,
    fontWeight: "900",
  },

  submitButton: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 5,
  },

  disabledSubmitButton: {
    opacity: 0.45,
  },

  submitButtonText: {
    color: "#FFD400",
    fontSize: 15,
    fontWeight: "900",
  },

  backButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },

  backButtonText: {
    color: "#111",
    fontSize: 15,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    color: "#777",
    fontSize: 12,
    marginTop: 24,
  },
});
