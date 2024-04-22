import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/responsivityUtil";

const datePickerStyle = StyleSheet.create({
  doneButtonStyle: {
    maxHeight: verticalScale(30),
    paddingVertical: verticalScale(4)
  },
  doneButtonLabelStyle: {
    color: "white"
  },
  rnDatePickerStyle: {
    alignSelf: "center"
  },
  container: {
    marginHorizontal: 20
  }
});

export default datePickerStyle;
