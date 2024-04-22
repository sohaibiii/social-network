import { StyleSheet } from "react-native";

import { APP_SCREEN_WIDTH } from "~/constants/";
import { scale, verticalScale } from "~/utils/responsivityUtil";

const styles = StyleSheet.create({
  homepageBackgroundImageStyle: { flex: 1, paddingTop: verticalScale(8) },
  homepageCardScrollViewStyle: {
    alignSelf: "flex-end",
    paddingLeft: scale(5),
    paddingVertical: verticalScale(5)
  },
  cardsScrollviewWrapperStyle: {
    marginBottom: verticalScale(10),
    width: APP_SCREEN_WIDTH
  }
});

export default styles;
