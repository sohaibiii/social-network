import {
  CountryRegionCityType,
  PropertyResponseType
} from "~/apiServices/property/property.types";

export interface SelectPropertyInterface {
  multiSelect?: boolean;
  selectedProperties?: PropertyResponseType[];
  initialSearch?: string;
  countryRegionCity?: CountryRegionCityType | null;
  onSearchCb?: (_search: string) => void;
  onSearchSuccessCb?: (_search: string) => void;
  onSearchFailedCb?: (_search: string) => void;
  onPropertyAddedCb: (_property: PropertyResponseType) => void;
  onPropertyRemovedCb: (_property: PropertyResponseType) => void;
  setIsNextDisabled?: (_shouldDisable: boolean) => void;
  isRateProperty?: boolean;
}
export type SelectPropertyProps = SelectPropertyInterface;
