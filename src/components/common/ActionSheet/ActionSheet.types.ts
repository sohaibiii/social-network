import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface ActionSheetInterface {
  mode?: "text" | "outlined" | "contained";
  dark?: boolean;
  compact?: boolean;
  color?: string;
  loading?: boolean;
  icon?: IconSource;
  title?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  uppercase?: boolean;
  accessibilityLabel?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  mediaType?: "video" | "mixed" | "photo";
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  theme?: ReactNativePaper.Theme;
  iconColor: string;
  options: ActionSheetOption[];
  testID?: string;
  text?: string;
  textStyle?: TextStyle;
  buttonStyle?: ViewStyle;
}

interface ActionSheetOption {
  title: string;
  id: string;
  icon?: string;
  callback: () => void;
}

export type ActionSheetType = ActionSheetInterface;
