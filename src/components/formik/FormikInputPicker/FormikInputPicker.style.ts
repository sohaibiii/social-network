import { StyleSheet, ViewStyle } from "react-native";

import { APP_SCREEN_HEIGHT } from "~/constants/";
import { verticalScale } from "~/utils/";

type style = {
  containerStyle: ViewStyle;
  inputContainerStyle: ViewStyle;
  modalContainerStyle: ViewStyle;
  scrollViewStyle: ViewStyle;
  modalItem: ViewStyle;
  modalItemSelected: ViewStyle;
};
const formikRoomSelectorItemStyles = (colors: ReactNativePaper.ThemeColors): style =>
  StyleSheet.create({
    containerStyle: {
      flex: 1,
      marginHorizontal: 4
    },
    inputContainerStyle: {
      borderRadius: 50,
      paddingVertical: verticalScale(4),
      backgroundColor: colors.white,
      alignItems: "center",
      borderWidth: 1,
      paddingHorizontal: 5
    },
    modalContainerStyle: {
      maxHeight: APP_SCREEN_HEIGHT * 0.8
    },
    scrollViewStyle: {
      borderRadius: 20,
      flex: 0,
      backgroundColor: colors.grayBackground
    },
    modalItem: {
      alignItems: "center",
      backgroundColor: "transparent",
      paddingVertical: 5
    },
    modalItemSelected: {
      alignItems: "center",
      backgroundColor: colors.primary_blue,
      paddingVertical: 5
    }
  });

export { formikRoomSelectorItemStyles };
