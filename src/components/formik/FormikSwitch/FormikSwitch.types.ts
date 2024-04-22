import { StyleProp, ViewStyle, TextStyle } from "react-native";

import { Control } from "react-hook-form";

import { SwitchSizes, SwitchTypes } from "~/components/common/Switch/Switch.types";

interface SwitchInterface {
  label?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  type?: SwitchTypes;
  size?: Record<SwitchSizes, string> | SwitchSizes;
  disabled?: boolean;
  onToggleCb?: (_value: boolean) => void;
  testID?: string;
  control?: Control<Record<string, string>>;
  name?: string;
  defaultValue?: boolean;
}
export type FormikSwitchProps = SwitchInterface;
