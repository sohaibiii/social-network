import { TextInputProps, TextStyle, ViewStyle } from "react-native";

import { UseFormRegister } from "react-hook-form/dist/types/form";

import { FormikTextInputRef } from "~/components/formik/FormikTextInput/FormikTextInput.types";

export interface TextInputInterface extends TextInputProps {
  onChangeText?: (_val: string) => void | undefined;
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
  textInputContainerStyle?: ViewStyle;
  leftIconColor?: string;
  rightIconColor?: string;
  errorWithNoMessage?: boolean;
  dense?: boolean;
  theme?: ReactNativePaper.Theme;
  name?: string;
  register?: UseFormRegister<TextInputProps>;
  testID?: string;
  rightIconOnPressCb?: (_e: any) => void;
}
export type TextInputType = TextInputInterface;
