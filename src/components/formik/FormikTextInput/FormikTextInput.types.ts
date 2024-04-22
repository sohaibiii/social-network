import { TextInputProps, TextStyle, ViewStyle } from "react-native";

import { Control } from "react-hook-form";
import { UseFormRegister } from "react-hook-form/dist/types/form";

export type FormikTextInputRef = {
  gainFocus: () => void;
};

export interface FormikTextInputInterface extends TextInputProps {
  onChangeTextCb?: (_val: string) => void | undefined;
  onBlur?: (_e: any) => void;
  value?: string;
  placeholder?: string;
  label?: string;
  rightIcon?: string;
  leftIcon?: string;
  underlineColor?: string;
  error?: string;
  errorVisible?: boolean;
  isPassword?: boolean;
  numberOfLines?: number;
  mode?: "outlined" | "flat";
  style?: TextStyle;
  control?: Control<Record<string, string>>;
  name?: string;
  textInputContainerStyle?: ViewStyle;
  defaultValue?: string;
  errorWithNoMessage?: boolean;
  register?: UseFormRegister<TextInputProps>;
  theme?: ReactNativePaper.Theme;
  testID?: string;
  regex: string;
  shouldTrim?: boolean;
  onRegexFail: () => void;
  rightIconOnPressCb?: () => void;
}

export type FormikTextInputType = FormikTextInputInterface;
