import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  ImageResizeMode,
} from "react-native";

import { FastImageProps } from "react-native-fast-image";
import { Source } from "react-native-fast-image";

interface ProgressiveImageInterface {
  source: Source;
  thumbnailSource: ImageSourcePropType;
  loadingSource?: Source;
  errorSource?: Source;
  loadingImageComponent?: JSX.Element;
  blurRadius?: number;
  imageAnimationDuration?: number;
  thumbnailAnimationDuration?: number;

  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
  width?: number;
  height?: number;
  testID?: string;
  resizeMode?: ImageResizeMode;
}
export type ProgressiveImageType = ProgressiveImageInterface;
export type FastImageType = FastImageProps;
