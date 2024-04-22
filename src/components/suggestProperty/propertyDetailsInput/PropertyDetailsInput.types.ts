import { Dispatch, SetStateAction } from "react";

export interface LocationSelectorInterface {
  setNextDisabled: Dispatch<SetStateAction<boolean>>;
}

export type LocationSelectorProps = LocationSelectorInterface;
