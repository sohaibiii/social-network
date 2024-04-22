import { StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT } from "~/constants/";
import {scale, verticalScale} from "~/utils/";

const destinationSearchStyles = (colors: ReactNativePaper.ThemeColors) =>
  StyleSheet.create({
    contentContainerStyle: {
      minHeight: APP_SCREEN_HEIGHT * 0.7,
      marginHorizontal: scale(16),
      flexDirection: "column",
      justifyContent: "flex-start"
    },
    hotelStyle: {
      paddingVertical: verticalScale(10),
      borderBottomWidth: 1,
      borderColor: colors.grayBB
    }
  });

export default destinationSearchStyles;
