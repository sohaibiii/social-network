import { StyleSheet, ViewStyle, TextStyle } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

type PlayerControllType = {
  wrapper: ViewStyle;
  touchable: ViewStyle;
  touchableDisabled: ViewStyle;
  videoIconStyle: TextStyle;
  playStopIconStyle: TextStyle;
};

const styles = (theme: ReactNativePaper.Theme): PlayerControllType =>
  StyleSheet.create({
    wrapper: {
      paddingHorizontal: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      flex: 3
    },
    touchable: {
      padding: 5
    },
    touchableDisabled: {
      opacity: 0.3
    },
    videoIconStyle: {
      color: theme.colors.white,
      fontSize: RFValue(28)
    },
    playStopIconStyle: {
      fontSize: RFValue(40)
    }
  });

export default styles;
