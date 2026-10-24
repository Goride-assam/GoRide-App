import "../i18n";
import { Stack, Redirect } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Constants from "expo-constants";

export default function RootLayout() {
  const isDriver = Constants.expoConfig?.extra?.appVariant === "driver";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      {/* Agar driver app hai, to direct driver dashboard par bhej do */}
      {isDriver && <Redirect href={"/driver" as any} />}
    </GestureHandlerRootView>
  );
}
