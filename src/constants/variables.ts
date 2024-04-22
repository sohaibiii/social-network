import { Dimensions, I18nManager, Platform } from "react-native";

import Orientation, { OrientationType } from "react-native-orientation-locker";

export const SAFARWAY_MAP_API = "https://gapi.safarway.com/mobile";

export const APP_SCREEN_WIDTH =
  Orientation.getInitialOrientation() === OrientationType["LANDSCAPE-LEFT"] ||
  Orientation.getInitialOrientation() === OrientationType["LANDSCAPE-RIGHT"]
    ? Dimensions.get("window").height
    : Dimensions.get("window").width;
export const APP_SCREEN_HEIGHT =
  Orientation.getInitialOrientation() === OrientationType["LANDSCAPE-LEFT"] ||
  Orientation.getInitialOrientation() === OrientationType["LANDSCAPE-RIGHT"]
    ? Dimensions.get("window").width
    : Dimensions.get("window").height;
export const FULL_SCREEN_HEIGHT = Dimensions.get("screen").height;

// current platform
export const PLATFORM = Platform.OS;

// isRTL
export const isRTL = I18nManager.isRTL;

//remote config
export const FETCH_CACHE_TIME = 600; // 60 * 10

const intepolate = (x0, x1, y0, y1, input) => {
  return (y0 * (x1 - input) + y1 * (input - x0)) / (x1 - x0);
};
/**
 *  x0 = minDeviceHeight assume iphone6 667
 *  x = maxDeviceHeight assume iphone14 926
 *  y0 = min(4) value for APP_SCREEN_HEIGHT / heightModifier value works on iphone 6
 *  y1 = max(5) value for APP_SCREEN_HEIGHT / heightModifier value works on iphone 14
 *  input is APP_SCREEN_HEIGHT
 *
 */
const heightModifier = intepolate(667, 926, 4, 5, APP_SCREEN_HEIGHT);
export const HORIZONTAL_SLIDER_HEIGHT = Math.round(APP_SCREEN_HEIGHT / heightModifier); //170;
export const PAGER_STEPS_FOOTER = Math.round((APP_SCREEN_HEIGHT / 680) * 60);
