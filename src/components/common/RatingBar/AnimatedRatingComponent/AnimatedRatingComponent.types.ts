import { ViewStyle } from "react-native";

interface RatingComponentInterface {
  isChecked: boolean;
  type: string;
  size: number;
  style?: ViewStyle;
  currentRating?: number;
  onPress?: () => void;
  testID?: string;
}

export type AnimatedRatingComponentProps = RatingComponentInterface;
