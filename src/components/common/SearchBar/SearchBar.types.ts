import { StyleProp, ViewStyle } from "react-native";

interface RadioButtonInterface {
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export type RadioButtonProps = RadioButtonInterface;
