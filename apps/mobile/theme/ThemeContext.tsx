import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import { darkColors, lightColors, type ThemeColors } from "./colors";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  const isDark =
    themeMode === "system" ? systemScheme === "dark" : themeMode === "dark";

  const value = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      themeMode,
      setThemeMode,
    }),
    [isDark, themeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
