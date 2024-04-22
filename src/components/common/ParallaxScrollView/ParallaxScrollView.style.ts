import { StyleSheet } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { verticalScale } from "~/utils/";

const parallaxScrollViewStyle = (
  theme: ReactNativePaper.Theme,
  expandedHeight: number,
  unexpandedHeight: number,
  topInset: number
) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    unexpandedContainerStyle: {
      width: "100%",
      position: "absolute"
    },
    unexpandedHeaderStyle: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: unexpandedHeight - topInset - 4
    },
    headerStyle: {
      position: "absolute",
      left: 0,
      zIndex: theme.zIndex.parallax,
      width: APP_SCREEN_WIDTH,
      top: topInset
    },
    shadowStyle: {
      height: verticalScale(20)
    },
    scrollViewStyle: {
      zIndex: theme.zIndex.parallax - 1,
      marginTop: unexpandedHeight - 4
    }
  });

export default parallaxScrollViewStyle;
