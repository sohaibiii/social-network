import { FC } from "react";
import { Animated, FlatListProps, ScrollViewProps } from "react-native";

import { IHandles } from "react-native-modalize/lib/options";

import { ColorType } from "~/theme/theme.types";
import { GenericObject } from "~/types/common";

export const SLICE_NAME = "bottomSheet";
interface ModalProps<T = any> {
  withOverlay?: boolean;
  panGestureEnabled?: boolean;
  handlePosition?: "inside" | "outside";
  handleColor?: ColorType;
  adjustToContentHeight?: boolean;
  alwaysOpen?: number;
  modalHeight?: number;
  modalBackgroundColor?: string;
  onPositionChange?: ((position: "top" | "initial") => void) | undefined;
  HeaderComponent?: FC;
  FooterComponent?: FC;
  flatListProps?: FlatListProps<T>;
  ref?: React.RefObject<IHandles>;
  children?: React.ReactNode;
  withHandle?: boolean;
  closeOnOverlayTap?: boolean;
  scrollViewProps?: Animated.AnimatedProps<ScrollViewProps>;
  onClose?: () => void;
  withoutHeaderMargin?: boolean;
}
export interface IBottomSheet {
  Content?: FC;
  props?: ModalProps;
  customProps?: GenericObject;
}
