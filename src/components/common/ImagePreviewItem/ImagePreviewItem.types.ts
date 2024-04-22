import { Thumbnail } from "react-native-create-thumbnail";
import { Asset } from "react-native-image-picker";

export interface ImagePreviewItemInterface {
  image: Asset & Thumbnail;
  onPress?: () => void;
  size?: number;
}

export type ImagePreviewItemType = ImagePreviewItemInterface;
