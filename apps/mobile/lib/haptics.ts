import { Platform } from "react-native";

type HapticsModule = typeof import("expo-haptics");

let Haptics: HapticsModule | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Haptics = require("expo-haptics") as HapticsModule;
} catch {
  Haptics = null;
}

const supported =
  (Platform.OS === "ios" || Platform.OS === "android") && Haptics != null;

export async function hapticLight() {
  if (!supported || !Haptics) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    /* native module unavailable */
  }
}

export async function hapticMedium() {
  if (!supported || !Haptics) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    /* native module unavailable */
  }
}

export async function hapticSuccess() {
  if (!supported || !Haptics) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    /* native module unavailable */
  }
}

export async function hapticSelection() {
  if (!supported || !Haptics) return;
  try {
    await Haptics.selectionAsync();
  } catch {
    /* native module unavailable */
  }
}

export async function hapticWarning() {
  if (!supported || !Haptics) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    /* native module unavailable */
  }
}
