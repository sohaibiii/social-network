import { Dispatch, SetStateAction } from "react";

import {
  AddressComponent,
  Point
} from "~/components/common/GooglePlaces/GooglePlaces.types";

export interface LocationSelectorInterface {
  setNextDisabled?: Dispatch<SetStateAction<boolean>>;
}
export interface GoogleLocation {
  address_components?: AddressComponent[];
  location?: Point | undefined;
  address?: string;
}
export type LocationSelectorProps = LocationSelectorInterface;
