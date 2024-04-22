import { InboxItemTypes } from "~/apiServices/inbox/inbox.types";

interface InboxItemInterface {
  item: InboxItemTypes;
  onPress?: (_item: InboxItemTypes) => void;
  onChecked?: (_item: InboxItemTypes, _checked: boolean) => void;
  isMultiSelecting: boolean;
  isSelected: boolean;
  isThemeDark?: boolean;
}

export type InboxItemType = InboxItemInterface;
