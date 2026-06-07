import { Image, type ImageStyle, type StyleProp } from "react-native";

const googleG = require("../assets/google-g.png");

/** Standard multicolor Google "G" — matches web / Figma login frame */
export function GoogleIcon({
  size = 20,
  style,
}: {
  size?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={googleG}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}
