import { Control } from "react-hook-form";

import { Country } from "~/apiServices/country/country.types";
import { CountryAndStateSelectorTypes } from "~/components/tripsGuard/CountryAndStateSelector/CountryAndStateSelector.types";

interface CountryAndStateSelectorInterface extends CountryAndStateSelectorTypes {
  onChangeCb?: (_value: Country) => void;
  control?: Control<Record<string, string>>;
  name?: string;
}
export type FormikCountryAndStateSelectorTypes = CountryAndStateSelectorInterface;
