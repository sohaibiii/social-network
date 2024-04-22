import { StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT } from "~/constants/";

const bottomSheetStyle = StyleSheet.create({
  containerStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: null,
    maxHeight: APP_SCREEN_HEIGHT,
    marginTop: APP_SCREEN_HEIGHT * 0.1
  },
  fullScreenContainerStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: null,
    maxHeight: APP_SCREEN_HEIGHT
  },
  footerStyle: {
    width: "100%",
    zIndex: 9
  },
  handleStyle: {
    alignSelf: "center"
  },
  modalStyle: {
    bottom: 0,
    width: "100%",
    justifyContent: "flex-end",
    margin: 0,
    height: null,
    alignSelf: "flex-end",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50
  }
});
export default bottomSheetStyle;
