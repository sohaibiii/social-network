import React from "react";
import { StyleProp, TextStyle, TouchableOpacityProps, ViewStyle } from "react-native";

import { IconTypes } from "~/components/";

interface ButtonInterface extends TouchableOpacityProps {
  icon?: string;
  iconType?: IconTypes;
  title?: string;
  children?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  theme?: ReactNativePaper.Theme;
  labelStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  finishedLoading?: boolean;
  finishedIcon?: string;
  iconSize?: number;
  iconColor?: string;
  onPress?: () => void;
  testID?: string;
  iconLeft?: number;
  disabled?: boolean;
  subtitle?: string;
  subtitleStyle?: StyleProp<TextStyle>;
}
export type ButtonType = ButtonInterface;
