import { ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from "react-native";

import { Asset } from "react-native-image-picker";

interface UserProfileImageInterface {
  isTraveller?: boolean;
  width?: number;
  height?: number;
  source?: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  borderRadius?: number;
  onImagePicked?: (image: Asset) => void;
  onImageDeleted?: () => void;
  firstNameCharacters?: string;
}
export type UserProfileImageType = UserProfileImageInterface;
