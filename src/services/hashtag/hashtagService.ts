import moment from "moment";

import { DestinationsType } from "~/containers/cityCountryRegion/CityCountryRegion.types";
import {
  logEvent,
  NAVIGATE_TO_CITY_COUNTRY_REGION,
  NAVIGATE_TO_PROPERTY
} from "~/services/analytics";
import { navigate } from "~/services/navigation";

export const handleHashTagPressed = async (type, geo, query) => {
  switch (type) {
    case DestinationsType.CITY:
    case DestinationsType.COUNTRY:
    case DestinationsType.REGION:
      await logEvent(NAVIGATE_TO_CITY_COUNTRY_REGION, {
        source: "hashtag_page",
        title: query?.term,
        slug: geo,
        type
      });
      return navigate({
        name: "CityCountryRegion",
        key: `${moment().unix()}`,
        params: { title: query?.term ?? "", slug: geo, type }
      });

    case DestinationsType.PROPERTY:
      await logEvent(NAVIGATE_TO_PROPERTY, {
        source: "hashtag_page",
        title: query?.term,
        slug: geo
      });

      return navigate("Property", { slug: geo });

    default:
      break;
  }
};
