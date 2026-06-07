import { View, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export function OnboardingDots({ active = 0, total = 3 }: { active?: number; total?: number }) {
  const { colors } = useTheme();

  return (
    <View style={styles.row} accessibilityRole="tablist">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === active ? colors.brandPrimary : colors.authDotInactive,
            },
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: i === active }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
