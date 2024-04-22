import { IconTypes } from "~/components/common";

export interface HeaderShortcutType {
  id: string;
  icon: string;
  iconType: IconTypes;
  onPress: () => void;
}
