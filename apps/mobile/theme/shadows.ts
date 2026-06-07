import { type ViewStyle } from "react-native";

/** Shadow presets mirroring apps/web/styles/tokens.css */

export function docCardShadow(isDark: boolean): ViewStyle {
  return {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.35 : 0.06,
    shadowRadius: isDark ? 16 : 16,
    elevation: isDark ? 4 : 3,
  };
}

export function docEmptyIconShadow(isDark: boolean): ViewStyle {
  return {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.4 : 0.08,
    shadowRadius: isDark ? 32 : 32,
    elevation: isDark ? 8 : 6,
  };
}

export function docFabShadow(): ViewStyle {
  return {
    shadowColor: "#ff5b4a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  };
}

export function settingsCardShadow(isDark: boolean): ViewStyle {
  return isDark
    ? {}
    : {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      };
}

export function sheetRowShadow(isDark: boolean): ViewStyle {
  return isDark
    ? {}
    : {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      };
}

export function authButtonShadow(isDark: boolean): ViewStyle {
  if (!isDark) return {};
  return {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  };
}

export function logoShadow(glowColor: string): ViewStyle {
  return {
    shadowColor: glowColor,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 12,
  };
}
