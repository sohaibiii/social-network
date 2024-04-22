import { StyleSheet, ViewStyle } from "react-native";

import { scale, verticalScale } from "~/utils/";

type DestinationsStyleType = {
  scrollViewWrapperStyle: ViewStyle;
  scrollviewContainerStyle: ViewStyle;
  famousDestinationsStyle: ViewStyle;
  adStyle: ViewStyle;
};

const styles = (theme: ReactNativePaper.Theme): DestinationsStyleType =>
  StyleSheet.create({
    scrollViewWrapperStyle: { backgroundColor: theme.colors.background },
    scrollviewContainerStyle: {
      flexGrow: 1,
      justifyContent: "flex-start",
      paddingHorizontal: scale(4)
    },
    famousDestinationsStyle: {
      flexDirection: "row",
      marginHorizontal: 4
    },
    adStyle: { marginVertical: verticalScale(3) }
  });

export default styles;
