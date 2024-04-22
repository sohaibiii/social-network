import { Platform } from "react-native";

import dynamicLinks, {
  FirebaseDynamicLinksTypes
} from "@react-native-firebase/dynamic-links";
import moment from "moment";
import queryString from "query-string";
import Share from "react-native-share";

import { DynamicLinksAction } from "./dynamicLinksCreator.types";

import store from "~/redux/store";

import { hotelsService } from "~/apiServices/index";
import postService from "~/apiServices/post";
import { USER_REFERRAL, HOTEL_AFFILIATE_FLAG, DEFAULTS } from "~/constants/";
import { loadNewPosts } from "~/redux/reducers/home.reducer";
import { hideOverlay, showOverlay } from "~/redux/reducers/overlayLoader.reducer";
import { retrieveItem, storeItem } from "~/services/";
import { navigate } from "~/services/navigation";
import { generalErrorHandler, logError } from "~/utils/";

const buildShortLink = async (link: FirebaseDynamicLinksTypes.DynamicLinkParameters) => {
  try {
    return await dynamicLinks().buildShortLink(link);
  } catch (error) {
    return error;
  }
};

const handleNavigateToProfile = (params: any) => {
  const { userId } = params;
  navigate("Profile", {
    uuid: userId
  });
};

const handleReferral = async (params: any) => {
  const { userId } = params;
  await storeItem(USER_REFERRAL, userId);
  navigate("Profile", {
    uuid: userId
  });
};

const handleNavigationToTop20 = () => {
  navigate("PointsBank");
};

const handleNavigateToProperty = params => {
  const { slug } = params;
  navigate("Property", { slug });
};
const handleNavigateToArticle = params => {
  const { title, slug } = params;
  navigate("ArticleDetails", { title: { ar: title, en: title }, slug });
};

const handleNavigateToGeoPlace = params => {
  const { slug, type } = params;
  navigate("CityCountryRegion", { title: slug, slug, type });
};

const handleNavigateToPost = async params => {
  const { pkey, timestamp } = params;
  const post = await postService.getPost(pkey, timestamp);
  store.dispatch(loadNewPosts([post]));
  navigate("PostDetails", { postPkey: pkey, commentsCounter: 0, timestamp });
};

const handleNavigateToHotel = async params => {
  store.dispatch(showOverlay({ visible: true }));
  try {
    const {
      data,
      session,
      search: searchParams
    } = await hotelsService.searchHotels({
      type: "distance",
      radius: 10000,
      currency: "USD",
      local: "ar",
      limit: 10,
      offset: 0,
      extras: "hotel_path,facilities",
      filters: "filter_facility_room,filter_facility_hotel,filter_rating",
      ...params,
      session: null
    });
    navigate("HotelDetails", {
      hotel: data[0],
      searchParams: {
        ...searchParams,
        session
      }
    });
  } catch (e) {
    generalErrorHandler(e);
  } finally {
    store.dispatch(hideOverlay());
  }
};

const handleNavigateToLogin = () => {
  navigate("LoginByEmail");
};

const handleAffilitateLink = async (params: any) => {
  try {
    const { affid } = params || {};
    const currentAffiliate = await retrieveItem(HOTEL_AFFILIATE_FLAG);
    const expiryDate = moment().add(DEFAULTS.AFFILIATE_EXPIRY_DURATION_IN_DAYS, "days");
    const newAffiliateData = JSON.stringify({ affid, expiryDate });

    if (!currentAffiliate) {
      await storeItem(HOTEL_AFFILIATE_FLAG, newAffiliateData);
    } else {
      const currentAffiliateData = JSON.parse(currentAffiliate);
      if (currentAffiliateData?.affid === affid) {
        return;
      }
      await storeItem(HOTEL_AFFILIATE_FLAG, newAffiliateData);
    }
  } catch (error) {
    logError(`Error: handleAffilitateLink --dynamixLinks.ts-- ${error}`);
  }
};

const handleNavigation = (data: any) => {
  let { params } = data;
  if (typeof params === "string") {
    try {
      params = JSON.parse(params);
    } catch (e) {
      params = {};
    }
  }
  switch (data?.action ?? "") {
    case DynamicLinksAction.SIGN_UP:
      handleNavigateToLogin();
      break;
    case DynamicLinksAction.PROFILE:
      handleNavigateToProfile(params);
      break;
    case DynamicLinksAction.REFERRAL:
      handleReferral(params);
      break;
    case DynamicLinksAction.TOP_20:
      handleNavigationToTop20();
      break;
    case DynamicLinksAction.PROPERTY:
      handleNavigateToProperty(params);
      break;
    case DynamicLinksAction.GEO_PLACE:
      handleNavigateToGeoPlace(params);
      break;
    case DynamicLinksAction.ARTICLE:
      handleNavigateToArticle(params);
      break;
    case DynamicLinksAction.POST:
      handleNavigateToPost(params);
      break;
    case DynamicLinksAction.HOTEL:
      handleNavigateToHotel(params);
      break;
    case DynamicLinksAction.AFFILIATE_HOTEL:
      handleAffilitateLink(params);
      break;
    default:
      break;
  }
};

const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink | null) => {
  if (!link) {
    return;
  }
  const { query: { action = "", ...params } = {} } = queryString.parseUrl(link.url) || {};
  const formattedDeepLink = { action, params };

  handleNavigation(formattedDeepLink);
};

const showShareView = (url?: string) => {
  const shareOptions =
    Platform.OS === "ios"
      ? {
          title: "Share via",
          failOnCancel: false,
          url
        }
      : {
          title: "Share via",
          failOnCancel: false,
          message: url
        };

  return Share.open(shareOptions);
};

const resolveDynamicLink = async (url: string) => {
  try {
    return await dynamicLinks().resolveLink(url);
  } catch (error) {
    return error;
  }
};

export { handleDynamicLink, buildShortLink, showShareView, resolveDynamicLink };
