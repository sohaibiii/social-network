import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/";

const formikRoomBookingFormStyles = StyleSheet.create({
  containerStyle: {
    marginTop: verticalScale(12)
  },
  namesContainer: {
    marginTop: verticalScale(6),
    flexDirection: "row"
  },
  firstNameContainerStyle: {
    flex: 1,
    marginBottom: verticalScale(6),
    marginEnd: 3
  },
  lastNameContainerStyle: {
    flex: 1,
    marginBottom: verticalScale(6),
    marginStart: 3
  },
  marginTop6: { marginTop: verticalScale(6) }
});

export default formikRoomBookingFormStyles;
