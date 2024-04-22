import {PropertyType} from "~/apiServices/property/property.types";

export interface PropertyTypeItemInterface {
  item: PropertyType;
  initialValue?: boolean;
  title?: string;
  onCheckedCb: (_checked: boolean, _item: PropertyType) => void;
}

export type PropertyTypeItemProps = PropertyTypeItemInterface;
