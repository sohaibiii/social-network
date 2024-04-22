import { StyleProp, TextStyle, ViewStyle } from "react-native";

interface CheckBoxInterface {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
  checkboxColor?: string;
  checkboxUncheckedColor?: string;
  onPressCb?: (_state: boolean) => void;
  disabled?: boolean;
  testID?: string;
  defaultValue?: boolean;
}

export type CheckBoxType = CheckBoxInterface;
