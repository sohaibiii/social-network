import { PropertyType, Property, SimpleProperty, SimpleGeoPlace } from "./property.types";

import { propertyAPI } from "~/apis/";
import { HOTEL_PROPERTY_ID } from "~/constants/";
import { DestinationsType } from "~/containers/cityCountryRegion/CityCountryRegion.types";
import { generalErrorHandler, logError } from "~/utils/";
import { appendHttpToUrl } from "~/utils/generalUtils";

const getPropertyTypes = async (): Promise<PropertyType[] | undefined> => {
  try {
    const { data } = await propertyAPI.getPropertyTypes();
    return data;
  } catch (error) {
    logError(`Error: GetPropertyTypes --property.ts-- ${error}`);
  }
};

const suggestProperty: (
  _name: string,
  _address: string,
  _types: PropertyType[],
  _token: string,
  _images: string[],
  _description?: string
) => Promise<true> = async (name, address, types, token, images, description) => {
  try {
    const { data } = await propertyAPI.suggestProperty(
      name,
      address,
      types.map(item => ({
        title: item.title.ar,
        id: item.id.toString()
      })),
      token,
      images.map(item => ({
        id: item
      })),
      description
    );
    return data;
  } catch (error) {
    logError(
      `Error: SuggestProperty --property.ts-- name=${name} address=${address} ${error}`
    );
    throw error;
  }
};

const getProperty: (
  _slug: string,
  _language: "ar" | "en" | "fr"
) => Promise<Property | undefined> = async (slug: string, language = "en") => {
  try {
    const { data } = await propertyAPI.getPropertyBySlug(slug);
    const property: Property = {
      name: data.title.ar,
      title: data.title,
      slug: data.slug,
      pkey: data.pkey,
      priceRange: (data.price_range ?? 0) % 5,
      website: data.website ? appendHttpToUrl(data.website) : "",
      location: {
        lat: data.location.lat,
        lon: data.location.lon
      },
      originalName: data.title.en,
      is_permanently_closed: data.is_permanently_closed,
      address: data.address,
      email: data.email ?? "",
      features:
        data.features?.map((item: any) => item?.title[language] ?? item?.title.en) ?? [],
      featuredImageUUID: data.featured_image?.image_uuid ?? "",
      workingHours: data.working_hours ?? {},
      gallery: data.gallery?.map((item: any) => ({
        owner: item.owner ?? "",
        source: item.source ?? "",
        uuid: item.image_uuid
      })),
      phone: data.phone ?? "",
      description: data.description,
      originalDescription: data.original_description ?? "",
      translationSource: data.translation_source,
      filters:
        data.filters?.map((item: any) => item?.title[language] ?? item?.title.en) ?? [],
      isOpen: data.is_open ?? false,
      propertyTypes: (data.property_type ?? []).map((item: any) => item.id),
      cityPkey: data.city?.id ?? "",
      countrySlug: data.country.slug,
      countryName: data.country.name,
      cityOrRegionName: data.city?.name ?? data.region?.name ?? "",
      cityOrRegionSlug: data.city?.slug ?? data.region?.slug ?? "",
      isRegionData: data.city?.slug === undefined,
      verified: data.verified ?? false,
      ticket: data.ticket ?? undefined,
      min_visit_duration: data.min_visit_duration,
      max_visit_duration: data.max_visit_duration
    };
    return property;
  } catch (error) {
    generalErrorHandler(`Error: GetPropertyBySlug --property.ts-- slug=${slug} ${error}`);
    throw error;
  }
};

// /property/status/:pkey

const getPropertyStatus: (_slug: string) => Promise<Property | undefined> = async (
  slug: string
) => {
  try {
    const { data } = await propertyAPI.getPropertyStatusBySlug(slug);
    const property: Property = {
      rate: data.rate ?? {},
      rating: data.rate?.rating ?? 0,
      ratingContributes: Number(data.rate?.contributes ?? 0),
      ratingDistribution: [
        data.rate?.rate_distribution?.["1"] ?? 0,
        data.rate?.rate_distribution?.["2"] ?? 0,
        data.rate?.rate_distribution?.["3"] ?? 0,
        data.rate?.rate_distribution?.["4"] ?? 0,
        data.rate?.rate_distribution?.["5"] ?? 0
      ],
      isFavorite: data.is_favorite ?? false,
      verified: data.verified ?? false,
      isReviewed: data.is_reviewed ?? false,
      specialContent: data.special_content ?? [],
      logo: data.logo ?? "",
      isClaimed: data.is_claimed ?? false,
      isPremium: data.is_premium ?? false
    };
    return property;
  } catch (error) {
    generalErrorHandler(`Error: getPropertyStatus --property.ts-- pkey=${pkey} ${error}`);
    throw error;
  }
};

