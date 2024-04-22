import { StyleSheet } from "react-native";

import { APP_SCREEN_HEIGHT } from "~/constants/";

const propertyDetailsInputStyle = StyleSheet.create({
  containerStyle: {
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
    minHeight: APP_SCREEN_HEIGHT * 0.7,
    flex: 1
  },
  inputContainerStyle: {
    width: "100%"
  },
  descriptionInputStyle: {
    textAlignVertical: "top",
    marginTop: 10
  }
});

export default propertyDetailsInputStyle;
