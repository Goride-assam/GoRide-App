import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "../../config/supabase";

export default function DriverRegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const registerDriver = async () => {
    if (submitting) {
      return;
    }

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanVehicle = vehicle.trim();
    const cleanVehicleNo = vehicleNo.trim().toUpperCase();

    if (
      !cleanName ||
      !cleanPhone ||
      !cleanVehicle ||
      !cleanVehicleNo
    ) {
      Alert.alert(
        "Missing Details ❌",
        "Please fill in all driver and vehicle details."
      );
      return;
    }

    if (cleanName.length < 2) {
      Alert.alert(
        "Invalid Name ❌",
        "Please enter a valid driver name."
      );
      return;
    }

    if (cleanPhone.length !== 10) {
      Alert.alert(
        "Invalid Phone ❌",
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    try {
      setSubmitting(true);

      /*
       * DRIVER AUTH
       *
       * Supabase Auth needs an email/password account.
       * The driver phone number is stored in user metadata.
       *
       * A deterministic internal email is generated from the
       * driver's phone number so the existing driver registration
       * screen does not need an email field.
       */
      const driverEmail =
        `driver.${cleanPhone}@goride.local`;

      const driverPassword =
        `GoRide@${cleanPhone}`;

      console.log(
        "========== DRIVER SUPABASE REGISTRATION =========="
      );

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: driverEmail,
        password: driverPassword,
        options: {
          data: {
            name: cleanName,
            phone: cleanPhone,
            vehicle: cleanVehicle,
            vehicleNo: cleanVehicleNo,
            rating: "New ⭐",
            role: "Driver",
          },
        },
      });

      if (error) {
        console.log(
          "SUPABASE DRIVER REGISTER ERROR:",
          error
        );

        /*
         * If this driver already has a Supabase Auth account,
         * try signing in with the same internal credentials.
         */
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: driverEmail,
            password: driverPassword,
          });

        if (loginError || !loginData.user) {
          throw error;
        }

        console.log(
          "EXISTING DRIVER SUPABASE LOGIN SUCCESS:",
          loginData.user.id
        );

        const existingDriverRegistration = {
          id: loginData.user.id,
          name: cleanName,
          phone: cleanPhone,
          vehicle: cleanVehicle,
          vehicleNo: cleanVehicleNo,
          rating: "New ⭐",
          registered: true,
          date: new Date().toISOString(),
        };

        await AsyncStorage.setItem(
          "driverRegistration",
          JSON.stringify(existingDriverRegistration)
        );

        Alert.alert(
          "Driver Ready ✅",
          "Your GoRide driver account is ready.",
          [
            {
              text: "CONTINUE",
              onPress: () => router.replace("/driver"),
            },
          ]
        );

        return;
      }

      if (!data.user) {
        throw new Error(
          "Supabase driver account could not be created."
        );
      }

      /*
       * IMPORTANT:
       * Save the Supabase Auth UUID locally.
       * This same UUID will be used as driver_documents.driver_id.
       */
      const driverRegistration = {
        id: data.user.id,
        name: cleanName,
        phone: cleanPhone,
        vehicle: cleanVehicle,
        vehicleNo: cleanVehicleNo,
        rating: "New ⭐",
        registered: true,
        date: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        "driverRegistration",
        JSON.stringify(driverRegistration)
      );

      console.log(
        "✅ SUPABASE DRIVER CREATED:",
        data.user.id
      );

      /*
       * Supabase may require email confirmation depending
       * on project Auth settings. For this driver flow,
       * continue only when a session exists.
       */
      if (!data.session) {
        Alert.alert(
          "Driver Account Created ⚠️",
          "Driver account was created, but Supabase requires email confirmation. Please disable email confirmation in Supabase Auth or configure the driver authentication flow before uploading documents."
        );

        return;
      }

      Alert.alert(
        "Registration Successful ✅",
        "Your GoRide driver registration has been saved.",
        [
          {
            text: "CONTINUE",
            onPress: () => router.replace("/driver"),
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "DRIVER REGISTRATION ERROR:",
        error
      );

      Alert.alert(
        "Registration Error ❌",
        error?.message ||
          "Unable to create your driver account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>
          GoRide 🚲
        </Text>

        <Text style={styles.title}>
          Become a Driver
        </Text>

        <Text style={styles.subtitle}>
          Register your vehicle and start earning with GoRide.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Driver Details
          </Text>

          <Text style={styles.label}>
            Driver Name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            editable={!submitting}
          />

          <Text style={styles.label}>
            Phone Number
          </Text>

          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            editable={!submitting}
          />

          <Text style={styles.sectionTitle}>
            Vehicle Details
          </Text>

          <Text style={styles.label}>
            Vehicle
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Example: Swift Dzire"
            placeholderTextColor="#999"
            value={vehicle}
            onChangeText={setVehicle}
            editable={!submitting}
          />

          <Text style={styles.label}>
            Vehicle Number
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Example: AS01AB1234"
            placeholderTextColor="#999"
            autoCapitalize="characters"
            value={vehicleNo}
            onChangeText={setVehicleNo}
            editable={!submitting}
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              🔐 Secure Driver Registration
            </Text>

            <Text style={styles.infoText}>
              Your driver account is securely connected to
              GoRide authentication. Your uploaded documents
              will be linked to your private driver account.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            submitting && styles.disabledButton,
          ]}
          onPress={registerDriver}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting
              ? "REGISTERING..."
              : "🚕 REGISTER AS DRIVER"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Text style={styles.backButtonText}>
            ← BACK
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          GoRide • Safe • Simple • Reliable
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFD400",
  },

  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
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
    marginTop: 5,
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 22,
    lineHeight: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#111",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111",
    marginTop: 8,
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 7,
  },

  input: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111",
    marginBottom: 15,
  },

  infoBox: {
    backgroundColor: "#fff8cc",
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111",
    marginBottom: 5,
  },

  infoText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 19,
  },

  button: {
    backgroundColor: "#111",
    paddingVertical: 17,
    borderRadius: 13,
    alignItems: "center",
    elevation: 4,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#FFD400",
    fontSize: 16,
    fontWeight: "900",
  },

  backButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 14,
    borderRadius: 13,
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
    color: "#999",
    fontSize: 12,
    marginTop: 22,
  },
});
