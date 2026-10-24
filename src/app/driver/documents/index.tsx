import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../config/firebase";
import { supabase } from "../../../config/supabase";

import {
  updateRideStatus,
  assignDriver,
} from "../../../data/rideData";

import { driverData } from "../../../data/driverData";

import {
  loadDriverDocuments,
  saveDriverDocuments,
  driverDocuments,
  type DriverDocuments,
} from "../../../data/driverDocumentsData";

const NEW_RIDE = "New Ride Request";
const ACCEPTED = "Driver Accepted 🚗";
const STARTED = "Ride Started 🛺";
const COMPLETED = "Ride Completed ✅";
const CANCELLED = "Ride Cancelled ❌";

const DRIVER_ONLINE_KEY = "goride_driver_online";

type RideRequest = {
  id: string;
  pickup?: string;
  drop?: string;
  userName?: string;
  phone?: string;
  fare?: number;
  rideType?: string;
  driverAmount?: number;
  gorideCommission?: number;
  requestStatus?: string;
  createdAt?: number;

  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  driverVehicleNo?: string;
  driverRating?: string;
};

type DocumentField =
  | "drivingLicenseUri"
  | "identityProofUri"
  | "vehicleRcUri"
  | "insuranceUri"
  | "vehiclePhotoUri";

type DocumentStatusField =
  | "drivingLicenseStatus"
  | "identityProofStatus"
  | "vehicleRcStatus"
  | "insuranceStatus"
  | "vehiclePhotoStatus";

