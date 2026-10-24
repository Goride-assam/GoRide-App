import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

import {
  driverLocation,
  loadDriverLocation,
  saveDriverLocation,
} from "../../../data/driverLocationData";

export default function DriverMapScreen() {
  const [latitude, setLatitude] = useState(
    driverLocation.latitude
  );

  const [longitude, setLongitude] = useState(
    driverLocation.longitude
  );

  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [tracking, setTracking] = useState(false);

  const hasLocation =
    latitude !== 0 && longitude !== 0;

  const updateLocationState = (
    nextLatitude: number,
    nextLongitude: number
  ) => {
    setLatitude(nextLatitude);
    setLongitude(nextLongitude);
    setLive(true);
  };

  const getGPSLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLive(false);

        Alert.alert(
          "Location Permission Required",
          "Please allow location permission for GoRide driver tracking."
        );

        return false;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const nextLatitude =
        location.coords.latitude;

      const nextLongitude =
        location.coords.longitude;

      await saveDriverLocation(
        nextLatitude,
        nextLongitude
      );

      updateLocationState(
        nextLatitude,
        nextLongitude
      );

      return true;
    } catch (error) {
      console.log(
        "GPS LOCATION ERROR:",
        error
      );

      setLive(false);
      return false;
    }
  };

  useEffect(() => {
    let locationSubscription:
      Location.LocationSubscription | null =
      null;

    const startTracking = async () => {
      try {
        setLoading(true);

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLive(false);
          setTracking(false);
          setLoading(false);

          Alert.alert(
            "Location Permission Required",
            "Please allow location permission for GoRide driver tracking."
          );

          return;
        }

        const initialLocation =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        const initialLatitude =
          initialLocation.coords.latitude;

        const initialLongitude =
          initialLocation.coords.longitude;

        await saveDriverLocation(
          initialLatitude,
          initialLongitude
        );

        updateLocationState(
          initialLatitude,
          initialLongitude
        );

        setTracking(true);
        setLoading(false);

        locationSubscription =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000,
              distanceInterval: 5,
            },
            async (location) => {
              const nextLatitude =
                location.coords.latitude;

              const nextLongitude =
                location.coords.longitude;

              console.log(
                "📍 DRIVER GPS UPDATE:",
                nextLatitude,
                nextLongitude
              );

              updateLocationState(
                nextLatitude,
                nextLongitude
              );

              setTracking(true);

              await saveDriverLocation(
                nextLatitude,
                nextLongitude
              );
            }
          );
      } catch (error) {
        console.log(
          "START GPS TRACKING ERROR:",
          error
        );

        setTracking(false);
        setLive(false);
        setLoading(false);

        const saved =
          await loadDriverLocation();

        if (saved) {
          setLatitude(
            driverLocation.latitude
          );

          setLongitude(
            driverLocation.longitude
          );

          setLive(true);
        }
      }
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
        locationSubscription = null;
      }
    };
  }, []);

  const refreshLocation = async () => {
    setLoading(true);

    const success =
      await getGPSLocation();

    if (!success) {
      const saved =
        await loadDriverLocation();

      if (saved) {
        setLatitude(
          driverLocation.latitude
        );

        setLongitude(
          driverLocation.longitude
        );

        setLive(true);
      }
    }

    setLoading(false);
  };

  const region: Region = {
    latitude: hasLocation
      ? latitude
      : 26.1445,

    longitude: hasLocation
      ? longitude
      : 91.7362,

    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  if (loading && !hasLocation) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Getting driver location... 📍
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          📍 Driver Live Map
        </Text>

        <Text style={styles.subtitle}>
          GoRide Driver GPS Tracking
        </Text>

        <Text
          style={[
            styles.liveStatus,
            {
              color: live
                ? "#16803c"
                : "#d32f2f",
            },
          ]}
        >
          {live
            ? tracking
              ? "🟢 LIVE GPS TRACKING ACTIVE"
              : "🟢 LOCATION ACTIVE"
            : "🔴 LOCATION OFFLINE"}
        </Text>
      </View>

      <View style={styles.mapContainer}>
        {hasLocation ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            showsUserLocation
            showsMyLocationButton
            showsCompass
            showsScale
            zoomEnabled
            scrollEnabled
            rotateEnabled
            pitchEnabled
          >
            <Marker
              coordinate={{
                latitude,
                longitude,
              }}
              title="GoRide Driver"
              description="Driver live GPS location"
            />
          </MapView>
        ) : (
          <View style={styles.noMap}>
            <Text style={styles.noMapText}>
              📍 Location unavailable
            </Text>

            <Text style={styles.info}>
              Please allow location permission.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>
          🚕 Your Live Location
        </Text>

        <Text style={styles.coordinate}>
          Latitude: {latitude.toFixed(6)}
        </Text>

        <Text style={styles.coordinate}>
          Longitude: {longitude.toFixed(6)}
        </Text>

        <View style={styles.activeBox}>
          <Text style={styles.activeText}>
            {tracking
              ? "🟢 GPS LIVE TRACKING ACTIVE"
              : "🟢 GPS LOCATION ACTIVE"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshLocation}
          activeOpacity={0.8}
        >
          <Text style={styles.refreshText}>
            🔄 UPDATE LOCATION
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD400",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },

  title: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  liveStatus: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 8,
  },

  mapContainer: {
    flex: 1,
    marginHorizontal: 12,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#ddd",
  },

  map: {
    flex: 1,
  },

  noMap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },

  noMapText: {
    fontSize: 20,
    fontWeight: "900",
  },

  bottomCard: {
    backgroundColor: "#fff",
    margin: 12,
    marginTop: 10,
    borderRadius: 18,
    padding: 18,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },

  coordinate: {
    fontSize: 15,
    color: "#444",
    marginBottom: 6,
  },

  activeBox: {
    backgroundColor: "#e8f5e9",
    borderRadius: 12,
    padding: 11,
    alignItems: "center",
    marginTop: 8,
  },

  activeText: {
    color: "#16803c",
    fontWeight: "900",
    fontSize: 13,
  },

  refreshButton: {
    backgroundColor: "#FFD400",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },

  refreshText: {
    color: "#111",
    fontSize: 15,
    fontWeight: "900",
  },

  info: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFD400",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
  },
});
