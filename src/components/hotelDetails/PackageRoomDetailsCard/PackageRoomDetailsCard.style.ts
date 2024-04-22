import { StyleSheet } from "react-native";

import { moderateScale } from "~/utils/";

const packageRoomDetailsCardStyle = StyleSheet.create({
  containerStyle: {
    flex: 1,
    marginBottom: 10,
    padding: 4
  },
  imageStyle: {
    height: moderateScale(80),
    borderRadius: 5
  },
  row: {
    alignItems: "center",
    flexDirection: "row"
  },
  flex: {
    flex: 1
  },
  iconStyle: {
    marginStart: 2,
    paddingHorizontal: 5
  },
  buttonsContainerStyle: {
    flexDirection: "row-reverse",
    alignItems: "flex-end",
    paddingBottom: 10
  },
  showDescriptionContainerStyle: {
    flexDirection: "row",
    flex: 1
  },
  galleryIconStyle: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 5,
    borderRadius: 5,
    position: "absolute",
    left: 6,
    top: 4
  },
  variantTextStyle: {
    marginBottom: 5,
    marginTop: 4
  },
  iconsContainerStyle: {
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 10
  },
  roomNameTextStyle: { marginTop: 5 }
});

export default packageRoomDetailsCardStyle;
