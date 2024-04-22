import { Platform } from "react-native";

import Config from "react-native-config";

const { CONTENT_MEDIA_PREFIX, SOCIAL_MEDIA_PREFIX } = Config;
export default {
  APP_MAIN_LANGUAGE: "ar",
  BUNDLE_ID: "com.safarway.dev",
  SCHEME: "safarway",
  TAB_BAR_HEIGHT: 65,
  GALLERY_LANDSCAPE_RATIO: 1.65,
  IMAGE_PLACEHOLDER_URL: `${CONTENT_MEDIA_PREFIX}/placeholder.jpg`,
  REFERRAL_SOCIAL_PREVIEW_IMAGE: `${SOCIAL_MEDIA_PREFIX}/referral-image.jpg`,
  SHARE_DYNAMIC_LINK: "https://share.safarway.com/links",
  REFERRAL_DYNAMIC_LINK: "https://referral.safarway.com/referral",
  AFFILIATE_EXPIRY_DURATION_IN_DAYS: 30,
  IS_ANDROID: Platform.OS === "android",
  HOTEL_SESSION_TIMEOUT: 20
};
