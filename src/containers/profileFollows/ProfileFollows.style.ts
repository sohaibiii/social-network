import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { EdgeInsets } from "react-native-safe-area-context";
import { scale } from "~/utils/";
type style = {
  flex: ViewStyle;
  flatListContainer: ViewStyle;
  appBarHeader: ViewStyle;
  appBarContent: TextStyle;
};

const styles = (insets: EdgeInsets, colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    flatListContainer: {
      paddingHorizontal: scale(10),
      paddingBottom: insets.bottom
    },
    appBarHeader: {
      backgroundColor: colors.surface
    },
    appBarContent: {
      color: colors.text
    }
  });

export default styles;
