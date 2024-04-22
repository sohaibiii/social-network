import { Control } from "react-hook-form";

import { RoomSelectorType } from "../../RoomSelectorContent/RoomSelectorContent.types";

interface FormikRoomSelectorItemInterface {
  onRemove?: () => void;
  testID?: string;
  hasDelete?: boolean;
  id?: string;
  roomIndex?: number;
  control?: Control<Record<string, string>>;
  name?: string;
  item?: RoomSelectorType;
  defaultValue?: string;
}
export type FormikRoomSelectorItemProps = FormikRoomSelectorItemInterface;
