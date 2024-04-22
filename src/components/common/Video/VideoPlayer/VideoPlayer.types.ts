import { OrientationType } from "react-native-orientation-locker";
import { VideoProperties } from "react-native-video";

import { GenericObject } from "~/types/common";

export interface VideoPlayerType extends VideoProperties {
  orientation: OrientationType;
  paused: boolean;
  videoStyle: GenericObject;
  onLoadEndCb: () => void;
  isFromGallery: boolean;
}

export type VideoPlayerRef = {
  destroyVideoComponent: () => void;
};
