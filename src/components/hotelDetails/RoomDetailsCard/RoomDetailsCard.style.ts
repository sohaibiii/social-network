import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/";

const roomDetailsCardStyle = StyleSheet.create({
  containerStyle: { marginBottom: verticalScale(8) },
  imageStyle: {
    margin: 8,
    height: verticalScale(130),
    borderRadius: 8
  },
  roomSectionTextStyle: {
    marginTop: verticalScale(4),
    marginBottom: verticalScale(2),
    fontWeight: "bold"
  },
  descriptionStyle: {
    padding: 8
  },
  markdownStyle: { flex: 0 }
});
export default roomDetailsCardStyle;
