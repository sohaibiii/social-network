import { StyleProp, ViewStyle, TextStyle } from "react-native";

interface RadioButtonInterface {
  label?: (_isChecked: boolean) => JSX.Element | string;
  color?: string;
  checked?: string;
  uncheckedColor?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  mode?: "ios" | "android" | undefined;
  value?: string;
  testID?: string;
  onPress?: (_props: string) => void;
}

export type RadioButtonProps = RadioButtonInterface;
