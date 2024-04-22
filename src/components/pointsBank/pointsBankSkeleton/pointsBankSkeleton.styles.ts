import { StyleSheet, ViewStyle } from "react-native";

import { scale } from "~/utils/responsivityUtil";

type style = {
  skeletonRoot: ViewStyle;
  skeletonContainer: ViewStyle;
  skeletonLeftContainer: ViewStyle;
  skeletonImage: ViewStyle;
  skeletonName: ViewStyle;
  skeletonRightContainer: ViewStyle;
  skeletonPoints: ViewStyle;
  skeletonImageCoins: ViewStyle;
  skeletonPrize: ViewStyle;
  skeletonCounter: ViewStyle;
  skeletonDot: ViewStyle;
};

const pointsBankSkeletonStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    skeletonRoot: { margin: 10 },
    skeletonContainer: {
      flexDirection: "row",
      marginBottom: 10,
      alignItems: "center"
    },
    skeletonLeftContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
    skeletonImage: { width: scale(40), height: scale(40), borderRadius: 50 },
    skeletonName: {
      width: scale(120),
      height: scale(20),
      marginLeft: 10,
      alignSelf: "center",
      borderRadius: 5
    },
    skeletonRightContainer: { flexDirection: "row", alignItems: "center" },
    skeletonPoints: {
      width: scale(35),
      height: scale(20),
      borderRadius: 5,
      marginRight: 10
    },
    skeletonImageCoins: {
      width: scale(25),
      height: scale(20),
      borderRadius: 5
    },
    skeletonPrize: {
      width: scale(30),
      height: scale(35),
      borderRadius: 5,
      marginLeft: 10
    },
    skeletonCounter: {
      width: scale(15),
      height: scale(20),
      marginRight: 5,
      borderRadius: 5
    },
    skeletonDot: { width: scale(3), height: scale(3), marginRight: 5 }
  });
export default pointsBankSkeletonStyles;
