import queryString from "query-string";
import Config from "react-native-config";

import { buildShortLink } from "./dynamicLinks";
import ItemProps, { DynamicLinksAction } from "./dynamicLinksCreator.types";

import { DEFAULTS } from "~/constants/";
import { translate } from "~/translations/";

const DESCRIPTION_LENGTH = 200;
const SOCIAL_PREVIEW_IMAGE_SCRIPT_CREATED_TIMESTAMPED = 1631093400000;
const SOCIAL_PREVIEW_VIDEOS_SCRIPT_CREATED_TIMESTAMPED = 1632808800000;

const {
  AVATAR_MEDIA_PREFIX,
  CONTENT_MEDIA_PREFIX,
  HOTELS_MEDIA_PREFIX,
  SOCIAL_MEDIA_PREFIX,
  VIDEOS_MEDIA_PREFIX,
  URL_PREFIX
} = Config;

const getImageUrl = (
  type: string,
  image: any,
  action: string,
  timestamp: number | undefined
) => {
  let id: string;
  if (typeof image === "string") {
    id = image;
  } else {
    id = image.id || image.uuid;
  }
  if (
    !image &&
    action !== DynamicLinksAction.TOP_20 &&
    action !== DynamicLinksAction.PROFILE
  ) {
    return DEFAULTS.IMAGE_PLACEHOLDER_URL;
  }
  let urlPostfix = "_sp";
  switch (action) {
    case DynamicLinksAction.POST:
      if (type === "image") {
        if ((timestamp ?? 0) < SOCIAL_PREVIEW_IMAGE_SCRIPT_CREATED_TIMESTAMPED) {
          urlPostfix = "_lg";
        }
      } else if ((timestamp ?? 0) < SOCIAL_PREVIEW_VIDEOS_SCRIPT_CREATED_TIMESTAMPED) {
        urlPostfix = ".0000001";
      }
      return type === "image"
        ? `${SOCIAL_MEDIA_PREFIX}/${id}${urlPostfix}.jpg`
        : `${VIDEOS_MEDIA_PREFIX}/${id}/${id}${urlPostfix}.jpg`;
    case DynamicLinksAction.PROPERTY:
    case DynamicLinksAction.GEO_PLACE:
    case DynamicLinksAction.ARTICLE:
      return `${CONTENT_MEDIA_PREFIX}/${id}_md.jpg`;
    case DynamicLinksAction.HOTEL:
      return `${HOTELS_MEDIA_PREFIX}/${id}_sp.jpeg`;
    case DynamicLinksAction.PROFILE:
      return id
        ? `${AVATAR_MEDIA_PREFIX}/${id}_s.jpg`
        : `${AVATAR_MEDIA_PREFIX}/default-avatar.png`;
    case DynamicLinksAction.TOP_20:
      return `${CONTENT_MEDIA_PREFIX}/top-20.jpg`;
    case DynamicLinksAction.REFERRAL:
      return DEFAULTS.REFERRAL_SOCIAL_PREVIEW_IMAGE;
    default:
      return "";
  }
};
const getWebUrl = (item: ItemProps) => {
  const { action, params = {} } = item;
  let urlPrefix: string;
  let query = {
    action,
    ...params
  };
  switch (action) {
    case DynamicLinksAction.POST:
      urlPrefix = `post/${params.pkey}/`;
      query = {
        ...query,
        ts: params.timestamp
      };
      break;
    case DynamicLinksAction.PROPERTY:
      urlPrefix = `property/${params.slug}/`;
      break;
    case DynamicLinksAction.GEO_PLACE:
      urlPrefix = `${params.type}/${params.slug}`;
      break;
    case DynamicLinksAction.ARTICLE:
      urlPrefix = `article/${params.slug}/`;
      break;
    case DynamicLinksAction.HOTEL:
      urlPrefix = `hotels/${params.hotelId}/`;
      break;
    case DynamicLinksAction.PROFILE:
      urlPrefix = `profile/${params.userId}/`;
      break;
    case DynamicLinksAction.TOP_20:
      urlPrefix = "";
      break;
    case DynamicLinksAction.REFERRAL:
      urlPrefix = `profile/${params.userId}?referral=true`;
      break;
    default:
      urlPrefix = "";
      break;
  }

  return queryString.stringifyUrl(
    {
      url: `${URL_PREFIX}/${urlPrefix}`,
      query
    },
    {
      skipNull: true
    }
  );
};

const handleCreateShareLink = async (item: ItemProps) => {
  const {
    title = translate("safarway"),
    description = "",
    image = "",
    action,
    params
  } = item;

  const domainUriPrefix =
    action === DynamicLinksAction.REFERRAL
      ? DEFAULTS.REFERRAL_DYNAMIC_LINK
      : DEFAULTS.SHARE_DYNAMIC_LINK;
  const descriptionText = `${description?.substring(0, DESCRIPTION_LENGTH)}${
    description.length > DESCRIPTION_LENGTH && description.length > 0 ? "..." : ""
  }`;
  const imageUrl = getImageUrl(image.type ?? "image", image, action, params?.timestamp);

  return (await buildShortLink({
    link: getWebUrl(item),
    domainUriPrefix,
    android: {
      packageName: Config.ANDROID_APP_ID
    },
    ios: {
      bundleId: Config.IOS_APP_ID
    },
    social: {
      title,
      descriptionText,
      imageUrl
    }
  })) as string;
};

export { handleCreateShareLink };
