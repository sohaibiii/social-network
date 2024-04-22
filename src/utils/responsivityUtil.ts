import { PixelRatio } from "react-native";

import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH } from "~/constants/";

// based on iphone 5s's scale
const scale_font = APP_SCREEN_WIDTH / 320;

const normalize = (size: number): number => {
  const newSize = size * scale_font;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = (size: number): number =>
  Math.round((APP_SCREEN_WIDTH / guidelineBaseWidth) * size);
const verticalScale = (size: number): number =>
  Math.round((APP_SCREEN_HEIGHT / guidelineBaseHeight) * size);
const moderateScale = (size: number, factor = 0.5): number =>
  Math.round(size + (scale(size) - size) * factor);

export { normalize, scale, verticalScale, moderateScale };
