import { StyleSheet } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

import { scale, verticalScale } from "~/utils/";

const locationSelectorStyle = (zIndex: ReactNativePaper.zIndexTypes) =>
  StyleSheet.create({
    searchBarStyle: {
      marginTop: scale(14),
      padding: scale(6),
      marginHorizontal: 10,
      backgroundColor: "white",
      borderRadius: 50,
      alignItems: "center",
      shadowOpacity: 0.4,
      shadowRadius: 3,
      shadowColor: "#000",
      zIndex: zIndex.overlay,
      flexDirection: "row",
      shadowOffset: {
        height: 0,
        width: 0
      },
      elevation: 4
    },
    contentContainerStyle: {
      flexDirection: "column",
      justifyContent: "center",
      flex: 1
    },
    scrollViewStyle: {
      alignSelf: "center",
      height: verticalScale(340),
      marginHorizontal: 20
    },
    addressTitleStyle: {
      fontSize: RFValue(12),
      lineHeight: RFValue(14)
    },
    autoCompleteContainerStyle: {
      height: "100%",
      marginHorizontal: scale(10)
    }
  });

export { locationSelectorStyle };
