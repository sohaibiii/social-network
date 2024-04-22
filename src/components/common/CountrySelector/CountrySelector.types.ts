import { Country } from "~/apiServices/country/country.types";

interface CheckBoxInterface {
  handleItemSelectedCb?: (_item: Country) => void;
  onPressCb?: () => void;
  defaultValue?: Country;
  testID?: string;
  error?: string;
}

export type CountrySelectorTypes = CheckBoxInterface;
