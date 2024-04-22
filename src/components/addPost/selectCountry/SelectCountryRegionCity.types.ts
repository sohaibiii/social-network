import { CountryRegionCityType } from "~/apiServices/property/property.types";

export interface SelectCountryRegionCityInterface {
  onSearchCb?: (_search: string) => void;
  onSearchSuccessCb?: (_search: string) => void;
  onSearchFailedCb?: (_search: string) => void;
  selectedCountryRegionCity?: CountryRegionCityType | null;
  initialSearch?: string | null;
  onCountryRegionCityRemovedCb: (_country: CountryRegionCityType) => void;
  onCountryRegionCitySelectedCb: (_country: CountryRegionCityType) => void;
  setIsNextDisabled?: (_shouldDisable: boolean) => void;
  countryRegionCityArr?: CountryRegionCityType[] | null;
  isPost?: boolean;
}
export type SelectCountryRegionCityProps = SelectCountryRegionCityInterface;
