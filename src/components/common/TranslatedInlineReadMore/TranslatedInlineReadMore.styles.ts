import { StyleSheet } from "react-native";

import { verticalScale } from "~/utils/";

const translatedInlineReadMoreStyles = StyleSheet.create({
  containerFlex: {
    flexDirection: "column",
    flex: 1
  },
  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8)
  },
  containerFullHeight: {
    flexDirection: "column",
    height: "100%",
    width: "100%"
  },
  inlineText: {
    marginHorizontal: 4,
    lineHeight: 20,
    alignItems: "flex-end"
  },
  inlineTextNoAutoLink: {
    textAlign: "left"
  }
});

export default translatedInlineReadMoreStyles;
