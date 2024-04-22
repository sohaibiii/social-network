import { StyleSheet } from "react-native";

import { LightTheme } from "~/theme/";
import { moderateScale } from "~/utils/responsivityUtil";

const radioButtonStyle = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center"
  },
  vertical: {
    flexDirection: "column"
  },
  horizontal: {
    flexDirection: "row"
  },
  labelStyle: {
    marginHorizontal: 10
  },
  disabledLabel: {
    color: LightTheme.colors.gray
  },
  small: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
  },
  medium: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }]
  },
  large: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
  },
  labelContainerStyle: { alignSelf: "center" },
  radioButtonContainer: {
    flexDirection: "row",
    marginBottom: moderateScale(5)
  }
});

export default radioButtonStyle;
