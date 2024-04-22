import { ViewStyle } from "react-native";

interface RadioBarInterface {
  children?: JSX.Element[];
  ratingCount?: number;
  type?: string;
  size?: number;
  useCeil?: boolean;
  spacing?: number;
  onToggleCb?: (_value: number) => void;
  defaultValue?: number;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  testID?: string;
}
export type RadioBarProps = RadioBarInterface;
