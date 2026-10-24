import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { currentRide } from "../../data/rideData";
import {
  driverLocation,
  listenToDriverLocation,
} from "../../data/driverLocationData";

type DriverLocation = {
  latitude: number;
  longitude: number;
};

export default function TrackRide() {
  const [location, setLocation] =
    useState<DriverLocation>(driverLocation);

  const [locationReady, setLocationReady] =
    useState(false);

  useEffect(() => {
    const unsubscribe = listenToDriverLocation(
      (nextLocation) => {
        if (nextLocation) {
          setLocation(nextLocation);
          setLocationReady(true);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Track Ride 📍
      </Text>

      {/* DRIVER LIVE MAP */}
      <View style={styles.mapCard}>
        <Text style={styles.mapTitle}>
          Driver Live Location 🚕
        </Text>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsCompass
          showsScale
          zoomEnabled
          scrollEnabled
          rotateEnabled
          pitchEnabled
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="GoRide Driver"
            description="Driver live location"
          />
        </MapView>

        <View style={styles.liveBar}>
          <View
            style={[
              styles.liveDot,
              {
                backgroundColor: locationReady
                  ? "#16803c"
                  : "#f39c12",
              },
            ]}
          />

          <Text style={styles.liveText}>
            {locationReady
              ? "Driver location is LIVE"
              : "Waiting for live driver location..."}
          </Text>
        </View>
      </View>

      {/* RIDE DETAILS */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          Ride Details
        </Text>

        <Text style={styles.text}>
          Booking ID: {currentRide.id || "No Ride"}
        </Text>

        <Text style={styles.text}>
          Passenger: {currentRide.userName || "User"}
        </Text>

        <Text style={styles.text}>
          Pickup: {currentRide.pickup || "-"}
        </Text>

        <Text style={styles.text}>
          Drop: {currentRide.drop || "-"}
        </Text>

        <Text style={styles.text}>
          Fare: ₹{currentRide.fare}
        </Text>

        <Text style={styles.status}>
          Status: {currentRide.status}
        </Text>

      </View>

      {/* DRIVER DETAILS */}
      <View style={styles.card}>

        <Text style={styles.heading}>
          Driver Details 🚗
        </Text>

        <Text style={styles.text}>
          Name: Raj Kumar
        </Text>

        <Text style={styles.text}>
          Rating: ⭐ 4.8
        </Text>

        <Text style={styles.text}>
          Vehicle: Bike
        </Text>

        <Text style={styles.text}>
          Vehicle No: AS01AB1234
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },

  mapCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
  },

  mapTitle: {
    fontSize: 19,
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },

  map: {
    width: "100%",
    height: 260,
  },

  liveBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },

  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  liveText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  text: {
    fontSize: 16,
    marginBottom: 8,
  },

  status: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
});
