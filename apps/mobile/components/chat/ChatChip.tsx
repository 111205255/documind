import { Text, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { PressableScale, StaggerIn } from "../motion";
import { Stagger } from "../../theme/motion";

export function ChatChip({
  label,
  index = 0,
  onPress,
  style,
}: {
  label: string;
  index?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();

  return (
    <StaggerIn index={index} step={Stagger.chip} baseDelay={40}>
      <PressableScale
        onPress={onPress}
        variant="chip"
        haptic="selection"
        style={[
          styles.chip,
          {
            backgroundColor: colors.chatChipBg,
            borderColor: colors.chatChipBorder,
          },
          style,
        ]}
      >
        <Text style={[styles.chipText, { color: colors.textPrimary }]}>{label}</Text>
      </PressableScale>
    </StaggerIn>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
  },
  chipText: { fontSize: 15, fontWeight: "500" },
});
