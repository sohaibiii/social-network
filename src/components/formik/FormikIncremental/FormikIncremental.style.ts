import { StyleSheet } from "react-native";

import { scale } from "~/utils/";

const formikIncrementalStyle = (isSmall: boolean) =>
  StyleSheet.create({
    container: {
      marginHorizontal: scale(16),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row"
    },
    textContainerStyle: { width: "70%" },
    backArrowStyle: {
      position: "absolute",
      left: 10,
      top: -10
    },
    descriptionTextStyle: {
      marginTop: 4
    },
    row: {
      flexDirection: "row",
      alignItems: "center"
    },
    countTextStyle: {
      minWidth: isSmall ? 0 : scale(25),
      marginHorizontal: 10
    }
  });

export default formikIncrementalStyle;
