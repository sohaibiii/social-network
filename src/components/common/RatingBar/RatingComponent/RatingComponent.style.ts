import { StyleSheet } from "react-native";

const ratingComponentStyle = StyleSheet.create({
  container: (spacing: number) => ({
    marginHorizontal: -spacing
  })
});

export default ratingComponentStyle;