export default function DriverScreen() {
  const [ride, setRide] = useState<RideRequest | null>(null);

  const [online, setOnline] = useState(false);

  const [statusLoaded, setStatusLoaded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [firebaseError, setFirebaseError] = useState("");

  const [documents, setDocuments] =
    useState<DriverDocuments>(driverDocuments);

  const [documentLoading, setDocumentLoading] =
    useState(false);

  /*
   * GET AUTHENTICATED SUPABASE DRIVER UUID
   */
  const getAuthenticatedDriverId = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.log(
        "SUPABASE GET DRIVER USER ERROR:",
        error
      );
      throw new Error(
        "Could not verify your driver account."
      );
    }

    if (!user?.id) {
      throw new Error(
        "Driver login session not found. Please login again."
      );
    }

    return user.id;
  };

  /*
   * LOAD DRIVER ONLINE/OFFLINE STATUS
   */
  useEffect(() => {
    const loadOnlineStatus = async () => {
      try {
        const savedStatus =
          await AsyncStorage.getItem(
            DRIVER_ONLINE_KEY
          );

        setOnline(savedStatus === "true");
      } catch (error) {
        console.log(
          "DRIVER ONLINE STATUS LOAD ERROR:",
          error
        );

        setOnline(false);
      } finally {
        setStatusLoaded(true);
      }
    };

    loadOnlineStatus();
  }, []);

  /*
   * LOAD DRIVER DOCUMENTS
   */
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const saved =
          await loadDriverDocuments();

        let localDocuments = {
          ...saved,
        };

        try {
          const driverId =
            await getAuthenticatedDriverId();

          const {
            data,
            error,
          } = await supabase
            .from("driver_documents")
            .select("*")
            .eq("driver_id", driverId)
            .maybeSingle();

          if (error) {
            console.log(
              "SUPABASE DRIVER DOCUMENT LOAD ERROR:",
              error
            );
          } else if (data) {
            localDocuments = {
              ...localDocuments,
              vehicleType:
                data.vehicle_type ||
                localDocuments.vehicleType,

              drivingLicenseUri:
                data.driving_license_uri ||
                localDocuments.drivingLicenseUri,

              identityProofUri:
                data.identity_proof_uri ||
                localDocuments.identityProofUri,

              vehicleRcUri:
                data.vehicle_rc_uri ||
                localDocuments.vehicleRcUri,

              insuranceUri:
                data.insurance_uri ||
                localDocuments.insuranceUri,

              vehiclePhotoUri:
                data.vehicle_photo_uri ||
                localDocuments.vehiclePhotoUri,

              drivingLicenseStatus:
                data.driving_license_status ||
                localDocuments.drivingLicenseStatus,

              identityProofStatus:
                data.identity_proof_status ||
                localDocuments.identityProofStatus,

              vehicleRcStatus:
                data.vehicle_rc_status ||
                localDocuments.vehicleRcStatus,

              insuranceStatus:
                data.insurance_status ||
                localDocuments.insuranceStatus,

              vehiclePhotoStatus:
                data.vehicle_photo_status ||
                localDocuments.vehiclePhotoStatus,

              submittedAt:
                data.submitted_at
                  ? new Date(
                      data.submitted_at
                    ).getTime()
                  : localDocuments.submittedAt,
            };

            await saveDriverDocuments(
              localDocuments
            );

            console.log(
              "SUPABASE DRIVER DOCUMENT LOAD SUCCESS"
            );
          }
        } catch (supabaseError) {
          console.log(
            "SUPABASE DOCUMENT SESSION/LOAD ERROR:",
            supabaseError
          );
        }

        setDocuments(localDocuments);
      } catch (error) {
        console.log(
          "DRIVER DOCUMENT LOAD ERROR:",
          error
        );
      }
    };

    loadDocuments();
  }, []);

  /*
   * FIREBASE RIDE LISTENER
   */
  useEffect(() => {
    if (!statusLoaded) {
      return;
    }

    if (!online) {
      setRide(null);
      return;
    }

    console.log(
      "========== DRIVER FIREBASE LISTENER START =========="
    );

    const requestsQuery = query(
      collection(db, "rideRequests"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        console.log(
          "🔥 DRIVER FIREBASE REQUEST COUNT:",
          snapshot.size
        );

        const rides: RideRequest[] =
          snapshot.docs.map((item) => {
            const data = item.data();

            return {
              id: item.id,
              pickup: data.pickup,
              drop: data.drop,
              userName: data.userName,
              phone: data.phone,
              fare: data.fare,
              rideType: data.rideType,
              driverAmount: data.driverAmount,
              gorideCommission:
                data.gorideCommission,
              requestStatus:
                data.requestStatus,
              createdAt: data.createdAt,

              driverName:
                data.driverName,
              driverPhone:
                data.driverPhone,
              driverVehicle:
                data.driverVehicle,
              driverVehicleNo:
                data.driverVehicleNo,
              driverRating:
                data.driverRating,
            };
          });

        const activeRide =
          rides.find((item) => {
            const status = String(
              item.requestStatus || ""
            ).trim();

            return (
              status === NEW_RIDE ||
              status === ACCEPTED ||
              status === STARTED
            );
          });

        if (!activeRide) {
          console.log(
            "ℹ️ NO ACTIVE CUSTOMER RIDE"
          );

          setRide(null);
          setFirebaseError("");

          return;
        }

        console.log(
          "🔥🔥 CUSTOMER RIDE FOUND 🔥🔥"
        );

        console.log(
          "RIDE ID:",
          activeRide.id
        );

        console.log(
          "REQUEST STATUS:",
          activeRide.requestStatus
        );

        setRide(activeRide);
        setFirebaseError("");
      },
      (error: any) => {
        console.log(
          "🔥 DRIVER FIREBASE ERROR:",
          error
        );

        setFirebaseError(
          error?.message ||
            "Firebase connection error"
        );

        setRide(null);
      }
    );

    return () => {
      console.log(
        "========== DRIVER FIREBASE LISTENER STOP =========="
      );

      unsubscribe();
    };
  }, [online, statusLoaded]);

  /*
   * PICK DRIVER DOCUMENT
   */
  /*
   * SAVE DRIVER DOCUMENT RECORD TO SUPABASE
   */
  const saveDocumentsToSupabase = async (
    updatedDocuments: DriverDocuments
  ) => {
    const driverId =
      await getAuthenticatedDriverId();

    const payload = {
      driver_id: driverId,
      vehicle_type: updatedDocuments.vehicleType,

      driving_license_uri:
        updatedDocuments.drivingLicenseUri,

      identity_proof_uri:
        updatedDocuments.identityProofUri,

      vehicle_rc_uri:
        updatedDocuments.vehicleRcUri,

      insurance_uri:
        updatedDocuments.insuranceUri,

      vehicle_photo_uri:
        updatedDocuments.vehiclePhotoUri,

      driving_license_status:
        updatedDocuments.drivingLicenseStatus,

      identity_proof_status:
        updatedDocuments.identityProofStatus,

      vehicle_rc_status:
        updatedDocuments.vehicleRcStatus,

      insurance_status:
        updatedDocuments.insuranceStatus,

      vehicle_photo_status:
        updatedDocuments.vehiclePhotoStatus,

      submitted_at:
        updatedDocuments.submittedAt
          ? new Date(
              updatedDocuments.submittedAt
            ).toISOString()
          : null,
    };

    const {
      data: existingRow,
      error: findError,
    } = await supabase
      .from("driver_documents")
      .select("id")
      .eq("driver_id", driverId)
      .maybeSingle();

    if (findError) {
      console.log(
        "SUPABASE DRIVER DOCUMENT FIND ERROR:",
        findError
      );
      throw findError;
    }

    if (existingRow?.id) {
      const { error } =
        await supabase
          .from("driver_documents")
          .update(payload)
          .eq("id", existingRow.id)
          .eq("driver_id", driverId);

      if (error) {
        throw error;
      }
    } else {
      const { error } =
        await supabase
          .from("driver_documents")
          .insert(payload);

      if (error) {
        throw error;
      }
    }

    console.log(
      "SUPABASE DRIVER DOCUMENT DATABASE SYNC SUCCESS"
    );
  };

  /*
   * UPLOAD DRIVER DOCUMENT TO PRIVATE SUPABASE STORAGE
   */
  const uploadDocumentToSupabase = async (
    uri: string,
    title: string
  ) => {
    const driverId =
      await getAuthenticatedDriverId();

    const extension =
      uri.split(".").pop()?.split("?")[0] ||
      "bin";

    const safeTitle =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");

    const filePath =
      `${driverId}/${safeTitle}_${Date.now()}.${extension}`;

    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error(
        "Could not read the selected document."
      );
    }

    const arrayBuffer =
      await response.arrayBuffer();

    const { error } =
      await supabase.storage
        .from("driver-documents")
        .upload(
          filePath,
          arrayBuffer,
          {
            upsert: true,
            contentType:
              response.headers.get(
                "content-type"
              ) || "application/octet-stream",
          }
        );

    if (error) {
      console.log(
        "SUPABASE DOCUMENT UPLOAD ERROR:",
        error
      );
      throw error;
    }

    console.log(
      "SUPABASE DOCUMENT UPLOAD SUCCESS:",
      filePath
    );

    return filePath;
  };

  const pickDocument = async (
    uriField: DocumentField,
    statusField: DocumentStatusField,
    title: string
  ) => {
    if (documentLoading) {
      return;
    }

    try {
      setDocumentLoading(true);

      const result =
        await DocumentPicker.getDocumentAsync({
          type: "*/*",
          copyToCacheDirectory: true,
          multiple: false,
        });

      if (
        result.canceled ||
        !result.assets ||
        result.assets.length === 0
      ) {
        return;
      }

      const selected =
        result.assets[0];

      const storagePath =
        await uploadDocumentToSupabase(
          selected.uri,
          title
        );

      const updatedDocuments: DriverDocuments =
        {
          ...documents,
          [uriField]: storagePath,
          [statusField]: "Pending Verification",
          submittedAt: Date.now(),
        };

      await saveDriverDocuments(
        updatedDocuments
      );

      await saveDocumentsToSupabase(
        updatedDocuments
      );

      setDocuments(updatedDocuments);

      Alert.alert(
        "Document Added ✅",
        `${title} selected successfully.`
      );
    } catch (error) {
      console.log(
        "DOCUMENT PICKER ERROR:",
        error
      );

      Alert.alert(
        "Document Error ❌",
        `Unable to select ${title}.`
      );
    } finally {
      setDocumentLoading(false);
    }
  };

  /*
   * REMOVE DRIVER DOCUMENT
   */
  const removeDocument = async (
    uriField: DocumentField,
    statusField: DocumentStatusField,
    title: string
  ) => {
    Alert.alert(
      "Remove Document",
      `Remove ${title}?`,
      [
        {
          text: "CANCEL",
          style: "cancel",
        },
        {
          text: "REMOVE",
          style: "destructive",
          onPress: async () => {
            try {
              const driverId =
                await getAuthenticatedDriverId();

              const storagePath =
                documents[uriField];

              if (storagePath) {
                const { error: storageError } =
                  await supabase.storage
                    .from("driver-documents")
                    .remove([storagePath]);

                if (storageError) {
                  console.log(
                    "SUPABASE DOCUMENT DELETE ERROR:",
                    storageError
                  );
                }
              }

              const updatedDocuments: DriverDocuments =
                {
                  ...documents,
                  [uriField]: "",
                  [statusField]:
                    "Not Uploaded",
                };

              await saveDriverDocuments(
                updatedDocuments
              );

              const { error: dbError } =
                await supabase
                  .from("driver_documents")
                  .update({
                    [uriField
                      .replace(
                        /[A-Z]/g,
                        (letter) =>
                          "_" +
                          letter.toLowerCase()
                      )]: "",
                    [statusField
                      .replace(
                        /[A-Z]/g,
                        (letter) =>
                          "_" +
                          letter.toLowerCase()
                      )]: "Not Uploaded",
                  })
                  .eq("driver_id", driverId);

              if (dbError) {
                throw dbError;
              }

              setDocuments(
                updatedDocuments
              );
            } catch (error) {
              console.log(
                "DOCUMENT REMOVE ERROR:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to remove document."
              );
            }
          },
        },
      ]
    );
  };

  /*
   * DRIVER RIDE STATUS
   */
  const changeRideStatus = async (
    newStatus: string
  ) => {
    if (!ride?.id) {
      Alert.alert(
        "No Ride",
        "There is no customer ride request."
      );

      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      console.log(
        "========== DRIVER STATUS UPDATE =========="
      );

      console.log(
        "RIDE ID:",
        ride.id
      );

      console.log(
        "NEW STATUS:",
        newStatus
      );

      const rideRef = doc(
        db,
        "rideRequests",
        ride.id
      );

      if (newStatus === ACCEPTED) {
        await updateDoc(
          rideRef,
          {
            requestStatus: ACCEPTED,

            driverName: String(
              driverData.name
            ),

            driverPhone: String(
              driverData.phone
            ),

            driverVehicle: String(
              driverData.vehicle
            ),

            driverVehicleNo: String(
              driverData.vehicleNo
            ),

            driverRating: String(
              driverData.rating
            ),

            updatedAt: Date.now(),
          }
        );

        await updateRideStatus(
          ACCEPTED
        );

        await assignDriver(
          String(driverData.name),
          String(driverData.phone),
          String(driverData.vehicle),
          String(driverData.vehicleNo),
          String(driverData.rating)
        );
      } else {
        await updateDoc(
          rideRef,
          {
            requestStatus: newStatus,
            updatedAt: Date.now(),
          }
        );

        await updateRideStatus(
          newStatus
        );
      }

      setRide((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          requestStatus: newStatus,

          ...(newStatus === ACCEPTED
            ? {
                driverName:
                  String(
                    driverData.name
                  ),

                driverPhone:
                  String(
                    driverData.phone
                  ),

                driverVehicle:
                  String(
                    driverData.vehicle
                  ),

                driverVehicleNo:
                  String(
                    driverData.vehicleNo
                  ),

                driverRating:
                  String(
                    driverData.rating
                  ),
              }
            : {}),
        };
      });

      console.log(
        "✅ DRIVER STATUS UPDATED:",
        newStatus
      );
    } catch (error: any) {
      console.log(
        "🔥 DRIVER STATUS ERROR:",
        error
      );

      Alert.alert(
        "Update Error",
        error?.message ||
          "Could not update ride."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * CALL CUSTOMER
   */
  const callCustomer = async () => {
    const phone = String(
      ride?.phone || ""
    ).trim();

    if (!phone) {
      Alert.alert(
        "Phone Unavailable",
        "Customer phone number is not available."
      );

      return;
    }

    try {
      await Linking.openURL(
        `tel:${phone}`
      );
    } catch (error) {
      console.log(
        "CALL CUSTOMER ERROR:",
        error
      );

      Alert.alert(
        "Call Error",
        "Unable to open phone dialer."
      );
    }
  };

  /*
   * ACCEPT RIDE
   */
  const acceptRide = () => {
    if (!ride) {
      return;
    }

    const status = String(
      ride.requestStatus || ""
    ).trim();

    if (status !== NEW_RIDE) {
      return;
    }

    Alert.alert(
      "Accept Ride",
      "Accept this customer ride?",
      [
        {
          text: "CANCEL",
          style: "cancel",
        },
        {
          text: "ACCEPT",
          onPress: () =>
            changeRideStatus(
              ACCEPTED
            ),
        },
      ]
    );
  };

  /*
   * START RIDE
   */
  const startRide = () => {
    if (!ride) {
      return;
    }

    const status = String(
      ride.requestStatus || ""
    ).trim();

    if (status !== ACCEPTED) {
      return;
    }

    changeRideStatus(
      STARTED
    );
  };

  /*
   * COMPLETE RIDE
   */
  const completeRide = () => {
    if (!ride) {
      return;
    }

    const status = String(
      ride.requestStatus || ""
    ).trim();

    if (status !== STARTED) {
      return;
    }

    Alert.alert(
      "Complete Ride",
      "Complete this ride?",
      [
        {
          text: "CANCEL",
          style: "cancel",
        },
        {
          text: "COMPLETE",
          onPress: () =>
            changeRideStatus(
              COMPLETED
            ),
        },
      ]
    );
  };

  /*
   * ONLINE / OFFLINE
   */
  const toggleOnline = async () => {
    if (loading) {
      return;
    }

    try {
      const newStatus = !online;

      setOnline(newStatus);

      await AsyncStorage.setItem(
        DRIVER_ONLINE_KEY,
        String(newStatus)
      );

      console.log(
        "🚗 DRIVER ONLINE STATUS:",
        newStatus
      );

      if (!newStatus) {
        setRide(null);
      }
    } catch (error) {
      console.log(
        "DRIVER ONLINE STATUS SAVE ERROR:",
        error
      );

      Alert.alert(
        "Status Error",
        "Could not save driver status."
      );
    }
  };

  const rideStatus = String(
    ride?.requestStatus || ""
  ).trim();

  /*
   * SWIPE ACCEPT
   */
  const swipeX = useSharedValue(0);
  const startSwipeX =
    useSharedValue(0);

  const acceptSwipe = Gesture.Pan()
    .onUpdate((event) => {
      swipeX.value =
        event.translationX;
    })
    .onEnd(() => {
      if (swipeX.value > 120) {
        runOnJS(acceptRide)();
      } else if (
        swipeX.value < -120
      ) {
        runOnJS(() => {
          if (!ride || loading) {
            return;
          }

          Alert.alert(
            "Cancel Ride",
            "Cancel this customer ride?",
            [
              {
                text: "KEEP RIDE",
                style: "cancel",
              },
              {
                text: "CANCEL RIDE",
                style: "destructive",
                onPress: () =>
                  changeRideStatus(
                    CANCELLED
                  ),
              },
            ]
          );
        })();
      }

      swipeX.value =
        withSpring(0);
    });

  const swipeStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX:
            swipeX.value,
        },
      ],
    }));

  const startSwipeStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX:
            startSwipeX.value,
        },
      ],
    }));

  /*
   * DOCUMENT CARD
   */
  const documentRow = (
    title: string,
    uriField: DocumentField,
    statusField: DocumentStatusField
  ) => {
    const uri =
      documents[uriField];

    const status =
      documents[statusField];

    return (
      <View style={styles.documentRow}>
        <View style={styles.documentInfo}>
          <Text
            style={styles.documentTitle}
          >
            {title}
          </Text>

          <Text
            style={
              uri
                ? styles.documentSelected
                : styles.documentNotSelected
            }
          >
            {uri
              ? `Status: ${status}`
              : "Not Uploaded"}
          </Text>
        </View>

        <TouchableOpacity
          style={
            uri
              ? styles.changeDocumentButton
              : styles.uploadDocumentButton
          }
          onPress={() =>
            uri
              ? removeDocument(
                  uriField,
                  statusField,
                  title
                )
              : pickDocument(
                  uriField,
                  statusField,
                  title
                )
          }
          disabled={
            documentLoading
          }
        >
          <Text
            style={
              uri
                ? styles.changeDocumentText
                : styles.uploadDocumentText
            }
          >
            {uri
              ? "REMOVE"
              : "UPLOAD"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /*
   * WAIT FOR DRIVER STATUS
   */
  if (!statusLoaded) {
    return (
      <View
        style={styles.loadingScreen}
      >
        <Text
          style={styles.loadingText}
        >
          Loading Driver Status...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <Text style={styles.logo}>
        GoRide 🚲
      </Text>

      <Text style={styles.title}>
        Driver App
      </Text>

      <Text style={styles.subtitle}>
        Driver Ride Management
      </Text>

      {/* DRIVER STATUS */}

      <View style={styles.onlineCard}>
        <View>
          <Text
            style={styles.onlineLabel}
          >
            DRIVER STATUS
          </Text>

          <Text
            style={
              online
                ? styles.onlineText
                : styles.offlineText
            }
          >
            {online
              ? "🟢 ONLINE"
              : "🔴 OFFLINE"}
          </Text>
        </View>

        <TouchableOpacity
          style={
            online
              ? styles.offlineButton
              : styles.onlineButton
          }
          onPress={toggleOnline}
          activeOpacity={0.8}
        >
          <Text
            style={styles.toggleText}
          >
            {online
              ? "GO OFFLINE"
              : "GO ONLINE"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DRIVER DOCUMENTS */}

      <View
        style={styles.documentsCard}
      >
        <Text
          style={styles.documentsTitle}
        >
          📋 DRIVER DOCUMENTS
        </Text>

        <Text
          style={styles.documentsSubtitle}
        >
          Upload your required driver
          and vehicle documents.
        </Text>

        {documentRow(
          "Driving License",
          "drivingLicenseUri",
          "drivingLicenseStatus"
        )}

        {documentRow(
          "Identity Proof",
          "identityProofUri",
          "identityProofStatus"
        )}

        {documentRow(
          "Vehicle RC",
          "vehicleRcUri",
          "vehicleRcStatus"
        )}

        {documentRow(
          "Insurance",
          "insuranceUri",
          "insuranceStatus"
        )}

        {documentRow(
          "Vehicle Photo",
          "vehiclePhotoUri",
          "vehiclePhotoStatus"
        )}
      </View>

      {firebaseError ? (
        <View
          style={styles.errorCard}
        >
          <Text
            style={styles.errorTitle}
          >
            Firebase Error
          </Text>

          <Text
            style={styles.errorText}
          >
            {firebaseError}
          </Text>
        </View>
      ) : null}

      {!ride && online ? (
        <View
          style={styles.waitingCard}
        >
          <Text
            style={styles.waitingIcon}
          >
            🔎
          </Text>

          <Text
            style={styles.waitingTitle}
          >
            Waiting for Customer Ride
          </Text>

          <Text
            style={styles.waitingText}
          >
            New customer ride requests
            will appear here automatically.
          </Text>

          <Text
            style={styles.liveText}
          >
            🟢 LIVE FIREBASE SYNC ACTIVE
          </Text>
        </View>
      ) : null}

      {!online ? (
        <View
          style={styles.waitingCard}
        >
          <Text
            style={styles.waitingIcon}
          >
            📴
          </Text>

          <Text
            style={styles.waitingTitle}
          >
            You Are Offline
          </Text>

          <Text
            style={styles.waitingText}
          >
            Go online to receive customer
            ride requests.
          </Text>
        </View>
      ) : null}

      {ride ? (
        <>
          <View
            style={styles.statusCard}
          >
            <Text
              style={styles.statusLabel}
            >
              CURRENT RIDE STATUS
            </Text>

            <Text
              style={styles.statusText}
            >
              {rideStatus}
            </Text>
          </View>

          <View
            style={styles.rideCard}
          >
            <Text
              style={styles.cardTitle}
            >
              🚕 Customer Ride
            </Text>

            <Text
              style={styles.detail}
            >
              🆔 Ride ID:{" "}
              {ride.id}
            </Text>

            <Text
              style={styles.detail}
            >
              👤 Customer:{" "}
              {ride.userName ||
                "Customer"}
            </Text>

            <Text
              style={styles.detail}
            >
              📍 Pickup:{" "}
              {ride.pickup ||
                "Not available"}
            </Text>

            <Text
              style={styles.detail}
            >
              🏁 Drop:{" "}
              {ride.drop ||
                "Not available"}
            </Text>

            <Text
              style={styles.detail}
            >
              🛵 Ride Type:{" "}
              {ride.rideType ||
                "Bike"}
            </Text>

            <Text
              style={styles.fare}
            >
              💰 Fare: ₹
              {ride.fare || 0}
            </Text>

            <Text
              style={styles.driverAmount}
            >
              💵 You will receive: ₹
              {ride.driverAmount ||
                ride.fare ||
                0}
            </Text>
          </View>

          {rideStatus === NEW_RIDE ? (
            <GestureDetector
              gesture={acceptSwipe}
            >
              <Animated.View
                style={[
                  styles.swipeCard,
                  swipeStyle,
                ]}
              >
                <Text
                  style={styles.swipeArrow}
                >
                  👉
                </Text>

                <View
                  style={
                    styles.swipeContent
                  }
                >
                  <Text
                    style={
                      styles.swipeTitle
                    }
                  >
                    SWIPE RIGHT TO ACCEPT
                  </Text>

                  <Text
                    style={
                      styles.swipeSubtext
                    }
                  >
                    Swipe right to accept
                    • Swipe left to cancel
                  </Text>
                </View>
              </Animated.View>
            </GestureDetector>
          ) : null}

          {rideStatus === ACCEPTED ? (
            <>
              <View
                style={styles.driverCard}
              >
                <Text
                  style={styles.cardTitle}
                >
                  🚕 Driver Information
                </Text>

                <Text
                  style={styles.detail}
                >
                  Driver:{" "}
                  {driverData.name}
                </Text>

                <Text
                  style={styles.detail}
                >
                  Vehicle:{" "}
                  {driverData.vehicle}
                </Text>

                <Text
                  style={styles.detail}
                >
                  Vehicle No.:{" "}
                  {driverData.vehicleNo}
                </Text>

                <Text
                  style={styles.detail}
                >
                  Rating: ⭐{" "}
                  {driverData.rating}
                </Text>

                <TouchableOpacity
                  style={
                    styles.callButton
                  }
                  onPress={
                    callCustomer
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={
                      styles.callButtonText
                    }
                  >
                    📞 CALL CUSTOMER
                  </Text>
                </TouchableOpacity>
              </View>

              <GestureDetector
                gesture={Gesture.Pan()
                  .onUpdate(
                    (event) => {
                      startSwipeX.value =
                        event.translationX;
                    }
                  )
                  .onEnd(() => {
                    if (
                      startSwipeX.value >
                      120
                    ) {
                      runOnJS(
                        startRide
                      )();
                    }

                    startSwipeX.value =
                      withSpring(0);
                  })}
              >
                <Animated.View
                  style={[
                    styles.swipeCard,
                    startSwipeStyle,
                  ]}
                >
                  <Text
                    style={
                      styles.swipeArrow
                    }
                  >
                    👉
                  </Text>

                  <View
                    style={
                      styles.swipeContent
                    }
                  >
                    <Text
                      style={
                        styles.swipeTitle
                      }
                    >
                      SWIPE RIGHT TO START
                    </Text>

                    <Text
                      style={
                        styles.swipeSubtext
                      }
                    >
                      Swipe right when you
                      are ready to start
                    </Text>
                  </View>
                </Animated.View>
              </GestureDetector>
            </>
          ) : null}

          {rideStatus === STARTED ? (
            <>
              <View
                style={styles.startedCard}
              >
                <Text
                  style={
                    styles.startedTitle
                  }
                >
                  🛺 RIDE IN PROGRESS
                </Text>

                <Text
                  style={
                    styles.startedText
                  }
                >
                  Customer ride is
                  currently in progress.
                </Text>
              </View>

              <TouchableOpacity
                style={
                  styles.completeButton
                }
                onPress={
                  completeRide
                }
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {loading
                    ? "PLEASE WAIT..."
                    : "✅ COMPLETE RIDE"}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}

          {rideStatus === COMPLETED ? (
            <View
              style={
                styles.completedCard
              }
            >
              <Text
                style={
                  styles.completedTitle
                }
              >
                ✅ RIDE COMPLETED
              </Text>

              <Text
                style={
                  styles.completedFare
                }
              >
                Fare: ₹
                {ride.fare || 0}
              </Text>

              <Text
                style={
                  styles.completedText
                }
              >
                Customer ride completed
                successfully.
              </Text>
            </View>
          ) : null}
        </>
      ) : null}

      <Text style={styles.footer}>
        GoRide • Safe • Simple • Reliable
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#FFF8D6",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 18,
    fontWeight: "800",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFF8D6",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  logo: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },

  onlineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  onlineLabel: {
    fontSize: 12,
    fontWeight: "800",
  },

  onlineText: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },

  offlineText: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },

  onlineButton: {
    backgroundColor: "#111111",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  offlineButton: {
    backgroundColor: "#DD3333",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  toggleText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },

  documentsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  documentsTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111111",
  },

  documentsSubtitle: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 14,
  },

  documentRow: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  documentInfo: {
    flex: 1,
    paddingRight: 10,
  },

  documentTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111111",
  },

  documentSelected: {
    fontSize: 12,
    color: "#16803C",
    fontWeight: "700",
    marginTop: 4,
  },

  documentNotSelected: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },

  uploadDocumentButton: {
    backgroundColor: "#111111",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },

  uploadDocumentText: {
    color: "#FFD400",
    fontSize: 12,
    fontWeight: "900",
  },

  changeDocumentButton: {
    backgroundColor: "#FFE2E2",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },

  changeDocumentText: {
    color: "#CC2222",
    fontSize: 12,
    fontWeight: "900",
  },

  errorCard: {
    backgroundColor: "#FFE2E2",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  errorText: {
    fontSize: 13,
  },

  waitingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    marginTop: 8,
  },

  waitingIcon: {
    fontSize: 42,
  },

  waitingTitle: {
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },

  waitingText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 21,
  },

  liveText: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 18,
  },

  statusCard: {
    backgroundColor: "#111111",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  statusLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  statusText: {
    color: "#FFD400",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 7,
  },

  rideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },

  detail: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    lineHeight: 21,
  },

  fare: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 5,
  },

  driverAmount: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
  },

  swipeCard: {
    backgroundColor: "#FFD400",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 4,
  },

  swipeArrow: {
    fontSize: 30,
  },

  swipeContent: {
    flex: 1,
    marginLeft: 12,
  },

  swipeTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111111",
  },

  swipeSubtext: {
    fontSize: 12,
    color: "#333333",
    marginTop: 5,
  },

  startButton: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  completeButton: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  callButton: {
    backgroundColor: "#16803C",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
  },

  callButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  driverCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  startedCard: {
    backgroundColor: "#E7F0FF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  startedTitle: {
    fontSize: 20,
    fontWeight: "900",
  },

  startedText: {
    fontSize: 14,
    marginTop: 8,
  },

  completedCard: {
    backgroundColor: "#DFF7DF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
  },

  completedTitle: {
    fontSize: 21,
    fontWeight: "900",
  },

  completedFare: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 12,
  },

  completedText: {
    fontSize: 14,
    marginTop: 8,
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 25,
    opacity: 0.6,
  },
});
