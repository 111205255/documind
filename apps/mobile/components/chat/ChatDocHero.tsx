import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext";

const SIZE = 76;
const ICON = 36;

/** Empty-chat center document icon (static). */
export function ChatDocHero() {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[colors.brandGradientFrom, colors.brandGradientTo]}
        start={{ x: 0.35, y: 0 }}
        end={{ x: 0.65, y: 1 }}
        style={styles.box}
      >
        <MaterialCommunityIcons name="file-document-outline" size={ICON} color="#fff" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  box: {
    width: SIZE,
    height: SIZE,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
});
