import { StyleSheet, ViewStyle, ImageStyle } from "react-native";

import { moderateScale } from "~/utils/responsivityUtil";

type ArticleCardStyleType = {
  cardWrapperStyle: ViewStyle;
  cardCoverStyle: ImageStyle;
  cardContentWrapperStyle: ViewStyle;
  badgeWrapperStyle: ViewStyle;
  badgeStyle: ViewStyle;
};

const styles = (
  theme: ReactNativePaper.Theme,
  width: number,
  height: number
): ArticleCardStyleType =>
  StyleSheet.create({
    cardWrapperStyle: {
      width: width,
      marginRight: 10,
      borderWidth: 1,
      borderColor: theme.colors.sliderItemBorderColor,
      borderRadius: 10,
      overflow: "hidden"
    },
    cardCoverStyle: {
      width: width,
      height: height
    },
    cardContentWrapperStyle: {
      backgroundColor: theme.colors.lightBackground,
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 10
    },
    badgeStyle: {
      marginLeft: 3,
      backgroundColor: theme.colors.primary_blue,
      lineHeight: 16,
      paddingHorizontal: moderateScale(10),
      marginTop: 3
    },
    badgeWrapperStyle: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 10
    }
  });

export default styles;
