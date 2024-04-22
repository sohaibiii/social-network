interface RatingComponentInterface {
  isChecked: boolean;
  type: string;
  size: number;
  spacing: number;
  testID?: string;
}

export enum RatingComponentTypes {
  STAR = "star",
  HEART = "heart",
  CHECK = "check",
  CIRCLE = "circle"
}

export type RatingComponentProps = RatingComponentInterface;
