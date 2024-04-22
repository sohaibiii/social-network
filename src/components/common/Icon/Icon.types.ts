import { ViewStyle } from "react-native";

export enum IconTypes {
  ANT_DESIGN = "AntDesign",
  ENTYPO = "Entypo",
  EVIL_ICONS = "EvilIcons",
  FEATHER = "Feather",
  FONTAWESOME = "FontAwesome",
  FONTAWESOME5 = "FontAwesome5",
  FONTISTO = "Fontisto",
  FOUNDATION = "Foundation",
  ION_ICONS = "Ionicons",
  MATERIAL_COMMUNITY_ICONS = "MaterialCommunityIcons",
  MATERIAL_ICONS = "MaterialIcons",
  OCTICONS = "Octicons",
  SIMPLELINE_ICONS = "SimpleLineIcons",
  SAFARWAY_ICONS = "SafarwayIcons",
  ZOCIAL = "Zocial"
}

export interface IconInterface {
  type?: IconTypes;
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  startColor?: string;
  width?: number;
  height?: number;
  endColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}
export type IconType = IconInterface;
