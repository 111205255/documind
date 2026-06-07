/** DocuMind tokens — aligned with apps/web/styles/tokens.css */

export const lightColors = {
  brandPrimary: "#ff4d4d",
  brandPrimaryHover: "#ff3b3b",
  brandGradientFrom: "#ff6b4a",
  brandGradientTo: "#ff2e3b",
  brandGlow: "rgba(255, 91, 74, 0.35)",

  pageBg: "#ffffff",
  glowA: "rgba(255, 200, 190, 0.55)",
  glowB: "rgba(255, 210, 200, 0.45)",

  textPrimary: "#0a0a0a",
  textSecondary: "#6b7280",
  textTertiary: "#9ca3af",
  textFooter: "#9ca3af",

  borderDefault: "#e5e5e5",
  borderStrong: "#d4d4d4",
  surfaceRaised: "#ffffff",

  authFeatureIconBg: "#f5f5f5",
  authFeatureIconBorder: "transparent",
  authButtonBg: "#ffffff",
  authButtonBorder: "#e5e5e5",
  authButtonText: "#0a0a0a",
  authDotInactive: "#d4d4d8",

  docSearchBg: "#f3f4f6",
  docSearchBorder: "#ebebeb",
  docCardBg: "#ffffff",
  docCardShadow: "#000000",
  docEmptyIconBg: "#ffffff",
  docChevron: "#c4c4c4",

  sheetBg: "#e8e8ed",
  sheetCardBg: "#ffffff",
  sheetHandle: "#c7c7cc",

  chatUserBubble: "#ff4d4d",
  chatAssistantBubble: "#ffffff",
  chatChipBg: "#ffffff",
  chatChipBorder: "#e5e5e5",
  chatInputBg: "#ffffff",
  citationTagBg: "#fff1f0",
  citationText: "#c62828",
  citationBorder: "#ffcdd2",
  progressTrack: "#e5e5e5",

  settingsCardBg: "#ffffff",
  settingsDivider: "#e5e5e5",
  settingsIconBg: "#f3f4f6",
  destructive: "#ff4d4d",
  destructiveIconBg: "#fff1f0",
  linkFieldBg: "#f3f4f6",
} as const;

export const darkColors = {
  brandPrimary: "#ff4d4d",
  brandPrimaryHover: "#ff3b3b",
  brandGradientFrom: "#ff6b4a",
  brandGradientTo: "#ff2e3b",
  brandGlow: "rgba(255, 80, 60, 0.25)",

  pageBg: "#000000",
  glowA: "rgba(80, 20, 20, 0.65)",
  glowB: "rgba(60, 15, 15, 0.5)",

  textPrimary: "#ffffff",
  textSecondary: "#9ca3af",
  textTertiary: "#6b7280",
  textFooter: "#6b7280",

  borderDefault: "#27272a",
  borderStrong: "#3f3f46",
  surfaceRaised: "#111111",

  authFeatureIconBg: "#1a1a1a",
  authFeatureIconBorder: "#2a2a2a",
  authButtonBg: "#1f2937",
  authButtonBorder: "#374151",
  authButtonText: "#ffffff",
  authDotInactive: "#3f3f46",

  docSearchBg: "#1a1a1a",
  docSearchBorder: "#2a2a2a",
  docCardBg: "#141414",
  docCardShadow: "#000000",
  docEmptyIconBg: "#1a1a1a",
  docChevron: "#52525b",

  sheetBg: "#1c1c1e",
  sheetCardBg: "#2c2c2e",
  sheetHandle: "#48484a",

  chatUserBubble: "#ff4d4d",
  chatAssistantBubble: "#1c1c1e",
  chatChipBg: "#1c1c1e",
  chatChipBorder: "#3a3a3c",
  chatInputBg: "#1c1c1e",
  citationTagBg: "#2a0a0a",
  citationText: "#ff8a80",
  citationBorder: "#4a1515",
  progressTrack: "#2c2c2e",

  settingsCardBg: "#1c1c1e",
  settingsDivider: "#2c2c2e",
  settingsIconBg: "#2c2c2e",
  destructive: "#ff4d4d",
  destructiveIconBg: "#2a1515",
  linkFieldBg: "#2c2c2e",
} as const;

export type ThemeColors = typeof lightColors | typeof darkColors;
