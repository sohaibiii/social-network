import { StyleSheet } from "react-native";

const progressiveImageStyle = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  imageStyle: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
  },
  loadingImageStyle: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
});

export default progressiveImageStyle;
