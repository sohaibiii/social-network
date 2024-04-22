import { StyleSheet } from "react-native";

import { scale, verticalScale } from "~/utils/responsivityUtil";

const mapCategoriesStyle = StyleSheet.create({
  root: {
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(15),
    borderRadius: scale(10),
    marginHorizontal: scale(5),
    // io
    shadowOpacity: 0.2,
    shadowRadius: scale(2),
    shadowOffset: {
      height: 0,
      width: 0
    },
    // android
    elevation: 2
  },
  contentContainerStyle: {
    paddingVertical: verticalScale(6)
  }
});

export default mapCategoriesStyle;
