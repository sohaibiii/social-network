import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { moderateScale, verticalScale } from "~/utils/responsivityUtil";

type ArticleMarkdowntype = {
  wrapperStyle: ViewStyle;
  heading1Style: TextStyle;
  heading2Style: TextStyle;
  heading3Style: TextStyle;
  heading4Style: TextStyle;
  heading5Style: TextStyle;
  heading6Style: TextStyle;
  bodyStyle: TextStyle;
  strongStyle: TextStyle;
  linkStyle: TextStyle;
  imageStyle: ViewStyle;
  imageWrapperStyle: ViewStyle;
  inboxImageStyle: ViewStyle;
};

const IMAGE_ASPECT_RATIO = 135 / 76;
const styles = (theme: ReactNativePaper.Theme): ArticleMarkdowntype =>
  StyleSheet.create({
    wrapperStyle: {
      flex: 1
    },
    bodyStyle: {
      textAlign: "left",
      color: theme.colors.text,
      marginHorizontal: moderateScale(10),
      fontSize: RFValue(12),
      fontFamily: theme.fonts.regular.fontFamily
    },
    strongStyle: {
      textAlign: "left",
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: RFValue(14),
      fontWeight: "normal"
    },
    heading1Style: {
      textAlign: "left",
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: RFValue(20),
      fontWeight: "normal"
    },
    heading2Style: {
      textAlign: "left",
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: RFValue(18),
      fontWeight: "normal"
    },
    heading3Style: {
      textAlign: "left",
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: RFValue(16),
      fontWeight: "normal"
    },
    heading4Style: {
      textAlign: "left",
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: RFValue(14),
      fontWeight: "normal"
    },
    heading5Style: {
      textAlign: "left",
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: RFValue(14),
      fontWeight: "normal"
    },
    heading6Style: {
      textAlign: "left",
      fontFamily: theme.fonts.regular.fontFamily,
      fontSize: RFValue(12),
      fontWeight: "normal"
    },
    linkStyle: {
      textAlign: "left",
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: "normal",
      color: theme.colors.primary
    },
    imageStyle: {
      width: APP_SCREEN_WIDTH + 2,
      // height: undefined,
      // added as workaround for now
      height: APP_SCREEN_WIDTH / IMAGE_ASPECT_RATIO,
      // by inspection images gets 6 padding to left and 10 to the top
      left: -6,
      top: -10,
      marginVertical: 10
    },
    inboxImageStyle: {
      marginVertical: 10
    },
    imageWrapperStyle: {
      height: APP_SCREEN_WIDTH / IMAGE_ASPECT_RATIO
    }
  });

export default styles;
