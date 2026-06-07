import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";
import { logoShadow } from "../theme/shadows";

type Size = "lg" | "md";

const sizes: Record<Size, { box: number; icon: number }> = {
  lg: { box: 88, icon: 40 },
  md: { box: 72, icon: 32 },
};

export function AppLogo({ size = "lg" }: { size?: Size }) {
  const { colors } = useTheme();
  const dim = sizes[size];

  return (
    <View
      style={[
        styles.shadow,
        logoShadow(colors.brandGlow),
        { width: dim.box, height: dim.box },
      ]}
    >
      <LinearGradient
        colors={[colors.brandGradientFrom, colors.brandGradientTo]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.box, { width: dim.box, height: dim.box, borderRadius: 22 }]}
      >
        <MaterialCommunityIcons name="file-document-outline" size={dim.icon} color="#fff" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
  },
});
