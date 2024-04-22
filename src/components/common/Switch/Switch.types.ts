import { StyleProp, ViewStyle, TextStyle } from "react-native";

interface SwitchInterface {
  label?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  type?: SwitchTypes;
  size?: Record<SwitchSizes, string> | SwitchSizes;
  disabled?: boolean;
  onToggle?: (value: boolean) => void;
  testID?: string;
  defaultValue?: boolean;
}
export enum SwitchTypes {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal"
}
export enum SwitchSizes {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large"
}
export type SwitchProps = SwitchInterface;
