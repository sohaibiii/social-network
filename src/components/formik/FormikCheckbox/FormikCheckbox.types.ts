import { StyleProp, TextStyle } from "react-native";

import { Control } from "react-hook-form";

interface CheckboxInterface {
  containerStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
  checkboxColor?: string;
  checkboxUncheckedColor?: string;
  disabled?: boolean;
  onToggleCb?: (_value: boolean) => void;
  testID?: string;
  control?: Control<Record<string, string>>;
  name?: string;
  defaultValue?: string;
  disableError?: boolean;
}
export type FormikCheckboxProps = CheckboxInterface;
