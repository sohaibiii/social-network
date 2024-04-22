import { IconTypes } from "~/components/common";

export interface HeaderCardType {
  name: string;
  icon: string;
  iconType: IconTypes;
  onPress: () => void;
  language?: string;
}
