import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheet } from "../BottomSheet";
import { useTheme } from "../../theme/ThemeContext";
import { sheetRowShadow } from "../../theme/shadows";
import { PressableScale, StaggerIn } from "../motion";
import { hapticSuccess } from "../../lib/haptics";

type Option = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export function AddDocumentSheet({
  visible,
  onClose,
  onSelectPdf,
  onSelectWord,
  onSelectLink,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectPdf: () => void;
  onSelectWord: () => void;
  onSelectLink: () => void;
}) {
  const { colors, isDark } = useTheme();

  const options: Option[] = [
    {
      icon: "file-document-outline",
      title: "Upload a PDF",
      subtitle: "Up to 50 MB",
      onPress: onSelectPdf,
    },
    {
      icon: "microsoft-word",
      title: "Upload Word document",
      subtitle: ".docx or .doc",
      onPress: onSelectWord,
    },
    {
      icon: "link-variant",
      title: "Paste a web link",
      subtitle: "Any public article or page",
      onPress: onSelectLink,
    },
  ];

  const handleSelect = (opt: Option) => {
    void hapticSuccess();
    onClose();
    opt.onPress();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Add a document">
      <View style={styles.list}>
        {options.map((opt, i) => (
          <StaggerIn key={opt.title} index={i}>
            <PressableScale
              onPress={() => handleSelect(opt)}
              variant="card"
              haptic="light"
              style={[
                styles.row,
                sheetRowShadow(isDark),
                { backgroundColor: colors.sheetCardBg },
              ]}
            >
              <LinearGradient
                colors={[colors.brandGradientFrom, colors.brandGradientTo]}
                style={styles.iconBox}
              >
                <MaterialCommunityIcons name={opt.icon} size={22} color="#fff" />
              </LinearGradient>
              <View style={styles.text}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                  {opt.title}
                </Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                  {opt.subtitle}
                </Text>
              </View>
            </PressableScale>
          </StaggerIn>
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12, paddingBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: "600" },
  rowSub: { marginTop: 2, fontSize: 14 },
});
