import "react-native-reanimated";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NetworkGuard } from "../components/NetworkGuard";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../theme/ThemeContext";

function RootStack() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: "fade" }} />
        <Stack.Screen name="login" />
        <Stack.Screen name="auth/callback" options={{ animation: "fade" }} />
        <Stack.Screen name="home" />
        <Stack.Screen name="document/[id]/details" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="document/[id]/processing" options={{ animation: "fade" }} />
        <Stack.Screen name="chat/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="chats" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="connection" options={{ animation: "slide_from_right" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NetworkGuard>
              <RootStack />
            </NetworkGuard>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
