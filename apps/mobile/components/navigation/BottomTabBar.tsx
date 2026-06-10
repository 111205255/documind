import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { usePathname } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeContext";
import { useMotionEnabled } from "../../hooks/use-reduced-motion";
import { PressableScale, AnimatedIonIcon } from "../motion";
import { navigate } from "../../lib/nav";
import { hapticSelection } from "../../lib/haptics";
import { Spring } from "../../theme/motion";

type TabKey = "home" | "chats" | "settings";

const TAB_CONFIG = [
  {
    key: "home" as const,
    href: "/home",
    label: "Documents",
    icon: "folder-outline" as const,
    activeIcon: "folder" as const,
  },
  {
    key: "chats" as const,
    href: "/chats",
    label: "Chats",
    icon: "chatbubbles-outline" as const,
    activeIcon: "chatbubbles" as const,
  },
  {
    key: "settings" as const,
    href: "/settings",
    label: "Settings",
    icon: "settings-outline" as const,
    activeIcon: "settings" as const,
  },
] as const;

function TabIndicator({
  activeIndex,
  tabWidth,
  color,
}: {
  activeIndex: number;
  tabWidth: number;
  color: string;
}) {
  const motion = useMotionEnabled();
  const translateX = useSharedValue(activeIndex * tabWidth);

  useEffect(() => {
    const target = activeIndex * tabWidth + (tabWidth - 32) / 2;
    if (!motion) {
      translateX.value = target;
      return;
    }
    translateX.value = withSpring(target, Spring.surface);
  }, [activeIndex, tabWidth, motion, translateX]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.indicator,
        { width: 32, backgroundColor: color },
        motion ? style : { transform: [{ translateX: activeIndex * tabWidth + (tabWidth - 32) / 2 }] },
      ]}
    />
  );
}

function resolveActiveTab(pathname: string): TabKey {
  if (pathname.startsWith("/chats") || pathname.startsWith("/chat/")) return "chats";
  if (pathname.startsWith("/settings")) return "settings";
  return "home";
}

export function BottomTabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors, isDark } = useTheme();
  const activeTab = resolveActiveTab(pathname);
  const activeIndex = TAB_CONFIG.findIndex((t) => t.key === activeTab);
  const tabWidth = width / TAB_CONFIG.length;

  const onTabPress = (href: string) => {
    void hapticSelection();
    navigate(href as never);
  };

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: isDark ? "rgba(18,18,20,0.92)" : "rgba(255,255,255,0.92)",
          borderTopColor: colors.docSearchBorder,
        },
      ]}
      accessibilityRole="tablist"
      testID="bottom-tab-bar"
    >
      <TabIndicator activeIndex={activeIndex} tabWidth={tabWidth} color={colors.brandPrimary} />
      <View style={styles.tabsRow}>
        {TAB_CONFIG.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <PressableScale
              key={tab.key}
              onPress={() => onTabPress(tab.href)}
              variant="chip"
              haptic={false}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              testID={`tab-${tab.key}`}
            >
              <AnimatedIonIcon
                name={tab.icon}
                activeName={tab.activeIcon}
                active={active}
                size={24}
                color={colors.textTertiary}
                activeColor={colors.brandPrimary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: active ? colors.brandPrimary : colors.textTertiary },
                  active && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    position: "absolute",
    top: 4,
    left: 0,
    height: 3,
    borderRadius: 2,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  tabLabelActive: {
    fontWeight: "700",
  },
});
