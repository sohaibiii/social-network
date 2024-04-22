import { countryAPI } from "~/apis/";
import { CommonGeoPlace } from "~/apiServices/city/city.types";
import { Country } from "~/apiServices/country/country.types";
import { CountryRegionCityType } from "~/apiServices/property/property.types";
import { DestinationsType } from "~/containers/cityCountryRegion/CityCountryRegion.types";
import { GenericObject } from "~/types/common";
import { logError } from "~/utils/";

const getCountriesCodes: () => Promise<Country[]> = async () => {
  try {
    const countries = await countryAPI.getCountriesCodes();
    return countries.data;
  } catch (error) {
    logError(`Error: getCountriesCodes --country.ts-- ${error}`);
  }
};
const getCountryBySlug: (slug: string) => Promise<CommonGeoPlace | undefined> = async (
  slug: string
) => {
  try {
    const { data: responseData } = await countryAPI.getCountryBySlug(slug);
    const { ProcessInfo, ...data } = responseData;

    const country: CommonGeoPlace = {
      featuredImageUUID: data.featured_image?.image_uuid ?? "",
      name: data.title.ar,
      slug: data.slug,
      pkey: data.pkey,
      livingCost: data.living_cost,
      currency: data.currency.name,
      months: data.months,
      description: data.description,
      originalDescription: data.original_description ?? "",
      translationSource: data.translation_source,
      gallery:
        data.gallery
          ?.map((item: any) => {
            return {
              owner: item.owner ?? "",
              source: item.source ?? "",
              uuid: item.image_uuid ?? ""
            };
          })
          .filter((item: any) => item !== undefined) ?? [],
      languages: data.languages,
      code: data.code.alpha_2 === "IL" ? "PS" : data.code.alpha_2,
      region: data?.region,
      country: {
        name: data.name,
        id: String(data.id),
        slug: data.slug,
        code: data.code.alpha_2 === "IL" ? "PS" : data.code.alpha_2
      },
      location: {
        lat: data.location.lat,
        lon: data.location.lon,
        latDelta: data.location.delta_lat,
        lonDelta: data.location.delta_lon
      },
      bestTimeToVisit: data.best_time_to_visit ?? [],
      isTourestCity: data.is_tourist_city,
      sportEventId: data.sports_event_id,
      title: data.title,
      viewsCount: data.views_count
    };

    return country;
  } catch (error) {
    logError(`Error: getCountryBySlug --country.ts-- slug=${slug} ${error}`);
  }
};
// GeoPlaceProperties
const getCountryPropertiesByPkey: (
  pkey: string,
  categoryPkey?: string,
  from?: number,
  filters?: GenericObject
) => Promise<any[]> = async (pkey, categoryPkey, from, filters) => {
  try {
    const { data } = await countryAPI.getCountryPropertiesByPkey(
      pkey,
      categoryPkey,
      from,
      filters
    );
    return data.map(item => ({
      title: item?.title,
      pkey: item?.pkey,
      total: item?.total,
      items: item?.items.map(item2 => ({
        city: item2.city,
        country: item2.country,
        featured_image: item2.featured_image,
        rate: item2.rate,
        slug: item2.slug,
        title: item2.title,
        location: item2.location,
        pkey: item2?.pkey,
        is_favorite: item2?.is_favorite
      }))
    }));
  } catch (error) {
    logError(
      `Error: getCountryPropertiesByPkey --country.ts-- pkey=${pkey} categoryPkey=${categoryPkey} ${error}`
    );
  }
};

const getCountryRegionsAndCitiesByPkey: (_pkey: string) => Promise<{
  regionsWithCitiesData: CountryRegionCityType[];
  countryName: string;
}> = async pkey => {
  try {
    const { data } = await countryAPI.getCountryRegionsAndCitiesByPkey(pkey);
    const { regions, cities, country } = data || {};

    const regionAndEmbeddedCities = [];

    const regionsLength = regions.length;

    for (let index = 0; index < regionsLength; index++) {
      const region = regions[index];
      regionAndEmbeddedCities.push({ ...region, ...{ type: DestinationsType.REGION } });
      const regionItemsLength = region.items.length;

      for (let innerIndex = 0; innerIndex < regionItemsLength; innerIndex++) {
        const city = region.items[innerIndex];
        regionAndEmbeddedCities.push({ ...city, ...{ type: DestinationsType.CITY } });
      }
    }

    const citiesToReturn = cities.items.map(city => {
      return { ...city, ...{ type: DestinationsType.CITY } };
    });

    return {
      countryName: country?.name,
      regionsWithCitiesData: [...regionAndEmbeddedCities, ...citiesToReturn].filter(
        (tag, index, array) => array.findIndex(k => k.pkey === tag.pkey) === index
      )
    };
  } catch (error) {
    logError(
      `Error: getCountryRegionsAndCitiesByPkey --country.ts-- pkey=${pkey} ${error}`
    );
  }
};

export default {
  getCountriesCodes,
  getCountryBySlug,
  getCountryPropertiesByPkey,
  getCountryRegionsAndCitiesByPkey
};
