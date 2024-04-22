import { ViewStyle, ImageStyle, StyleProp } from "react-native";

import { Source } from "react-native-fast-image";

interface ProgressiveViewerImageInterface {
  source: Source;
  borderRadius?: number;
  wrapperStyle?: ViewStyle;
  imageStyle?: StyleProp<ImageStyle>;
}

export type ProgressiveViewerImageType = ProgressiveViewerImageInterface;
