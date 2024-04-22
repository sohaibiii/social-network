import React from "react";

interface BottomTabButtonInterface {
  onPress: () => void | undefined;
  children?: React.ReactNode;
  shouldRotate?: boolean;
  text?: string;
  isFocused?: boolean;
  testID?: string;
  isThemeDark?: boolean;
}
export type BottomTabButtonType = BottomTabButtonInterface;
