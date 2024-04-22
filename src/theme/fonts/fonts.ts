import { Platform } from "react-native";

type FontWeight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | undefined;

export type FontFamilyType = keyof typeof FONTS_IOS;

const FONT_CONFIG = {
  default: {
    regular: {
      fontFamily: "din_next_medium",
      fontWeight: "normal" as FontWeight
    }
  },
  regular: {
    fontFamily: "din_next_medium",
    fontWeight: "normal" as FontWeight
  },
  medium: {
    fontFamily: "din_next_bold",
    fontWeight: "normal" as FontWeight
  },
  light: {
    fontFamily: "din_next_light",
    fontWeight: "normal" as FontWeight
  },
  thin: {
    fontFamily: "din_next_light",
    fontWeight: "normal" as FontWeight
  }
};
const FONT_CONFIG_IOS = {
  default: {
    regular: {
      fontFamily: "DINNextLTW23-Medium",
      fontWeight: "500" as FontWeight
    }
  },
  regular: {
    fontFamily: "DINNextLTW23-Medium",
    fontWeight: "500" as FontWeight
  },
  medium: {
    fontFamily: "DINNextLTW23-Heavy",
    fontWeight: "800" as FontWeight
  },
  light: {
    fontFamily: "DINNextLTW23-Light",
    fontWeight: "300" as FontWeight
  },
  thin: {
    fontFamily: "DINNextLTW23-Light",
    fontWeight: "100" as FontWeight
  }
};

export const FONTS_IOS = {
  regular: "DINNextLTW23-Medium",
  light: "DINNextLTW23-Light",
  medium: "DINNextLTW23-Heavy",
  thin: "DINNextLTW23-Light"
};

export const FONTS_ANDROID = {
  regular: "din_next_medium",
  light: "din_next_light",
  medium: "din_next_bold",
  thin: "din_next_light"
};

export const FONTS = Platform.select({
  ios: {
    regular: "DINNextLTW23-Medium",
    medium: "DINNextLTW23-Heavy",
    light: "DINNextLTW23-Light",
    thin: "DINNextLTW23-Light"
  },
  android: {
    regular: "din_next_medium",
    medium: "din_next_bold",
    light: "din_next_light",
    thin: "din_next_light"
  }
});

export default {
  ios: FONT_CONFIG_IOS,
  android: FONT_CONFIG,
  web: FONT_CONFIG
};
