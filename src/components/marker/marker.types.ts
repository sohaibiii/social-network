interface Location {
  latitude: number;
  longitude: number;
}

export interface MarkerProps {
  isHotel?: boolean;
  onPress?: (slug: string) => void;
  slug?: string;
  selected?: boolean;
  coordinate: Location;
  myLocation?: boolean;
}
