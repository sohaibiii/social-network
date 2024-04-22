import { StyleProp, ViewStyle, TextStyle } from "react-native";

interface Props {
  name: string;
  width?: number | string;
  height?: number | string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle> & StyleProp<TextStyle>;
  aspectRatio?: number;
  startColor?: string;
  endColor?: string;
  focused?: boolean;
  testID?: string;
  disabled?: boolean;
}

export type SafIconProps = Props;