export const getPropertyOrGeoPlaceFromResponse: (
  item: any,
  type?: string
) => SimpleProperty | SimpleGeoPlace | undefined = (item, type) => {
  if (type === DestinationsType.COUNTRY) {
    return {
      name: item.title.ar,
      slug: item.slug,
      pkey: item.pkey,
      featuredImageUUID: item.featured_image?.image_uuid ?? ""
    };
  }
  if (type === DestinationsType.CITY) {
    return {
      name: item.title.ar,
      slug: item.slug,
      pkey: item.pkey,
      featuredImageUUID: item.featured_image?.image_uuid ?? "",
      country: {
        name: item.country.name,
        slug: item.country.slug ?? "",
        pkey: item.country.pkey ?? ""
      },
      regionName: item.region?.name ?? ""
    };
  }
  if (type === DestinationsType.REGION) {
    return {
      name: item.title.ar,
      slug: item.slug,
      pkey: item.pkey,
      featuredImageUUID: item.featured_image?.image_uuid ?? "",
      country: {
        name: item.country.name,
        slug: item.country.slug ?? "",
        pkey: item.country.pkey ?? ""
      }
    };
  }

  return {
    name: item.title.ar,
    slug: item.slug,
    pkey: item.pkey,
    priceRange: Number(item.price_range ?? 0) % 5,
    location: {
      lat: Number(item.location?.lat ?? 0),
      lon: Number(item.location?.lon ?? 0)
    },
    featuredImageUUID: item.featured_image.image_uuid,
    rating: Number(item.rate?.rate_calculated ?? item.rate?.rating ?? 0),
    ratingContributes: Number(item.rate?.contributes ?? 0),
    countryName: item.country.name ?? item.country.ar,
    cityOrRegionName:
      item.city?.name ?? item.city?.ar ?? item.region?.name ?? item.region?.ar ?? "",
    isFavorite: item.is_favorite ?? false,
    verified: item.verified ?? false
  };
};

export const getHotelFromResponse: (
  item: any
) => SimpleProperty | SimpleGeoPlace | undefined = item => {
  return {
    name: item.title.ar,
    slug: item.slug,
    pkey: item.pkey,
    priceRange: Number(item.price_range ?? 0) % 5,
    location: {
      lat: Number(item.location?.lat ?? 0),
      lon: Number(item.location?.lon ?? 0)
    },
    rating: Number(item.star_rating ?? 0),
    country: item.country.code,
    ratingContributes: Number(item.rate?.contributes ?? 0),
    countryName: item.country.name ?? item.country.ar,
    featuredImageUUID: item.featured_image?.image_uuid ?? "",
    hotelId: item.hotel_id,
    cityOrRegionName:
      item.city?.name ?? item.city?.ar ?? item.region?.name ?? item.region?.ar ?? "",
    verified: item.verified ?? false
  };
};

const getPropertiesByLocation: (
  location: Location,
  distance: number,
  propertiesTypes?: number[],
  pkey?: string,
  isRegion?: boolean,
  priceFilter?: number,
  ratingFilter?: number,
  isOpen?: boolean,
  filters?: string[]
) => Promise<SimpleProperty[]> = async (
  location,
  distance,
  propertiesTypes,
  pkey,
  isRegion,
  priceFilter,
  ratingFilter,
  isOpen,
  filters
) => {
  try {
    const { data } = (await propertyAPI.getPropertiesByLocation(
      location,
      distance,
      propertiesTypes,
      pkey,
      isRegion,
      priceFilter,
      ratingFilter,
      isOpen,
      filters
    )) || { data: { items: [] } };
    return data?.items ?? [];
    const properties: SimpleProperty[] = [];
    if (!propertiesTypes || propertiesTypes[0] !== HOTEL_PROPERTY_ID) {
      data.items.forEach((property: any) => {
        const propertyTranslated = getPropertyOrGeoPlaceFromResponse(
          property,
          "property"
        );
        if (propertyTranslated && "cityOrRegionName" in propertyTranslated)
          properties.push(propertyTranslated);
      });
    } else {
      data.items.forEach((hotel: any) => {
        const hotelTranslated = getHotelFromResponse(hotel);
        if (hotelTranslated && "cityOrRegionName" in hotelTranslated)
          properties.push(hotelTranslated);
      });
    }
    return properties;
  } catch (error) {
    logError(
      `Error: GetPropertyBySlug --property.ts-- ${{
        location,
        distance,
        propertiesTypes,
        pkey,
        isRegion,
        priceFilter,
        ratingFilter,
        isOpen,
        filters
      }}  ${error}`
    );
  }
};

export default {
  getPropertyTypes,
  suggestProperty,
  getProperty,
  getPropertyStatus,
  getPropertiesByLocation
};
