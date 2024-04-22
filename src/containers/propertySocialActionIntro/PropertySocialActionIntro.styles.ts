import { StyleSheet } from "react-native";

import { scale } from "~/utils/";

const propertySocialActionIntoStyle = StyleSheet.create({
  containerStyle: {
    flex: 1,
    height: "100%",
    justifyContent: "space-evenly",
    margin: scale(20)
  }
});

export default propertySocialActionIntoStyle;
