import {
  CountryRegionCityType,
  PropertyResponseType
} from "~/apiServices/property/property.types";

interface CountryAndRegionInterface {
  item: PropertyResponseType | CountryRegionCityType;
  hasRating?: boolean;
  setSelectionCb: (_string: any) => void;
  selected?: boolean;
  title?: string;
  index?: number;
}

export type CountryAndRegionProps = CountryAndRegionInterface;
