import { regionAPI } from "~/apis/";
import { CommonGeoPlace } from "~/apiServices/city/city.types";
import { GenericObject } from "~/types/common";
import { logError } from "~/utils/";

const getRegionBySlug: (slug: string) => Promise<CommonGeoPlace | undefined> = async (
  slug: string
) => {
  try {
    const { data: responseData } = await regionAPI.getRegionBySlug(slug);
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
      viewsCount: data.views_count
    };

    return city;
  } catch (error) {
    logError(`Error: getRegionBySlug --region.ts-- slug=${slug} ${error}`);
  }
};
// GeoPlaceProperties
const getRegionPropertiesByPkey: (
  pkey: string,
  categoryPkey?: string,
  from?: number,
  filters?: GenericObject
) => Promise<any[]> = async (pkey, categoryPkey, from, filters) => {
  try {
    const { data } = await regionAPI.getRegionPropertiesByPkey(
      pkey,
      categoryPkey,
      from,
      filters
    );

    return data;
  } catch (error) {
    logError(
      `Error: getRegionPropertiesByPkey --region.ts-- pkey=${pkey} categoryPkey=${categoryPkey} ${error}`
    );
  }
};

export default {
  getRegionBySlug,
  getRegionPropertiesByPkey
};
