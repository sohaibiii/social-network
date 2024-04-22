import { StyleSheet } from "react-native";

const inlineReadMoreStyles = StyleSheet.create({
  containerFlex: {
    flexDirection: "column",
    flex: 1
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

export default inlineReadMoreStyles;
