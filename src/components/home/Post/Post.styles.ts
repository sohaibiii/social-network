import { StyleSheet, ViewStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { scale, verticalScale } from "~/utils/";

type PostStyleType = {
  postWrapperStyle: ViewStyle;
  tagsContentContainerStyle: ViewStyle;
  galleryWrapperStyle: ViewStyle;
  relatedPlacesStyle: ViewStyle;
  postTextStyle: any;
  noLikeCommentShareContainer: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme, height: number): PostStyleType =>
  StyleSheet.create({
    postWrapperStyle: {
      marginBottom: 10,
      backgroundColor: theme.colors.sliderItemBackground
    },
    tagsStyle: {
      width: APP_SCREEN_WIDTH
    },
    galleryWrapperStyle: { height, marginTop: verticalScale(8) },
    postTextStyle: {
      fontFamily: null,
      fontSize: RFValue(13),
      lineHeight: RFValue(21),
      paddingHorizontal: scale(4)
    },
    relatedPlacesStyle: {
      marginTop: verticalScale(18),
      paddingHorizontal: 10
    },
    tagsContentContainerStyle: { padding: 10, flexGrow: 1 },
    noLikeCommentShareContainer: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme.colors.borderLightGrayBorder
    }
  });

export default styles;
