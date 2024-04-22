import { cityAPI } from "~/apis/";
import { CommonGeoPlace, Weather } from "~/apiServices/city/city.types";
import { GenericObject } from "~/types/common";
import { logError } from "~/utils/";

const getCityBySlug: (slug: string) => Promise<CommonGeoPlace | undefined> = async (
  slug: string
) => {
  try {
    const { data: responseData } = await cityAPI.getCityBySlug(slug);
    const { ProcessInfo, ...data } = responseData;

    const city: CommonGeoPlace = {
      featuredImageUUID: data.featured_image?.image_uuid ?? "",
      name: data.title.ar,
      slug: data.slug,
      pkey: data.pkey,
      livingCost: data.living_cost,
      currency: data.currency.name,
      months: data.months,
      description: data.description,
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
      code: data.country.code.alpha_2 === "IL" ? "PS" : data.country.code.alpha_2,
      region: data.region,
      country: {
        name: data.country.name,
        id: String(data.country.id),
        slug: data.country.slug,
        code: data.country.code.alpha_2 === "IL" ? "PS" : data.country.code.alpha_2
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
      viewsCount: data.views_count,
      originalDescription: data.original_description ?? "",
      translationSource: data.translation_source
    };

    return city;
  } catch (error) {
    logError(`Error: getCityBySlug --city.ts-- slug=${slug} ${error}`);
  }
};
// GeoPlaceProperties
const getCityProperties: (
  pkey: string,
  categoryPkey?: string,
  from?: number,
  filters?: GenericObject
) => Promise<any[]> = async (pkey, categoryPkey, from, filters) => {
  try {
    const { data } = await cityAPI.getCityPropertiesByPkey(
      pkey,
      categoryPkey,
      from,
      filters
    );

    return data;
  } catch (error) {
    logError(
      `Error: getCityProperties --city.ts-- pkey=${pkey} categoryPkey=${categoryPkey} ${error}`
    );
  }
};

const getWeatherByLatLon: (
  latLon: string
) => Promise<Weather | undefined> = async latLon => {
  try {
    const { data } = await cityAPI.getWeatherByLatLon(latLon);
    return {
      weatherCode: data.weather.weatherCode,
      weatherIconType: data.weather.weatherIconType.toLowerCase(),
      localtime: data.time_zone[0].localtime,
      current: data.weather.currentTempC,
      max: data.weather.maxTempC,
      min: data.weather.minTempC
    };
  } catch (error) {
    logError(`Error: getWeatherByLatLon --city.ts-- location=${latLon} ${error}`);
  }
};

export default {
  getCityBySlug,
  getCityProperties,
  getWeatherByLatLon
};
