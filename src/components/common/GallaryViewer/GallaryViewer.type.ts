import { ImageURISource, ImageRequireSource } from "react-native";

import { FastImageProps } from "react-native-fast-image";

export type ImageSource = ImageURISource | ImageRequireSource;
export interface Images {
  key?: string;
  uri: ImageSource;
  original?: number;
}

export interface GalleryType {
  data: Images[];
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onImageSwippedCb?: (index: number) => void;
  disableThumbnailPreview?: boolean;
  currentIndex?: number;
}
