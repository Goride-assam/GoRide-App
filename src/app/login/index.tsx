import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { loginCustomer } from "../../data/userData";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      await loginCustomer(
        email.trim().toLowerCase(),
        password
      );

      console.log("CUSTOMER LOGIN SUCCESS");

      router.replace("/home");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);

      const message =
        typeof error?.message === "string"
          ? error.message
          : "";

      if (
        message.toLowerCase().includes("email not confirmed")
      ) {
        Alert.alert(
          "Email Not Verified",
          "Please confirm your email before logging in."
        );
      } else if (message) {
        Alert.alert(
          "Login Failed",
          message
        );
      } else {
        Alert.alert(
          "Login Error",
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🚲</Text>
          </View>

          <Text style={styles.logo}>
            GoRide
          </Text>

          <Text style={styles.subtitle}>
            Welcome back 👋
          </Text>

          <Text style={styles.description}>
            Login to continue your ride.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>
              Email Address
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              editable={!loading}
            />

            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading
                  ? "LOGGING IN..."
                  : "LOGIN"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerBox}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/register")}
              disabled={loading}
            >
              <Text style={styles.register}>
                Register Now
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            GoRide • Safe • Simple • Reliable
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFD400",
  },

  flex: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
    paddingBottom: 35,
  },

  logoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#fff",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 4,
  },

  logoIcon: {
    fontSize: 40,
  },

  logo: {
    fontSize: 38,
    fontWeight: "900",
    color: "#111",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
    marginTop: 8,
  },

  description: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 17,
    fontSize: 16,
    color: "#111",
  },

  button: {
    backgroundColor: "#FFD400",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 3,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#111",
    fontSize: 17,
    fontWeight: "900",
  },

  registerBox: {
    alignItems: "center",
    marginTop: 22,
  },

  registerText: {
    fontSize: 14,
    color: "#333",
  },

  register: {
    color: "#111",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 6,
    textDecorationLine: "underline",
  },

  footer: {
    textAlign: "center",
    color: "#555",
    fontSize: 12,
    marginTop: 25,
  },
});
