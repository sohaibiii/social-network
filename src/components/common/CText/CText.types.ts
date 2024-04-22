import { StyleProp, TextStyle } from "react-native";

import { FontFamilyType } from "~/theme/fonts/fonts";
import { ColorType } from "~/theme/theme.types";

export interface CTextProps {
  style?: StyleProp<TextStyle> | undefined;
  children?: any;
  fontSize?: number;
  fontFamily?: FontFamilyType;
  color?: ColorType;
  lineHeight?: number;
  textAlign?: "auto" | "left" | "right" | "center" | "justify" | undefined;
  forceRTL?: boolean;
}
