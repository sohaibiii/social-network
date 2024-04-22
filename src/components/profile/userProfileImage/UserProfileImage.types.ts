import { ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from "react-native";

interface UserProfileImageInterface {
  onPress?: () => void;
  isTraveller?: boolean;
  width?: number;
  height?: number;
  source?: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  borderRadius?: number;
  shouldRenderProgressive?: boolean;
}
export type UserProfileImageType = UserProfileImageInterface;
