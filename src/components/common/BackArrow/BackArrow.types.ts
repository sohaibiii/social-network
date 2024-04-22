import { TextStyle } from "react-native";

interface BackArrowInterface {
  onPress?: () => void | undefined;
  size?: number;
  color?: string;
  style?: TextStyle;
}
export type BackArrowType = BackArrowInterface;
