import { AdsConfigs } from "~/redux/types/ads.types";
import Config from "react-native-config";

export const CITY_COUNTRY_REGION_AD = {
  id: Config.CITY_COUNTRY_REGION_AD,
  config: "adEnabledCityCountryRegion" as keyof AdsConfigs
};
export const DESTINATIONS_AD = {
  id: Config.DESTINATIONS_AD,
  config: "adEnabledDestinations" as keyof AdsConfigs
};
export const PROPERTY_AD = {
  id: Config.PROPERTY_AD,
  config: "adEnabledProperty" as keyof AdsConfigs
};
export const TOP_20_AD = {
  id: Config.TOP_20_AD,
  config: "adEnabledTop20" as keyof AdsConfigs
};
export const THINGS_TO_DO_AD = {
  id: Config.THINGS_TO_DO_AD,
  config: "adEnabledThingsToDo" as keyof AdsConfigs
};
export const MORE_RELATED_PROPERTIES_AD = {
  id: Config.MORE_RELATED_PROPERTIES_AD,
  config: "adEnabledMoreRelatedProperties" as keyof AdsConfigs
};
