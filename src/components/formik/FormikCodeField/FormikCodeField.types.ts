import { TextInputProps, TextStyle, ViewStyle, KeyboardType } from "react-native";

import { Control, UseFormSetFocus } from "react-hook-form";
import { UseFormRegister } from "react-hook-form/dist/types/form";

export interface FormikCodeFieldInterface extends TextInputProps {
  onChangeTextCb?: (_val: string) => void | undefined;
  onBlur?: (_e: any) => void;
  value?: string;
  placeholder?: string;
  label?: string;
  rightIcon?: string;
  leftIcon?: string;
  underlineColor?: string;
  error?: string;
  isPassword?: boolean;
  numberOfLines?: number;
  mode?: "outlined" | "flat";
  style?: TextStyle;
  control?: Control<Record<string, string>>;
  name?: string;
  errorWithNoMessage?: boolean;
  textInputContainerStyle?: ViewStyle;
  setFocus?: UseFormSetFocus<TextInputProps>;
  register?: UseFormRegister<TextInputProps>;
  defaultValue?: string;
  theme?: ReactNativePaper.Theme;
  testID?: string;
  keyboardType?: KeyboardType;
}

export type FormikCodeFieldType = FormikCodeFieldInterface;
