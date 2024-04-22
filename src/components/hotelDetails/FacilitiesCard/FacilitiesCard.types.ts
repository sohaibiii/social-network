import {TouchableOpacity, TouchableOpacityProps, ViewStyle} from "react-native";

import { TitleLanguageObject } from "~/types/common";

interface FacilitiesCardInterface extends TouchableOpacityProps {
  icon?: JSX.Element;
  title?: string;
  style?: ViewStyle;
  circleStyle?: ViewStyle;
  cardWidth?: number | string;
  onPress?: () => void;
  uri?: string;
}

export interface FacilityType {
  id?: string;
  title?: TitleLanguageObject;
}

export type FacilitiesCardProps = FacilitiesCardInterface;
