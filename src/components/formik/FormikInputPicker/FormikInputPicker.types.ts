interface FormikRoomSelectorItemInterface {
  onChange?: (_val: number | string) => void;
  array?: string[] | number[];
  defaultValue?: string | number;
  testID?: string;
}
export type FormikRoomSelectorItemProps = FormikRoomSelectorItemInterface;
