import { ViewStyle } from "react-native";

import { MapViewProps } from "react-native-maps";

interface Markers {
  latitude: number;
  longitude: number;
  identifier: string;
}

export interface MapPreviewTypes extends MapViewProps {
  containerStyle?: ViewStyle;
  markers?: Markers[];
  minZoomLevel?: number;
  animateToFitMarkers?: boolean;
  scrollEnabled?: boolean;
  pitchEnabled?: boolean;
  zoomEnabled?: boolean;
  zoomTapEnabled?: boolean;
  rotateEnabled?: boolean;
  zoomControlEnabled?: boolean;
  onPress?: () => void;
}
