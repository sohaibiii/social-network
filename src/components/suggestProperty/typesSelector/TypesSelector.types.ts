import { Dispatch, SetStateAction } from "react";

import { PropertyType } from "~/apiServices/property/property.types";

export interface TypesSelectorInterface {
  propertyTypes: PropertyType[] | null;
  setNextDisabled: Dispatch<SetStateAction<boolean>>;
}

export type TypesSelectorProps = TypesSelectorInterface;
