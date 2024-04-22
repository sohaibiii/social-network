import { Asset, MediaType } from "react-native-image-picker";
import { CameraOptions, ImageLibraryOptions } from "react-native-image-picker/src/types";

export interface ImagePickerInterface {
  libraryOptions?: ImageLibraryOptions;
  cameraOptions?: CameraOptions;
  onImagesAddedCb?: (_images: Asset[]) => void;
  onImageRemovedCb?: (_image: Asset) => void;
  initialImages?: Asset[];
  horizontal?: boolean;
  maxImagesLength?: number;
  fullWidth?: boolean;
  mediaType?: MediaType;
  title?: string;
}

export type ImagePickerProps = ImagePickerInterface;
