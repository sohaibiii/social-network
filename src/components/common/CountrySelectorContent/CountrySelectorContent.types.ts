import { ListRenderItemInfo } from "react-native";

import { Country } from "~/apiServices/country/country.types";
import { TripsGuardDestination } from "~/components/tripsGuard/CountryAndStateSelector/CountryAndStateSelector.types";

interface CheckBoxInterface {
  handleRenderItem?: (_item: ListRenderItemInfo<Country>) => JSX.Element;
  countries?: Country[] | TripsGuardDestination[];
  keyExtractor?: ((_item: Country, _index: number) => string) | undefined
}

export type CountrySelectorContentTypes = CheckBoxInterface;
