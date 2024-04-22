import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, moderateScale, verticalScale } from "~/utils/responsivityUtil";

const puzzleStyles = (colors: ReactNativePaper.ThemeColors) => {
  return StyleSheet.create({
    root: {
      padding: scale(5)
    },
    finalButtonStyle: {
      borderRadius: 5,
      marginTop: scale(10),
      alignSelf: "center",
      width: "50%"
    },
    finalButtonLabelStyle: { color: colors.white },
    timeTillNextPuzzleRoot: {
      width: "100%",
      height: scale(150)
    },
    timeTillNextPuzzleContainer: {
      padding: scale(5),
      height: "100%",
      justifyContent: "center",
      alignItems: "center"
    },
    puzzleRoot: {
      width: "100%",
      height: scale(400)
    },
    puzzleImage: { width: "100%", height: "52%" },
    resultContainer: {
      marginTop: scale(10),
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "center",
      width: "100%"
    },
    answersText: {
      fontSize: RFValue(35),
      lineHeight: RFValue(50)
    },
    puzzleWrapperStyle: {
      paddingVertical: verticalScale(6),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.sliderItemBorderColor,
      marginBottom: 10,
      backgroundColor: colors.sliderItemBackground
    },
    puzzleTextWrapperStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: verticalScale(15),
      marginLeft: 10
    },
    reloadButtonContainerStyle: {
      flexDirection: "row",
      alignSelf: "flex-end",
      backgroundColor: colors.primary,
      padding: scale(4),
      borderRadius: scale(4),
      justifyContent: "space-between",
      alignItems: "center",
      flex: 1,
      marginRight: moderateScale(10)
    },
    reloadButtonIconStyle: {
      marginEnd: scale(4)
    }
  });
};

export default puzzleStyles;
