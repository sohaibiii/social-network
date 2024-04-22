import { StyleSheet } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { moderateScale } from "~/utils/";

export const styles = (height: number) =>
  StyleSheet.create({
    adStyle: {
      marginStart: 1,
      marginVertical: 2,
      width: APP_SCREEN_WIDTH - 2,
      height: moderateScale(height)
    }
  });
