import { CountryAndRegion, TitleLanguageObject } from "~/types/common";

interface CountryAndRegionInterface {
  item: {
    title?: TitleLanguageObject;
    pkey?: string;
    country?: CountryAndRegion;
    city?: CountryAndRegion;
    region?: CountryAndRegion;
  };
  setSelectionCb: (_string: string) => void;
  selected?: boolean;
}

export type CountryAndRegionProps = CountryAndRegionInterface;
