import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";

export default function OtpScreen() {
  const [otp, setOtp] = useState("");

  const verifyOtp = () => {
    if (otp === "1234") {
      Alert.alert(
        "Success ✅",
        "OTP Verified"
      );

      router.push("/login");
    } else {
      Alert.alert(
        "Invalid OTP ❌",
        "Please enter the correct 4 digit OTP."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>
            🔐
          </Text>
        </View>

        <Text style={styles.logo}>
          GoRide
        </Text>

        <Text style={styles.title}>
          Verify Your Account
        </Text>

        <Text style={styles.subtitle}>
          Enter the 4-digit OTP sent to your mobile number
        </Text>

        <View style={styles.card}>

          <Text style={styles.label}>
            Enter OTP
          </Text>

          <TextInput
            style={styles.input}
            placeholder="• • • •"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            maxLength={4}
            value={otp}
            onChangeText={setOtp}
            textContentType="oneTimeCode"
            autoFocus
          />

          <TouchableOpacity
            style={[
              styles.button,
              otp.length !== 4 && styles.disabledButton,
            ]}
            onPress={verifyOtp}
            disabled={otp.length !== 4}
          >
            <Text style={styles.buttonText}>
              VERIFY OTP
            </Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>
              💡
            </Text>

            <Text style={styles.infoText}>
              For testing, use OTP 1234
            </Text>
          </View>

        </View>

        <Text style={styles.footer}>
          GoRide • Safe • Simple • Reliable
        </Text>

      </View>
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
    justifyContent: "center",
    padding: 20,
  },

  logoCircle: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#fff",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    marginBottom: 8,
  },

  logoIcon: {
    fontSize: 36,
  },

  logo: {
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    color: "#111",
  },

  title: {
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
    color: "#111",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 7,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    elevation: 6,
  },

  label: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
    marginBottom: 10,
  },

  input: {
    height: 65,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
    borderRadius: 14,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 12,
    textAlign: "center",
    color: "#111",
    marginBottom: 18,
  },

  button: {
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.45,
  },

  buttonText: {
    color: "#FFD400",
    fontSize: 16,
    fontWeight: "900",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff8cc",
    borderRadius: 10,
    padding: 10,
    marginTop: 18,
  },

  infoIcon: {
    fontSize: 17,
    marginRight: 7,
  },

  infoText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    color: "#555",
    fontSize: 12,
    marginTop: 25,
  },
});
