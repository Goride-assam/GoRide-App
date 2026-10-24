import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  loadUser,
  currentUser,
} from "../data/userData";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const result = await loadUser();

      if (result && currentUser.role === "Customer") {
        router.replace("/home");
        return;
      }

      setLoading(false);
    } catch (error) {
      console.log("USER CHECK ERROR:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        GoRide 🚲
      </Text>

      <Text style={styles.subtitle}>
        Customer App
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>
          Login 🔐
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.register}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.buttonText}>
          Register 📝
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFD400",
  },

  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#111",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 35,
  },

  button: {
    width: "90%",
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },

  register: {
    width: "90%",
    backgroundColor: "#208AEF",
    padding: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
