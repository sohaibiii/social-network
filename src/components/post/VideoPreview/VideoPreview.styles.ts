import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

const styles = (theme: ReactNativePaper.Theme) =>
  StyleSheet.create({
    videoIconWrapperStyle: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      width: verticalScale(50),
      height: verticalScale(50),
      borderRadius: verticalScale(25),
      justifyContent: "center",
      alignItems: "center",
      paddingEnd: 5
    },
    videoMuteBackgroundWrapperStyle: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      width: verticalScale(50),
      height: verticalScale(50),
      borderRadius: verticalScale(25),
      justifyContent: "center",
      alignItems: "center"
    },
    videoMuteWrapperStyles: {
      position: "absolute",
      right: 5,
      bottom: 5,
      justifyContent: "center",
      alignItems: "center",
      zIndex: theme.zIndex.videoModal
    }
  });

export default styles;
