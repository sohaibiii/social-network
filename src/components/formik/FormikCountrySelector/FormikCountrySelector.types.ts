import { Control } from "react-hook-form";

import { Country } from "~/apiServices/country/country.types";
import { CountrySelectorTypes } from "~/components/common/CountrySelector/CountrySelector.types";

interface FormikCountrySelectorInterface {
  defaultValue?: Country;
  name?: string;
  control?: Control<Record<string, string>>;
  testID?: string;
}

export type FormikCountrySelectorType = FormikCountrySelectorInterface &
  CountrySelectorTypes;
